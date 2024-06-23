const session = require("express-session");
const redisClient = require("../redis/redis");
require("dotenv").config();

// const Redis2 = require("ioredis");
const RedisStore = require("connect-redis").default;

const sessionMW = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: "sid",
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === "production" ? "true" : "auto",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: 1000 * 60 * 60 * 24 * 7,
  },
});

const wrap = (expressMW) => {
  (socket, next) => expressMW(socket.request, {}, next);
};

module.exports = { sessionMW, wrap };
