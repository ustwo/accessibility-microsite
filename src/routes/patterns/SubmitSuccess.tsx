import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import Section from "../../components/Section";
import Grid, { Col } from "../../components/Grid";

export default function PatternsSubmitSuccess() {
  return (
    <Layout title="Pattern Submitted Successfully">
      <Helmet>
        <title>Pattern Success - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Your pattern submission has been received successfully."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <h2 id="success-heading">Your pattern has been submitted successfully!</h2>
            <p className="mb-6">
              Thank you for your submission. We&apos;ll review it shortly.
            </p>
            <Link to="/patterns" className="button">
              Back to Patterns
            </Link>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 