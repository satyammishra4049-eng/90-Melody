require('dotenv').config();

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development'
};

const requiredKeys = ['MONGODB_URI', 'JWT_SECRET'];
for (const key of requiredKeys) {
  if (!env[key]) {
    console.warn(`Warning: Missing required environment variable: ${key}`);
  }
}

module.exports = env;
