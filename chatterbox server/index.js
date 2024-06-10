// Import the necessary modules
const express = require("express"); // Express framework for handling HTTP requests
const { Server } = require("socket.io"); // Socket.io for WebSocket communication
const helmet = require("helmet"); // Helmet for securing Express apps by setting various HTTP headers
const cors = require("cors"); // CORS for request/traffic permissions
const authRouter = require("./routers/authRouter"); // Import auth handler for logins and signups
const session = require("express-session");
require("dotenv").config();

// Create an Express application
const app = express();

// Create an HTTP server using the Express app
const server = require("http").createServer(app);

// Create a new Socket.io server and configure CORS settings
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: "true", // Allow cookies to be sent with the requests
  },
});

// Use Helmet middleware to enhance the app's security
app.use(helmet());

// User CORS to accept requests/traffic from the frontend only
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// Use middleware to parse JSON bodies in HTTP requests
app.use(express.json());

// Use middleware for session persistence
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: "sid",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.ENVIRONMENT === "production",
      httpOnly: true,
      sameSite: process.env.ENVIRONMENT === "production" ? "none" : "lax",
    },
  })
);

// Use middleware to pass auth requests to appropriate handler
app.use("/auth", authRouter);

// Define a route for the root URL
// app.get("/", (req, res) => {
//   res.json("hi"); // Send a JSON response with the message "hi"
// });

// Handle WebSocket connections
io.on("connect", (socket) => {
  // Code to handle socket connections goes here
});

// Start the server and listen on port 4000
server.listen(4000, () => {
  console.log("Server Listening on port 4000"); // Log a message when the server starts
});
