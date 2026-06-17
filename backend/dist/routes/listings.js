"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// GET all listings with platform info
router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT 
        pl.listing_id,
        pl.product_id,
        pl.platform_id,
        pl.listing_title,
        pl.price,
        pl.url,
        pl.image_url,
        pl.first_seen,
        pl.last_updated,
        pl.discount_rate,
        pl.promotions,
        p.name as platform_name,
        p.slug as platform_slug,
        p.logo_url as platform_logo_url,
        p.is_marketplace
      FROM product_listings pl
      LEFT JOIN platforms p ON pl.platform_id = p.platform_id
      ORDER BY pl.price ASC, pl.last_updated DESC
    `;
        const result = await database_1.default.query(query);
        const listings = result.rows.map((row) => ({
            listing_id: row.listing_id,
            product_id: row.product_id,
            platform_id: row.platform_id,
            listing_title: row.listing_title,
            price: row.price,
            url: row.url,
            image_url: row.image_url,
            first_seen: row.first_seen,
            last_updated: row.last_updated,
            discount_rate: row.discount_rate,
            promotions: row.promotions,
            platform: {
                platform_id: row.platform_id,
                name: row.platform_name,
                slug: row.platform_slug,
                logo_url: row.platform_logo_url,
                is_marketplace: row.is_marketplace,
            },
        }));
        res.json(listings);
    }
    catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});
// GET listings by product ID with platform info
router.get("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const query = `
      SELECT 
        pl.listing_id,
        pl.product_id,
        pl.platform_id,
        pl.listing_title,
        pl.price,
        pl.url,
        pl.image_url,
        pl.first_seen,
        pl.last_updated,
        pl.discount_rate,
        pl.promotions,
        p.name as platform_name,
        p.slug as platform_slug,
        p.logo_url as platform_logo_url,
        p.is_marketplace
      FROM product_listings pl
      LEFT JOIN platforms p ON pl.platform_id = p.platform_id
      WHERE pl.product_id = $1
      ORDER BY pl.price ASC
    `;
        const result = await database_1.default.query(query, [productId]);
        const listings = result.rows.map((row) => ({
            listing_id: row.listing_id,
            product_id: row.product_id,
            platform_id: row.platform_id,
            listing_title: row.listing_title,
            price: row.price,
            url: row.url,
            image_url: row.image_url,
            first_seen: row.first_seen,
            last_updated: row.last_updated,
            discount_rate: row.discount_rate,
            promotions: row.promotions,
            platform: {
                platform_id: row.platform_id,
                name: row.platform_name,
                slug: row.platform_slug,
                logo_url: row.platform_logo_url,
                is_marketplace: row.is_marketplace,
            },
        }));
        res.json(listings);
    }
    catch (error) {
        console.error("Error fetching listings:", error);
        res.status(500).json({ error: "Failed to fetch listings" });
    }
});
// GET listings by platform
router.get("/platform/:platformSlug", async (req, res) => {
    try {
        const { platformSlug } = req.params;
        const query = `
      SELECT 
        pl.listing_id,
        pl.product_id,
        pl.platform_id,
        pl.listing_title,
        pl.price,
        pl.url,
        pl.image_url,
        pl.first_seen,
        pl.last_updated
      FROM product_listings pl
      JOIN platforms p ON pl.platform_id = p.platform_id
      WHERE p.slug = $1
      ORDER BY pl.price ASC, pl.last_updated DESC
    `;
        const result = await database_1.default.query(query, [platformSlug]);
        const listings = result.rows;
        res.json(listings);
    }
    catch (error) {
        console.error("Error fetching listings by platform:", error);
        res.status(500).json({ error: "Failed to fetch listings by platform" });
    }
});
// GET listing with price history
router.get("/:listingId/price-history", async (req, res) => {
    try {
        const { listingId } = req.params;
        const query = `
      SELECT 
        pl.listing_id,
        pl.product_id,
        pl.platform_id,
        pl.listing_title,
        pl.price,
        pl.url,
        pl.image_url,
        pl.first_seen,
        pl.last_updated,
        json_agg(
          json_build_object(
            'history_id', ph.history_id,
            'price', ph.price,
            'recorded_at', ph.recorded_at
          ) ORDER BY ph.recorded_at DESC
        ) FILTER (WHERE ph.history_id IS NOT NULL) as priceHistory
      FROM product_listings pl
      LEFT JOIN price_history ph ON pl.listing_id = ph.listing_id
      WHERE pl.listing_id = $1
      GROUP BY pl.listing_id, pl.product_id, pl.platform_id, pl.listing_title, pl.price, pl.url, pl.image_url, pl.first_seen, pl.last_updated
    `;
        const result = await database_1.default.query(query, [listingId]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Listing not found" });
            return;
        }
        const listing = result.rows[0];
        res.json(listing);
    }
    catch (error) {
        console.error("Error fetching listing with price history:", error);
        res.status(500).json({ error: "Failed to fetch listing with price history" });
    }
});
exports.default = router;
//# sourceMappingURL=listings.js.map