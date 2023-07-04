const { redis } = require("../database/connection");
const RateLimitException = require("../error/rate-limit-exception");

const rateLimiter = ({ secondsWindow, allowedHits }) => {
  return async function (req, res, next) {
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    const requests = await redis.incr(ip);

    let ttl;
    if (requests === 1) {
      await redis.expire(ip, secondsWindow);
      ttl = secondsWindow;
    } else {
      ttl = await redis.ttl(ip);
    }

    if (requests > allowedHits) {
      return next(new RateLimitException());
    }
    req.requests = requests;
    req.ttl = ttl;

    res.setHeader("X-RateLimit-Limit", allowedHits);
    res.setHeader("X-RateLimit-Used", requests);
    res.setHeader("X-RateLimit-Reset", ttl);

    next();
  };
};

module.exports = { rateLimiter };
