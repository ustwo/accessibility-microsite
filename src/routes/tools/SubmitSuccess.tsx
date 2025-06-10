import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import Section from "../../components/Section";
import Grid, { Col } from "../../components/Grid";

export default function ToolsSubmitSuccess() {
  return (
    <Layout title="Tool Submitted Successfully">
      <Helmet>
        <title>Tool Success - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Your tool submission has been received successfully."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={6}>
            <h2 id="success-heading">Your tool has been submitted successfully!</h2>
            <p className="mb-6">
              Thank you for your submission. We&apos;ll review it shortly.
            </p>
            <Link to="/tools" className="button">
              Back to Tools
            </Link>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
}
 