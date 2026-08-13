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
    expires: 60 // TTL index of 60 seconds
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
