import { Seller } from "../common/types";

export const getSellerDiscount = (seller: Seller): number =>
  seller.discountRate ?? seller.discount_rate ?? 0;

/**
 * Get original price from seller, using either the database value or calculated value
 * Prioritizes seller.original_price from database when available
 */
export const getOriginalPrice = (
  discountedPrice: number,
  discountRate: number,
  databaseOriginalPrice?: number
): number | null => {
  const originalPrice =
    typeof databaseOriginalPrice === "number" && databaseOriginalPrice > 0
      ? databaseOriginalPrice
      : discountRate > 0 && discountRate < 100
        ? Math.round(discountedPrice / (1 - discountRate / 100))
        : null;

  // Only show an original price when it is actually above the selling price.
  if (originalPrice === null || originalPrice <= discountedPrice) {
    return null;
  }

  return originalPrice;
};

export const getSellerOriginalPrice = (seller: Seller): number | null => {
  return getOriginalPrice(seller.price, getSellerDiscount(seller), seller.original_price);
};

export const getLowestPrice = (
  sellers: Seller[] | undefined,
  fallbackPrice: number
): number => {
  if (!sellers || sellers.length === 0) {
    return fallbackPrice;
  }

  return Math.min(...sellers.map((seller) => seller.price));
};

/**
 * Discount for the displayed lowest price — only considers sellers at that price.
 */
export const getLowestPriceDiscount = (sellers: Seller[] | undefined): number => {
  if (!sellers || sellers.length === 0) {
    return 0;
  }

  const lowestPrice = Math.min(...sellers.map((seller) => seller.price));
  const lowestPriceSellers = sellers.filter((seller) => seller.price === lowestPrice);

  return Math.max(...lowestPriceSellers.map(getSellerDiscount));
};

export const getLowestPriceOriginal = (
  sellers: Seller[] | undefined,
  fallbackPrice: number
): number | null => {
  if (!sellers || sellers.length === 0) {
    return null;
  }

  const lowestPrice = getLowestPrice(sellers, fallbackPrice);
  const lowestPriceSellers = sellers.filter((seller) => seller.price === lowestPrice);
  
  // Check if any seller has a valid database original_price
  for (const seller of lowestPriceSellers) {
    if (typeof seller.original_price === "number" && seller.original_price > lowestPrice) {
      return seller.original_price;
    }
  }
  
  // Otherwise calculate from discount
  const discount = getLowestPriceDiscount(sellers);
  if (discount <= 0) {
    return null;
  }

  return getOriginalPrice(lowestPrice, discount);
};
