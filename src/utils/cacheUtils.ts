/**
 * Utility functions for caching data from Google Sheets to localStorage
 */

type CachedItem<T> = {
  data: T;
  timestamp: number;
  version: string; // Used to invalidate cache when data structure changes
};

// Cache versions - increment when data structure changes
const CACHE_VERSIONS = {
  tools: "1.0.0",
  patterns: "1.0.0",
  jwt: "1.0.0"
};

// Cache keys
export const CACHE_KEYS = {
  TOOLS: "accessibility_tools_cache",
  PATTERNS: "accessibility_patterns_cache",
  JWT: "google_jwt_cache"
};

// Default expiration times (in milliseconds)
const DEFAULT_CACHE_DURATION = {
  TOOLS: 1000 * 60 * 60 * 24, // 24 hours
  PATTERNS: 1000 * 60 * 60 * 24, // 24 hours
  JWT: 1000 * 60 * 50 // 50 minutes (JWT typically expires in 1 hour)
};

/**
 * Get data from cache if it exists and hasn't expired
 */
export function getFromCache<T>(key: string, version: string): T | null {
  try {
    const cachedData = localStorage.getItem(key);
    if (!cachedData) return null;

    const parsed = JSON.parse(cachedData) as CachedItem<T>;
    
    // Check if cache version matches (to handle schema changes)
    if (parsed.version !== version) {
      localStorage.removeItem(key);
      return null;
    }
    
    // Check if cache has expired
    const now = Date.now();
    const cacheAge = now - parsed.timestamp;
    const maxAge = key === CACHE_KEYS.JWT 
      ? DEFAULT_CACHE_DURATION.JWT 
      : key === CACHE_KEYS.TOOLS 
        ? DEFAULT_CACHE_DURATION.TOOLS 
        : DEFAULT_CACHE_DURATION.PATTERNS;

    if (cacheAge > maxAge) {
      localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Save data to cache with version and timestamp
 */
export function saveToCache<T>(key: string, data: T, version: string): void {
  try {
    const cacheItem: CachedItem<T> = {
      data,
      timestamp: Date.now(),
      version
    };
    localStorage.setItem(key, JSON.stringify(cacheItem));
  } catch (error) {
    // If error is due to quota exceeded, try to clear other caches
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      try {
        // Clear all caches except the current one we're trying to save
        Object.values(CACHE_KEYS).forEach(cacheKey => {
          if (cacheKey !== key) localStorage.removeItem(cacheKey);
        });
        // Try again
        localStorage.setItem(key, JSON.stringify({
          data,
          timestamp: Date.now(),
          version
        }));
      } catch (retryError) {
      }
    }
  }
}

/**
 * Clear all application caches
 */
export function clearAllCaches(): void {
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Get the current cache version for a specific type
 */
export function getCacheVersion(type: 'tools' | 'patterns' | 'jwt'): string {
  return CACHE_VERSIONS[type];
} 