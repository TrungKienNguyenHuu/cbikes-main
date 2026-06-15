export interface Seller {
  name: string;
  price: number;
  url: string;
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
  maxPrice: number;
  currentSeller: string;
}
