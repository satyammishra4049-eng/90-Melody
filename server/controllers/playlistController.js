const Playlist = require('../models/Playlist');

exports.getAllPlaylists = async (req, res) => {
  try {
    const playlists = await Playlist.find().populate('songs');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error: error.message });
  }
};

exports.getPlaylistById = async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id).populate('songs');
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlist', error: error.message });
  }
};

exports.createPlaylist = async (req, res) => {
  try {
    const playlist = new Playlist(req.body);
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ message: 'Error creating playlist', error: error.message });
  }
};

exports.updatePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json(playlist);
  } catch (error) {
    res.status(400).json({ message: 'Error updating playlist', error: error.message });
  }
};

exports.deletePlaylist = async (req, res) => {
  try {
    const playlist = await Playlist.findByIdAndDelete(req.params.id);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist', error: error.message });
  }
};
