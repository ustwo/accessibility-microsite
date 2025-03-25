import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { fetchAccessibilityTools, type AccessibilityTool } from "~/utils/edgeGoogleSheets";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { BackLink } from "~/components/BackLink";

// Define types for our loader response
type LoaderSuccessData = {
  success: true;
  message: string;
  elapsedTime: string;
  isMockData: boolean;
  toolCount: number;
  sampleData: AccessibilityTool[];
};

type LoaderErrorData = {
  success: false;
  message: string;
  isMockData: boolean;
  toolCount: number;
  sampleData: never[];
  elapsedTime?: string;
};

type LoaderData = LoaderSuccessData | LoaderErrorData;

export async function loader() {
  try {
    // Start timer
    const startTime = Date.now();
    
    // Try to fetch tools from Google Sheets
    const tools = await fetchAccessibilityTools();
    
    // Calculate elapsed time
    const elapsedTime = Date.now() - startTime;
    
    return json<LoaderSuccessData>({
      success: true,
      message: 'Successfully fetched data from Google Sheets',
      elapsedTime: `${elapsedTime}ms`,
      isMockData: tools === null || tools.length === 0 || tools[0].id === 'mock-1',
      toolCount: tools?.length || 0,
      sampleData: tools?.slice(0, 2) || []
    });
  } catch (error) {
    return json<LoaderErrorData>({
      success: false,
      message: `Error fetching from Google Sheets: ${error}`,
      isMockData: true,
      toolCount: 0,
      sampleData: [],
      elapsedTime: 'N/A'
    });
  }
}

export default function TestSheetsRoute() {
  const data = useLoaderData<typeof loader>() as LoaderData;
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  
  return (
    <div className="container" style={{ padding: '2rem' }}>
      <h1>Google Sheets Connection Test</h1>
      
      <BackLink to="/sheets-debug" />
      
      {isLoading ? (
        <LoadingSpinner message="Testing Google Sheets connection..." />
      ) : (
        <>
          <div style={{
            padding: '1rem',
            backgroundColor: data.success ? '#e6ffe6' : '#ffe6e6',
            border: `1px solid ${data.success ? 'green' : 'red'}`,
            borderRadius: '4px',
            marginTop: '1rem'
          }}>
            <h3>Status: {data.success ? 'Success' : 'Failed'}</h3>
            <p><strong>Message:</strong> {data.message}</p>
            <p><strong>Elapsed Time:</strong> {data.elapsedTime}</p>
            <p><strong>Using Mock Data:</strong> {data.isMockData ? 'Yes' : 'No'}</p>
            <p><strong>Tool Count:</strong> {data.toolCount}</p>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <h2>Sample Data</h2>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '1rem', 
              overflow: 'auto',
              maxHeight: '400px' 
            }}>
              {JSON.stringify(data.sampleData, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
} 