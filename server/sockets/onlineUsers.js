const ActiveSession = require('../models/ActiveSession');

module.exports = (io) => {
  io.on('connection', async (socket) => {
    const sessionId = socket.id;
    const userAgent = socket.handshake.headers['user-agent'];

    try {
      // Create active session
      await ActiveSession.create({
        sessionId,
        userAgent
      });

      // Broadcast updated count
      const count = await ActiveSession.countDocuments();
      io.emit('onlineUsersUpdated', { count });

      socket.on('heartbeat', async () => {
        try {
          await ActiveSession.findOneAndUpdate(
            { sessionId },
            { lastSeen: Date.now() }
          );
        } catch (error) {
          console.error('Socket heartbeat error:', error.message);
        }
      });

      socket.on('disconnect', async () => {
        try {
          await ActiveSession.findOneAndDelete({ sessionId });
          const newCount = await ActiveSession.countDocuments();
          io.emit('onlineUsersUpdated', { count: newCount });
        } catch (error) {
          console.error('Socket disconnect error:', error.message);
        }
      });
    } catch (error) {
      console.error('Socket connection error:', error.message);
    }
  });
};
