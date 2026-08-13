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

// Determine CORS origin for both dev and production
const corsOrigin = env.CLIENT_URL || (
  env.NODE_ENV === 'production' 
    ? 'https://90-melody.vercel.app' 
    : 'http://localhost:5173'
);

// Socket.io Setup
const io = new Server(server, {
  cors: {
    origin: corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({ 
  origin: corsOrigin,
  credentials: true 
}));
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler for API routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ 
      error: 'API endpoint not found', 
      path: req.path,
      method: req.method 
    });
  }
  // For non-API routes, let Vercel handle them (frontend routing)
  res.status(404).json({ error: 'Not found' });
});

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
