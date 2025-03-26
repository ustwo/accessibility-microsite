import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  getFromCache, 
  saveToCache, 
  clearAllCaches, 
  CACHE_KEYS, 
  getCacheVersion 
} from '../cacheUtils';

// Mock localStorage
const mockLocalStorage = {
  store: {} as Record<string, string>,
  getItem: vi.fn((key: string) => mockLocalStorage.store[key] || null),
  setItem: vi.fn((key: string, value: string) => {
    mockLocalStorage.store[key] = value;
  }),
  removeItem: vi.fn((key: string) => {
    delete mockLocalStorage.store[key];
  }),
  clear: vi.fn(() => {
    mockLocalStorage.store = {};
  })
};

// Replace the global localStorage with our mock
vi.stubGlobal('localStorage', mockLocalStorage);

// Mock console methods to reduce noise in test output
vi.spyOn(console, 'log').mockImplementation(() => {});
vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Cache Utilities', () => {
  beforeEach(() => {
    // Clear mock calls and localStorage for each test
    vi.clearAllMocks();
    mockLocalStorage.clear();
    mockLocalStorage.store = {};
  });

  describe('getFromCache', () => {
    it('returns null if the item is not in cache', () => {
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });
    
    it('returns cached data if valid and not expired', () => {
      // Set up a valid cached item
      const testData = { foo: 'bar' };
      mockLocalStorage.store['test-key'] = JSON.stringify({
        data: testData,
        timestamp: Date.now(),
        version: '1.0.0'
      });
      
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toEqual(testData);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
    });
    
    it('returns null and removes the item if version mismatch', () => {
      // Set up a cached item with older version
      mockLocalStorage.store['test-key'] = JSON.stringify({
        data: { foo: 'bar' },
        timestamp: Date.now(),
        version: '0.9.0'
      });
      
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toBeNull();
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('test-key');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });
    
    it('returns null and removes the item if expired', () => {
      // Create a timestamp for 25 hours ago (exceeds 24-hour cache duration)
      const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000);
      
      mockLocalStorage.store['test-key'] = JSON.stringify({
        data: { foo: 'bar' },
        timestamp: expiredTimestamp,
        version: '1.0.0'
      });
      
      const result = getFromCache('test-key', '1.0.0');
      
      expect(result).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('test-key');
    });

    it('handles JSON parse errors', () => {
      // Set up an invalid JSON string
      mockLocalStorage.store['test-key'] = 'invalid-json{';
      
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

    it('handles quota exceeded errors by clearing other caches', () => {
      // Setup QuotaExceededError
      const quotaError = new DOMException('QuotaExceededError', 'QuotaExceededError');
      vi.spyOn(mockLocalStorage, 'setItem')
        .mockImplementationOnce(() => { throw quotaError; })
        .mockImplementationOnce(() => {}); // Second call succeeds

      // Pre-populate some cache items
      Object.values(CACHE_KEYS).forEach(key => {
        mockLocalStorage.store[key] = 'some-data';
      });
      
      saveToCache('test-key', { test: 'data' }, '1.0.0');
      
      // Verify other caches were cleared
      Object.values(CACHE_KEYS).forEach(key => {
        if (key !== 'test-key') {
          expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(key);
        }
      });
      
      // Second setItem should have been attempted
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(2);
    });
  });
  
  describe('clearAllCaches', () => {
    it('removes all cache keys from localStorage', () => {
      // Setup mock data
      Object.values(CACHE_KEYS).forEach(key => {
        mockLocalStorage.store[key] = 'test data';
      });
      
      clearAllCaches();
      
      Object.values(CACHE_KEYS).forEach(key => {
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith(key);
      });
    });
  });

  describe('getCacheVersion', () => {
    it('returns the correct version for tools', () => {
      const version = getCacheVersion('tools');
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
    });

    it('returns the correct version for patterns', () => {
      const version = getCacheVersion('patterns');
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
    });

    it('returns the correct version for jwt', () => {
      const version = getCacheVersion('jwt');
      expect(version).toBeDefined();
      expect(typeof version).toBe('string');
    });
  });
}); 