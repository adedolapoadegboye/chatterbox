// src/controllers/validateForm.test.js
const validateForm = require("./validateForm");
const Yup = require("yup");

// Mock the response object to capture the JSON response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("validateForm", () => {
  it("should return an error if username is missing", async () => {
    const req = { body: { password: "testpassword" } };
    const res = mockResponse();

    await validateForm(req, res);
    // expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Username is required!"],
    });
  });

  it("should return an error if password is missing", async () => {
    const req = { body: { username: "testuser" } };
    const res = mockResponse();

    await validateForm(req, res);
    // expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Password is required!"],
    });
  });

  it("should return an error if username is too short", async () => {
    const req = { body: { username: "test", password: "testpassword" } };
    const res = mockResponse();

    await validateForm(req, res);
    // expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Username is too short!"],
    });
  });

  it("should return an error if password is too short", async () => {
    const req = { body: { username: "testuser", password: "test" } };
    const res = mockResponse();

    await validateForm(req, res);
    // expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Password is too short!"],
    });
  });

  it("should return an error if username is too long", async () => {
    const req = {
      body: { username: "a".repeat(129), password: "testpassword" },
    };
    const res = mockResponse();

    await validateForm(req, res);
    // expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Username is too long!"],
    });
  });

  it("should return an error if password is too long", async () => {
    const req = { body: { username: "testuser", password: "a".repeat(129) } };
    const res = mockResponse();

    await validateForm(req, res);
    // expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      errors: ["Password is too long!"],
    });
  });

  it("should return success if form data is valid", async () => {
    const req = { body: { username: "validuser", password: "validpassword" } };
    const res = mockResponse();

    await validateForm(req, res);
    expect(res.status).not.toHaveBeenCalled(); // No status should be set for a valid form
    expect(res.json).not.toHaveBeenCalled(); // No JSON response should be sent for a valid form
  });
});
