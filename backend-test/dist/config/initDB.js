"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const database_1 = __importDefault(require("./database"));
const initializeDatabase = async () => {
    try {
        console.log("🔧 Initializing test database...");
        // Create products table
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id UUID PRIMARY KEY,
        name VARCHAR(500) UNIQUE NOT NULL,
        url TEXT,
        image_url TEXT,
        description TEXT,
        specifications JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✓ Products table created/verified");
        // Create product_listings table
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS product_listings (
        listing_id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
        source_name VARCHAR(50) NOT NULL,
        listing_title TEXT NOT NULL,
        price INTEGER NOT NULL,
        url TEXT,
        image_url TEXT,
        description TEXT,
        specifications JSONB,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, source_name, listing_title)
      );
    `);
        console.log("✓ Product listings table created/verified");
        console.log("✅ Database initialization complete");
    }
    catch (error) {
        console.error("❌ Error initializing database:", error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=initDB.js.map