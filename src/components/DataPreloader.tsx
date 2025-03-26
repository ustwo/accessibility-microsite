import { useEffect, useState } from 'react';
import { fetchAccessibilityTools, fetchAccessibilityPatterns } from '../utils/googleSheets';

/**
 * Component that preloads data from Google Sheets in the background
 * This component renders nothing in the UI
 */
export default function DataPreloader() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function preloadData() {
      if (isLoading) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 Preloading data in the background...');

        // We use Promise.allSettled instead of Promise.all to ensure that if one request fails, 
        // we still get the results from the other
        const results = await Promise.allSettled([
          fetchAccessibilityTools(),
          fetchAccessibilityPatterns()
        ]);

        if (!isMounted) return;
        
        // Log the results
        results.forEach((result, index) => {
          const dataType = index === 0 ? 'tools' : 'patterns';
          if (result.status === 'fulfilled') {
            console.log(`✅ Successfully preloaded ${dataType} data`);
          } else {
            console.error(`❌ Failed to preload ${dataType} data:`, result.reason);
          }
        });
      } catch (error) {
        console.error('Error preloading data:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    // Slight delay to not compete with critical resources during initial page load
    const timeoutId = setTimeout(() => {
      preloadData();
    }, 1500);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, []);

  // This component doesn't render anything
  return null;
} 