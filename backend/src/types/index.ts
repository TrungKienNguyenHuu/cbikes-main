export interface Brand {
  brand_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description?: string;
  created_at: Date;
}

export interface Platform {
  platform_id: string;
  name: string;
  slug: string;
  logo_url?: string;
  is_marketplace: boolean;
}

export interface Product {
  product_id: string;
  brand_id?: string;
  name: string;
  slug: string;
  image_url?: string;
  description?: string;
  specifications?: Record<string, any>;
  created_at: Date;
  brand?: Brand; // Optional brand details when joined
}

export interface Promotion {
  title: string;
  description?: string;
  discountPercentage?: number;
}

export interface ProductListing {
  listing_id: string;
  product_id: string;
  platform_id: string;
  listing_title: string;
  price: number;
  original_price?: number;
  url: string;
  image_url?: string;
  detail_image_url?: string;
  first_seen: Date;
  last_updated: Date;
  discount_rate?: number;
  promotions?: Promotion[];
  platform?: Platform; // Optional platform details when joined
}

export interface PriceHistory {
  history_id: string;
  listing_id: string;
  price: number;
  recorded_at: Date;
}

export interface Seller {
  name: string;
  price: number;
  url: string;
  discount_rate?: number;
  promotions?: Promotion[];
}

export interface ProductWithListings extends Product {
  listings: ProductListing[];
  sellers?: Seller[];
}

export interface ListingWithPriceHistory extends ProductListing {
  priceHistory?: PriceHistory[];
}
