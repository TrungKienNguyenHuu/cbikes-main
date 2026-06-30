"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
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
exports.default = pool;
//# sourceMappingURL=database.js.map