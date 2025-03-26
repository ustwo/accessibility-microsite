import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { 
  AccessibilityTool, 
  AccessibilityPattern, 
  fetchAccessibilityTools, 
  fetchAccessibilityPatterns 
} from '../utils/googleSheets';
import { clearAllCaches } from '../utils/cacheUtils';

// Track when the last data load occurred at the application level
// to prevent excessive API calls across page loads
const lastLoadTimestamps = {
  tools: 0,
  patterns: 0,
};

// Minimum time between forced refreshes (10 minutes)
const MIN_REFRESH_INTERVAL = 10 * 60 * 1000;

// Define the context shape
interface DataContextType {
  tools: AccessibilityTool[];
  patterns: AccessibilityPattern[];
  isLoadingTools: boolean;
  isLoadingPatterns: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  clearCache: () => void;
}

// Create the context with default values
const DataContext = createContext<DataContextType>({
  tools: [],
  patterns: [],
  isLoadingTools: false,
  isLoadingPatterns: false,
  error: null,
  refreshData: async () => {},
  clearCache: () => {}
});

// Hook for easy context consumption
export const useData = () => useContext(DataContext);

interface DataProviderProps {
  children: ReactNode;
}

// Provider component
export function DataProvider({ children }: DataProviderProps) {
  const [tools, setTools] = useState<AccessibilityTool[]>([]);
  const [patterns, setPatterns] = useState<AccessibilityPattern[]>([]);
  const [isLoadingTools, setIsLoadingTools] = useState<boolean>(false);
  const [isLoadingPatterns, setIsLoadingPatterns] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Function to load tools data
  const loadTools = async (forceRefresh = false) => {
    try {
      // Check if a refresh was performed recently
      const now = Date.now();
      const timeSinceLastLoad = now - lastLoadTimestamps.tools;
      
      // Only clear cache if forceRefresh is true AND it's been long enough since the last refresh
      const shouldClearCache = forceRefresh && timeSinceLastLoad > MIN_REFRESH_INTERVAL;
      
      if (shouldClearCache) {
        console.log(`Forcing refresh of tools data - clearing cache (last refresh was ${Math.round(timeSinceLastLoad/1000)}s ago)`);
        // Only clear tool-related caches, not everything
        try {
          // Clear matching cache entries
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('tools') || key.includes('sheets_data'))) {
              localStorage.removeItem(key);
            }
          }
        } catch (err) {
          console.error('Error clearing specific caches:', err);
        }
      } else if (forceRefresh) {
        console.log(`Skipping cache clear - last refresh was only ${Math.round(timeSinceLastLoad/1000)}s ago`);
      }
      
      setIsLoadingTools(true);
      const data = await fetchAccessibilityTools();
      console.log('Loaded tools:', data);
      setTools(data);
      
      // Update the last load timestamp
      lastLoadTimestamps.tools = Date.now();
    } catch (err) {
      console.error('Error loading tools:', err);
      setError('Failed to load tools data');
    } finally {
      setIsLoadingTools(false);
    }
  };

  // Function to load patterns data
  const loadPatterns = async (forceRefresh = false) => {
    try {
      // Check if a refresh was performed recently
      const now = Date.now();
      const timeSinceLastLoad = now - lastLoadTimestamps.patterns;
      
      // Only clear cache if forceRefresh is true AND it's been long enough
      const shouldClearCache = forceRefresh && timeSinceLastLoad > MIN_REFRESH_INTERVAL;
      
      if (shouldClearCache) {
        console.log(`Forcing refresh of patterns data - clearing cache (last refresh was ${Math.round(timeSinceLastLoad/1000)}s ago)`);
        // Only clear pattern-related caches
        try {
          // Clear matching cache entries
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('patterns') || key.includes('sheets_data'))) {
              localStorage.removeItem(key);
            }
          }
        } catch (err) {
          console.error('Error clearing specific caches:', err);
        }
      } else if (forceRefresh) {
        console.log(`Skipping cache clear - last refresh was only ${Math.round(timeSinceLastLoad/1000)}s ago`);
      }
      
      setIsLoadingPatterns(true);
      const data = await fetchAccessibilityPatterns();
      setPatterns(data);
      
      // Update the last load timestamp
      lastLoadTimestamps.patterns = Date.now();
    } catch (err) {
      console.error('Error loading patterns:', err);
      setError('Failed to load patterns data');
    } finally {
      setIsLoadingPatterns(false);
    }
  };

  // Function to refresh all data (used after form submissions or manual refresh)
  const refreshData = async () => {
    setError(null);
    await Promise.all([loadTools(true), loadPatterns(true)]);
  };

  // Function to clear the cache and reload data
  const clearCache = () => {
    clearAllCaches();
    refreshData();
  };

  // Load data on initial mount - don't force refresh to use cache if available
  useEffect(() => {
    loadTools(false);
    loadPatterns(false);
  }, []);

  // Context value
  const value = {
    tools,
    patterns,
    isLoadingTools,
    isLoadingPatterns,
    error,
    refreshData,
    clearCache
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
} 