// Import necessary modules and components
const express = require("express");
const request = require("supertest");
const bcrypt = require("bcrypt");
const session = require("express-session");
const authRouter = require("./authRouter");
const { executeQuery } = require("../database/database");
const validateForm = require("../controllers/validateForm");

jest.mock("../database/database");
jest.mock("../controllers/validateForm");
jest.mock("bcrypt");

const app = express();
app.use(express.json());
app.use(
  session({
    secret: "testSecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use("/auth", authRouter);

describe("Auth Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    test("should login successfully with valid credentials", async () => {
      validateForm.mockReturnValue(null);
      executeQuery.mockResolvedValue([
        { id: 1, username: "testuser", passhash: "hashedpassword" },
      ]);
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "password" });

      expect(validateForm).toHaveBeenCalledWith(expect.any(Object));
      expect(executeQuery).toHaveBeenCalledWith(
        "SELECT id, username, passhash FROM chatterbox_users WHERE username=$1",
        ["testuser"]
      );
      expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedpassword");
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        loggedIn: true,
        status: "Log in successful!",
      });
    });

    test("should return validation error", async () => {
      validateForm.mockReturnValue("Validation error");

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "password" });

      expect(validateForm).toHaveBeenCalledWith(expect.any(Object));
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        loggedIn: false,
        status: "Validation error",
      });
    });

    test("should return wrong username or password error", async () => {
      validateForm.mockReturnValue(null);
      executeQuery.mockResolvedValue([]);

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "wronguser", password: "password" });

      expect(executeQuery).toHaveBeenCalledWith(
        "SELECT id, username, passhash FROM chatterbox_users WHERE username=$1",
        ["wronguser"]
      );
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        loggedIn: false,
        status: "Wrong username or password!",
      });
    });

    test("should return internal server error on exception", async () => {
      validateForm.mockReturnValue(null);
      executeQuery.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "password" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        loggedIn: false,
        status: "An error occurred during login.",
      });
    });
  });

  describe("POST /auth/signup", () => {
    test("should signup successfully with valid data", async () => {
      executeQuery
        .mockResolvedValueOnce([]) // For checking if user exists
        .mockResolvedValueOnce([{ id: 1, username: "newuser" }]); // For inserting new user
      bcrypt.hash.mockResolvedValue("hashedpassword");

      const response = await request(app)
        .post("/auth/signup")
        .send({ username: "newuser", password: "newpassword" });

      expect(executeQuery).toHaveBeenCalledWith(
        "SELECT username FROM chatterbox_users WHERE username = $1",
        ["newuser"]
      );
      expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 10);
      expect(executeQuery).toHaveBeenCalledWith(
        "INSERT INTO chatterbox_users (username, passhash) VALUES ($1, $2) RETURNING id, username",
        ["newuser", "hashedpassword"]
      );
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        loggedIn: true,
        status: "Signup successful!",
        username: "newuser",
      });
    });

    test("should return account already exists error", async () => {
      executeQuery.mockResolvedValue([{ username: "existinguser" }]);

      const response = await request(app)
        .post("/auth/signup")
        .send({ username: "existinguser", password: "password" });

      expect(executeQuery).toHaveBeenCalledWith(
        "SELECT username FROM chatterbox_users WHERE username = $1",
        ["existinguser"]
      );
      expect(response.status).toBe(409);
      expect(response.body).toEqual({
        loggedIn: false,
        status: "Account already exists",
      });
    });

    test("should return internal server error on exception", async () => {
      executeQuery.mockRejectedValue(new Error("Database error"));

      const response = await request(app)
        .post("/auth/signup")
        .send({ username: "newuser", password: "newpassword" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        loggedIn: false,
        status: "An error occurred during signup.",
      });
    });
  });
});
