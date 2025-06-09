import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import Section from "../components/Section";
import Grid, { Col } from "../components/Grid";

export default function TestSteps() {
  return (
    <Layout title="Test Steps">
      <Helmet>
        <title>Test Steps - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Step-by-step guide for accessibility testing."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <h2 id="test-steps-heading">Accessibility Testing Steps</h2>
            <p className="intro-text">
              Follow these steps to conduct thorough accessibility testing.
            </p>
            
            {/* Test steps content would go here */}
            <div className="test-steps-content">
              <p>Test steps content will be here</p>
            </div>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 