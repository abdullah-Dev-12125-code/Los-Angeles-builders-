/**
 * Performance Optimization Utilities
 * Includes debouncing, memoization, and lazy loading helpers
 */

/**
 * Debounce function to prevent excessive re-renders
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function to limit function execution
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoization cache for expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  cacheSize: number = 100
) {
  const cache = new Map<string, ReturnType<T>>();

  return (...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func(...args);

    if (cache.size >= cacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  };
}

/**
 * Intersection Observer for lazy loading
 */
export function createLazyLoader(
  callback: (entry: IntersectionObserverEntry) => void,
  options?: IntersectionObserverInit
) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        callback(entry);
      }
    });
  }, options);

  return observer;
}

/**
 * Request Animation Frame wrapper for smooth animations
 */
export function smoothScroll(
  element: Element,
  duration: number = 1000
): Promise<void> {
  return new Promise((resolve) => {
    const start = element.scrollTop;
    const target = element.scrollHeight - element.clientHeight;
    const distance = target - start;
    const startTime = performance.now();

    const scroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function
      const easeProgress = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      element.scrollTop = start + distance * easeProgress;

      if (progress < 1) {
        requestAnimationFrame(scroll);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(scroll);
  });
}

/**
 * Preload multiple images
 */
export async function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    urls.map((url) => {
      return new Promise<HTMLImageElement>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    })
  );
}

/**
 * Optimize image loading with intersection observer
 */
export function setupImageLazyLoading() {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement;
        const src = img.dataset.src;
        if (src) {
          img.src = src;
          img.removeAttribute("data-src");
          imageObserver.unobserve(img);
        }
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img);
  });

  return imageObserver;
}

/**
 * Calculate optimal image size for device
 */
export function getOptimalImageSize(): {
  width: number;
  quality: number;
} {
  const dpr = window.devicePixelRatio || 1;
  const width = Math.min(window.innerWidth * dpr, 2560);
  
  // Higher DPI = lower quality needed
  const quality = dpr > 2 ? 75 : dpr > 1.5 ? 80 : 85;

  return { width, quality };
}

/**
 * Memory-efficient list virtualization for large lists
 */
export interface VirtualListOptions {
  itemHeight: number;
  visibleItems: number;
  totalItems: number;
}

export function calculateVisibleRange(
  scrollTop: number,
  options: VirtualListOptions
): { start: number; end: number } {
  const start = Math.floor(scrollTop / options.itemHeight);
  const end = Math.min(start + options.visibleItems, options.totalItems);

  return { start, end };
}

/**
 * Performance monitoring utility
 */
export function measurePerformance(label: string): () => void {
  const startTime = performance.now();

  return () => {
    const endTime = performance.now();
    console.log(`[Performance] ${label}: ${(endTime - startTime).toFixed(2)}ms`);
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Check network connectivity
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Get available memory (if supported)
 */
export function getAvailableMemory(): number | null {
  const memory = (performance as any).memory;
  return memory ? memory.jsHeapSizeLimit : null;
}
