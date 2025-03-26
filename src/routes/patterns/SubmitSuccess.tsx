import { Link } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function PatternsSubmitSuccess() {
  return (
    <Layout title="Thank You!">
      <Helmet>
        <title>Thank You for Your Submission - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Thank you for submitting a pattern to our accessibility resources."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="success-heading">
        <div className="container container-content text-center">
          <h2 id="success-heading">Your submission has been received!</h2>
          <p className="mb-6">
            Thank you for contributing to the accessibility community. We&apos;ll review your submission shortly.
          </p>
          <div className="button-group">
            <Link to="/patterns" className="button">
              Back to Patterns
            </Link>
            <Link to="/" className="button button-secondary">
              Return Home
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
} 