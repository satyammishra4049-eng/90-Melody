const PlayEvent = require('../models/PlayEvent');

exports.trackEvent = async (req, res) => {
  try {
    const { event, songId, sessionId } = req.body;
    
    if (!event || !songId || !sessionId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    const newEvent = new PlayEvent({
      event,
      songId,
      sessionId
    });
    
    await newEvent.save();
    res.status(201).json({ message: 'Event tracked successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error tracking event', error: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await PlayEvent.find().sort({ timestamp: -1 }).populate('songId', 'title artist').limit(100);
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};
