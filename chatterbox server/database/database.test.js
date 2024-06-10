// Import necessary modules and components
const { Pool } = require("pg");
const {
  executeQuery,
  createTable,
  insertData,
  queryData,
  updateData,
  deleteData,
} = require("./database");

// Mock the pg Pool
jest.mock("pg", () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    release: jest.fn(),
  };
  const mPool = {
    connect: jest.fn(() => mClient),
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const mPool = new Pool();
const mClient = mPool.connect();

// Test suite for the PostgreSQL utility functions
describe("PostgreSQL Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("executeQuery executes a query successfully", async () => {
    const mockQuery = "SELECT * FROM users WHERE id = $1";
    const mockParams = [1];
    const mockResponse = { rows: [{ id: 1, username: "testuser" }] };
    mClient.query.mockResolvedValueOnce(mockResponse);

    const result = await executeQuery(mockQuery, mockParams);

    expect(mClient.connect).toHaveBeenCalledTimes(1);
    expect(mClient.query).toHaveBeenCalledWith(mockQuery, mockParams);
    expect(mClient.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse.rows);
  });

  test("executeQuery handles query errors", async () => {
    const mockQuery = "SELECT * FROM users WHERE id = $1";
    const mockParams = [1];
    const mockError = new Error("Query failed");
    mClient.query.mockRejectedValueOnce(mockError);

    await expect(executeQuery(mockQuery, mockParams)).rejects.toThrow(
      "Query failed"
    );

    expect(mClient.connect).toHaveBeenCalledTimes(1);
    expect(mClient.query).toHaveBeenCalledWith(mockQuery, mockParams);
    expect(mClient.release).toHaveBeenCalledTimes(1);
  });

  test("createTable creates a table successfully", async () => {
    const mockTableName = "users";
    const mockTableDefinition = "id SERIAL PRIMARY KEY, username VARCHAR(50)";
    const mockQuery = `CREATE TABLE IF NOT EXISTS ${mockTableName} (${mockTableDefinition});`;

    mClient.query.mockResolvedValueOnce({ rows: [] });

    await createTable(mockTableName, mockTableDefinition);

    expect(mClient.query).toHaveBeenCalledWith(mockQuery, undefined);
    expect(mClient.release).toHaveBeenCalledTimes(1);
  });

  test("insertData inserts data successfully", async () => {
    const mockTableName = "users";
    const mockColumns = ["username", "password"];
    const mockValues = ["testuser", "testpass"];
    const mockQuery = `INSERT INTO ${mockTableName} (${mockColumns.join(
      ", "
    )}) VALUES (${mockValues.map((_, i) => `$${i + 1}`).join(", ")});`;

    mClient.query.mockResolvedValueOnce({ rows: [] });

    await insertData(mockTableName, mockColumns, mockValues);

    expect(mClient.query).toHaveBeenCalledWith(mockQuery, mockValues);
    expect(mClient.release).toHaveBeenCalledTimes(1);
  });

  test("queryData queries data successfully", async () => {
    const mockQuery = "SELECT * FROM users";
    const mockResponse = { rows: [{ id: 1, username: "testuser" }] };
    mClient.query.mockResolvedValueOnce(mockResponse);

    const result = await queryData(mockQuery);

    expect(mClient.query).toHaveBeenCalledWith(mockQuery, []);
    expect(mClient.release).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse.rows);
  });

  test("updateData updates data successfully", async () => {
    const mockTableName = "users";
    const mockUpdates = [["username", "updateduser"]];
    const mockCondition = "id = 1";
    const mockQuery = `UPDATE ${mockTableName} SET username = $1 WHERE ${mockCondition};`;
    const mockValues = ["updateduser"];

    mClient.query.mockResolvedValueOnce({ rows: [] });

    await updateData(mockTableName, mockUpdates, mockCondition);

    expect(mClient.query).toHaveBeenCalledWith(mockQuery, mockValues);
    expect(mClient.release).toHaveBeenCalledTimes(1);
  });

  test("deleteData deletes data successfully", async () => {
    const mockTableName = "users";
    const mockCondition = "id = 1";
    const mockQuery = `DELETE FROM ${mockTableName} WHERE ${mockCondition};`;

    mClient.query.mockResolvedValueOnce({ rows: [] });

    await deleteData(mockTableName, mockCondition);

    expect(mClient.query).toHaveBeenCalledWith(mockQuery, undefined);
    expect(mClient.release).toHaveBeenCalledTimes(1);
  });
});
