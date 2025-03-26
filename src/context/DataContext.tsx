import { createContext, ReactNode, useContext, useState, useEffect } from 'react';
import { 
  AccessibilityTool, 
  AccessibilityPattern, 
  fetchAccessibilityTools, 
  fetchAccessibilityPatterns 
} from '../utils/googleSheets';
import { clearAllCaches } from '../utils/cacheUtils';

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
      setIsLoadingTools(true);
      // Clear cache if forceRefresh is true
      if (forceRefresh) {
        console.log('Forcing refresh of tools data - clearing cache');
        clearAllCaches();
      }
      
      const data = await fetchAccessibilityTools();
      console.log('Loaded tools:', data);
      setTools(data);
    } catch (err) {
      console.error('Error loading tools:', err);
      setError('Failed to load tools data');
    } finally {
      setIsLoadingTools(false);
    }
  };

  // Function to load patterns data
  const loadPatterns = async () => {
    try {
      setIsLoadingPatterns(true);
      const data = await fetchAccessibilityPatterns();
      setPatterns(data);
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
    await Promise.all([loadTools(true), loadPatterns()]);
  };

  // Function to clear the cache and reload data
  const clearCache = () => {
    clearAllCaches();
    refreshData();
  };

  // Load data on initial mount, with forced refresh to clear any cached data
  useEffect(() => {
    loadTools(true);
    loadPatterns();
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