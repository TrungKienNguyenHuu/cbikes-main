import { Pool } from "pg";

const pool = new Pool({
  // Hardcoded connection string
  connectionString: "postgresql://neondb_owner:npg_JchlwWix7pA1@ep-shiny-cake-apgnhg50-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: true,
  connectionTimeoutMillis: 10_000,
  idleTimeoutMillis: 30_000,
  keepAlive: true,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;