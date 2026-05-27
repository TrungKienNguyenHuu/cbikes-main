export const DEFAULT_MAX_PRICE = 2850;
export const DEFAULT_MIN_RANGE = 350;
export const DEFAULT_MAX_RANGE = 3870;
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

// Sorting options
export const SORT_OPTIONS = [
  { value: "latest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Best Rating" },
];

// Items per page
export const ITEMS_PER_PAGE_OPTIONS = [12, 24, 48];
