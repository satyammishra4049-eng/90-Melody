const ActiveSession = require('../models/ActiveSession');

// TTL index in MongoDB (expires: 60) automatically handles cleanup of expired sessions,
// but we can also run a manual periodic cleanup if we don't rely entirely on TTL or 
// if we want to ensure accurate counts at specific intervals.

const startSessionCleanup = (interval = 30000) => {
  setInterval(async () => {
    try {
      // Find sessions where lastSeen is older than 60 seconds
      const threshold = new Date(Date.now() - 60000);
      const result = await ActiveSession.deleteMany({ lastSeen: { $lt: threshold } });
      if (result.deletedCount > 0) {
        console.log(`Cleaned up ${result.deletedCount} expired sessions.`);
      }
    } catch (error) {
      console.error('Error during session cleanup:', error.message);
    }
  }, interval);
};

module.exports = startSessionCleanup;
