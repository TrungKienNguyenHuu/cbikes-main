import { Bike } from "../common/types";

interface HotProductFromAPI {
  product_id: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  specifications?: Record<string, any>;
  brand_name?: string;
  click_count: number;
  last_clicked_at: string;
  listings: Array<{
    listing_id: string;
    price: number;
    original_price?: number | null;
    discount_rate?: number | null;
    url: string;
    platform_name: string;
  }>;
}

/**
 * Transform hot product from API to Bike format
 */
const transformHotProductToBike = (product: HotProductFromAPI): Bike | null => {
  try {
    if (!product.listings || product.listings.length === 0) {
      console.warn(`⚠️ No listings found for hot product ${product.name}`);
      return null;
    }

    // Get the lowest priced listing
    const lowestPriceListing = product.listings.reduce((lowest, current) => {
      return current.price < lowest.price ? current : lowest;
    });
    const sellers = product.listings.map((listing) => ({
      name: listing.platform_name || "Unknown Platform",
      price: listing.price,
      url: listing.url,
      ...(listing.original_price != null && { original_price: listing.original_price }),
      ...(listing.discount_rate != null && { discountRate: listing.discount_rate }),
    }));

    const bike: Bike = {
      id: product.product_id,
      name: product.name,
      price: lowestPriceListing.price,
      imgSrc: product.image_url || "",
      category: product.brand_name?.toLowerCase() || "all",
      link: lowestPriceListing.url || "",
      reviewText: `Hot! ${product.click_count} views`,
      description: product.description,
      specifications: product.specifications,
      sellers,
    };

    console.log(`🔥 Transformed hot product: ${product.name} (${product.click_count} clicks)`);
    return bike;
  } catch (error) {
    console.error(`❌ Error transforming hot product ${product.name}:`, error);
    return null;
  }
};

/**
 * Fetch hot products (trending products based on click count)
 * @param days - Number of days to consider (default: 7)
 * @param limit - Maximum number of hot products to return (default: 10)
 */
export const fetchHotProducts = async (
  days: number = 7,
  limit: number = 10
): Promise<Bike[]> => {
  try {
    const apiURL = process.env.REACT_APP_API_URL;
    const url = new URL(`${apiURL}/clicks/trending`);
    url.searchParams.append("days", days.toString());
    url.searchParams.append("limit", limit.toString());

    console.log("📡 Fetching hot products from:", url.toString());
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch hot products: ${response.statusText}`);
    }

    const hotProducts: HotProductFromAPI[] = await response.json();
    console.log("📥 Raw hot products API response:", hotProducts);

    const transformedBikes: Bike[] = hotProducts
      .map(transformHotProductToBike)
      .filter((bike): bike is Bike => bike !== null);

    console.log("✅ Transformed hot products:", transformedBikes);
    return transformedBikes;
  } catch (error) {
    console.error("❌ Error fetching hot products:", error);
    return [];
  }
};

/**
 * Record a product click for analytics
 * @param productId - The product ID that was clicked
 * @param userSessionId - Optional user session ID for tracking
 */
export const recordProductClick = async (
  productId: string,
  userSessionId?: string
): Promise<boolean> => {
  try {
    const apiURL = process.env.REACT_APP_API_URL;
    const url = `${apiURL}/clicks/${productId}`;

    console.log("📊 Recording product click for:", productId);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userSessionId && { "X-Session-Id": userSessionId }),
      },
      body: JSON.stringify({
        userSessionId: userSessionId || "anonymous",
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to record click: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("✅ Click recorded successfully:", result);
    return true;
  } catch (error) {
    console.error("❌ Error recording product click:", error);
    // Don't throw - this is non-critical analytics data
    return false;
  }
};
