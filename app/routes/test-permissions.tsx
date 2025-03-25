import { json } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { checkSheetPermission } from "~/utils/edgeGoogleSheets";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { BackLink } from "~/components/BackLink";

// Define our loader data type
type SheetPermissionCheck = {
  hasAccess: boolean;
  message: string;
  details?: Record<string, unknown>;
};

type LoaderData = {
  patterns: SheetPermissionCheck;
  tools: SheetPermissionCheck;
};

export async function loader() {
  // Get the sheet IDs from environment variables or use defaults
  const PATTERNS_SHEET_ID = process.env.GOOGLE_PATTERNS_SHEET_ID || '1lxc12mHxlBCuhWEx_r4ce7jr1vPbiwuF_t4xt0RvsEs';
  const TOOLS_SHEET_ID = process.env.GOOGLE_TOOLS_SHEET_ID || '1vjzCZobdvV1tvLy-k38Tpr6AGJX8fs9wKv6tXg55s7k';
  
  // Check permissions for both sheets
  const patternsResult = await checkSheetPermission(PATTERNS_SHEET_ID);
  const toolsResult = await checkSheetPermission(TOOLS_SHEET_ID);
  
  return json<LoaderData>({
    patterns: patternsResult,
    tools: toolsResult
  });
}

export default function TestPermissionsRoute() {
  const data = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  
  // Helper function to render permission check result
  const renderPermissionCheck = (title: string, result: SheetPermissionCheck) => (
    <div style={{
      padding: '1rem',
      backgroundColor: result.hasAccess ? '#e6ffe6' : '#ffe6e6',
      border: `1px solid ${result.hasAccess ? 'green' : 'red'}`,
      borderRadius: '4px',
      marginBottom: '1.5rem'
    }}>
      <h3>{title}: {result.hasAccess ? '✅ Access Granted' : '❌ Access Denied'}</h3>
      <p><strong>Message:</strong> {result.message}</p>
      
      {result.details && (
        <div>
          <h4>Details:</h4>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '0.5rem', 
            overflow: 'auto',
            maxHeight: '200px',
            fontSize: '0.9rem'
          }}>
            {JSON.stringify(result.details, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
  
  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Google Sheets - Permission Check</h1>
      
      <BackLink to="/sheets-debug" />
      
      <div style={{ marginBottom: '2rem' }}>
        <p>
          This test checks if your Google Service Account has permission to access the necessary Google Sheets.
          If access is denied, you&apos;ll need to share the sheets with your service account email address.
        </p>
      </div>
      
      {isLoading ? (
        <LoadingSpinner message="Checking permissions for Google Sheets..." />
      ) : (
        <>
          <div style={{ marginBottom: '2rem' }}>
            <h2>Check Results</h2>
            {renderPermissionCheck("Accessibility Tools Sheet", data.tools)}
            {renderPermissionCheck("Accessibility Patterns Sheet", data.patterns)}
          </div>
          
          {(!data.tools.hasAccess || !data.patterns.hasAccess) && (
            <div style={{ 
              backgroundColor: '#fffde7',
              border: '1px solid #ffd700',
              borderRadius: '4px',
              padding: '1rem',
              marginTop: '2rem'
            }}>
              <h3>How to Fix Permission Issues</h3>
              <ol style={{ lineHeight: '1.6' }}>
                <li>Open the Google Sheets document in your browser</li>
                <li>Click the &quot;Share&quot; button in the top right</li>
                <li>Add your service account email as a collaborator: <code>{data.tools.details?.serviceAccount as string || "Your service account email"}</code></li>
                <li>Give it at least &quot;Viewer&quot; permission</li>
                <li>Click &quot;Send&quot; (you don&apos;t need to actually send an email notification)</li>
                <li>After sharing, wait a minute and then refresh this page to see if the permissions are now working</li>
              </ol>
            </div>
          )}
        </>
      )}
    </div>
  );
} 