import { useState } from "react";
import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import { testJwtGeneration } from "../utils/googleSheets";
import Section from "../components/Section";
import Grid, { Col } from "../components/Grid";

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
    <Layout title="Test JWT">
      <Helmet>
        <title>Test JWT - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Test JWT token functionality."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <h2 id="jwt-heading">JWT Token Test</h2>
            <p className="intro-text">
              Test JWT token functionality and authentication.
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
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 