// controllers/rateLimiter.js
const redisClient = require("../redis/redis");

module.exports.rateLimiter = async (req, res, next) => {
  const ip = req.ip; // Use req.ip to get the client's IP address
  // console.log(`Client IP: ${ip}`);

  try {
    const response = await redisClient.multi().incr(ip).expire(ip, 60).exec();

    const requestCount = response[0][1];
    // console.log("Request count: ", requestCount);

    if (requestCount > 10) {
      return res.status(429).json({
        loggedIn: false,
        status:
          "Whoa there, speedy! You’ve hit the brakes too many times. Try again in a minute!",
      });
    }

    next();
  } catch (error) {
    // console.error("Rate limiter error:", error);
    return res.status(500).json({
      error: "Yikes! Something went wrong on our end. Please try again later.",
    });
  }
};
