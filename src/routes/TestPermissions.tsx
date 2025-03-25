import { useState } from "react";
import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import { checkSheetPermission } from "../utils/googleSheets";

export default function TestPermissions() {
  const [spreadsheetId, setSpreadsheetId] = useState<string>(
    import.meta.env.VITE_GOOGLE_TOOLS_SHEET_ID || ''
  );
  const [result, setResult] = useState<{
    hasAccess: boolean;
    message: string;
    details?: Record<string, unknown>;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestPermissions = async () => {
    if (!spreadsheetId.trim()) {
      alert('Please enter a spreadsheet ID');
      return;
    }
    
    try {
      setLoading(true);
      const testResult = await checkSheetPermission(spreadsheetId);
      setResult(testResult);
    } catch (error) {
      console.error("Error testing permissions:", error);
      setResult({
        hasAccess: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Permissions Testing">
      <Helmet>
        <title>Permissions Testing - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Testing Google Sheets permissions for the accessibility microsite."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="permissions-heading">
        <div className="container container-content">
          <h2 id="permissions-heading">Google Sheets Permissions Testing</h2>
          <p className="intro-text">
            Test if the application has permission to access a Google Sheet.
          </p>
          
          <div className="test-container">
            <div className="form-group">
              <label htmlFor="spreadsheetId">Spreadsheet ID:</label>
              <input
                type="text"
                id="spreadsheetId"
                value={spreadsheetId}
                onChange={(e) => setSpreadsheetId(e.target.value)}
                placeholder="Enter spreadsheet ID"
                className="form-control"
              />
              <p className="form-help">
                This is the long string in the URL of your Google Sheet, between /d/ and /edit
              </p>
            </div>
            
            <button
              className="button"
              onClick={handleTestPermissions}
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Permissions"}
            </button>
            
            {result && (
              <div className={`result-box ${result.hasAccess ? "success" : "error"}`}>
                <h3>{result.hasAccess ? "Access Granted" : "Access Denied"}</h3>
                <p>{result.message}</p>
                {result.details && (
                  <div className="details">
                    <h4>Details:</h4>
                    <pre>{JSON.stringify(result.details, null, 2)}</pre>
                  </div>
                )}
              </div>
            )}
            
            <div className="info-box mt-6">
              <h3>About Sheet Permissions</h3>
              <p>
                For the Google Sheets integration to work, you need to grant access to 
                the service account email address. You can find this email in your 
                Google Cloud Console under &quot;Service Accounts&quot;.
              </p>
              <p>
                Make sure you&apos;ve shared your Google Sheet with the service account email 
                with at least &quot;Editor&quot; permissions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 