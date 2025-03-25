import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';

export default function TestSheets() {
  return (
    <Layout title="Test Sheets">
      <Helmet>
        <title>Test Sheets - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Accessibility testing sheets and templates."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="test-sheets-heading">
        <div className="container container-content">
          <h2 id="test-sheets-heading">Accessibility Testing Sheets</h2>
          <p className="intro-text">
            Use these sheets to document and track your accessibility testing.
          </p>
          
          {/* Test sheets content would go here */}
          <div className="test-sheets-content">
            <p>Test sheets content will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 