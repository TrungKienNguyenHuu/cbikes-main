import {Bike, CategoryAll} from "../common/types";

interface BikeFromAPI {
  id: string;
  name: string;
  price: number | string;
  link: string;
  image_url: string;
  category?: string;
  review_text?: string | null;
}

/**
 * Interface for products from API (new schema)
 */
interface ProductFromAPI {
  product_id: string;
  name: string;
  slug: string;
  brand_id?: string;
  image_url?: string;
  description?: string;
  specifications?: Record<string, any>;
  created_at: string;
  brand?: BrandInfo;
  listings: ProductListing[];
}

interface BrandInfo {
  brand_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  created_at: string;
}

interface ProductListing {
  listing_id: string;
  product_id: string;
  platform_id: string;
  listing_title: string;
  price: number;
  original_price?: number;
  url: string;
  image_url?: string;
  detail_image_url?: string;
  first_seen: string;
  last_updated: string;
  platform?: PlatformInfo;
}

interface PlatformInfo {
  platform_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_marketplace: boolean;
}

/**
 * Parse price string to number
 * Handles Vietnamese format: "12.990.000 ₫" -> 12990000
 */
const parsePrice = (price: number | string): number => {
  if (typeof price === "number") {
    return price;
  }
  
  // Remove currency symbol and dots (Vietnamese thousand separator)
  const cleaned = String(price)
    .replace(/[₫\s]/g, "")  // Remove currency symbol and spaces
    .replace(/\./g, "");     // Remove dots (thousand separator)
  
  const parsed = parseInt(cleaned, 10);
  console.log(`💰 Parsed price: "${price}" -> ${parsed}`);
  
  return isNaN(parsed) ? 0 : parsed;
};

const normalizeCategory = (raw?: string | null): string => {
  if (!raw) return "all";
  return raw.trim().toLowerCase();
};

/**
 * Transform backend API response to frontend Bike format
 */
const transformBikeFromAPI = (apiBike: BikeFromAPI): Bike => {
  const category = normalizeCategory(apiBike.category);

  const parsedPrice = parsePrice(apiBike.price);

  const transformedBike: Bike = {
    id: apiBike.id,
    name: apiBike.name,
    price: parsedPrice,
    imgSrc: apiBike.image_url,
    category: category,
    link: apiBike.link,
    ...(apiBike.review_text != null && apiBike.review_text !== ""
      ? { reviewText: apiBike.review_text }
      : {}),
  };
  
  console.log(`📦 Transformed bike: ${apiBike.name}`, transformedBike);
  
  return transformedBike;
};

/**
 * Keep one bike per product name, using the minimum price row.
 * This handles duplicated product names scraped from multiple listings.
 */
const keepLowestPricePerName = (bikes: Bike[]): Bike[] => {
  const bikesByName = new Map<string, Bike>();

  bikes.forEach((bike) => {
    const key = bike.name.trim().toLowerCase();
    const existing = bikesByName.get(key);

    if (!existing || bike.price < existing.price) {
      bikesByName.set(key, bike);
    }
  });

  return Array.from(bikesByName.values());
};

/**
 * Transform product from API to Bike format
 * Takes the first (lowest price) listing from a product
 */
const transformProductToBike = (product: ProductFromAPI): Bike | null => {
  try {
    // Get the lowest priced listing for this product
    const lowestPriceListing = product.listings.reduce((lowest, current) => {
      return current.price < lowest.price ? current : lowest;
    });

    if (!lowestPriceListing) {
      console.warn(`⚠️ No listings found for product ${product.name}`);
      return null;
    }

    // Extract category from brand name if available
    const category = product.brand ? normalizeCategory(product.brand.slug) : CategoryAll;

    const bike: Bike = {
      id: product.product_id,
      name: product.name,
      price: lowestPriceListing.price,
      imgSrc: product.image_url || lowestPriceListing.image_url || "",
      category: category,
      link: lowestPriceListing.url,
      reviewText: `Available at ${lowestPriceListing.platform?.name || "Unknown Platform"}`,
    };

    console.log(`📦 Transformed product to bike: ${product.name}`, bike);
    return bike;
  } catch (error) {
    console.error(`❌ Error transforming product ${product.name}:`, error);
    return null;
  }
};

/**
 * Fetch all bikes from the API (port 5001)
 * ✅ Fetches from API with product listings using new schema
 */
export const fetchBikesFromAPI = async (): Promise<Bike[]> => {
  try {
    const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5001";
    console.log("📡 Fetching bikes from API:", `${apiURL}/api/products`);
    
    const response = await fetch(`${apiURL}/api/products`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products: ProductFromAPI[] = await response.json();
    console.log("📥 Raw API response:", products);
    
    // Transform products to bikes format
    const transformedBikes: Bike[] = products
      .map(transformProductToBike)
      .filter((bike): bike is Bike => bike !== null);
    
    const lowestPriceBikes = keepLowestPricePerName(transformedBikes);
    console.log("✅ Transformed products to bikes (lowest price per name):", lowestPriceBikes);

    return lowestPriceBikes;
  } catch (error) {
    console.error("❌ Error fetching bikes from API:", error);
    throw error;
  }
};

/**
 * Fetch a single bike by ID from the API (port 5001)
 * ✅ Fetches from API with product listings using new schema
 */
export const fetchBikeByIdFromAPI = async (id: string): Promise<Bike> => {
  try {
    const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5001";
    console.log("📡 Fetching bike by ID from API:", `${apiURL}/api/products/${id}`);
    
    const response = await fetch(`${apiURL}/api/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product: ProductFromAPI = await response.json();
    console.log("📥 Fetched product:", product);
    
    const bike = transformProductToBike(product);
    if (!bike) {
      throw new Error(`Failed to transform product ${id} to bike format`);
    }
    
    return bike;
  } catch (error) {
    console.error(`❌ Error fetching bike ${id} from API:`, error);
    throw error;
  }
};

/**
 * Fetch products by brand slug
 */
export const fetchProductsByBrand = async (brandSlug: string): Promise<Bike[]> => {
  try {
    const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5001";
    console.log("📡 Fetching products by brand:", `${apiURL}/api/products/brand/${brandSlug}`);
    
    const response = await fetch(`${apiURL}/api/products/brand/${brandSlug}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products by brand: ${response.statusText}`);
    }

    const products: ProductFromAPI[] = await response.json();
    console.log("📥 Products by brand:", products);
    
    const transformedBikes: Bike[] = products
      .map(transformProductToBike)
      .filter((bike): bike is Bike => bike !== null);
    
    return transformedBikes;
  } catch (error) {
    console.error(`❌ Error fetching products by brand ${brandSlug}:`, error);
    throw error;
  }
};

/**
 * Fetch listings for a specific product
 */
export const fetchProductListings = async (productId: string): Promise<ProductListing[]> => {
  try {
    const apiURL = process.env.REACT_APP_API_URL || "http://localhost:5001";
    console.log("📡 Fetching listings for product:", `${apiURL}/api/listings/product/${productId}`);
    
    const response = await fetch(`${apiURL}/api/listings/product/${productId}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch listings: ${response.statusText}`);
    }

    const listings: ProductListing[] = await response.json();
    console.log("📥 Fetched listings:", listings);
    
    return listings;
  } catch (error) {
    console.error(`❌ Error fetching listings for product ${productId}:`, error);
    throw error;
  }
};
