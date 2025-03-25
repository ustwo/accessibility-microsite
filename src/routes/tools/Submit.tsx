import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function ToolsSubmit() {
  return (
    <Layout title="Submit a Tool">
      <Helmet>
        <title>Submit a Tool - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Submit your favorite accessibility tool to be featured on our site."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="submit-heading">
        <div className="container container-content">
          <p className="intro-text">
            Share your favorite accessibility tool with the community. We appreciate your contributions!
          </p>
          
          {/* Form would go here */}
          <div className="form-container">
            <p>Submission form will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 