const session = require("express-session");
const redisClient = require("../redis/redis");
require("dotenv").config();
const RedisStore = require("connect-redis").default;

// Session middleware configuration
const sessionMW = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // CSRF protection
    expires: 1000 * 60 * 60 * 24 * 7, // 1 week
  },
});

// Wrapper function to use Express middleware with Socket.io
const wrap = (expressMW) => (socket, next) => {
  expressMW(socket.request, {}, next);
};

module.exports = { sessionMW, wrap };
