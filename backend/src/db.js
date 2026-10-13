
const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

const dockerCaPath = "/app/certs/global-bundle.pem";
const localCaPath = path.join(__dirname, "../global-bundle.pem");

const caPath =
  process.env.DB_CA_CERT ||
  (fs.existsSync(dockerCaPath) ? dockerCaPath : localCaPath);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME || "ecommerce",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT || 5432),
  ssl: {
    ca: fs.readFileSync(caPath, "utf8"),
    rejectUnauthorized: true,
  },
});

module.exports = pool;

