/**
 * Format a number as Vietnamese currency digits: 26769000 → "26.769.000"
 */
export const formatVNDNumber = (price: number): string => {
  if (!Number.isFinite(price)) {
    return "0";
  }

  return Math.round(price)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/** Plain-text VND label for charts and compact contexts */
export const formatVNDLabel = (price: number): string =>
  `${formatVNDNumber(price)}₫`;

/** Parse user input like "26.769.000" or "26769000" to a number */
export const parseVNDInput = (value: string): number => {
  const cleaned = value.replace(/[^\d]/g, "");
  const parsed = parseInt(cleaned, 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

/** Short label for preset chips, e.g. 15000000 → "15 triệu" */
export const formatVNDShort = (price: number): string => {
  if (price >= 1_000_000) {
    const millions = price / 1_000_000;
    return Number.isInteger(millions)
      ? `${millions} triệu`
      : `${millions.toFixed(1).replace(".", ",")} triệu`;
  }

  if (price >= 1_000) {
    return `${Math.round(price / 1_000)} nghìn`;
  }

  return formatVNDNumber(price);
};
