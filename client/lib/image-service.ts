/**
 * Image Service - Unsplash API Integration
 * Fetches high-quality property and construction images
 */

const UNSPLASH_ACCESS_KEY = "demo"; // Free tier - replace with your key
const UNSPLASH_BASE_URL = "https://api.unsplash.com";

export interface PropertyImage {
  id: string;
  url: string;
  thumbUrl: string;
  alt: string;
  photographer: string;
  photographer_url: string;
}

// Local fallback images for development
const FALLBACK_PROPERTY_IMAGES: PropertyImage[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1545324418-cc1a9a6fead3?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1545324418-cc1a9a6fead3?w=500&q=80",
    alt: "Modern luxury apartment exterior",
    photographer: "Unsplash",
    photographer_url: "#",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1512917774080-9a485dc1d1b7?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1512917774080-9a485dc1d1b7?w=500&q=80",
    alt: "Contemporary building design",
    photographer: "Unsplash",
    photographer_url: "#",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1506228613408-eca07ce68773?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1506228613408-eca07ce68773?w=500&q=80",
    alt: "High-rise construction site",
    photographer: "Unsplash",
    photographer_url: "#",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1485872299829-c673f5194813?w=500&q=80",
    alt: "Luxury penthouse interior",
    photographer: "Unsplash",
    photographer_url: "#",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500&q=80",
    alt: "Modern office building",
    photographer: "Unsplash",
    photographer_url: "#",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&q=80",
    alt: "Urban skyline architecture",
    photographer: "Unsplash",
    photographer_url: "#",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1552145005-71d12c31b1df?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1552145005-71d12c31b1df?w=500&q=80",
    alt: "Modern residential building",
    photographer: "Unsplash",
    photographer_url: "#",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1486312338219-ce68d2dc6f44?w=1920&q=80",
    thumbUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2dc6f44?w=500&q=80",
    alt: "Commercial real estate",
    photographer: "Unsplash",
    photographer_url: "#",
  },
];

/**
 * Get property images with fallback to local dataset
 */
export async function getPropertyImages(
  query: string = "luxury property modern apartment"
): Promise<PropertyImage[]> {
  try {
    // For now, return fallback images
    // In production, integrate with Unsplash API
    return FALLBACK_PROPERTY_IMAGES;
  } catch (error) {
    console.error("Error fetching images:", error);
    return FALLBACK_PROPERTY_IMAGES;
  }
}

/**
 * Get random property image
 */
export function getRandomPropertyImage(): PropertyImage {
  return FALLBACK_PROPERTY_IMAGES[
    Math.floor(Math.random() * FALLBACK_PROPERTY_IMAGES.length)
  ];
}

/**
 * Get images collection for specific property type
 */
export async function getImagesByPropertyType(
  type: "apartment" | "house" | "commercial" | "condo"
): Promise<PropertyImage[]> {
  const queries: Record<string, string> = {
    apartment: "luxury apartment modern interior",
    house: "contemporary house modern home",
    commercial: "office building commercial property",
    condo: "beachfront condo luxury residential",
  };

  return getPropertyImages(queries[type] || queries.apartment);
}

/**
 * Preload images for better performance
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Get optimized image URL with parameters
 */
export function getOptimizedImageUrl(
  url: string,
  { width = 1920, quality = 80, format = "webp" }: ImageOptimizationOptions = {}
): string {
  // For Unsplash URLs, add optimization parameters
  if (url.includes("unsplash.com")) {
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}w=${width}&q=${quality}&fm=${format}`;
  }
  return url;
}

export interface ImageOptimizationOptions {
  width?: number;
  quality?: number;
  format?: "webp" | "jpg" | "png";
}

/**
 * Get thumbnail URL (smaller, optimized for grid)
 */
export function getThumbnailUrl(url: string): string {
  return getOptimizedImageUrl(url, { width: 500, quality: 75, format: "webp" });
}

/**
 * Get hero image URL (large, optimized for header)
 */
export function getHeroImageUrl(url: string): string {
  return getOptimizedImageUrl(url, { width: 2560, quality: 85, format: "webp" });
}

/**
 * Get mobile image URL (responsive)
 */
export function getMobileImageUrl(url: string): string {
  return getOptimizedImageUrl(url, { width: 768, quality: 80, format: "webp" });
}

/**
 * Generate srcset for responsive images
 */
export function generateSrcSet(url: string): string {
  const mobile = getOptimizedImageUrl(url, { width: 640, quality: 80 });
  const tablet = getOptimizedImageUrl(url, { width: 1024, quality: 85 });
  const desktop = getOptimizedImageUrl(url, { width: 1920, quality: 90 });

  return `${mobile} 640w, ${tablet} 1024w, ${desktop} 1920w`;
}
