const mongoose = require('mongoose');

const playEventSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    enum: ['play', 'pause', 'end', 'skip']
  },
  songId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('PlayEvent', playEventSchema);
