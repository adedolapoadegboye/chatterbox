// controllers/rateLimiter.js
const redisClient = require("../redis/redis");

module.exports.rateLimiter = async (req, res, next) => {
  const ip = req.connection.remoteAddress;
  console.log(ip);

  try {
    const [response] = await redisClient.multi().incr(ip).expire(ip, 60).exec();

    console.log(response);
    next();
  } catch (error) {
    console.error("Rate limiter error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
