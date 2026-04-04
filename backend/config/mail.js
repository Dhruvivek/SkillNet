// FILE: config/mail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send OTP email to user
 * @param {string} to - Recipient email
 * @param {string} otp - 6-digit OTP code
 */
const sendOTPEmail = async (to, otp) => {
  const mailOptions = {
    from: `"SkillNet" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'SkillNet - Email Verification OTP',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #0a0a0b; border-radius: 16px; color: #fff;">
        <h1 style="font-size: 28px; margin-bottom: 8px;">Skill<span style="color: #7c3aed;">Net</span></h1>
        <p style="color: #999; margin-bottom: 24px;">Verify your email to join the network</p>
        <div style="background: #1a1a2e; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="color: #999; margin-bottom: 12px; font-size: 14px;">Your verification code</p>
          <h2 style="font-size: 40px; letter-spacing: 12px; color: #7c3aed; margin: 0;">${otp}</h2>
        </div>
        <p style="color: #666; font-size: 13px;">This code expires in <strong>5 minutes</strong>. Do not share it with anyone.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { transporter, sendOTPEmail };
