"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// GET all products with their listings
router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT 
        p.product_id,
        p.name,
        p.url,
        p.image_url,
        p.description,
        p.brand,
        p.specifications,
        p.created_at,
        json_agg(
          json_build_object(
            'listing_id', pl.listing_id,
            'product_id', pl.product_id,
            'source_name', pl.source_name,
            'listing_title', pl.listing_title,
            'price', pl.price,
            'url', pl.url,
            'image_url', pl.image_url,
            'description', pl.description,
            'specifications', pl.specifications,
            'last_updated', pl.last_updated
          ) ORDER BY pl.price ASC
        ) FILTER (WHERE pl.listing_id IS NOT NULL) as listings
      FROM products p
      LEFT JOIN product_listings pl ON p.product_id = pl.product_id
      GROUP BY p.product_id, p.name, p.url, p.image_url, p.description, p.brand, p.specifications, p.created_at
      ORDER BY p.created_at DESC
    `;
        const result = await database_1.default.query(query);
        const products = result.rows;
        res.json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});
// GET product by ID with listings
router.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const query = `
      SELECT 
        p.product_id,
        p.name,
        p.url,
        p.image_url,
        p.description,
        p.brand,
        p.specifications,
        p.created_at,
        json_agg(
          json_build_object(
            'listing_id', pl.listing_id,
            'product_id', pl.product_id,
            'source_name', pl.source_name,
            'listing_title', pl.listing_title,
            'price', pl.price,
            'url', pl.url,
            'image_url', pl.image_url,
            'description', pl.description,
            'specifications', pl.specifications,
            'last_updated', pl.last_updated
          ) ORDER BY pl.price ASC
        ) FILTER (WHERE pl.listing_id IS NOT NULL) as listings
      FROM products p
      LEFT JOIN product_listings pl ON p.product_id = pl.product_id
      WHERE p.product_id = $1
      GROUP BY p.product_id, p.name, p.url, p.image_url, p.description, p.brand, p.specifications, p.created_at
    `;
        const result = await database_1.default.query(query, [productId]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        const product = result.rows[0];
        res.json(product);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map