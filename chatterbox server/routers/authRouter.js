const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const executeQuery = require("../database/database");
const bcrypt = require("bcrypt");

// Define the route for login
router.post("/login", (req, res) => {
  validateForm(req, res);
});

// Define the route for signup
router.post("/signup", async (req, res) => {
  validateForm(req, res);

  const existingUserCheck = await executeQuery(
    "SELECT username from users WHERE username=$1",
    [req.body.username]
  );

  if (existingUserCheck > 0) {
    res.json({ loggedIn: false, status: "Account already exists" });
  } else {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await await executeQuery(
      "INSERT INTO users (username, passhash) values($1,$2) RETURNING username",
      [req.body.username, hashedPassword]
    );
    res.json({ loggedIn: true, username: newUserQuery });
  }
});

module.exports = router;
