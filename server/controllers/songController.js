const Song = require('../models/Song');

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching songs', error: error.message });
  }
};

exports.getSongById = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching song', error: error.message });
  }
};

exports.createSong = async (req, res) => {
  try {
    const newSong = new Song(req.body);
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (error) {
    res.status(400).json({ message: 'Error creating song', error: error.message });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const updatedSong = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json(updatedSong);
  } catch (error) {
    res.status(400).json({ message: 'Error updating song', error: error.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const deletedSong = await Song.findByIdAndDelete(req.params.id);
    if (!deletedSong) {
      return res.status(404).json({ message: 'Song not found' });
    }
    res.json({ message: 'Song deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting song', error: error.message });
  }
};
