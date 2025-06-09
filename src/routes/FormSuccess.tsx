import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import Section from "../components/Section";
import Grid, { Col } from "../components/Grid";

export default function FormSuccess() {
  return (
    <Layout title="Form Submitted Successfully">
      <Helmet>
        <title>Form Success - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Your form has been submitted successfully."
        />
      </Helmet>

      <Section>
        <Grid>
          <Col start={1} span={12}>
            <h2 id="success-heading">Your form has been submitted successfully!</h2>
            <p className="mb-6">
              Thank you for your submission. We&apos;ll process it shortly.
            </p>
            <Link to="/" className="button">
              Return to Home
            </Link>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 