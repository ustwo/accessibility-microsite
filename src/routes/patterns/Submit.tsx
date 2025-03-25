import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function PatternsSubmit() {
  return (
    <Layout title="Submit a Pattern">
      <Helmet>
        <title>Submit a Pattern - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Submit your favorite accessibility pattern to be featured on our site."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="submit-heading">
        <div className="container container-content">
          <p className="intro-text">
            Share your favorite accessibility pattern with the community. We appreciate your contributions!
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