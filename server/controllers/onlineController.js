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
    
    const session = await ActiveSession.findOneAndUpdate(
      { sessionId },
      { lastSeen: Date.now() },
      { new: true, upsert: true }
    );
    
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    
    res.json({ message: 'Heartbeat registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error processing heartbeat', error: error.message });
  }
};

exports.removeSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    await ActiveSession.findOneAndDelete({ sessionId });
    res.json({ message: 'Session removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing session', error: error.message });
  }
};
