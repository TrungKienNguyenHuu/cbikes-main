import { Router, Request, Response } from "express";
import pool from "../config/database";
import { ProductWithListings } from "../types";

const router = Router();

// Helper function to extract unique sellers from listings
const extractSellersFromListings = (listings: any[]) => {
  const sellerMap = new Map<string, { name: string; price: number; original_price?: number; url: string; discount_rate?: number; promotions?: any[] }>();

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
      } else {
        // Keep the minimum price for this seller
        const existing = sellerMap.get(platformId)!;
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

const classifyTier = (price: number): string => {
  if (price < 20000000) return "basic";
  if (price < 40000000) return "mid";
  return "premium";
};

const classifyNeed = (specs: Record<string, any> = {}, name: string = ""): string => {
  const motorPower = parseInt(specs.motorPower?.toString().replace(/\D/g, "") || "0");
  const maxSpeed = parseInt(specs.maxSpeed?.toString().replace(/\D/g, "") || "0");
  const batteryCapacity = specs.batteryCapacity?.toString().toLowerCase() || "";
  const range = parseInt(specs.range?.toString().replace(/\D/g, "") || "0");
  const weight = parseInt(specs.weight?.toString().replace(/\D/g, "") || "0");
  const productName = name.toLowerCase();

  if (
    weight > 40 ||
    motorPower > 3000 ||
    maxSpeed > 60 ||
    productName.includes("cargo") ||
    productName.includes("delivery") ||
    productName.includes("truck")
  ) {
    return "delivery";
  }



  if (range >= 100 && maxSpeed <= 40 && motorPower <= 2000) {
    return "office";
  }

  return "students";
};

const aggregatePriceHistory = (listings: any[]): any[] => {
  const priceHistoryMap = new Map<string, number>();
  listings.forEach((listing) => {
    if (listing.priceHistory && Array.isArray(listing.priceHistory)) {
      listing.priceHistory.forEach((entry: any) => {
        const existing = priceHistoryMap.get(entry.date);
        if (!existing || entry.price < existing) {
          priceHistoryMap.set(entry.date, entry.price);
        }
      });
    }
  });
  return Array.from(priceHistoryMap.entries())
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

// GET metadata for filters (categories and sellers)
router.get("/metadata", async (req: Request, res: Response) => {
  try {
    const catQuery = `
      SELECT b.slug as id, b.name
      FROM brands b
      JOIN products p ON b.brand_id = p.brand_id
      GROUP BY b.brand_id, b.slug, b.name
      ORDER BY b.name
    `;
    const catResult = await pool.query(catQuery);
    const dynamicCategories = catResult.rows.map(row => ({
      id: row.id || row.name,
      name: row.name
    }));

    const sellQuery = `
      SELECT plat.name as id, plat.name
      FROM platforms plat
      JOIN product_listings pl ON plat.platform_id = pl.platform_id
      GROUP BY plat.platform_id, plat.name
      ORDER BY plat.name
    `;
    const sellResult = await pool.query(sellQuery);
    const dynamicSellers = sellResult.rows.map(row => ({
      id: row.id,
      name: row.name
    }));

    res.json({ dynamicCategories, dynamicSellers });
  } catch (error) {
    console.error("Error fetching metadata:", error);
    res.status(500).json({ error: "Failed to fetch metadata" });
  }
});

// GET all products with their listings and brand info, including price history
// Supports pagination, filtering, and sorting
router.get("/", async (req: Request, res: Response) => {
  try {
    const { 
      page = "1", limit = "12", search = "", 
      category = "all", seller = "all", 
      minPrice, maxPrice, need = "all", tier = "all", sort = "updated-asc" 
    } = req.query;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 12;
    const offset = (pageNum - 1) * limitNum;

    const minPriceVal = minPrice ? parseFloat(minPrice as string) : null;
    const maxPriceVal = maxPrice ? parseFloat(maxPrice as string) : null;

    const query = `
      WITH base_filtered AS (
        SELECT 
          p.product_id,
          p.brand_id,
          p.name,
          p.slug,
          p.image_url,
          p.specifications,
          p.created_at,
          b.name as brand_name,
          b.slug as brand_slug,
          b.logo_url as brand_logo_url,
          b.description as brand_description
        FROM products p
        LEFT JOIN brands b ON p.brand_id = b.brand_id
        WHERE 1=1
          AND ($1::text = '' OR p.name ILIKE '%' || $1 || '%' OR p.slug ILIKE '%' || $1 || '%')
          AND ($2::text = 'all' OR b.slug ILIKE $2 OR b.name ILIKE $2)
          AND ($6::text = 'all' OR 
            CASE
              WHEN (NULLIF(regexp_replace(p.specifications->>'weight', '\\D', '', 'g'), '')::numeric > 40)
                OR (NULLIF(regexp_replace(p.specifications->>'motorPower', '\\D', '', 'g'), '')::numeric > 3000)
                OR (NULLIF(regexp_replace(p.specifications->>'maxSpeed', '\\D', '', 'g'), '')::numeric > 60)
                OR (p.name ILIKE '%cargo%') OR (p.name ILIKE '%delivery%') OR (p.name ILIKE '%truck%')
              THEN 'delivery'

              WHEN (COALESCE(NULLIF(regexp_replace(p.specifications->>'range', '\\D', '', 'g'), ''), '0')::numeric >= 100)
                AND (COALESCE(NULLIF(regexp_replace(p.specifications->>'maxSpeed', '\\D', '', 'g'), ''), '0')::numeric <= 40)
                AND (COALESCE(NULLIF(regexp_replace(p.specifications->>'motorPower', '\\D', '', 'g'), ''), '0')::numeric <= 2000)
              THEN 'office'
              ELSE 'students'
            END = $6
          )
      ),
      aggregated_filtered AS (
        SELECT 
          bf.product_id,
          bf.brand_id,
          bf.name,
          bf.slug,
          bf.image_url,
          bf.specifications,
          bf.created_at,
          bf.brand_name,
          bf.brand_slug,
          bf.brand_logo_url,
          bf.brand_description,
          MIN(pl.price) as min_price,
          MAX(pl.last_updated) as last_updated
        FROM base_filtered bf
        LEFT JOIN product_listings pl ON bf.product_id = pl.product_id
        WHERE 1=1
          AND ($3::text = 'all' OR EXISTS (
            SELECT 1 FROM product_listings pl2 
            JOIN platforms plat ON pl2.platform_id = plat.platform_id
            WHERE pl2.product_id = bf.product_id AND plat.name ILIKE $3
          ))
        GROUP BY 
          bf.product_id, bf.brand_id, bf.name, bf.slug, bf.image_url, 
          bf.specifications, bf.created_at, bf.brand_name, bf.brand_slug, 
          bf.brand_logo_url, bf.brand_description
        HAVING 1=1
          AND ($4::numeric IS NULL OR MIN(pl.price) >= $4)
          AND ($5::numeric IS NULL OR MIN(pl.price) <= $5)
          AND ($7::text = 'all' OR 
            CASE 
              WHEN MIN(pl.price) < 20000000 THEN 'basic'
              WHEN MIN(pl.price) < 40000000 THEN 'mid'
              ELSE 'premium'
            END = $7
          )
      ),
      paginated AS (
        SELECT *
        FROM aggregated_filtered
        ORDER BY 
          CASE WHEN $8 = 'price-asc' THEN min_price END ASC NULLS LAST,
          CASE WHEN $8 = 'price-desc' THEN min_price END DESC NULLS LAST,
          CASE WHEN $8 = 'name-asc' THEN name END ASC,
          CASE WHEN $8 = 'name-desc' THEN name END DESC,
          CASE WHEN $8 = 'updated-asc' THEN last_updated END ASC NULLS LAST,
          CASE WHEN $8 = 'updated-desc' THEN last_updated END DESC NULLS LAST,
          created_at DESC
        LIMIT $9 OFFSET $10
      )
      SELECT 
        paginated.*,
        (SELECT count(*) FROM aggregated_filtered) as total_count,
        COALESCE((
          SELECT json_agg(
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
              'priceHistory', COALESCE((
                SELECT json_agg(
                  json_build_object('date', ph.recorded_at::date, 'price', ph.price) ORDER BY ph.recorded_at
                )
                FROM price_history ph
                WHERE ph.listing_id = pl.listing_id
              ), '[]'::json)
            ) ORDER BY pl.price ASC
          )
          FROM product_listings pl
          LEFT JOIN platforms plat ON pl.platform_id = plat.platform_id
          WHERE pl.product_id = paginated.product_id
        ), '[]'::json) as listings
      FROM paginated
    `;

    const queryParams = [
      search, category, seller, minPriceVal, maxPriceVal, need, tier, sort, limitNum, offset
    ];

    const result = await pool.query(query, queryParams);
    
    let totalCount = 0;
    const products: any[] = result.rows.map((row) => {
      totalCount = parseInt(row.total_count, 10);
      const listings = row.listings || [];
      const sellers = extractSellersFromListings(listings);
      
      let lowestPrice = 0;
      if (listings.length > 0) {
        lowestPrice = listings.reduce((lowest: any, current: any) => current.price < lowest.price ? current : lowest).price;
      }

      const specs = row.specifications || {};
      specs.tier = classifyTier(lowestPrice);
      specs.need = classifyNeed(specs, row.name);
      
      const priceHistory = aggregatePriceHistory(listings);

      return {
        product_id: row.product_id,
        brand_id: row.brand_id,
        name: row.name,
        slug: row.slug,
        image_url: row.image_url,
        description: row.description,
        specifications: specs,
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
        lowest_price: lowestPrice,
        price_history: priceHistory
      };
    });

    res.json({ 
      products, 
      totalCount, 
      totalPages: Math.ceil(totalCount / limitNum) 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET product by ID with listings and brand info, including price history
router.get("/:productId", async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const query = `
      WITH product_listings_subset AS (
        SELECT 
          pl.listing_id, pl.product_id, pl.platform_id, pl.listing_title, pl.price, pl.original_price, 
          pl.url, pl.image_url, pl.detail_image_url, pl.first_seen, pl.last_updated, pl.discount_rate, pl.promotions,
          plat.platform_id as plat_id, plat.name as plat_name, plat.slug as plat_slug, plat.logo_url as plat_logo_url, plat.is_marketplace
        FROM product_listings pl
        LEFT JOIN platforms plat ON pl.platform_id = plat.platform_id
        WHERE pl.product_id = $1
      ),
      aggregated_history AS (
        SELECT 
          ph.listing_id,
          json_agg(
            json_build_object('date', ph.recorded_at::date, 'price', ph.price) ORDER BY ph.recorded_at
          ) as history
        FROM price_history ph
        JOIN product_listings_subset pls ON ph.listing_id = pls.listing_id
        GROUP BY ph.listing_id
      )
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
        COALESCE((
          SELECT json_agg(
            json_build_object(
              'listing_id', pls.listing_id,
              'product_id', pls.product_id,
              'platform_id', pls.platform_id,
              'listing_title', pls.listing_title,
              'price', pls.price,
              'original_price', pls.original_price,
              'url', pls.url,
              'image_url', pls.image_url,
              'detail_image_url', pls.detail_image_url,
              'first_seen', pls.first_seen,
              'last_updated', pls.last_updated,
              'discount_rate', pls.discount_rate,
              'promotions', pls.promotions,
              'platform', json_build_object(
                'platform_id', pls.plat_id,
                'name', pls.plat_name,
                'slug', pls.plat_slug,
                'logo_url', pls.plat_logo_url,
                'is_marketplace', pls.is_marketplace
              ),
              'priceHistory', COALESCE(ah.history, '[]'::json)
            ) ORDER BY pls.price ASC
          )
          FROM product_listings_subset pls
          LEFT JOIN aggregated_history ah ON pls.listing_id = ah.listing_id
        ), '[]'::json) as listings
      FROM products p
      LEFT JOIN brands b ON p.brand_id = b.brand_id
      WHERE p.product_id = $1
    `;
    const result = await pool.query(query, [productId]);

    if (result.rows.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const row = result.rows[0];
    const listings = row.listings || [];
    const sellers = extractSellersFromListings(listings);

    let lowestPrice = 0;
    if (listings.length > 0) {
      lowestPrice = listings.reduce((lowest: any, current: any) => current.price < lowest.price ? current : lowest).price;
    }

    const specs = row.specifications || {};
    specs.tier = classifyTier(lowestPrice);
    specs.need = classifyNeed(specs, row.name);

    const priceHistory = aggregatePriceHistory(listings);

    const product: any = {
      product_id: row.product_id,
      brand_id: row.brand_id,
      name: row.name,
      slug: row.slug,
      image_url: row.image_url,
      description: row.description,
      specifications: specs,
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
      lowest_price: lowestPrice,
      price_history: priceHistory
    };
    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// GET products by brand
router.get("/brand/:brandSlug", async (req: Request, res: Response) => {
  try {
    const { brandSlug } = req.params;
    const query = `
      SELECT 
        p.product_id,
        p.brand_id,
        p.name,
        p.slug,
        p.image_url,
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
      GROUP BY p.product_id, p.brand_id, p.name, p.slug, p.image_url, p.specifications, p.created_at,
               b.brand_id, b.name, b.slug, b.logo_url, b.description
      ORDER BY p.created_at DESC
    `;
    const result = await pool.query(query, [brandSlug]);
    const products: ProductWithListings[] = result.rows.map((row) => ({
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
  } catch (error) {
    console.error("Error fetching products by brand:", error);
    res.status(500).json({ error: "Failed to fetch products by brand" });
  }
});

export default router;
