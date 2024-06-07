const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const Yup = require("yup");

// Define the route for login
router.post("/login", (req, res) => {
  validateForm(req, res);
});

// Define the route for signup
router.post("/signup", (req, res) => {
  validateForm(req, res);
});

module.exports = router;
