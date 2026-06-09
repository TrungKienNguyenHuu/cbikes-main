import { Router, Request, Response } from "express";
import pool from "../config/database";
import { BikeFromDatabase } from "../types/index";

const router = Router();

// GET all bikes
router.get("/", async (req: Request, res: Response) => {
  try {
    const query = "SELECT id, name, price, link, image_url, category FROM products ORDER BY id";
    const result = await pool.query(query);
    const bikes: BikeFromDatabase[] = result.rows;
    res.json(bikes);
  } catch (error) {
    console.error("Error fetching bikes:", error);
    res.status(500).json({ error: "Failed to fetch bikes" });
  }
});

// GET bike by ID (includes latest review as product description)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT
        p.id,
        p.name,
        p.price,
        p.link,
        p.image_url,
        p.category,
        (
          SELECT r.review_text
          FROM reviews r
          WHERE r.listing_id = p.id
          ORDER BY r.scraped_at DESC
          LIMIT 1
        ) AS review_text
      FROM products p
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Bike not found" });
      return;
    }

    const bike: BikeFromDatabase = result.rows[0];
    res.json(bike);
  } catch (error) {
    console.error("Error fetching bike:", error);
    res.status(500).json({ error: "Failed to fetch bike" });
  }
});

// GET bikes by category (if you have category column)
router.get("/category/:category", async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const query =
      "SELECT id, name, price, link, image_url, category FROM products WHERE category = category ORDER BY id";
    const result = await pool.query(query, [category]);
    const bikes: BikeFromDatabase[] = result.rows;
    res.json(bikes);
  } catch (error) {
    console.error("Error fetching bikes by category:", error);
    res.status(500).json({ error: "Failed to fetch bikes by category" });
  }
});

export default router;
