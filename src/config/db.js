const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test the database connection
pool.query("SELECT NOW()", (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Database connection successful");
  }
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
