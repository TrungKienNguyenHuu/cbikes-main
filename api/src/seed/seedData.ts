import pool from "../config/database";
import { initializeDatabase } from "../config/initDB";
import { v4 as uuidv4 } from "uuid";

const seedData = async () => {
  try {
    console.log("🌱 Starting database seed...");

    // Initialize database
    await initializeDatabase();

    // Clear existing data
    await pool.query("DELETE FROM product_listings");
    await pool.query("DELETE FROM products");
    console.log("✓ Cleared existing data");

    // Image URL mapping (using local bike images)
    const imageUrls = [
      "im1-min.png",
      "im2-min.png",
      "im3-min.png",
      "im4-min.png",
      "im5-min.png",
      "im6-min.png",
      "im7-min.png",
      "im8-min.png",
      "im9-min.png",
      "im10-min.png",
      "im11-min.png",
      "im12-min.png",
    ];

    // Sample products data
    const productsData = [
      {
        name: "VinFast Klara S",
        url: "https://vinfast.com/klara-s",
        imageUrl: imageUrls[0],
      },
      {
        name: "Yaeda E-Bike Pro",
        url: "https://yaeda.com/ebike-pro",
        imageUrl: imageUrls[1],
      },
      {
        name: "Kazuki Electric Cruiser",
        url: "https://kazuki.com/e-cruiser",
        imageUrl: imageUrls[2],
      },
      {
        name: "VinFast Theon",
        url: "https://vinfast.com/theon",
        imageUrl: imageUrls[3],
      },
      {
        name: "Yaeda City Commuter",
        url: "https://yaeda.com/city-commuter",
        imageUrl: imageUrls[4],
      },
    ];

    // Insert products
    const productIds: string[] = [];
    for (const product of productsData) {
      const productId = uuidv4();
      productIds.push(productId);
      
      await pool.query(
        `INSERT INTO products (product_id, name, url, image_url, created_at)
         VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
        [productId, product.name, product.url, product.imageUrl]
      );
    }
    console.log(`✓ Inserted ${productIds.length} products`);

    // Sample listings data (multiple sources per product)
    const sources = [
      { name: "Amazon", baseUrl: "https://amazon.com/s?k=" },
      { name: "Phoxedien", baseUrl: "https://phoxedien.com/product/" },
      { name: "WheelHub", baseUrl: "https://wheelhub.com/bikes/" },
      { name: "RideZone", baseUrl: "https://ridezone.com/bikes/" },
      { name: "BikeHub", baseUrl: "https://bikehub.com/products/" },
    ];
    let listingCount = 0;

    for (let i = 0; i < productIds.length; i++) {
      const productId = productIds[i];
      const basePrice = 15000000 + Math.random() * 20000000; // VND pricing
      
      // Create 3-5 listings per product from different sources
      const listingsPerProduct = 3 + Math.floor(Math.random() * 3);
      
      for (let j = 0; j < listingsPerProduct; j++) {
        const listingId = uuidv4();
        const source = sources[Math.floor(Math.random() * sources.length)];
        const priceVariation = basePrice + (Math.random() - 0.5) * 2000000; // Add ±1M VND variation
        const price = Math.round(priceVariation);
        const productName = productsData[i].name;
        const listingUrl = `${source.baseUrl}${encodeURIComponent(productName)}`;
        
        await pool.query(
          `INSERT INTO product_listings 
           (listing_id, product_id, source_name, listing_title, price, url, image_url, last_updated)
           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)`,
          [
            listingId,
            productId,
            source.name,
            `${productName} - ${source.name}`,
            price,
            listingUrl,
            productsData[i].imageUrl,
          ]
        );
        listingCount++;
      }
    }
    console.log(`✓ Inserted ${listingCount} product listings`);

    console.log("✅ Database seed completed successfully!");
    console.log(`📊 Summary: ${productIds.length} products, ${listingCount} listings`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
};

seedData();
