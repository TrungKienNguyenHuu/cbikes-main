"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// GET all listings
router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT listing_id, product_id, source_name, listing_title, price, url, image_url, last_updated 
      FROM product_listings
      ORDER BY price ASC, last_updated DESC
    `;
        const result = await database_1.default.query(query);
        const listings = result.rows;
        res.json(listings);
    }
    catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});
// GET listings by product ID
router.get("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const query = `
      SELECT listing_id, product_id, source_name, listing_title, price, url, image_url, last_updated
      FROM product_listings
      WHERE product_id = $1
      ORDER BY price ASC
    `;
        const result = await database_1.default.query(query, [productId]);
        const listings = result.rows;
        res.json(listings);
    }
    catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});
exports.default = router;
//# sourceMappingURL=listings.js.map