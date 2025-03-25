import { Link, useLocation } from "react-router-dom";
import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import { useEffect } from "react";

// ScrollToTop component that uses React Router's useLocation
function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
}

export default function ToolsSubmitSuccess() {
  return (
    <Layout title="Thank You for Your Submission">
      <ScrollToTop />
      <Helmet>
        <title>Submission Successful - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Your tool submission has been received successfully."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="success-heading">
        <div className="container container-content text-center">
          <h2 id="success-heading">Your submission has been received!</h2>
          <p className="mb-6">
            Thank you for contributing to the accessibility community. We&apos;ll review your submission shortly.
          </p>
          <div className="button-group">
            <Link to="/tools" className="button">
              Back to Tools
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
 