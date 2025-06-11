import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import Section from "../components/Section";
import Grid, { Col } from "../components/Grid";

export default function TestSheets() {
  return (
    <Layout title="Test Sheets">
      <Helmet>
        <title>Test Sheets - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Test Google Sheets API integration."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <h2 id="test-sheets-heading">Test Google Sheets API</h2>
            <p className="intro-text">
              Test the Google Sheets API integration.
            </p>
            
            {/* Test sheets content would go here */}
            <div className="test-sheets-content">
              <p>Test sheets content will be here</p>
            </div>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 