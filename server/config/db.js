const mongoose = require('mongoose');
const env = require('./env');

// ─── Serverless connection cache ─────────────────────────────────────────────
// Vercel re-uses warm function instances between requests. By caching the
// mongoose connection on the global object we avoid opening a new connection
// on every invocation, which would quickly exhaust Atlas's connection pool.
let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  // Already connected — reuse
  if (cached.conn) return cached.conn;

  // Connection in-flight — wait for it
  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(env.MONGODB_URI, opts)
      .then((m) => {
        console.log(`[db] MongoDB connected: ${m.connection.host}`);

        mongoose.connection.on('error', (err) => {
          console.error('[db] Connection error:', err.message);
          // Reset cache so next invocation retries
          cached.conn = null;
          cached.promise = null;
        });

        mongoose.connection.on('disconnected', () => {
          console.warn('[db] MongoDB disconnected — will reconnect on next request');
          cached.conn = null;
          cached.promise = null;
        });

        return m;
      })
      .catch((err) => {
        // Reset so next invocation retries instead of hanging on a bad promise
        cached.promise = null;
        console.error('[db] Connection failed:', err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;

