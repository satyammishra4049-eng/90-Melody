// Since standard rate limiters usually require external packages like express-rate-limit,
// I'll implement a basic in-memory rate limiter to avoid requiring new deps, 
// or I can assume we can use standard express-rate-limit if it was in package.json.
// The prompt says package.json is already installed. Let's write a simple custom one.

const requestCounts = new Map();

const rateLimiter = (options = { windowMs: 60000, max: 100 }) => {
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const currentTime = Date.now();
    
    if (!requestCounts.has(ip)) {
      requestCounts.set(ip, { count: 1, startTime: currentTime });
      return next();
    }
    
    const record = requestCounts.get(ip);
    
    if (currentTime - record.startTime > options.windowMs) {
      record.count = 1;
      record.startTime = currentTime;
      return next();
    }
    
    if (record.count >= options.max) {
      return res.status(429).json({ message: 'Too many requests, please try again later.' });
    }
    
    record.count += 1;
    next();
  };
};

module.exports = rateLimiter;
