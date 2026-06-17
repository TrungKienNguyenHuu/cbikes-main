export const DEFAULT_MIN_PRICE = 0;
export const DEFAULT_MAX_PRICE = 100000000;
export const DEFAULT_MIN_RANGE = 0;
export const DEFAULT_MAX_RANGE = 100000000;
export const PRICE_SLIDER_STEP = 500000;

export interface PriceRangePreset {
  id: string;
  label: string;
  min: number;
  max: number;
}

export const PRICE_RANGE_PRESETS: PriceRangePreset[] = [
  { id: "all", label: "All prices", min: 0, max: 100000000 },
  { id: "under-15", label: "Under 15M", min: 0, max: 15000000 },
  { id: "15-20", label: "15M – 20M", min: 15000000, max: 20000000 },
  { id: "20-30", label: "20M – 30M", min: 20000000, max: 30000000 },
  { id: "30-50", label: "30M – 50M", min: 30000000, max: 50000000 },
  { id: "over-50", label: "Over 50M", min: 50000000, max: 100000000 },
];
export const WEB_APP_NAME = "CBIKES-SHOP";
export const IMG_PATH =
  "https://raw.githubusercontent.com/constantinehuzenko/cbikes/master/i/";

// ===== THEME & COLORS =====
export const COLORS = {
  primary: "#FF6B35",      // Vibrant orange for CTAs
  secondary: "#004E89",    // Deep blue for accents
  success: "#27ae60",      // Green for positive actions
  error: "#e74c3c",        // Red for errors
  warning: "#f39c12",      // Orange for warnings
  info: "#3498db",         // Blue for info
  
  // Neutrals
  text: "#333333",
  textLight: "#666666",
  textLighter: "#999999",
  background: "#ffffff",
  backgroundLight: "#f8f9fa",
  border: "#e0e0e0",
  borderLight: "#f0f0f0",
  
  // Status
  disabled: "#cccccc",
  hover: "#f5f5f5",
};

export const SHADOWS = {
  sm: "0 1px 3px rgba(0,0,0,0.08)",
  md: "0 4px 12px rgba(0,0,0,0.12)",
  lg: "0 8px 24px rgba(0,0,0,0.15)",
  xl: "0 12px 32px rgba(0,0,0,0.2)",
};

export const SPACING = {
  xs: "0.5rem",
  sm: "1rem",
  md: "1.5rem",
  lg: "2rem",
  xl: "3rem",
};

export const BREAKPOINTS = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  wide: "1400px",
};

export const LAYOUT = {
  stickyHeaderOffset: "5.5rem",
};

// Sorting options
export const SORT_OPTIONS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "updated-asc", label: "Updated: Oldest First" },
  { value: "updated-desc", label: "Updated: Newest First" },
  { value: "sellers-asc", label: "Sellers: Fewest First" },
  { value: "sellers-desc", label: "Sellers: Most First" },
  { value: "discount-asc", label: "Discount: Lowest First" },
  { value: "discount-desc", label: "Discount: Highest First" },
];

// Items per page
export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];

// Filter options for needs (phân loại theo nhu cầu)
export const BIKE_NEEDS_OPTIONS = [
  { id: "all", name: "All Needs" },
  { id: "students", name: "🎓 Students" },
  { id: "office", name: "💼 Office Workers" },
  { id: "tech", name: "🚀 Tech Enthusiasts" },
  { id: "delivery", name: "📦 Delivery/Shippers" },
];

// Filter options for tiers (phân loại theo phân khúc)
export const BIKE_TIER_OPTIONS = [
  { id: "all", name: "All Tiers" },
  { id: "basic", name: "Phổ Thông (Basic)" },
  { id: "mid", name: "Trung Cấp (Mid-Tier)" },
  { id: "premium", name: "Cao Cấp (Premium)" },
];
