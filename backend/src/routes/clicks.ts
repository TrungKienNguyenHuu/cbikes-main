import { Router, Request, Response } from "express";
import pool from "../config/database";

const router = Router();

// POST: Record a click on a product
router.post("/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const userSessionId = req.body.userSessionId || req.headers["x-session-id"] || "anonymous";
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const userAgent = req.headers["user-agent"] || "unknown";

    // 1. Validate product exists
    const productCheck = await pool.query(
        "SELECT product_id FROM products WHERE product_id = $1",
        [productId]
    );

    if (productCheck.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // 2. NEW: Check if this user already clicked this product in the last 24 hours
    // (We skip this check if the ID is somehow still "anonymous" to prevent blocking everyone)
    if (userSessionId !== "anonymous") {
      const duplicateCheck = await pool.query(
          `SELECT click_id FROM product_clicks 
         WHERE product_id = $1 
         AND user_session_id = $2 
         AND clicked_at >= NOW() - INTERVAL '24 hours'`,
          [productId, userSessionId]
      );

      // If they already clicked it, return success but don't save to database
      if (duplicateCheck.rows.length > 0) {
        console.log(`⏳ Ignored duplicate click from ${userSessionId} for product ${productId}`);
        res.json({ success: true, message: "Click already recorded recently" });
        return;
      }
    }

    // 3. Record the click
    const query = `
      INSERT INTO product_clicks (product_id, user_session_id, ip_address, user_agent)
      VALUES ($1, $2, $3, $4)
      RETURNING click_id, product_id, clicked_at
    `;

    const result = await pool.query(query, [
      productId,
      userSessionId,
      ipAddress, // You can remove this if you decided you don't want IP tracking!
      userAgent,
    ]);

    res.json({
      success: true,
      click_id: result.rows[0].click_id,
      product_id: result.rows[0].product_id,
      clicked_at: result.rows[0].clicked_at,
    });
  } catch (error) {
    console.error("Error recording click:", error);
    res.status(500).json({ error: "Failed to record click" });
  }
});

// GET: Get hot products (most clicked in the last X days)
router.get("/", async (req: Request, res: Response) => {
  try {
    const { days = 7, limit = 10 } = req.query;
    const daysNum = parseInt(days as string, 10) || 7;
    const limitNum = parseInt(limit as string, 10) || 10;

    const query = `
      SELECT 
        p.product_id,
        p.name,
        p.slug,
        p.image_url,
        p.description,
        p.specifications,
        COUNT(DISTINCT pc.click_id) as click_count, -- FIXED LINE
        MAX(pc.clicked_at) as last_clicked_at,
        b.name as brand_name,
        COALESCE(json_agg(
          json_build_object(
            'listing_id', pl.listing_id,
            'price', pl.price,
            'original_price', pl.original_price,
            'discount_rate', pl.discount_rate,
            'url', pl.url,
            'platform_name', plat.name
          ) ORDER BY pl.price ASC
        ) FILTER (WHERE pl.listing_id IS NOT NULL), '[]'::json) as listings
      FROM product_clicks pc
      JOIN products p ON pc.product_id = p.product_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_listings pl ON p.product_id = pl.product_id
      LEFT JOIN platforms plat ON pl.platform_id = plat.platform_id
      WHERE pc.clicked_at >= NOW() - INTERVAL '${daysNum} days'
      GROUP BY p.product_id, p.name, p.slug, p.image_url, p.description, p.specifications, b.name
      ORDER BY click_count DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limitNum]);
    const hotProducts = result.rows.map((row) => ({
      product_id: row.product_id,
      name: row.name,
      slug: row.slug,
      image_url: row.image_url,
      description: row.description,
      specifications: row.specifications,
      brand_name: row.brand_name,
      click_count: parseInt(row.click_count, 10),
      last_clicked_at: row.last_clicked_at,
      listings: row.listings,
    }));

    res.json(hotProducts);
  } catch (error) {
    console.error("Error fetching hot products:", error);
    res.status(500).json({ error: "Failed to fetch hot products" });
  }
});

// GET: Get hot products by ID (alternative endpoint without /hot prefix)
router.get("/trending", async (req: Request, res: Response) => {
  // ... (Keep this identical to your original code, it was perfectly fine)
  try {
    const { days = 7, limit = 10 } = req.query;
    const daysNum = parseInt(days as string, 10) || 7;
    const limitNum = parseInt(limit as string, 10) || 10;

    const query = `
      SELECT 
        p.product_id,
        p.name,
        p.slug,
        p.image_url,
        p.description,
        p.specifications,
        COUNT(DISTINCT pc.click_id) as click_count, -- FIXED LINE
        MAX(pc.clicked_at) as last_clicked_at,
        b.name as brand_name,
        COALESCE(json_agg(
          json_build_object(
            'listing_id', pl.listing_id,
            'price', pl.price,
            'original_price', pl.original_price,
            'discount_rate', pl.discount_rate,
            'url', pl.url,
            'platform_name', plat.name
          ) ORDER BY pl.price ASC
        ) FILTER (WHERE pl.listing_id IS NOT NULL), '[]'::json) as listings
      FROM product_clicks pc
      JOIN products p ON pc.product_id = p.product_id
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      LEFT JOIN product_listings pl ON p.product_id = pl.product_id
      LEFT JOIN platforms plat ON pl.platform_id = plat.platform_id
      WHERE pc.clicked_at >= NOW() - INTERVAL '${daysNum} days'
      GROUP BY p.product_id, p.name, p.slug, p.image_url, p.description, p.specifications, b.name
      ORDER BY click_count DESC
      LIMIT $1
    `;

    const result = await pool.query(query, [limitNum]);
    const hotProducts = result.rows.map((row) => ({
      product_id: row.product_id,
      name: row.name,
      slug: row.slug,
      image_url: row.image_url,
      description: row.description,
      specifications: row.specifications,
      brand_name: row.brand_name,
      click_count: parseInt(row.click_count, 10),
      last_clicked_at: row.last_clicked_at,
      listings: row.listings,
    }));

    res.json(hotProducts);
  } catch (error) {
    console.error("Error fetching trending products:", error);
    res.status(500).json({ error: "Failed to fetch trending products" });
  }
});

export default router;