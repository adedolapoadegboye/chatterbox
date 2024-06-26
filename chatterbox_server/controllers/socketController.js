// socketController.js
const redisClient = require("../redis/redis");
require("dotenv").config();

module.exports.authorizeUser = (socket, next) => {
  const session = socket.request.session;
  if (session && session.user) {
    socket.user = session.user; // Set the user object
    // console.log("User authorized:", socket.user); // Debugging line

    // Set the Redis key without extra spaces
    redisClient.hset(
      `userid:${socket.user.username}`,
      "userid",
      socket.user.userid,
      (err, res) => {
        if (err) {
          // console.error("Redis HSET error:", err);
        } else {
          // console.log("Redis HSET response:", res);
        }
      }
    );

    next();
  } else {
    console.log("User not authorized:", session); // Debugging line
    next(new Error("Unauthorized"));
  }
};

module.exports.addFriend = async (add_friend, cb) => {
  // console.log(add_friend, cb);
  const friendUserID = await redisClient.hget(`userid:${add_friend}`, "userid");
  // console.log(friendUserID);
  if (!friendUserID) {
    cb({
      done: false,
      addError: "User does not exist. Please check your submission",
    });
  }
};
