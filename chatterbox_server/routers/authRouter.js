const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const { executeQuery } = require("../database/database"); // Correctly import executeQuery
const bcrypt = require("bcrypt");
const { rateLimiter } = require("../controllers/rateLimiter");
const { v4: uuidv4 } = require("uuid");

// Define the route for login
router
  .route("/login")
  .post(rateLimiter, async (req, res) => {
    const { username, password } = req.body;

    try {
      // Validate form inputs
      const validationError = validateForm(req);
      if (validationError) {
        return res
          .status(400)
          .json({ loggedIn: false, status: validationError });
      }

      // Check if the user exists
      const existingUserCheck = await executeQuery(
        "SELECT id, username, passhash, userid FROM chatterbox_users WHERE username=$1",
        [username]
      );

      if (existingUserCheck.length > 0) {
        // Compare password hashes
        const isValidPass = await bcrypt.compare(
          password,
          existingUserCheck[0].passhash
        );

        if (isValidPass) {
          // Save user data in session
          req.session.user = {
            username: username,
            id: existingUserCheck[0].id,
            userid: existingUserCheck[0].userid,
          };
          return res.json({
            loggedIn: true,
            status: "Log in successful!",
          });
        } else {
          return res.status(401).json({
            loggedIn: false,
            status: "Wrong username or password!",
          });
        }
      } else {
        return res.status(401).json({
          loggedIn: false,
          status: "Wrong username or password!",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      return res
        .status(500)
        .json({ loggedIn: false, status: "An error occurred during login." });
    }
  })
  .get(async (req, res) => {
    if (req.session.user && req.session.user.username) {
      res.json({ loggedIn: true, username: req.session.user.username });
    } else {
      res.json({ loggedIn: false });
    }
  });

// Signup route
router.post("/signup", rateLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user already exists
    const existingUserCheck = await executeQuery(
      "SELECT username FROM chatterbox_users WHERE username = $1",
      [username]
    );

    if (existingUserCheck.length > 0) {
      return res
        .status(409)
        .json({ loggedIn: false, status: "Username taken" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      const newUserQuery = await executeQuery(
        "INSERT INTO chatterbox_users (username, passhash, userid) VALUES ($1, $2, $3) RETURNING id, username",
        [username, hashedPassword, uuidv4()]
      );

      // Check if the insert query returned a result
      if (newUserQuery && newUserQuery.length > 0) {
        // Save user data in session
        req.session.user = {
          username: username,
          id: newUserQuery[0].id,
          userid: newUserQuery[0].userid,
        };

        return res.json({
          loggedIn: true,
          status: "Signup successful!",
          username: newUserQuery[0].username,
        });
      } else {
        return res
          .status(500)
          .json({ loggedIn: false, status: "User creation failed." });
      }
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ loggedIn: false, status: "An error occurred during signup." });
  }
});

module.exports = router;
