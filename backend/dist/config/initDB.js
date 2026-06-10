"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = void 0;
const database_1 = __importDefault(require("./database"));
const initializeDatabase = async () => {
    try {
        console.log("🔧 Initializing database with new schema...");
        // 1. Create brands table
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS brands (
        brand_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(100) UNIQUE NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        logo_url TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✓ Brands table created/verified");
        // 2. Create platforms table
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS platforms (
        platform_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(50) UNIQUE NOT NULL,
        slug VARCHAR(50) UNIQUE NOT NULL,
        logo_url TEXT,
        is_marketplace BOOLEAN DEFAULT true
      );
    `);
        console.log("✓ Platforms table created/verified");
        // 3. Create products table
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        brand_id UUID REFERENCES brands(brand_id) ON DELETE SET NULL,
        name VARCHAR(500) UNIQUE NOT NULL,
        slug VARCHAR(500) UNIQUE NOT NULL,
        image_url TEXT,
        description TEXT,
        specifications JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✓ Products table created/verified");
        // 4. Create product_listings table
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS product_listings (
        listing_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
        platform_id UUID REFERENCES platforms(platform_id) ON DELETE CASCADE,
        listing_title TEXT NOT NULL,
        price INTEGER NOT NULL,
        url TEXT NOT NULL,
        image_url TEXT,
        first_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(product_id, platform_id, listing_title)
      );
    `);
        console.log("✓ Product listings table created/verified");
        // 5. Create price_history table
        await database_1.default.query(`
      CREATE TABLE IF NOT EXISTS price_history (
        history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        listing_id UUID REFERENCES product_listings(listing_id) ON DELETE CASCADE,
        price INTEGER NOT NULL,
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log("✓ Price history table created/verified");
        console.log("✅ Database initialization complete");
    }
    catch (error) {
        console.error("❌ Error initializing database:", error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
//# sourceMappingURL=initDB.js.map