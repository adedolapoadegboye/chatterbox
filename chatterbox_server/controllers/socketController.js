const redisClient = require("../redis/redis");
require("dotenv").config();

// Middleware to authorize the user
module.exports.authorizeUser = async (socket, next) => {
  const session = socket.request.session;
  if (session && session.user) {
    socket.user = session.user; // Set the user object
    socket.join(socket.user.userid); // Join the user to their own room

    // Set the Redis key without extra spaces
    await redisClient.hset(
      `userid:${socket.user.username}`,
      "userid",
      socket.user.userid,
      "connected",
      true
    );

    // Get the friends list from Redis
    const friendsList = await redisClient.lrange(
      `friends:${socket.user.username}`,
      0,
      -1
    );

    // Parse the friends list to include connection status
    const parsedFriendsList = await parseFriendsList(friendsList);
    const friendRooms = parsedFriendsList.map((friend) => friend.userid);

    // Notify friends about the user's connection status
    if (friendRooms.length > 0) {
      socket.to(friendRooms).emit("connected", true, socket.user.username);
    }

    console.log(`Friend list for ${socket.user.username}`, parsedFriendsList);
    socket.emit("friends", parsedFriendsList);
    next();
  } else {
    console.log("User not authorized:", session); // Debugging line
    next(new Error("Unauthorized"));
  }
};

// Function to add a friend
module.exports.addFriend = async (socket, add_friend, cb) => {
  // Get the friend's details from Redis
  const friend = await redisClient.hgetall(`userid:${add_friend}`);
  if (!friend || !friend.userid) {
    cb({
      done: false,
      addError: "User does not exist. Please check your submission",
    });
    return;
  }

  // Prevent adding oneself as a friend
  if (friend.userid === socket.user.userid) {
    cb({
      done: false,
      addError: "You cannot add yourself as a friend!",
    });
    return;
  }

  // Check if the friend is already in the user's friends list
  const currentFriendsList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  if (
    currentFriendsList &&
    currentFriendsList.includes(`${add_friend}.${friend.userid}`)
  ) {
    cb({
      done: false,
      addError: "Friend already exists",
    });
    return;
  }

  // Add the friend to the user's friends list in Redis
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
      connected: friend.connected,
    },
  });
};

// Function to handle user disconnection
module.exports.onDisconnect = async (socket) => {
  await redisClient.hset(`userid:${socket.user.username}`, "connected", false);
  const friendsList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );
  const friendRooms = await parseFriendsList(friendsList).then((friends) =>
    friends.map((friend) => friend.userid)
  );
  socket.to(friendRooms).emit("connected", false, socket.user.username);
};

// Helper function to parse the friends list
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
