// FILE: models/Connection.js
const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  type: {
    type: String,
    default: 'peer',
  },
}, { timestamps: true });

// Prevent duplicate connection requests between same pair
connectionSchema.index({ from: 1, to: 1 }, { unique: true });

module.exports = mongoose.model('Connection', connectionSchema);
