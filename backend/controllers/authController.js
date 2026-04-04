// FILE: controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');
const generateOTP = require('../utils/generateOTP');
const { sendOTPEmail } = require('../config/mail');

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Register — store temp data + send OTP (user NOT saved to DB yet)
// @route   POST /api/auth/register
// ─────────────────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    // Validate @niet.co.in domain
    if (!email.endsWith('@niet.co.in')) {
      return res.status(400).json({
        success: false,
        message: 'Only @niet.co.in email addresses are allowed',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      });
    }

    // Check if a VERIFIED user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account already exists with this email. Please log in.',
      });
    }

    // Hash password before storing temporarily
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Delete any previous pending OTP for this email
    await OTP.deleteMany({ email });

    // Store OTP + registration data temporarily (user NOT in DB yet)
    await OTP.create({
      email,
      otp,
      name,
      hashedPassword,
      expiresAt,
    });

    // Send OTP email — fire and forget, do NOT await
    // This prevents the request from hanging if SMTP is slow/unavailable
    sendOTPEmail(email, otp).then(sent => {
      if (!sent) console.warn(`⚠️  OTP email failed for ${email} — OTP: ${otp}`);
    });

    // Always log to console for dev/debug
    console.log(`\n📧 OTP for ${email}: ${otp}\n`);

    res.status(201).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Verify OTP — creates the User in DB only after OTP is correct
// @route   POST /api/auth/verify-otp
// ─────────────────────────────────────────────────────────────────────────────
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and OTP',
      });
    }

    // Find the pending OTP record
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP. Please check the code and try again.',
      });
    }

    // Check expiry
    if (otpRecord.expiresAt < new Date()) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please register again to get a new code.',
      });
    }

    // OTP is valid — NOW create the user in the database
    const user = await User.create({
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.hashedPassword,
      isVerified: true,
    });

    // Clean up OTP record
    await OTP.deleteMany({ email });

    console.log(`✅ User registered: ${user.name} (${user.email})`);

    res.status(200).json({
      success: true,
      message: 'Email verified! Your account has been created. Please log in.',
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
      error: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// @desc    Login — check email + password → return JWT
// @route   POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Find user — include password field for comparison
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'No account found with this email. Please register first.',
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    // Generate JWT (7 days)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log(`🔐 User logged in: ${user.name} (${user.email})`);

    // Return token + user data (password excluded via toJSON)
    res.status(200).json({
      success: true,
      data: {
        token,
        user: user.toJSON(),
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

module.exports = { register, verifyOtp, login };
