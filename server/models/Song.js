const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  youtubeVideoId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    required: true,
    trim: true
  },
  album: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  youtubeUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
