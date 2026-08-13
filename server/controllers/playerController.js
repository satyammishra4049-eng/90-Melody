const PlayEvent = require('../models/PlayEvent');

exports.getNowPlaying = async (req, res) => {
  try {
    // Find the most recent 'play' event
    const lastPlay = await PlayEvent.findOne({ event: 'play' })
      .sort({ timestamp: -1 })
      .populate('songId');
      
    if (!lastPlay || !lastPlay.songId) {
      return res.json({ message: 'Nothing playing right now', song: null });
    }
    
    res.json({
      message: 'Now playing',
      song: lastPlay.songId,
      timestamp: lastPlay.timestamp
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching now playing', error: error.message });
  }
};
