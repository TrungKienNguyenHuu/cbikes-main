import { Bike, Category } from "../common/types";

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
 * Interface for products from test backend
 */
interface ProductFromTestAPI {
  product_id: string;
  name: string;
  brand: string;
  created_at: string;
  listings: ProductListing[];
}

interface ProductListing {
  listing_id: string;
  product_id: string;
  source_name: string;
  listing_title: string;
  price: number;
  currency: string;
  last_updated: string;
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

const normalizeCategory = (raw?: string | null): keyof typeof Category => {
  if (!raw) return Category.all;

  const normalized = raw.trim().toLowerCase();
  const categoryIds: Array<keyof typeof Category> = ["vinfast", "yaeda", "kazuki"];

  if (categoryIds.includes(normalized as keyof typeof Category)) {
    return normalized as keyof typeof Category;
  }

  console.warn(
    `⚠️ Category "${raw}" not recognized for filtering, using "all"`
  );
  return Category.all;
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
 * Fetch all bikes from the backend API
 * ❌ DEPRECATED: This function fetches from port 5000 (main backend)
 * Use fetchBikesFromTestBackend() instead for port 5001 (test backend)
 */
// export const fetchBikesFromAPI = async (): Promise<Bike[]> => {
//   try {
//     const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
//     console.log("📡 Fetching bikes from:", `${backendURL}/api/bikes`);
//     const response = await fetch(`${backendURL}/api/bikes`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch bikes: ${response.statusText}`);
//     }

//     const bikes: BikeFromAPI[] = await response.json();
//     console.log("📥 Raw API response:", bikes);
//     
//     // Transform API response to frontend format
//     const transformedBikes: Bike[] = bikes.map(transformBikeFromAPI);
//     const lowestPriceBikes = keepLowestPricePerName(transformedBikes);
//     console.log("✅ Transformed bikes (lowest price per name):", lowestPriceBikes);

//     return lowestPriceBikes;
//   } catch (error) {
//     console.error("❌ Error fetching bikes from API:", error);
//     throw error;
//   }
// };

/**
 * Fetch a single bike by ID
 * ❌ DEPRECATED: This function fetches from port 5000 (main backend)
 * Use fetchBikeByIdFromTestBackend() instead for port 5001 (test backend)
 */
// export const fetchBikeByIdFromAPI = async (id: string): Promise<Bike> => {
//   try {
//     const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
//     const response = await fetch(`${backendURL}/api/bikes/${id}`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch bike: ${response.statusText}`);
//     }

//     const bike: BikeFromAPI = await response.json();
//     
//     return transformBikeFromAPI(bike);
//   } catch (error) {
//     console.error(`Error fetching bike ${id} from API:`, error);
//     throw error;
//   }
// };

/**
 * Transform product from test backend to Bike format
 * Takes the first (lowest price) listing from a product
 */
const transformProductToBike = (product: ProductFromTestAPI): Bike | null => {
  try {
    // Get the lowest priced listing for this product
    const lowestPriceListing = product.listings.reduce((lowest, current) => {
      return current.price < lowest.price ? current : lowest;
    });

    if (!lowestPriceListing) {
      console.warn(`⚠️ No listings found for product ${product.name}`);
      return null;
    }

    const bike: Bike = {
      id: product.product_id,
      name: product.name,
      price: lowestPriceListing.price,
      imgSrc: "", // Test backend doesn't provide image URLs
      category: Category.all,
      link: "",
      reviewText: `Available at ${lowestPriceListing.source_name}`,
    };

    console.log(`📦 Transformed product to bike: ${product.name}`, bike);
    return bike;
  } catch (error) {
    console.error(`❌ Error transforming product ${product.name}:`, error);
    return null;
  }
};

/**
 * Fetch all bikes from the test backend (port 5001)
 * ✅ NEW: Fetches from test backend with product listings
 */
export const fetchBikesFromAPI = async (): Promise<Bike[]> => {
  try {
    const testBackendURL = process.env.REACT_APP_TEST_BACKEND_URL || "http://localhost:5001";
    console.log("📡 Fetching bikes from test backend:", `${testBackendURL}/api/products`);
    
    const response = await fetch(`${testBackendURL}/api/products`);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const products: ProductFromTestAPI[] = await response.json();
    console.log("📥 Raw test backend response:", products);
    
    // Transform products to bikes format
    const transformedBikes: Bike[] = products
      .map(transformProductToBike)
      .filter((bike): bike is Bike => bike !== null);
    
    const lowestPriceBikes = keepLowestPricePerName(transformedBikes);
    console.log("✅ Transformed products to bikes (lowest price per name):", lowestPriceBikes);

    return lowestPriceBikes;
  } catch (error) {
    console.error("❌ Error fetching bikes from test backend:", error);
    throw error;
  }
};

/**
 * Fetch a single bike by ID from the test backend (port 5001)
 * ✅ NEW: Fetches from test backend with product listings
 */
export const fetchBikeByIdFromAPI = async (id: string): Promise<Bike> => {
  try {
    const testBackendURL = process.env.REACT_APP_TEST_BACKEND_URL || "http://localhost:5001";
    console.log("📡 Fetching bike by ID from test backend:", `${testBackendURL}/api/products/${id}`);
    
    const response = await fetch(`${testBackendURL}/api/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product: ${response.statusText}`);
    }

    const product: ProductFromTestAPI = await response.json();
    console.log("📥 Fetched product:", product);
    
    const bike = transformProductToBike(product);
    if (!bike) {
      throw new Error(`Failed to transform product ${id} to bike format`);
    }
    
    return bike;
  } catch (error) {
    console.error(`❌ Error fetching bike ${id} from test backend:`, error);
    throw error;
  }
};
