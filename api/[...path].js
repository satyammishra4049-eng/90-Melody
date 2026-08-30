'use strict';

// Vercel native API catch-all handler
// All /api/* requests are routed here by Vercel automatically.
// We forward them to the Express app which already has /api/* routes.

const app = require('../server/server.js');

module.exports = app;
