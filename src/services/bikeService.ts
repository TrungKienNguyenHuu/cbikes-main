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
  lowest_price?: number;
  price_history?: PriceHistoryPoint[];
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
  discount_rate?: number;
  promotions?: Array<{ title: string; description?: string; discountPercentage?: number }>;
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



const transformProductToBike = (product: ProductFromAPI): Bike | null => {
  try {
    if (!product.listings || product.listings.length === 0) {
      console.warn(`⚠️ No listings found for product ${product.name}`);
      return null;
    }

    const lowestPriceListing = product.listings.reduce((lowest, current) => {
      return current.price < lowest.price ? current : lowest;
    });

    const latestUpdate = product.listings.reduce((latest, current) => {
      if (!current.last_updated) return latest;
      const currentUpdate = new Date(current.last_updated).getTime();
      let latestTime: number = new Date(latest).getTime();
      return currentUpdate > latestTime ? current.last_updated : latest;
    }, product.listings[0]?.last_updated);

    const sellers = product.sellers || [];
    const category = product.brand ? normalizeCategory(product.brand.slug) : CategoryAll;

    let bike: Bike = {
      id: product.product_id,
      name: product.name,
      price: product.lowest_price !== undefined ? product.lowest_price : lowestPriceListing.price,
      imgSrc: product.image_url || lowestPriceListing.image_url || "",
      detailImageUrl: lowestPriceListing.detail_image_url,
      category: category,
      link: lowestPriceListing.url || "",
      reviewText: `Available at ${sellers.length} store${sellers.length > 1 ? "s" : ""}`,
      sellers: sellers,
      description: product.description,
      specifications: product.specifications,
      lastUpdated: latestUpdate,
      priceHistory: product.price_history && product.price_history.length > 0 ? product.price_history : undefined,
    };

    console.log(`📦 Transformed product to bike:`, bike);
    return bike;
  } catch (error) {
    console.error(`❌ Error transforming product ${product.name}:`, error);
    return null;
  }
};

/**
 * Fetch metadata (categories, sellers) from the API
 */
export const fetchMetadataFromAPI = async () => {
  try {
    const apiURL = process.env.REACT_APP_API_URL;
    console.log("📡 Fetching metadata from API:", `${apiURL}/products/metadata`);
    
    const response = await fetch(`${apiURL}/products/metadata`);

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ Error fetching metadata from API:", error);
    throw error;
  }
};

/**
 * Fetch all bikes from the API (port 5001)
 * ✅ Fetches from API with product listings using new schema and server-side filtering
 */
export const fetchBikesFromAPI = async (params: Record<string, any> = {}): Promise<{ bikes: Bike[]; totalCount: number; totalPages: number }> => {
  try {
    const apiURL = process.env.REACT_APP_API_URL;
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    const url = `${apiURL}/products${queryString ? `?${queryString}` : ''}`;
    
    console.log("📡 Fetching bikes from API:", url);
    
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    const products: ProductFromAPI[] = Array.isArray(data) ? data : (data.products || []);
    const totalCount = data.totalCount || products.length;
    const totalPages = data.totalPages || 1;

    console.log("📥 Raw API response products count:", products.length);
    
    // Transform products to bikes format
    const transformedBikes: Bike[] = products
      .map(transformProductToBike)
      .filter((bike): bike is Bike => bike !== null);
    
    // We do not need keepLowestPricePerName because the backend already groups by product_id
    // and returns the lowest price for that product in the CTE.
    console.log("✅ Transformed products to bikes:", transformedBikes);

    return { bikes: transformedBikes, totalCount, totalPages };
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
