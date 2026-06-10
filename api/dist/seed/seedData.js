"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const initDB_1 = require("../config/initDB");
const uuid_1 = require("uuid");
const seedData = async () => {
    try {
        console.log("🌱 Starting database seed with new schema...");
        // Initialize database
        await (0, initDB_1.initializeDatabase)();
        // Clear existing data (in correct order due to foreign keys)
        await database_1.default.query("DELETE FROM price_history");
        await database_1.default.query("DELETE FROM product_listings");
        await database_1.default.query("DELETE FROM products");
        await database_1.default.query("DELETE FROM platforms");
        await database_1.default.query("DELETE FROM brands");
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
        // Insert brands
        const brands = [
            { name: "VinFast", slug: "vinfast", description: "Vietnamese electric bike brand" },
            { name: "Yaeda", slug: "yaeda", description: "Premium electric bikes" },
            { name: "Kazuki", slug: "kazuki", description: "Japanese-inspired electric cycles" },
        ];
        const brandIdMap = {};
        for (const brand of brands) {
            const result = await database_1.default.query(`INSERT INTO brands (name, slug, description, created_at)
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         RETURNING brand_id`, [brand.name, brand.slug, brand.description]);
            brandIdMap[brand.slug] = result.rows[0].brand_id;
        }
        console.log(`✓ Inserted ${brands.length} brands`);
        // Insert platforms
        const platforms = [
            { name: "Amazon", slug: "amazon", isMarketplace: true },
            { name: "Phoxedien", slug: "phoxedien", isMarketplace: true },
            { name: "WheelHub", slug: "wheelhub", isMarketplace: true },
            { name: "RideZone", slug: "ridezone", isMarketplace: true },
            { name: "BikeHub", slug: "bikehub", isMarketplace: true },
        ];
        const platformIdMap = {};
        for (const platform of platforms) {
            const result = await database_1.default.query(`INSERT INTO platforms (name, slug, is_marketplace)
         VALUES ($1, $2, $3)
         RETURNING platform_id`, [platform.name, platform.slug, platform.isMarketplace]);
            platformIdMap[platform.slug] = result.rows[0].platform_id;
        }
        console.log(`✓ Inserted ${platforms.length} platforms`);
        // Sample products data
        const productsData = [
            { name: "Klara S", brandSlug: "vinfast", imageUrl: imageUrls[0] },
            { name: "E-Bike Pro", brandSlug: "yaeda", imageUrl: imageUrls[1] },
            { name: "Electric Cruiser", brandSlug: "kazuki", imageUrl: imageUrls[2] },
            { name: "Theon", brandSlug: "vinfast", imageUrl: imageUrls[3] },
            { name: "City Commuter", brandSlug: "yaeda", imageUrl: imageUrls[4] },
            { name: "Urban Express", brandSlug: "kazuki", imageUrl: imageUrls[5] },
            { name: "VinFast Evo", brandSlug: "vinfast", imageUrl: imageUrls[6] },
            { name: "Yaeda Max", brandSlug: "yaeda", imageUrl: imageUrls[7] },
        ];
        const productIds = [];
        for (const product of productsData) {
            const productId = (0, uuid_1.v4)();
            const slug = `${product.brandSlug}-${product.name.toLowerCase().replace(/\s+/g, "-")}`;
            const brandId = brandIdMap[product.brandSlug];
            productIds.push(productId);
            await database_1.default.query(`INSERT INTO products (product_id, brand_id, name, slug, image_url, created_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)`, [productId, brandId, `${product.brandSlug} ${product.name}`, slug, product.imageUrl]);
        }
        console.log(`✓ Inserted ${productIds.length} products`);
        // Create listings for each product
        let listingCount = 0;
        const platformSlugs = Object.keys(platformIdMap);
        for (let i = 0; i < productIds.length; i++) {
            const productId = productIds[i];
            const product = productsData[i];
            const basePrice = 15000000 + Math.random() * 20000000; // VND pricing
            // Create 3-4 listings per product from different platforms
            const listingsPerProduct = 3 + Math.floor(Math.random() * 2);
            const selectedPlatforms = platformSlugs
                .sort(() => Math.random() - 0.5)
                .slice(0, listingsPerProduct);
            for (const platformSlug of selectedPlatforms) {
                const listingId = (0, uuid_1.v4)();
                const platformId = platformIdMap[platformSlug];
                const priceVariation = basePrice + (Math.random() - 0.5) * 2000000; // ±1M VND
                const price = Math.round(priceVariation);
                const productFullName = `${product.brandSlug} ${product.name}`;
                const platformName = platforms.find((p) => p.slug === platformSlug)?.name || platformSlug;
                await database_1.default.query(`INSERT INTO product_listings 
           (listing_id, product_id, platform_id, listing_title, price, url, image_url, first_seen, last_updated)
           VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`, [
                    listingId,
                    productId,
                    platformId,
                    `${productFullName} - ${platformName}`,
                    price,
                    `https://${platformSlug}.example.com/product/${encodeURIComponent(productFullName)}`,
                    product.imageUrl,
                ]);
                // Add initial price history entry
                await database_1.default.query(`INSERT INTO price_history (listing_id, price, recorded_at)
           VALUES ($1, $2, CURRENT_TIMESTAMP)`, [listingId, price]);
                listingCount++;
            }
        }
        console.log(`✓ Inserted ${listingCount} product listings`);
        console.log("✅ Database seed completed successfully!");
        console.log(`📊 Summary: ${brands.length} brands, ${platforms.length} platforms, ${productIds.length} products, ${listingCount} listings`);
    }
    catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    }
    finally {
        await database_1.default.end();
    }
};
seedData();
//# sourceMappingURL=seedData.js.map