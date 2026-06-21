"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    // Hardcoded connection string
    connectionString: "postgresql://neondb_owner:npg_JchlwWix7pA1@ep-shiny-cake-apgnhg50-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    ssl: false,
    //connectionString: "postgresql://postgres:postgres@localhost:5432/ecommerce_db",
    connectionTimeoutMillis: 10_000,
    idleTimeoutMillis: 30_000,
    keepAlive: true,
});
pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});
exports.default = pool;
//# sourceMappingURL=database.js.map