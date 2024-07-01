const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const { executeQuery } = require("../database/database");
const bcrypt = require("bcrypt");
const { rateLimiter } = require("../controllers/rateLimiter");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Utility function to create JWT
const createJWT = (user, res) => {
  jwt.sign(
    {
      username: user.username,
      id: user.id,
      userid: user.userid,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1hr" },
    (err, token) => {
      if (err) {
        return res
          .status(500)
          .json({ loggedIn: false, status: "JWT error, try again later" });
      }
      res.status(200).json({
        loggedIn: true,
        status: "Log in successful!",
        token,
      });
    }
  );
};

// Handler for user login
const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const validationError = validateForm(req);
    if (validationError) {
      return res.status(400).json({ loggedIn: false, status: validationError });
    }

    const userQuery = await executeQuery(
      "SELECT id, username, passhash, userid FROM chatterbox_users WHERE username=$1",
      [username]
    );

    if (userQuery.length === 0) {
      return res.status(401).json({
        loggedIn: false,
        status: "Wrong username or password!",
      });
    }

    const user = userQuery[0];
    const isValidPass = await bcrypt.compare(password, user.passhash);

    if (!isValidPass) {
      return res.status(401).json({
        loggedIn: false,
        status: "Wrong username or password!",
      });
    }

    createJWT(user, res);
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ loggedIn: false, status: "An error occurred during login." });
  }
};

// Handler to check login status
const checkLoginStatus = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ loggedIn: false, status: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).json({
        loggedIn: false,
        status: "Invalid token, please log in again",
      });
    }
    res.status(200).json({
      loggedIn: true,
      username: decodedToken.username,
    });
  });
};

// Handler for user signup
const handleSignup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUserQuery = await executeQuery(
      "SELECT username FROM chatterbox_users WHERE username = $1",
      [username]
    );

    if (existingUserQuery.length > 0) {
      return res
        .status(409)
        .json({ loggedIn: false, status: "Username taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserQuery = await executeQuery(
      "INSERT INTO chatterbox_users (username, passhash, userid) VALUES ($1, $2, $3) RETURNING id, username, userid",
      [username, hashedPassword, uuidv4()]
    );

    if (newUserQuery.length === 0) {
      return res
        .status(500)
        .json({ loggedIn: false, status: "User creation failed." });
    }

    const newUser = newUserQuery[0];
    createJWT(newUser, res);
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ loggedIn: false, status: "An error occurred during signup." });
  }
};

// Define the routes
router.route("/login").post(rateLimiter, handleLogin).get(checkLoginStatus);
router.post("/signup", rateLimiter, handleSignup);

module.exports = router;
