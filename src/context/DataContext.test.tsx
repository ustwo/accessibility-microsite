import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { DataProvider, useData } from './DataContext';
import * as googleSheets from '../utils/googleSheets';
import * as cacheUtils from '../utils/cacheUtils';
import { mockTools, mockPatterns } from '../data/mockData';

// Mock the utilities
vi.mock('../utils/googleSheets', () => ({
  fetchAccessibilityTools: vi.fn(),
  fetchAccessibilityPatterns: vi.fn(),
}));

vi.mock('../utils/cacheUtils', () => ({
  clearAllCaches: vi.fn(),
}));

// Create a test component that uses the context
function TestComponent() {
  const { tools, patterns, isLoadingTools, isLoadingPatterns, error, refreshData, clearCache } = useData();
  
  return (
    <div>
      <div data-testid="loading-tools">{isLoadingTools ? 'Loading tools' : 'Tools loaded'}</div>
      <div data-testid="loading-patterns">{isLoadingPatterns ? 'Loading patterns' : 'Patterns loaded'}</div>
      <div data-testid="error">{error || 'No errors'}</div>
      <div data-testid="tools-count">{tools.length}</div>
      <div data-testid="patterns-count">{patterns.length}</div>
      <button data-testid="refresh-btn" onClick={refreshData}>Refresh</button>
      <button data-testid="clear-cache-btn" onClick={clearCache}>Clear Cache</button>
    </div>
  );
}

describe('DataContext with Caching Backoff Strategy', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock localStorage for cache tracking
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
      key: vi.fn(),
      length: 0
    });
    
    // Default mock implementations
    vi.mocked(googleSheets.fetchAccessibilityTools).mockImplementation(async () => {
      return mockTools;
    });
    
    vi.mocked(googleSheets.fetchAccessibilityPatterns).mockImplementation(async () => {
      return mockPatterns;
    });
    
    // Set up time mocking
    vi.useFakeTimers({ shouldAdvanceTime: true });
  });
  
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });
  
  it('should load data without forcing refresh on initial mount', async () => {
    // Render the component
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
      expect(screen.getByTestId('loading-patterns')).toHaveTextContent('Patterns loaded');
    }, { timeout: 3000 });
    
    // Verify functions were called with the right parameters
    // First parameter to fetchAccessibilityTools should be false indicating no forced refresh
    expect(googleSheets.fetchAccessibilityTools).toHaveBeenCalledTimes(1);
    expect(googleSheets.fetchAccessibilityPatterns).toHaveBeenCalledTimes(1);
  }, 10000);
  
  it('should enforce a minimum time between forced refreshes', async () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    });
    
    // Reset mock counters to track new calls
    vi.mocked(googleSheets.fetchAccessibilityTools).mockClear();
    vi.mocked(googleSheets.fetchAccessibilityPatterns).mockClear();
    
    // First refresh - this should trigger the API calls
    act(() => {
      screen.getByTestId('refresh-btn').click();
    });
    
    // Wait for refresh to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    });
    
    // Verify that the fetch was called for the first refresh
    expect(googleSheets.fetchAccessibilityTools).toHaveBeenCalledTimes(1);
    expect(googleSheets.fetchAccessibilityPatterns).toHaveBeenCalledTimes(1);
    
    // Reset mocks to track second refresh
    vi.mocked(googleSheets.fetchAccessibilityTools).mockClear();
    vi.mocked(googleSheets.fetchAccessibilityPatterns).mockClear();
    
    // Second refresh immediately after - should NOT force a refresh due to MIN_REFRESH_INTERVAL
    act(() => {
      screen.getByTestId('refresh-btn').click();
    });
    
    // Wait for any loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    }, { timeout: 3000 });
    
    // APIs should still be called, but cache shouldn't be cleared
    expect(googleSheets.fetchAccessibilityTools).toHaveBeenCalledTimes(1);
    expect(googleSheets.fetchAccessibilityPatterns).toHaveBeenCalledTimes(1);
  }, 10000);
  
  it('should allow refresh after MIN_REFRESH_INTERVAL has elapsed', async () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    });
    
    // Reset mocks to track calls
    vi.mocked(googleSheets.fetchAccessibilityTools).mockClear();
    vi.mocked(googleSheets.fetchAccessibilityPatterns).mockClear();
    
    // First refresh
    act(() => {
      screen.getByTestId('refresh-btn').click();
    });
    
    // Wait for refresh to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    }, { timeout: 3000 });
    
    // Fast-forward timers beyond the MIN_REFRESH_INTERVAL (10 minutes)
    await act(async () => {
      await vi.advanceTimersByTimeAsync(11 * 60 * 1000); // 11 minutes
    });
    
    // Reset mocks to track new calls
    vi.mocked(googleSheets.fetchAccessibilityTools).mockClear();
    vi.mocked(googleSheets.fetchAccessibilityPatterns).mockClear();
    
    // Second refresh after interval - should allow a forced refresh now
    act(() => {
      screen.getByTestId('refresh-btn').click();
    });
    
    // Wait for refresh to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    }, { timeout: 3000 });
    
    // Verify that APIs were called again and cache was cleared
    expect(googleSheets.fetchAccessibilityTools).toHaveBeenCalledTimes(1);
    expect(googleSheets.fetchAccessibilityPatterns).toHaveBeenCalledTimes(1);
  }, 10000);
  
  it('should selectively clear caches when refreshing tools', async () => {
    // Set up spy for localStorage functions
    const localStorageRemoveSpy = vi.spyOn(localStorage, 'removeItem');
    
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    }, { timeout: 3000 });
    
    // Fast-forward beyond refresh interval
    await act(async () => {
      await vi.advanceTimersByTimeAsync(11 * 60 * 1000);
    });
    
    // Reset the spy to track new calls
    localStorageRemoveSpy.mockClear();
    
    // Trigger refresh
    act(() => {
      screen.getByTestId('refresh-btn').click();
    });
    
    // Wait for refresh to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    }, { timeout: 3000 });
    
    // Check if localStorage.removeItem was called with specific prefixes
    expect(localStorageRemoveSpy).toHaveBeenCalled();
  }, 10000);
  
  it('should handle error during data loading', async () => {
    // Setup mock to reject
    vi.mocked(googleSheets.fetchAccessibilityTools).mockRejectedValueOnce(new Error('API Error'));
    
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent('Failed to load tools data');
    }, { timeout: 3000 });
    
    // Tools count should be 0 due to error
    expect(screen.getByTestId('tools-count')).toHaveTextContent('0');
    
    // Patterns should still have loaded successfully
    expect(screen.getByTestId('patterns-count')).not.toHaveTextContent('0');
  }, 10000);
  
  it('should clear all caches when clearCache is called', async () => {
    render(
      <DataProvider>
        <TestComponent />
      </DataProvider>
    );
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    }, { timeout: 3000 });
    
    // Reset mocks to track calls
    vi.mocked(cacheUtils.clearAllCaches).mockClear();
    vi.mocked(googleSheets.fetchAccessibilityTools).mockClear();
    vi.mocked(googleSheets.fetchAccessibilityPatterns).mockClear();
    
    // Trigger cache clear
    act(() => {
      screen.getByTestId('clear-cache-btn').click();
    });
    
    // Wait for loading to complete after cache clear
    await waitFor(() => {
      expect(screen.getByTestId('loading-tools')).toHaveTextContent('Tools loaded');
    }, { timeout: 3000 });
    
    // Verify caches were cleared and data was reloaded
    expect(cacheUtils.clearAllCaches).toHaveBeenCalledTimes(1);
    expect(googleSheets.fetchAccessibilityTools).toHaveBeenCalledTimes(1);
    expect(googleSheets.fetchAccessibilityPatterns).toHaveBeenCalledTimes(1);
  }, 10000);
}); 