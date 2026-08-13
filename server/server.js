const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
// Only require these if they are typically used in production standard express apps. We'll wrap in try-catch in case they aren't installed.
let helmet, morgan;
try { helmet = require('helmet'); } catch (e) {}
try { morgan = require('morgan'); } catch (e) {}

const connectDB = require('./config/db');
const env = require('./config/env');
const onlineUsersSocket = require('./sockets/onlineUsers');
const startSessionCleanup = require('./services/sessionCleanup');
const rateLimiter = require('./middleware/rateLimiter');

// Routes
const songRoutes = require('./routes/songRoutes');
const onlineRoutes = require('./routes/onlineRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');
const playerRoutes = require('./routes/playerRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const healthRoutes = require('./routes/healthRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (helmet) app.use(helmet());
if (morgan) app.use(morgan('dev'));
app.use(rateLimiter({ windowMs: 60000, max: 100 })); // Apply globally for simplicity

// Setup Routes
app.use('/api/songs', songRoutes);
app.use('/api/online-users', onlineRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/youtube', youtubeRoutes);

// Mock static routes for placeholder urls
app.get('/api/audio/*', (req, res) => res.send('audio demo placeholder'));
app.get('/api/covers/*', (req, res) => res.send('cover demo placeholder'));

// Initialize Socket.io
onlineUsersSocket(io);

// Connect to Database and start server
const startServer = async () => {
  await connectDB();
  
  // Start session cleanup task
  startSessionCleanup(30000); // 30 seconds
  
  const PORT = env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`Server running in ${env.NODE_ENV} mode on port ${PORT}`);
  });
};

startServer();

module.exports = { app, server };
