const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const executeQuery = require("../database/database");
const bcrypt = require("bcrypt");

// Define the route for login
router.post("/login", async (req, res) => {
  try {
    // Validate form inputs
    const validationError = validateForm(req);
    if (validationError) {
      return res.status(400).json({ loggedIn: false, status: validationError });
    }

    // Check if the user exists
    const existingUserCheck = await executeQuery(
      "SELECT id, username, passhash FROM users WHERE username=$1",
      [req.body.username]
    );

    if (existingUserCheck.rowCount > 0) {
      // Compare password hashes
      const isValidPass = await bcrypt.compare(
        req.body.password,
        existingUserCheck.rows[0].passhash
      );

      if (isValidPass) {
        // Save user data in session
        req.session.user = {
          username: req.body.username,
          id: existingUserCheck.rows[0].id,
        };
        return res.json({ loggedIn: true, status: "Log in successful!" });
      } else {
        return res
          .status(401)
          .json({ loggedIn: false, status: "Wrong username or password!" });
      }
    } else {
      return res
        .status(401)
        .json({ loggedIn: false, status: "Wrong username or password!" });
    }
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ loggedIn: false, status: "An error occurred during login." });
  }
});

// Define the route for signup
router.post("/signup", async (req, res) => {
  try {
    // Validate form inputs
    const validationError = validateForm(req);
    if (validationError) {
      return res.status(400).json({ loggedIn: false, status: validationError });
    }

    // Check if the user already exists
    const existingUserCheck = await executeQuery(
      "SELECT username FROM users WHERE username=$1",
      [req.body.username]
    );

    if (existingUserCheck.rowCount > 0) {
      return res
        .status(409)
        .json({ loggedIn: false, status: "Account already exists" });
    } else {
      // Hash the password
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Insert new user into the database
      const newUserQuery = await executeQuery(
        "INSERT INTO users (username, passhash) VALUES ($1, $2) RETURNING id, username",
        [req.body.username, hashedPassword]
      );

      // Save user data in session
      req.session.user = {
        username: req.body.username,
        id: newUserQuery.rows[0].id,
      };
      return res.json({
        loggedIn: true,
        status: "Signup successful!",
        username: newUserQuery.rows[0].username,
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ loggedIn: false, status: "An error occurred during signup." });
  }
});

module.exports = router;
