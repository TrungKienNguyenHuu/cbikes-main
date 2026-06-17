import { Seller } from "../common/types";

export const getSellerDiscount = (seller: Seller): number =>
  seller.discountRate ?? seller.discount_rate ?? 0;

export const getOriginalPrice = (
  discountedPrice: number,
  discountRate: number
): number | null => {
  if (discountRate <= 0 || discountRate >= 100) {
    return null;
  }

  return Math.round(discountedPrice / (1 - discountRate / 100));
};

export const getSellerOriginalPrice = (seller: Seller): number | null =>
  getOriginalPrice(seller.price, getSellerDiscount(seller));

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
  const discount = getLowestPriceDiscount(sellers);
  if (discount <= 0) {
    return null;
  }

  return getOriginalPrice(getLowestPrice(sellers, fallbackPrice), discount);
};
