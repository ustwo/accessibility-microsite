import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';

export default function SheetsDebug() {
  return (
    <Layout title="Sheets Debug">
      <Helmet>
        <title>Sheets Debug - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Debugging Google Sheets integration for the accessibility microsite."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="sheets-debug-heading">
        <div className="container container-content">
          <h2 id="sheets-debug-heading">Sheets Debug</h2>
          <p className="intro-text">
            This page is for debugging Google Sheets integration.
          </p>
          
          {/* Sheets debug content would go here */}
          <div className="sheets-debug-content">
            <p>Sheets debug content will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 