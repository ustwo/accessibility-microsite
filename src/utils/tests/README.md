# Testing Google Sheets Integration and Cache Utilities

This directory contains tests for the Google Sheets integration and caching utilities.

## Test Structure

The tests should focus on the following key areas:

1. **Cache Utilities**
   - Test cache storage and retrieval
   - Test cache expiration
   - Test cache version control
   - Test cache clearing

2. **Google Sheets Integration**
   - Test JWT token generation and caching
   - Test API fetch with proper mocking
   - Test data processing from raw spreadsheet data
   - Test error handling and fallbacks to mock data

## Writing Tests

### Required Mocks

When testing the Google Sheets integration, you'll need to mock:

1. **localStorage** - For testing cache operations
2. **fetch API** - For testing API requests
3. **Web Crypto API** - For testing JWT generation
4. **Environment variables** - For mocking sheet IDs and credentials

### Example Test Setup

Here's a basic setup for your test file:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as cacheUtils from '../cacheUtils';
import { 
  fetchAccessibilityTools, 
  fetchAccessibilityPatterns,
  getAccessToken
} from '../googleSheets';

// Mock the cache utilities
vi.mock('../cacheUtils', () => ({
  CACHE_KEYS: {
    TOOLS: "accessibility_tools_cache",
    PATTERNS: "accessibility_patterns_cache",
    JWT: "google_jwt_cache"
  },
  getFromCache: vi.fn(),
  saveToCache: vi.fn(),
  getCacheVersion: vi.fn().mockReturnValue('1.0.0'),
  clearAllCaches: vi.fn()
}));

// Mock the fetch API
vi.stubGlobal('fetch', vi.fn());

// Mock environment variables
vi.stubGlobal('import.meta', {
  env: {
    VITE_GOOGLE_TOOLS_SHEET_ID: 'mock-tools-sheet-id',
    VITE_GOOGLE_PATTERNS_SHEET_ID: 'mock-patterns-sheet-id',
    VITE_GOOGLE_SERVICE_ACCOUNT_CREDENTIALS: '{"client_email":"mock@example.com","private_key":"mock"}',
    DEV: true
  }
});

describe('Cache Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  // Your cache tests here
});

describe('Google Sheets Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  // Your Google Sheets integration tests here
});
```

### Sample Test Implementation for cacheUtils

Here's a complete example of testing the cache utilities:

```typescript
// cacheUtils.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getFromCache, 
  saveToCache, 
  clearAllCaches, 
  CACHE_KEYS, 
  getCacheVersion 
} from '../cacheUtils';

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    })
  };
})();

// Replace the global localStorage with our mock
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

describe('Cache Utilities', () => {
  beforeEach(() => {
    // Clear mock calls for each test
    vi.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('getFromCache', () => {
    it('returns null if the item is not in cache', () => {
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });
    
    it('returns the cached data if valid and not expired', () => {
      // Set up a valid cached item
      const testData = { foo: 'bar' };
      mockLocalStorage.setItem('test-key', JSON.stringify({
        data: testData,
        timestamp: Date.now(),
        version: '1.0.0'
      }));
      
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toEqual(testData);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });
    
    it('returns null and removes the item if version mismatch', () => {
      // Set up a cached item with older version
      mockLocalStorage.setItem('test-key', JSON.stringify({
        data: { foo: 'bar' },
        timestamp: Date.now(),
        version: '0.9.0'
      }));
      
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
    
    it('returns null and removes the item if expired', () => {
      // Create a timestamp for 25 hours ago
      const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000);
      
      mockLocalStorage.setItem('test-key', JSON.stringify({
        data: { foo: 'bar' },
        timestamp: expiredTimestamp,
        version: '1.0.0'
      }));
      
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
  });
  
  describe('saveToCache', () => {
    it('saves data to localStorage with timestamp and version', () => {
      // Mock Date.now for consistent testing
      const mockTimestamp = 1612345678901;
      vi.spyOn(Date, 'now').mockImplementation(() => mockTimestamp);
      
      const data = { test: 'data' };
      const version = '1.0.0';
      
      saveToCache('test-key', data, version);
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({
          data,
          timestamp: mockTimestamp,
          version
        })
      );
      
      // Restore Date.now
      vi.restoreAllMocks();
    });
  });
  
  describe('clearAllCaches', () => {
    it('removes all cache keys from localStorage', () => {
      // Setup mock data
      Object.values(CACHE_KEYS).forEach(key => {
        mockLocalStorage.setItem(key, 'test data');
      });
      
      clearAllCaches();
      
      Object.values(CACHE_KEYS).forEach(key => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(key);
      });
    });
  });
});
```

### Testing Strategy

1. Test scenarios with and without cached data
2. Test successful API responses and error handling
3. Verify that data processing functions properly transform raw data
4. Ensure cache durability with all necessary metadata

## Running Tests

Run the tests using:

```bash
npm test
```

Or to run only the Google Sheets tests:

```bash
npm test -- -t "googleSheets"
```

## Best Practices

1. Keep mocks minimal and focused
2. Test both success and failure paths
3. Ensure proper cleanup between tests
4. Test cache invalidation conditions 