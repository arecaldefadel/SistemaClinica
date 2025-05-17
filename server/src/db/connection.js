// Get the client
import mysql from "mysql2/promise";
import config from "../config.js";

// Create the connection to database
const pool = mysql.createPool({
  host: config.DB_HOST,
  user: config.DB_USERNAME,
  database: config.DB_NAME,
  password: config.DB_PASSWORD,
  port: config.DB_PORT,
  namedPlaceholders: true,
});
export { pool };
