const mongoose = require('mongoose');
const ActiveSession = require('../models/ActiveSession');

// TTL index in MongoDB (expires: 60) automatically handles cleanup of expired sessions,
// but we can also run a manual periodic cleanup if we don't rely entirely on TTL or 
// if we want to ensure accurate counts at specific intervals.

const startSessionCleanup = (interval = 30000) => {
  setInterval(async () => {
    try {
      // Check if MongoDB connection is ready before attempting cleanup
      if (mongoose.connection.readyState !== 1) {
        console.warn('MongoDB connection not ready, skipping session cleanup');
        return;
      }

      // Find sessions where lastSeen is older than 60 seconds
      const threshold = new Date(Date.now() - 60000);
      const result = await ActiveSession.deleteMany({ lastSeen: { $lt: threshold } });
      if (result.deletedCount > 0) {
        console.log(`Cleaned up ${result.deletedCount} expired sessions.`);
      }
    } catch (error) {
      console.warn('Session cleanup warning:', error.message);
      // Don't crash the server on cleanup errors
    }
  }, interval);
};

module.exports = startSessionCleanup;
