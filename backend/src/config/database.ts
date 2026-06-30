import { Pool } from "pg";

const pool = new Pool({
  // Hardcoded connection string
  connectionString: "postgresql://neondb_owner:npg_exV9no0fEDrR@ep-muddy-mud-aouf3bx2-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: true,
  //connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_db",
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  keepAlive: true,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;