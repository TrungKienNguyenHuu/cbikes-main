import { Bike, Category } from "../common/types";

interface BikeFromAPI {
  id: string;
  name: string;
  price: number | string;
  link: string;
  image_url: string;
  category?: string;
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

/**
 * Transform backend API response to frontend Bike format
 */
const transformBikeFromAPI = (apiBike: BikeFromAPI): Bike => {
  // Map category from API response or default to 'all'
  let category: keyof typeof Category = "all";
  if (apiBike.category && apiBike.category in Category) {
    category = apiBike.category as keyof typeof Category;
  } else {
    console.warn(`⚠️ Category "${apiBike.category}" not recognized for bike ${apiBike.id}, using "all"`);
  }

  const parsedPrice = parsePrice(apiBike.price);

  const transformedBike: Bike = {
    id: apiBike.id,
    name: apiBike.name,
    price: parsedPrice,
    imgSrc: apiBike.image_url,
    category: category,
  };
  
  console.log(`📦 Transformed bike: ${apiBike.name}`, transformedBike);
  
  return transformedBike;
};

/**
 * Fetch all bikes from the backend API
 */
export const fetchBikesFromAPI = async (): Promise<Bike[]> => {
  try {
    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    console.log("📡 Fetching bikes from:", `${backendURL}/api/bikes`);
    const response = await fetch(`${backendURL}/api/bikes`);

    if (!response.ok) {
      throw new Error(`Failed to fetch bikes: ${response.statusText}`);
    }

    const bikes: BikeFromAPI[] = await response.json();
    console.log("📥 Raw API response:", bikes);
    
    // Transform API response to frontend format
    const transformedBikes: Bike[] = bikes.map(transformBikeFromAPI);
    console.log("✅ Transformed bikes:", transformedBikes);
    
    return transformedBikes;
  } catch (error) {
    console.error("❌ Error fetching bikes from API:", error);
    throw error;
  }
};

/**
 * Fetch a single bike by ID
 */
export const fetchBikeByIdFromAPI = async (id: string): Promise<Bike> => {
  try {
    const backendURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";
    const response = await fetch(`${backendURL}/api/bikes/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch bike: ${response.statusText}`);
    }

    const bike: BikeFromAPI = await response.json();
    
    return transformBikeFromAPI(bike);
  } catch (error) {
    console.error(`Error fetching bike ${id} from API:`, error);
    throw error;
  }
};
