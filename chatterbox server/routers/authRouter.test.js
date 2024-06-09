// src/routes/authRoutes.test.js
const request = require("supertest");
const express = require("express");
const session = require("express-session");
const authRoutes = require("./authRoutes");
const executeQuery = require("../database/database");
const bcrypt = require("bcrypt");

// Mock the executeQuery function
jest.mock("../database/database");

const app = express();

app.use(express.json());
app.use(
  session({ secret: "testsecret", resave: false, saveUninitialized: true })
);
app.use("/auth", authRoutes);

describe("Auth Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/login", () => {
    it("should return 400 for validation error", async () => {
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "", password: "" });
      expect(response.status).toBe(400);
      expect(response.body.loggedIn).toBe(false);
    });

    it("should return 401 for non-existent user", async () => {
      executeQuery.mockResolvedValueOnce({ rowCount: 0 });
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "nonexistent", password: "password" });
      expect(response.status).toBe(401);
      expect(response.body.loggedIn).toBe(false);
      expect(response.body.status).toBe("Wrong username or password!");
    });

    it("should return 401 for wrong password", async () => {
      executeQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, username: "testuser", passhash: "hashedpassword" }],
      });
      bcrypt.compare = jest.fn().mockResolvedValueOnce(false);
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "wrongpassword" });
      expect(response.status).toBe(401);
      expect(response.body.loggedIn).toBe(false);
      expect(response.body.status).toBe("Wrong username or password!");
    });

    it("should return 200 and set session for valid credentials", async () => {
      executeQuery.mockResolvedValueOnce({
        rowCount: 1,
        rows: [{ id: 1, username: "testuser", passhash: "hashedpassword" }],
      });
      bcrypt.compare = jest.fn().mockResolvedValueOnce(true);
      const response = await request(app)
        .post("/auth/login")
        .send({ username: "testuser", password: "correctpassword" });
      expect(response.status).toBe(200);
      expect(response.body.loggedIn).toBe(true);
      expect(response.body.status).toBe("Log in successful!");
    });
  });

  describe("POST /auth/signup", () => {
    it("should return 400 for validation error", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({ username: "", password: "" });
      expect(response.status).toBe(400);
      expect(response.body.loggedIn).toBe(false);
    });

    it("should return 409 for existing user", async () => {
      executeQuery.mockResolvedValueOnce({ rowCount: 1 });
      const response = await request(app)
        .post("/auth/signup")
        .send({ username: "existinguser", password: "password" });
      expect(response.status).toBe(409);
      expect(response.body.loggedIn).toBe(false);
      expect(response.body.status).toBe("Account already exists");
    });

    it("should return 200 and set session for new user", async () => {
      executeQuery.mockResolvedValueOnce({ rowCount: 0 });
      executeQuery.mockResolvedValueOnce({
        rows: [{ id: 1, username: "newuser" }],
      });
      bcrypt.hash = jest.fn().mockResolvedValueOnce("hashedpassword");
      const response = await request(app)
        .post("/auth/signup")
        .send({ username: "newuser", password: "password" });
      expect(response.status).toBe(200);
      expect(response.body.loggedIn).toBe(true);
      expect(response.body.status).toBe("Signup successful!");
    });
  });
});
