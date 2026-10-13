const fs = require("fs");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || "ecommerce",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: {
    ca: fs.readFileSync("/app/certs/global-bundle.pem", "utf8"),
    rejectUnauthorized: true,
  },
});

module.exports = pool;
