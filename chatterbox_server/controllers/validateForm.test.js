const validateForm = require("./validateForm");

// Mock the response object to capture the JSON response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Mock the next function
const mockNext = () => jest.fn();

describe("validateForm", () => {
  // it("should return an error if username is missing", async () => {
  //   const req = { body: { password: "testpassword" } };
  //   const res = mockResponse();
  //   const next = mockNext();
  //   await validateForm(req, res, next);
  //   // expect(res.status).toHaveBeenCalledWith(422);
  //   expect(res.json).toHaveBeenCalledWith({
  //     errors: ["Username is required!"],
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });
  // it("should return an error if password is missing", async () => {
  //   const req = { body: { username: "testuser" } };
  //   const res = mockResponse();
  //   const next = mockNext();
  //   await validateForm(req, res, next);
  //   // expect(res.status).toHaveBeenCalledWith(422);
  //   expect(res.json).toHaveBeenCalledWith({
  //     errors: ["Password is required!"],
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });
  // it("should return an error if username is too short", async () => {
  //   const req = { body: { username: "test", password: "testpassword" } };
  //   const res = mockResponse();
  //   const next = mockNext();
  //   await validateForm(req, res, next);
  //   // expect(res.status).toHaveBeenCalledWith(422);
  //   expect(res.json).toHaveBeenCalledWith({
  //     errors: ["Username is too short!"],
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });
  // it("should return an error if password is too short", async () => {
  //   const req = { body: { username: "testuser", password: "test" } };
  //   const res = mockResponse();
  //   const next = mockNext();
  //   await validateForm(req, res, next);
  //   // expect(res.status).toHaveBeenCalledWith(422);
  //   expect(res.json).toHaveBeenCalledWith({
  //     errors: ["Password is too short!"],
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });
  // it("should return an error if username is too long", async () => {
  //   const req = {
  //     body: { username: "a".repeat(129), password: "testpassword" },
  //   };
  //   const res = mockResponse();
  //   const next = mockNext();
  //   await validateForm(req, res, next);
  //   // expect(res.status).toHaveBeenCalledWith(422);
  //   expect(res.json).toHaveBeenCalledWith({
  //     errors: ["Username is too long!"],
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });
  // it("should return an error if password is too long", async () => {
  //   const req = { body: { username: "testuser", password: "a".repeat(129) } };
  //   const res = mockResponse();
  //   const next = mockNext();
  //   await validateForm(req, res, next);
  //   // expect(res.status).toHaveBeenCalledWith(422);
  //   expect(res.json).toHaveBeenCalledWith({
  //     errors: ["Password is too long!"],
  //   });
  //   expect(next).not.toHaveBeenCalled();
  // });
  // it("should call next if form data is invalid", async () => {
  //   const req = { body: { username: "vali", password: "vali" } };
  //   const res = mockResponse();
  //   const next = mockNext();
  //   await validateForm(req, res, next);
  //   expect(res.status).not.toHaveBeenCalled(); // No status should be set for a valid form
  //   expect(res.json).not.toHaveBeenCalled(); // No JSON response should be sent for a valid form
  //   expect(next).toHaveBeenCalled(); // next should be called for a valid form
  // });
});
