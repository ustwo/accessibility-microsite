import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';

export default function TestJwt() {
  return (
    <Layout title="JWT Testing">
      <Helmet>
        <title>JWT Testing - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Testing JWT functionality for the accessibility microsite."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="jwt-heading">
        <div className="container container-content">
          <h2 id="jwt-heading">JWT Testing</h2>
          <p className="intro-text">
            This page is for testing JWT functionality.
          </p>
          
          {/* JWT testing content would go here */}
          <div className="jwt-content">
            <p>JWT testing content will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 