import { useState } from "react";
import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import { testJwtGeneration } from "../utils/googleSheets";

export default function TestJwt() {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    jwt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTestJwt = async () => {
    try {
      setLoading(true);
      const testResult = await testJwtGeneration();
      setResult(testResult);
    } catch (error) {
      console.error("Error testing JWT:", error);
      setResult({
        success: false,
        message: `Error: ${error instanceof Error ? error.message : String(error)}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="JWT Testing">
      <Helmet>
        <title>JWT Testing - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Testing JWT functionality for the accessibility microsite."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="jwt-heading">
        <div className="container container-content">
          <h2 id="jwt-heading">JWT Testing</h2>
          <p className="intro-text">
            This page is for testing JWT generation for Google API authentication.
          </p>
          
          <div className="test-container">
            <button
              className="button"
              onClick={handleTestJwt}
              disabled={loading}
            >
              {loading ? "Testing..." : "Test JWT Generation"}
            </button>
            
            {result && (
              <div className={`result-box ${result.success ? "success" : "error"}`}>
                <h3>{result.success ? "Success" : "Failed"}</h3>
                <p>{result.message}</p>
                {result.jwt && (
                  <div className="jwt-sample">
                    <p><strong>JWT Sample:</strong> {result.jwt}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="info-box mt-6">
              <h3>About JWT Authentication</h3>
              <p>
                JWT (JSON Web Token) is used to authenticate with Google APIs. 
                This test verifies that the application can generate a valid JWT
                using the service account credentials.
              </p>
              <p>
                If this test fails, check that your service account credentials
                are correctly configured in the environment variables.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
} 