const redisClient = require("../redis/redis");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Utility function to parse the friends list
const parseFriendsList = async (friendsList) => {
  const newFriendsList = [];
  for (let friend of friendsList) {
    const [username, userid] = friend.split(".");
    const connected = await redisClient.hget(`userid:${username}`, "connected");
    newFriendsList.push({
      username,
      userid,
      connected: connected === "true", // Ensure the connection status is a boolean
    });
  }
  return newFriendsList;
};

// Utility function to emit messages
const emitMessages = async (socket, userId) => {
  const messageQuery = await redisClient.lrange(`chat:${userId}`, 0, -1);
  const messages = messageQuery.map((message) => {
    try {
      const parsedString = message.split(".");
      return {
        to: parsedString[0],
        from: parsedString[1],
        content: parsedString[2],
      };
    } catch (error) {
      console.log(error);
    }
  });

  if (messages && messages.length > 0) {
    try {
      socket.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  }
};

// Middleware to authorize the user
module.exports.authorizeUser = async (socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return next(new Error("Invalid token, please log in again"));
    }

    socket.user = { ...decodedToken };
    socket.join(socket.user.userid);

    try {
      await redisClient.hset(
        `userid:${socket.user.username}`,
        "userid",
        socket.user.userid,
        "connected",
        true
      );

      const friendsList = await redisClient.lrange(
        `friends:${socket.user.username}`,
        0,
        -1
      );

      const parsedFriendsList = await parseFriendsList(friendsList);
      const friendRooms = parsedFriendsList.map((friend) => friend.userid);

      if (friendRooms.length > 0) {
        socket.to(friendRooms).emit("connected", true, socket.user.username);
      }

      socket.emit("friends", parsedFriendsList);
      await emitMessages(socket, socket.user.userid);

      next();
    } catch (error) {
      console.error("Authorization error:", error);
      next(
        new Error(
          "Oops! Something went wrong while trying to authorize you. Please try again later."
        )
      );
    }
  });
};

// Function to add a friend
module.exports.addFriend = async (socket, add_friend, cb) => {
  try {
    const friend = await redisClient.hgetall(`userid:${add_friend}`);
    if (!friend || !friend.userid) {
      return cb({
        done: false,
        addError:
          "Whoops! This user doesn't exist. Please double-check the username.",
      });
    }

    if (friend.userid === socket.user.userid) {
      return cb({
        done: false,
        addError: "Nice try, but you can't be your own best friend!",
      });
    }

    const currentFriendsList = await redisClient.lrange(
      `friends:${socket.user.username}`,
      0,
      -1
    );
    if (currentFriendsList.includes(`${add_friend}.${friend.userid}`)) {
      return cb({
        done: false,
        addError: "Hold up! This friend is already in your list.",
      });
    }

    await redisClient.lpush(
      `friends:${socket.user.username}`,
      `${add_friend}.${friend.userid}`
    );

    cb({
      done: true,
      addError: "",
      newFriend: {
        username: add_friend,
        userid: friend.userid,
        connected: friend.connected === "true",
      },
    });
  } catch (error) {
    console.error("Add friend error:", error);
    cb({
      done: false,
      addError:
        "Uh-oh! Something went wrong while adding your friend. Please try again later.",
    });
  }
};

// Function to handle user disconnection
module.exports.onDisconnect = async (socket) => {
  try {
    await redisClient.hset(
      `userid:${socket.user.username}`,
      "connected",
      false
    );
    const friendsList = await redisClient.lrange(
      `friends:${socket.user.username}`,
      0,
      -1
    );
    const friendRooms = await parseFriendsList(friendsList).then((friends) =>
      friends.map((friend) => friend.userid)
    );
    socket.to(friendRooms).emit("connected", false, socket.user.username);
  } catch (error) {
    console.error("Disconnection error:", error);
  }
};

// Function to handle direct messages
module.exports.dm = async (socket, messages) => {
  const parsedMessage = { ...messages, from: socket.user.userid };
  const messageString = [
    parsedMessage.to,
    parsedMessage.from,
    parsedMessage.content,
  ].join(".");

  try {
    await redisClient.lpush(`chat:${parsedMessage.to}`, messageString);
    await redisClient.lpush(`chat:${parsedMessage.from}`, messageString);
    socket.to(parsedMessage.to).emit("dm", parsedMessage);
  } catch (error) {
    console.error("Message error:", error);
  }
};
