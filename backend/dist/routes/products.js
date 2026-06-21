"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../config/database"));
const router = (0, express_1.Router)();
// Helper function to extract unique sellers from listings
const extractSellersFromListings = (listings) => {
    const sellerMap = new Map();
    listings.forEach((listing) => {
        const platformId = listing.platform?.platform_id || listing.platform_id;
        if (platformId) {
            const platformName = listing.platform?.name || platformId;
            if (!sellerMap.has(platformId)) {
                sellerMap.set(platformId, {
                    name: platformName,
                    price: listing.price,
                    ...(listing.original_price !== undefined && { original_price: listing.original_price }),
                    url: listing.url,
                    ...(listing.discount_rate !== undefined && { discount_rate: listing.discount_rate }),
                    ...(listing.promotions && listing.promotions.length > 0 && { promotions: listing.promotions }),
                });
            }
            else {
                // Keep the minimum price for this seller
                const existing = sellerMap.get(platformId);
                if (listing.price < existing.price) {
                    existing.price = listing.price;
                    existing.url = listing.url;
                    if (listing.original_price !== undefined) {
                        existing.original_price = listing.original_price;
                    }
                    if (listing.discount_rate !== undefined) {
                        existing.discount_rate = listing.discount_rate;
                    }
                    if (listing.promotions && listing.promotions.length > 0) {
                        existing.promotions = listing.promotions;
                    }
                }
            }
        }
    });
    return Array.from(sellerMap.values());
};
// GET all products with their listings and brand info, including price history
router.get("/", async (req, res) => {
    try {
        const query = `
      SELECT 
        p.product_id,
        p.brand_id,
        p.name,
        p.slug,
        p.image_url,
        p.description,
        p.specifications,
        p.created_at,
        b.brand_id,
        b.name as brand_name,
        b.slug as brand_slug,
        b.logo_url as brand_logo_url,
        b.description as brand_description,
        COALESCE(json_agg(
          json_build_object(
            'listing_id', pl.listing_id,
            'product_id', pl.product_id,
            'platform_id', pl.platform_id,
            'listing_title', pl.listing_title,
            'price', pl.price,
            'original_price', pl.original_price,
            'url', pl.url,
            'image_url', pl.image_url,
            'detail_image_url', pl.detail_image_url,
            'first_seen', pl.first_seen,
            'last_updated', pl.last_updated,
            'discount_rate', pl.discount_rate,
            'promotions', pl.promotions,
            'platform', json_build_object(
              'platform_id', plat.platform_id,
              'name', plat.name,
              'slug', plat.slug,
              'logo_url', plat.logo_url,
              'is_marketplace', plat.is_marketplace
            ),
            'priceHistory', COALESCE(ph_data.price_history, '[]'::json)
          ) ORDER BY pl.price ASC
        ) FILTER (WHERE pl.listing_id IS NOT NULL), '[]'::json) as listings
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_listings pl ON p.product_id = pl.product_id
      LEFT JOIN platforms plat ON pl.platform_id = plat.platform_id
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'date', recorded_at::date,
            'price', price
          ) ORDER BY recorded_at
        ) as price_history
        FROM price_history
        WHERE listing_id = pl.listing_id
      ) ph_data ON TRUE
      GROUP BY p.product_id, p.brand_id, p.name, p.slug, p.image_url, p.description, p.specifications, p.created_at,
               b.brand_id, b.name, b.slug, b.logo_url, b.description
      ORDER BY p.created_at DESC
    `;
        const result = await database_1.default.query(query);
        const products = result.rows.map((row) => {
            const listings = row.listings || [];
            const sellers = extractSellersFromListings(listings);
            return {
                product_id: row.product_id,
                brand_id: row.brand_id,
                name: row.name,
                slug: row.slug,
                image_url: row.image_url,
                description: row.description,
                specifications: row.specifications,
                created_at: row.created_at,
                brand: row.brand_id ? {
                    brand_id: row.brand_id,
                    name: row.brand_name,
                    slug: row.brand_slug,
                    logo_url: row.brand_logo_url,
                    description: row.brand_description,
                    created_at: row.created_at,
                } : undefined,
                listings: listings,
                sellers: sellers,
            };
        });
        res.json(products);
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});
// GET product by ID with listings and brand info, including price history
router.get("/:productId", async (req, res) => {
    try {
        const { productId } = req.params;
        const query = `
      SELECT 
        p.product_id,
        p.brand_id,
        p.name,
        p.slug,
        p.image_url,
        p.description,
        p.specifications,
        p.created_at,
        b.brand_id,
        b.name as brand_name,
        b.slug as brand_slug,
        b.logo_url as brand_logo_url,
        b.description as brand_description,
        COALESCE(json_agg(
          json_build_object(
            'listing_id', pl.listing_id,
            'product_id', pl.product_id,
            'platform_id', pl.platform_id,
            'listing_title', pl.listing_title,
            'price', pl.price,
            'original_price', pl.original_price,
            'url', pl.url,
            'image_url', pl.image_url,
            'detail_image_url', pl.detail_image_url,
            'first_seen', pl.first_seen,
            'last_updated', pl.last_updated,
            'discount_rate', pl.discount_rate,
            'promotions', pl.promotions,
            'platform', json_build_object(
              'platform_id', plat.platform_id,
              'name', plat.name,
              'slug', plat.slug,
              'logo_url', plat.logo_url,
              'is_marketplace', plat.is_marketplace
            ),
            'priceHistory', COALESCE(ph_data.price_history, '[]'::json)
          ) ORDER BY pl.price ASC
        ) FILTER (WHERE pl.listing_id IS NOT NULL), '[]'::json) as listings
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_listings pl ON p.product_id = pl.product_id
      LEFT JOIN platforms plat ON pl.platform_id = plat.platform_id
      LEFT JOIN LATERAL (
        SELECT json_agg(
          json_build_object(
            'date', recorded_at::date,
            'price', price
          ) ORDER BY recorded_at
        ) as price_history
        FROM price_history
        WHERE listing_id = pl.listing_id
      ) ph_data ON TRUE
      WHERE p.product_id = $1
      GROUP BY p.product_id, p.brand_id, p.name, p.slug, p.image_url, p.description, p.specifications, p.created_at,
               b.brand_id, b.name, b.slug, b.logo_url, b.description
    `;
        const result = await database_1.default.query(query, [productId]);
        if (result.rows.length === 0) {
            res.status(404).json({ error: "Product not found" });
            return;
        }
        const row = result.rows[0];
        const listings = row.listings || [];
        const sellers = extractSellersFromListings(listings);
        const product = {
            product_id: row.product_id,
            brand_id: row.brand_id,
            name: row.name,
            slug: row.slug,
            image_url: row.image_url,
            description: row.description,
            specifications: row.specifications,
            created_at: row.created_at,
            brand: row.brand_id ? {
                brand_id: row.brand_id,
                name: row.brand_name,
                slug: row.brand_slug,
                logo_url: row.brand_logo_url,
                description: row.brand_description,
                created_at: row.created_at,
            } : undefined,
            listings: listings,
            sellers: sellers,
        };
        res.json(product);
    }
    catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});
// GET products by brand
router.get("/brand/:brandSlug", async (req, res) => {
    try {
        const { brandSlug } = req.params;
        const query = `
      SELECT 
        p.product_id,
        p.brand_id,
        p.name,
        p.slug,
        p.image_url,
        p.description,
        p.specifications,
        p.created_at,
        b.brand_id,
        b.name as brand_name,
        b.slug as brand_slug,
        b.logo_url as brand_logo_url,
        b.description as brand_description,
        json_agg(
          json_build_object(
            'listing_id', pl.listing_id,
            'product_id', pl.product_id,
            'platform_id', pl.platform_id,
            'listing_title', pl.listing_title,
            'price', pl.price,
            'original_price', pl.original_price,
            'url', pl.url,
            'image_url', pl.image_url,
            'detail_image_url', pl.detail_image_url,
            'first_seen', pl.first_seen,
            'last_updated', pl.last_updated
          ) ORDER BY pl.price ASC
        ) FILTER (WHERE pl.listing_id IS NOT NULL) as listings
      FROM products p
      JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_listings pl ON p.product_id = pl.product_id
      WHERE b.slug = $1
      GROUP BY p.product_id, p.brand_id, p.name, p.slug, p.image_url, p.description, p.specifications, p.created_at,
               b.brand_id, b.name, b.slug, b.logo_url, b.description
      ORDER BY p.created_at DESC
    `;
        const result = await database_1.default.query(query, [brandSlug]);
        const products = result.rows.map((row) => ({
            product_id: row.product_id,
            brand_id: row.brand_id,
            name: row.name,
            slug: row.slug,
            image_url: row.image_url,
            description: row.description,
            specifications: row.specifications,
            created_at: row.created_at,
            brand: {
                brand_id: row.brand_id,
                name: row.brand_name,
                slug: row.brand_slug,
                logo_url: row.brand_logo_url,
                description: row.brand_description,
                created_at: row.created_at,
            },
            listings: row.listings || [],
        }));
        res.json(products);
    }
    catch (error) {
        console.error("Error fetching products by brand:", error);
        res.status(500).json({ error: "Failed to fetch products by brand" });
    }
});
exports.default = router;
//# sourceMappingURL=products.js.map