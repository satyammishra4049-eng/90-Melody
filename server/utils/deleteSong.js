const mongoose = require('mongoose');
const env = require('../config/env');
const Song = require('../models/Song');

const deleteSongByTitle = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Search for the song by title (case-insensitive)
    const song = await Song.findOne({ 
      title: { $regex: 'chura k dil mera', $options: 'i' } 
    });

    if (!song) {
      console.log('Song "chura k dil mera" not found in database');
      process.exit(0);
    }

    console.log('Found song:', song.title);
    
    // Delete the song
    const result = await Song.findByIdAndDelete(song._id);
    console.log('Song deleted successfully:', result.title);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

if (require.main === module) {
  deleteSongByTitle();
}

module.exports = deleteSongByTitle;
