const ActiveSession = require('../models/ActiveSession');

// Sessions active within last 20 seconds are "online"
// This threshold > heartbeat interval (5s) so network delays don't cause drops.
// We do NOT rely on MongoDB TTL (runs ~60s), instead we filter by lastSeen directly.
const ACTIVE_THRESHOLD_MS = 20_000;

const activeFilter = () => ({
  lastSeen: { $gte: new Date(Date.now() - ACTIVE_THRESHOLD_MS) },
});

exports.getOnlineCount = async (req, res) => {
  try {
    const count = await ActiveSession.countDocuments(activeFilter());
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

    // Upsert session with current timestamp
    await ActiveSession.findOneAndUpdate(
      { sessionId },
      { lastSeen: new Date() },
      { new: true, upsert: true }
    );

    // Count only truly active sessions — NOT relying on MongoDB TTL
    const count = await ActiveSession.countDocuments(activeFilter());
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
