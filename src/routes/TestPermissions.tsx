import { useState } from "react";
import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import { checkSheetPermission } from "../utils/googleSheets";
import Section from "../components/Section";
import Grid, { Col } from "../components/Grid";

export default function TestPermissions() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    sheets?: string[];
  } | null>(null);

  const handleTestPermissions = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const toolsSheetId = import.meta.env.VITE_GOOGLE_TOOLS_SHEET_ID;
      if (!toolsSheetId) {
        setResult({
          success: false,
          message: 'No tools sheet ID configured'
        });
        return;
      }
      
      const testResult = await checkSheetPermission(toolsSheetId);
      setResult({
        success: testResult.hasAccess,
        message: testResult.message
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Error testing permissions: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Test Permissions">
      <Helmet>
        <title>Test Permissions - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Test Google Sheets API permissions."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <h2 id="permissions-heading">Google Sheets Permissions Test</h2>
            <p className="intro-text">
              Test the Google Sheets API permissions and access.
            </p>
            
            {/* Test permissions content */}
            <div className="test-container">
              <button
                className="button"
                onClick={handleTestPermissions}
                disabled={loading}
              >
                {loading ? "Testing..." : "Test Permissions"}
              </button>
              
              {result && (
                <div className={`result-box ${result.success ? "success" : "error"}`}>
                  <h3>{result.success ? "Success" : "Failed"}</h3>
                  <p>{result.message}</p>
                  {result.sheets && (
                    <div className="sheets-list">
                      <p><strong>Available sheets:</strong></p>
                      <ul>
                        {result.sheets.map((sheet, index) => (
                          <li key={index}>{sheet}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              <div className="info-box mt-6">
                <h3>About Permissions Testing</h3>
                <p>
                  This test verifies that the service account has the necessary
                  permissions to access the Google Sheets used by the application.
                </p>
                <p>
                  If this test fails, check that the service account email has been
                  granted appropriate access to the spreadsheet.
                </p>
              </div>
            </div>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 