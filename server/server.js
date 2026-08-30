'use strict';

const express = require('express');
const cors = require('cors');

let helmet, morgan;
try { helmet = require('helmet'); } catch (e) {}
try { morgan = require('morgan'); } catch (e) {}

const connectDB = require('./config/db');
const env = require('./config/env');
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

// ─── CORS ───────────────────────────────────────────────────────────────────
// Allow the production frontend URL, the Vercel preview URLs, and localhost.
const allowedOrigins = [
  'https://90-melody.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
];

// Also allow any *.vercel.app preview deployment (e.g. 90-melody-git-main-xxx.vercel.app)
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight for all routes

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (helmet) {
  app.use(
    helmet({
      // Allow Vercel's own scripts/frames; keep CSP relaxed for music embeds
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );
}
if (morgan && env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(rateLimiter({ windowMs: 60000, max: 200 }));

// ─── DB connection (cached for serverless warm invocations) ──────────────────
// connectDB handles its own global caching internally (see config/db.js).
// We call it here so the connection is ready before the first request.
// Vercel will reuse this module between warm invocations, so connectDB
// will no-op if already connected.
connectDB().catch((err) => {
  console.error('[server] DB connection failed:', err.message);
});

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/songs', songRoutes);
app.use('/api/online-users', onlineRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/player', playerRoutes);
app.use('/api/playlist', playlistRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/youtube', youtubeRoutes);

// Standalone health check (no /api prefix) — used by uptime monitors
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 handler (API only) ──────────────────────────────────────────────────
// Non-API paths are handled by Vercel's filesystem + SPA catch-all in vercel.json.
app.use((req, res) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.path,
    method: req.method,
  });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  console.error('[server error]', err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    error: env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// ─── Local dev only: start HTTP server ──────────────────────────────────────
// On Vercel, this file is imported as a serverless function handler.
// When running locally with `node server.js`, we still want a live server.
if (require.main === module) {
  const http = require('http');
  const { Server: SocketServer } = require('socket.io');
  const onlineUsersSocket = require('./sockets/onlineUsers');
  const startSessionCleanup = require('./services/sessionCleanup');

  const httpServer = http.createServer(app);
  const io = new SocketServer(httpServer, {
    cors: corsOptions,
  });
  onlineUsersSocket(io);
  startSessionCleanup(30000);

  const PORT = env.PORT || 5000;
  httpServer.listen(PORT, () => {
    console.log(`[dev] Server running on http://localhost:${PORT}`);
  });
}

// ─── Vercel: export the Express app as the serverless handler ────────────────
module.exports = app;

