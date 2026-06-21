/**
 * Utility to handle image loading from both backend URLs and local assets
 */

/**
 * Load image from backend URL or local assets
 * @param imageSrc - Image URL from backend or local filename
 * @returns Resolved image URL or empty string
 */
export const getImageUrl = (imageSrc: string | undefined | null): string => {
  if (!imageSrc) {
    return "";
  }

  // If it's a full URL (http/https), use it directly
  if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
    return imageSrc;
  }
  // If not found, return the original (might be a relative path)
  return imageSrc;
};

/**
 * Get placeholder image when image fails to load
 */
export const getPlaceholderImage = (): string => {
  return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23f0f0f0' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23999'%3EImage not available%3C/text%3E%3C/svg%3E";
};
