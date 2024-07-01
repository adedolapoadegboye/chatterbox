// index.js
const express = require("express"); // Express framework for handling HTTP requests
const { Server } = require("socket.io"); // Socket.io for WebSocket communication
const helmet = require("helmet"); // Helmet for securing Express apps by setting various HTTP headers
const cors = require("cors"); // CORS for request/traffic permissions
const authRouter = require("./routers/authRouter"); // Import auth handler for logins and signups
const session = require("express-session"); // Session middleware for handling user sessions
require("dotenv").config(); // Load environment variables from .env file
const redisClient = require("./redis/redis"); // Redis client for session storage
// const { sessionMW, wrap } = require("./controllers/serverController"); // Session middleware and wrapper for Socket.io
const {
  authorizeUser,
  addFriend,
  onDisconnect,
  dm,
} = require("./controllers/socketController");
const RedisStore = require("connect-redis").default; // Redis store for session storage

// Create an Express application
const app = express();

// Create an HTTP server using the Express app
const server = require("http").createServer(app);

// Create a new Socket.io server and configure CORS settings
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with the requests
  },
});

// Use Helmet middleware to enhance the app's security
app.use(helmet());

// Use CORS to accept requests/traffic from the frontend only
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Use middleware to parse JSON bodies in HTTP requests
app.use(express.json());

// Log incoming requests in development mode for debugging purposes
if (process.env.NODE_ENV === "development") {
  const morgan = require("morgan");
  app.use(morgan("dev"));
}

// Use middleware for session persistence
// app.use(sessionMW);

// Use middleware to pass auth requests to appropriate handler
app.use("/auth", authRouter);

app.set("trust proxy", 1);

// Socket.io middleware to use the same session management
// io.use(wrap(sessionMW));

// Custom middleware to authorize user
io.use(authorizeUser);

// Handle WebSocket connections
io.on("connect", (socket) => {
  // Log the username and user id of the connected user
  // console.log(`User connected `);
  socket.on("disconnect", () => {
    onDisconnect(socket);
    // Handle user disconnection
    // console.log(`User disconnected: ${socket.request.session.user.username}`);
  });

  // Handle "Add Friend" events
  socket.on("add_friend", (newFriendName, cb) => {
    addFriend(socket, newFriendName, cb);
  });

  // Handle "Message" events
  socket.on("dm", (message) => {
    dm(socket, message);
  });
});

// Error handling middleware for Express
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server and listen on port 4000
server.listen(process.env.PORT || 4000, () => {
  console.log(`Server listening on port ${process.env.PORT || 4000}`); // Log a message when the server starts
});
