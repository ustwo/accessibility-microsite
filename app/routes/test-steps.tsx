import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { 
  testJwtGeneration, 
  hasApiCredentials, 
  getAccessToken,
  checkSheetPermission,
  fetchSheetValues
} from "~/utils/edgeGoogleSheets";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { BackLink } from "~/components/BackLink";

// Define result type for tests
type TestResult = {
  success: boolean;
  message: string;
  tokenPreview?: string;
  data?: unknown;
};

type LoaderData = {
  environment: {
    nodeEnv: string | undefined;
    hasCredentials: boolean;
  };
  credentials: TestResult;
  jwt: TestResult;
  accessToken: TestResult;
  sheetsPermissions: {
    tools: TestResult;
    patterns: TestResult;
  };
  sheetsData: TestResult;
};

export async function loader() {
  // Get the sheet IDs from environment variables or use defaults
  const PATTERNS_SHEET_ID = process.env.GOOGLE_PATTERNS_SHEET_ID || '1lxc12mHxlBCuhWEx_r4ce7jr1vPbiwuF_t4xt0RvsEs';
  const TOOLS_SHEET_ID = process.env.GOOGLE_TOOLS_SHEET_ID || '1vjzCZobdvV1tvLy-k38Tpr6AGJX8fs9wKv6tXg55s7k';
  
  // Check environment and credentials
  const hasCredentials = hasApiCredentials();
  
  // Step 1: Validate credentials
  const credentialsResult: TestResult = {
    success: hasCredentials,
    message: hasCredentials 
      ? 'Service account credentials found and parsed successfully' 
      : 'Service account credentials not found or invalid'
  };
  
  // Step 2: Test JWT generation
  const jwtTest = await testJwtGeneration();
  const jwtResult: TestResult = {
    success: jwtTest.success,
    message: jwtTest.message,
    tokenPreview: jwtTest.jwt
  };
  
  // Step 3: Test access token retrieval
  let accessTokenResult: TestResult;
  try {
    const accessToken = await getAccessToken();
    accessTokenResult = {
      success: !!accessToken,
      message: accessToken 
        ? 'Successfully obtained access token' 
        : 'Failed to get access token',
      tokenPreview: accessToken ? `${accessToken.substring(0, 15)}...` : undefined
    };
  } catch (error) {
    accessTokenResult = {
      success: false,
      message: `Error getting access token: ${error}`
    };
  }
  
  // Step 4: Test sheet permissions
  const toolsPermissionCheck = await checkSheetPermission(TOOLS_SHEET_ID);
  const patternsPermissionCheck = await checkSheetPermission(PATTERNS_SHEET_ID);
  
  const toolsPermissionResult: TestResult = {
    success: toolsPermissionCheck.hasAccess,
    message: toolsPermissionCheck.message,
    data: toolsPermissionCheck.details
  };
  
  const patternsPermissionResult: TestResult = {
    success: patternsPermissionCheck.hasAccess,
    message: patternsPermissionCheck.message,
    data: patternsPermissionCheck.details
  };
  
  // Step 5: Test fetching actual sheet data
  let sheetsDataResult: TestResult;
  try {
    const data = await fetchSheetValues(TOOLS_SHEET_ID, 'A1:B2');
    sheetsDataResult = {
      success: !!data,
      message: data 
        ? 'Successfully fetched data from Google Sheets' 
        : 'Failed to fetch data from Google Sheets',
      data: data || undefined
    };
  } catch (error) {
    sheetsDataResult = {
      success: false,
      message: `Error fetching sheet data: ${error}`
    };
  }
  
  return json<LoaderData>({
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasCredentials
    },
    credentials: credentialsResult,
    jwt: jwtResult,
    accessToken: accessTokenResult,
    sheetsPermissions: {
      tools: toolsPermissionResult,
      patterns: patternsPermissionResult
    },
    sheetsData: sheetsDataResult
  });
}

export default function TestStepsRoute() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  
  const renderTestCard = (title: string, result: TestResult, details?: Record<string, unknown>) => (
    <div style={{
      padding: '1rem',
      backgroundColor: result.success ? '#e6ffe6' : '#ffe6e6',
      border: `1px solid ${result.success ? 'green' : 'red'}`,
      borderRadius: '4px',
      marginBottom: '1.5rem'
    }}>
      <h3>{title}: {result.success ? '✅ Success' : '❌ Failed'}</h3>
      <p><strong>Message:</strong> {result.message}</p>
      
      {details && (
        <div>
          <h4>Details:</h4>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '0.5rem', 
            overflow: 'auto',
            maxHeight: '200px',
            fontSize: '0.9rem'
          }}>
            {JSON.stringify(details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Google Sheets Connection - Step by Step Test</h1>
      
      <BackLink to="/sheets-debug" />
      
      {isLoading ? (
        <LoadingSpinner message="Running step-by-step tests..." />
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h2>Environment Info</h2>
            <pre style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '1rem',
              borderRadius: '4px'
            }}>
              {JSON.stringify(data.environment, null, 2)}
            </pre>
          </div>
          
          <div style={{ marginBottom: '2rem' }}>
            <h2>1. Service Account Credentials</h2>
            {renderTestCard(
              "Credentials Check", 
              data.credentials
            )}
            
            <h2>2. JWT Token Generation</h2>
            {renderTestCard(
              "JWT Generation", 
              data.jwt,
              data.jwt.tokenPreview ? { tokenPreview: data.jwt.tokenPreview } : undefined
            )}
            
            <h2>3. OAuth Access Token</h2>
            {renderTestCard(
              "OAuth Token", 
              data.accessToken, 
              data.accessToken.tokenPreview ? { tokenPreview: data.accessToken.tokenPreview } : undefined
            )}
            
            <h2>4. Google Sheets Permissions</h2>
            {renderTestCard(
              "Tools Sheet Permissions", 
              data.sheetsPermissions.tools,
              data.sheetsPermissions.tools.data ? { details: data.sheetsPermissions.tools.data } : undefined
            )}
            
            {renderTestCard(
              "Patterns Sheet Permissions", 
              data.sheetsPermissions.patterns,
              data.sheetsPermissions.patterns.data ? { details: data.sheetsPermissions.patterns.data } : undefined
            )}
            
            <h2>5. Google Sheets Data Fetch</h2>
            {renderTestCard(
              "Sheet Data", 
              data.sheetsData,
              data.sheetsData.data ? { data: data.sheetsData.data } : undefined
            )}
          </div>
        </>
      )}
    </div>
  );
} 