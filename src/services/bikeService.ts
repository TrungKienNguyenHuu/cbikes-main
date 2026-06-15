import { Bike, CategoryAll, PriceHistoryPoint, Seller } from "../common/types";

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
  sellers?: Seller[];
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
  url: string;
  image_url?: string;
  first_seen: string;
  last_updated: string;
  platform?: PlatformInfo;
  priceHistory?: Array<{ date: string; price: number }>;
}

interface PlatformInfo {
  platform_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_marketplace: boolean;
}

const mergeSellers = (
  existingSellers: Seller[] = [],
  incomingSellers: Seller[] = []
): Seller[] => {
  const sellersByName = new Map<string, Seller>();

  [...existingSellers, ...incomingSellers].forEach((seller) => {
    const name = seller.name?.trim();

    if (!name) {
      return;
    }

    const normalizedSeller: Seller = {
      name,
      price: seller.price,
      url: seller.url,
    };
    const key = name.toLowerCase();
    const existing = sellersByName.get(key);

    if (!existing || normalizedSeller.price < existing.price) {
      sellersByName.set(key, normalizedSeller);
    }
  });

  return Array.from(sellersByName.values());
};

const getSellersFromListings = (listings: ProductListing[]): Seller[] => {
  const sellers = listings.map((listing) => {
    const platformName = listing.platform?.name || listing.platform_id || "Unknown Platform";

    return {
      name: platformName,
      price: listing.price,
      url: listing.url,
    };
  });

  return mergeSellers([], sellers);
};

const mergePriceHistory = (
  existingHistory: PriceHistoryPoint[] = [],
  incomingHistory: PriceHistoryPoint[] = []
): PriceHistoryPoint[] | undefined => {
  const historyByDate = new Map<string, number>();

  [...existingHistory, ...incomingHistory].forEach((entry) => {
    if (!entry.date) {
      return;
    }

    const existingPrice = historyByDate.get(entry.date);

    if (existingPrice === undefined || entry.price < existingPrice) {
      historyByDate.set(entry.date, entry.price);
    }
  });

  const mergedHistory = Array.from(historyByDate.entries())
    .map(([date, price]) => ({ date, price }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return mergedHistory.length > 0 ? mergedHistory : undefined;
};

const getLatestDate = (
  existingDate?: string,
  incomingDate?: string
): string | undefined => {
  if (!existingDate) return incomingDate;
  if (!incomingDate) return existingDate;

  return new Date(incomingDate).getTime() > new Date(existingDate).getTime()
    ? incomingDate
    : existingDate;
};

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
 * Merge sellers and history so duplicated API rows do not lose seller counts.
 */
const keepLowestPricePerName = (bikes: Bike[]): Bike[] => {
  const bikesByName = new Map<string, Bike>();

  bikes.forEach((bike) => {
    const key = bike.name.trim().toLowerCase();
    const existing = bikesByName.get(key);

    if (!existing) {
      bikesByName.set(key, {
        ...bike,
        sellers: mergeSellers([], bike.sellers),
        priceHistory: mergePriceHistory([], bike.priceHistory),
      });
      return;
    }

    const lowerPriceBike = bike.price < existing.price ? bike : existing;

    bikesByName.set(key, {
      ...lowerPriceBike,
      description: lowerPriceBike.description || existing.description || bike.description,
      specifications: lowerPriceBike.specifications || existing.specifications || bike.specifications,
      sellers: mergeSellers(existing.sellers, bike.sellers),
      lastUpdated: getLatestDate(existing.lastUpdated, bike.lastUpdated),
      priceHistory: mergePriceHistory(existing.priceHistory, bike.priceHistory),
    });
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
 * Transform product from API to Bike format
 * Takes the first (lowest price) listing from a product
 * Includes all listings as sellers
 */
const transformProductToBike = (product: ProductFromAPI): Bike | null => {
  try {
    if (!product.listings || product.listings.length === 0) {
      console.warn(`⚠️ No listings found for product ${product.name}`);
      return null;
    }

    // Get the lowest priced listing for this product
    const lowestPriceListing = product.listings.reduce((lowest, current) => {
      return current.price < lowest.price ? current : lowest;
    });

    // FIND THE LATEST TIMESTAMP ACROSS ALL LISTINGS
    const latestUpdate = product.listings.reduce((latest, current) => {
      if (!current.last_updated) return latest;
      const currentUpdate = new Date(current.last_updated).getTime();
      let latestTime: number;
      latestTime = new Date(latest).getTime();
      return currentUpdate > latestTime ? current.last_updated : latest;
    }, product.listings[0]?.last_updated);

    const sellers = mergeSellers(product.sellers, getSellersFromListings(product.listings));

    // Extract category from brand slug if available
    const category = product.brand ? normalizeCategory(product.brand.slug) : CategoryAll;

    // Aggregate price history from all listings (combine and deduplicate by date)
    const priceHistoryMap = new Map<string, number>();
    product.listings.forEach((listing) => {
      if (listing.priceHistory && Array.isArray(listing.priceHistory)) {
        listing.priceHistory.forEach((entry) => {
          // If date already exists, keep the lower price
          const existing = priceHistoryMap.get(entry.date);
          if (!existing || entry.price < existing) {
            priceHistoryMap.set(entry.date, entry.price);
          }
        });
      }
    });

    // Convert map to sorted array
    const priceHistory = Array.from(priceHistoryMap.entries())
      .map(([date, price]) => ({ date, price }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const bike: Bike = {
      id: product.product_id,
      name: product.name,
      price: lowestPriceListing.price,
      imgSrc: product.image_url || lowestPriceListing.image_url || "", // Use product image or listing image
      category: category,
      link: lowestPriceListing.url || "",
      reviewText: `Available at ${sellers.length} store${sellers.length > 1 ? "s" : ""}`,
      sellers: sellers,
      description: product.description,
      specifications: product.specifications,
      lastUpdated: latestUpdate,
      priceHistory: priceHistory.length > 0 ? priceHistory : undefined,
    };

    console.log(`📦 Transformed product to bike with ${sellers.length} sellers and ${priceHistory.length} price history points:`, bike);
    console.log(`📋 Sellers detail:`, sellers);
    console.log(`📈 Price history:`, priceHistory);
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
    const apiURL = process.env.REACT_APP_API_URL;
    console.log("📡 Fetching bikes from API:", `${apiURL}/products`);
    
    const response = await fetch(`${apiURL}/products`);

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
    const apiURL = process.env.REACT_APP_API_URL;
    console.log("📡 Fetching bike by ID from API:", `${apiURL}/products/${id}`);
    
    const response = await fetch(`${apiURL}/products/${id}`);

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
