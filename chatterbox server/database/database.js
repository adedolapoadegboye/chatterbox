require("dotenv").config(); // Load environment variables from .env file

const { Pool } = require("pg");

// Configure the PostgreSQL connection pool using environment variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  max: 20, // increase pool size to 20
  idleTimeoutMillis: 30000, // close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // return an error after 2 seconds if connection could not be established
});

// Function to execute a query using the connection pool
const executeQuery = async (query, params) => {
  const client = await pool.connect(); // Get a client from the pool
  try {
    const res = await client.query(query, params); // Execute the query with parameters
    return res.rows; // Return the query results
  } catch (err) {
    console.error("Error executing query", err.stack); // Log any errors
    throw err; // Rethrow the error for further handling
  } finally {
    client.release(); // Release the client back to the pool
  }
};

// Function to create a table if it does not exist
const createTable = async (tableName, tableDefinition) => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName} (${tableDefinition});`;
  await executeQuery(query); // Execute the table creation query
  console.log(`Table "${tableName}" created successfully`); // Log success message
};

// Function to insert data into a specified table
const insertData = async (tableName, columns, values) => {
  const query = `INSERT INTO ${tableName} (${columns.join(
    ", "
  )}) VALUES (${values.map((_, i) => `$${i + 1}`).join(", ")});`;
  await executeQuery(query, values); // Execute the insert query with values
  console.log(`Data inserted into table "${tableName}"`); // Log success message
};

// Function to query data from the database
const queryData = async (query, params = []) => {
  const rows = await executeQuery(query, params); // Execute the query with optional parameters
  console.log("Query results:", rows); // Log the query results
  return rows; // Return the query results
};

// Function to update data in a specified table
const updateData = async (tableName, updates, condition) => {
  const setClause = updates.map((_, i) => `${_[0]} = $${i + 1}`).join(", "); // Create SET clause for the update query
  const values = updates.map((_) => _[1]); // Extract values for the update query
  const query = `UPDATE ${tableName} SET ${setClause} WHERE ${condition};`;
  await executeQuery(query, values); // Execute the update query with values
  console.log(`Data updated in table "${tableName}"`); // Log success message
};

// Function to delete data from a specified table
const deleteData = async (tableName, condition) => {
  const query = `DELETE FROM ${tableName} WHERE ${condition};`;
  await executeQuery(query); // Execute the delete query
  console.log(`Data deleted from table "${tableName}"`); // Log success message
};

// Export the common functions
module.exports = {
  pool,
  createTable,
  insertData,
  queryData,
  updateData,
  deleteData,
};
