"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMigrations = void 0;
const database_1 = __importDefault(require("./database"));
/**
 * Run all migrations
 */
const runMigrations = async () => {
    try {
        console.log("🔄 Running database migrations...");
        // Check if discount_rate column exists, if not, add it
        await addDiscountRateColumn();
        // Check if promotions column exists, if not, add it
        await addPromotionsColumn();
        console.log("✅ All migrations completed successfully");
    }
    catch (error) {
        console.error("❌ Migration failed:", error);
        throw error;
    }
};
exports.runMigrations = runMigrations;
/**
 * Add discount_rate column to product_listings table if it doesn't exist
 */
const addDiscountRateColumn = async () => {
    try {
        // Check if column exists
        const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_listings' AND column_name = 'discount_rate'
      );
    `;
        const result = await database_1.default.query(checkQuery);
        const columnExists = result.rows[0].exists;
        if (!columnExists) {
            console.log("📝 Adding discount_rate column...");
            await database_1.default.query(`
        ALTER TABLE product_listings
        ADD COLUMN discount_rate INTEGER DEFAULT NULL;
      `);
            console.log("✅ discount_rate column added");
        }
        else {
            console.log("✓ discount_rate column already exists");
        }
    }
    catch (error) {
        console.error("❌ Error adding discount_rate column:", error);
        throw error;
    }
};
/**
 * Add promotions column to product_listings table if it doesn't exist
 */
const addPromotionsColumn = async () => {
    try {
        // Check if column exists
        const checkQuery = `
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'product_listings' AND column_name = 'promotions'
      );
    `;
        const result = await database_1.default.query(checkQuery);
        const columnExists = result.rows[0].exists;
        if (!columnExists) {
            console.log("📝 Adding promotions column...");
            await database_1.default.query(`
        ALTER TABLE product_listings
        ADD COLUMN promotions JSONB DEFAULT NULL;
      `);
            console.log("✅ promotions column added");
        }
        else {
            console.log("✓ promotions column already exists");
        }
    }
    catch (error) {
        console.error("❌ Error adding promotions column:", error);
        throw error;
    }
};
//# sourceMappingURL=migrations.js.map