export interface Promotion {
  title: string;
  description?: string;
  discountPercentage?: number;
}

export interface Seller {
  name: string;
  price: number;
  original_price?: number;
  url: string;
  discountRate?: number;
  discount_rate?: number;  // Support both camelCase and snake_case
  promotions?: Promotion[];
}

export interface BikeSpecifications {
  batteryCapacity: string;
  motorPower: string;
  maxSpeed: string;
  range: string;
  weight: string;
  chargingTime: string;
}

export interface PriceHistoryPoint {
  date: string;
  price: number;
}

export interface Bike {
  id: string;
  name: string;
  category: string;
  price: number;
  imgSrc: string;
  detailImageUrl?: string;
  link: string;
  reviewText?: string;
  specifications?: Record<string, any>;
  description?: string;
  sellers?: Seller[];
  lastUpdated?: string;
  priceHistory?: PriceHistoryPoint[];
}

// Dynamic category values - "all" is always available, others come from brands table
export const CategoryAll = "all";

export interface FilterState {
  currentCategory: string;
  minPrice: number;
  maxPrice: number;
  pricePreset: string;
  currentSeller: string;
  currentNeed?: string;    // phân loại theo nhu cầu
  currentTier?: string;    // phân loại theo phân khúc
}
