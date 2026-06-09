"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const isLocalConnection = process.env.DATABASE_URL?.includes("localhost") ||
    process.env.DATABASE_URL?.includes("127.0.0.1");
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: isLocalConnection ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
    idleTimeoutMillis: 30000,
    keepAlive: true,
});
pool.on("error", (err) => {
    console.error("Unexpected error on idle client", err);
});
exports.default = pool;
//# sourceMappingURL=database.js.map