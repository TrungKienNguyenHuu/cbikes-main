import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  // Pull from environment variables securely
  connectionString: process.env.DATABASE_URL,
  ssl: false,
  //connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_db",
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  keepAlive: true,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;