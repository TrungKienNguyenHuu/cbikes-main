export interface Product {
  product_id: string;
  name: string;
  url?: string;
  image_url?: string;
  description?: string;
  brand: string;
  specifications?: Record<string, any>;
  created_at: Date;
}

export interface ProductListing {
  listing_id: string;
  product_id: string;
  source_name: string;
  listing_title: string;
  price: number;
  url?: string;
  image_url?: string;
  description?: string;
  specifications?: Record<string, any>;
  last_updated: Date;
}

export interface ProductWithListings extends Product {
  listings: ProductListing[];
}
