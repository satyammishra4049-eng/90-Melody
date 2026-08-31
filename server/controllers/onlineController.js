const ActiveSession = require('../models/ActiveSession');

exports.getOnlineCount = async (req, res) => {
  try {
    const count = await ActiveSession.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching online count', error: error.message });
  }
};

exports.heartbeat = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    await ActiveSession.findOneAndUpdate(
      { sessionId },
      { lastSeen: new Date() },
      { new: true, upsert: true }
    );

    // Return count in same request — saves an extra round-trip
    const count = await ActiveSession.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error processing heartbeat', error: error.message });
  }
};

exports.removeSession = async (req, res) => {
  try {
    // navigator.sendBeacon sends Content-Type: text/plain, so body may be a string
    let sessionId = req.body?.sessionId;
    if (!sessionId && typeof req.body === 'string') {
      try { sessionId = JSON.parse(req.body)?.sessionId; } catch { /* ignore */ }
    }
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    await ActiveSession.findOneAndDelete({ sessionId });
    res.status(204).end(); // 204 No Content — fast response for beacon
  } catch (error) {
    res.status(500).json({ message: 'Error removing session', error: error.message });
  }
};
