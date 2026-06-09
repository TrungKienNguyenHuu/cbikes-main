import { Router, Request, Response } from "express";
import pool from "../config/database";
import { ProductListing } from "../types";

const router = Router();

// GET all listings
router.get("/", async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT listing_id, product_id, source_name, listing_title, price, url, image_url, last_updated 
      FROM product_listings
      ORDER BY price ASC, last_updated DESC
    `;
    const result = await pool.query(query);
    const listings: ProductListing[] = result.rows;
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

// GET listings by product ID
router.get("/product/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const query = `
      SELECT listing_id, product_id, source_name, listing_title, price, url, image_url, last_updated
      FROM product_listings
      WHERE product_id = $1
      ORDER BY price ASC
    `;
    const result = await pool.query(query, [productId]);
    const listings: ProductListing[] = result.rows;
    res.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

export default router;
