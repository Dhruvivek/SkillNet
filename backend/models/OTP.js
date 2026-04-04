// FILE: models/OTP.js
const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  otp: {
    type: String,
    required: true,
  },
  // Temporary registration data — stored here until OTP is verified
  // Only then is the User document created in the DB
  name: {
    type: String,
    default: '',
  },
  hashedPassword: {
    type: String,
    default: '',
  },
  expiresAt: {
    type: Date,
    required: true,
    // TTL index: document auto-deletes when expiresAt is reached
    index: { expires: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('OTP', otpSchema);
