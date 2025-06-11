import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import Section from "../components/Section";
import Grid, { Col } from "../components/Grid";

export default function SheetsDebug() {
  return (
    <Layout title="Sheets Debug">
      <Helmet>
        <title>Sheets Debug - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Debug Google Sheets integration."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <h2 id="sheets-debug-heading">Google Sheets Debug</h2>
            <p className="intro-text">
              Debug information for Google Sheets integration.
            </p>
            
            {/* Debug content would go here */}
            <div className="debug-content">
              <p>Debug content will be here</p>
            </div>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 