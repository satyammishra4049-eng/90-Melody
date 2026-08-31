const mongoose = require('mongoose');

const activeSessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    default: 'anonymous'
  },
  lastSeen: {
    type: Date,
    default: Date.now,
    expires: 15 // TTL index of 15 seconds — fast cleanup
  },
  connectedAt: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('ActiveSession', activeSessionSchema);
