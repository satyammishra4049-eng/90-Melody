const jwt = require('jsonwebtoken');
const env = require('../config/env');
const Song = require('../models/Song');
const PlayEvent = require('../models/PlayEvent');
const ActiveSession = require('../models/ActiveSession');

exports.login = (req, res) => {
  const { email, password } = req.body;
  
  if (email === env.ADMIN_EMAIL && password === env.ADMIN_PASSWORD) {
    const token = jwt.sign(
      { email: env.ADMIN_EMAIL, role: 'admin' },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({ token, message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalSongs = await Song.countDocuments();
    const totalPlays = await PlayEvent.countDocuments({ event: 'play' });
    const onlineUsers = await ActiveSession.countDocuments();
    
    res.json({
      totalSongs,
      totalPlays,
      onlineUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

// CRUD operations for admin panel are basically delegating to songController,
// but let's implement them here for completeness if required, or we can just reuse the songController.
// Actually, we'll provide them directly here.

exports.getAllSongs = async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};

exports.createSong = async (req, res) => {
  try {
    const song = new Song(req.body);
    await song.save();
    res.status(201).json(song);
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error.message });
  }
};

exports.updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!song) return res.status(404).json({ message: 'Not found' });
    res.json(song);
  } catch (error) {
    res.status(400).json({ message: 'Error', error: error.message });
  }
};

exports.deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    if (!song) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error', error: error.message });
  }
};
