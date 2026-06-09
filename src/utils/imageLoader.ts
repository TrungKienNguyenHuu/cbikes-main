/**
 * Utility to handle image loading from both backend URLs and local assets
 */

// Import all local images
import im1 from "../assets/im1-min.png";
import im2 from "../assets/im2-min.png";
import im3 from "../assets/im3-min.png";
import im4 from "../assets/im4-min.png";
import im5 from "../assets/im5-min.png";
import im6 from "../assets/im6-min.png";
import im7 from "../assets/im7-min.png";
import im8 from "../assets/im8-min.png";
import im9 from "../assets/im9-min.png";
import im10 from "../assets/im10-min.png";
import im11 from "../assets/im11-min.png";
import im12 from "../assets/im12-min.png";

const localImages: Record<string, string> = {
  "im1-min.png": im1,
  "im2-min.png": im2,
  "im3-min.png": im3,
  "im4-min.png": im4,
  "im5-min.png": im5,
  "im6-min.png": im6,
  "im7-min.png": im7,
  "im8-min.png": im8,
  "im9-min.png": im9,
  "im10-min.png": im10,
  "im11-min.png": im11,
  "im12-min.png": im12,
};

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

  // If it's a local filename, try to find it in imported assets
  if (localImages[imageSrc]) {
    return localImages[imageSrc];
  }

  // If it's just a filename without path, try to match it
  const filename = imageSrc.split("/").pop() || imageSrc;
  if (localImages[filename]) {
    return localImages[filename];
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
