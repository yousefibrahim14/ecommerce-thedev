const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER || "ecommerce_user",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "ecommerce",
  password: process.env.DB_PASSWORD || "ecommerce_password",
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;
