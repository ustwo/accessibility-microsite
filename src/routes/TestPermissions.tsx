import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';

export default function TestPermissions() {
  return (
    <Layout title="Permissions Testing">
      <Helmet>
        <title>Permissions Testing - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Testing permissions functionality for the accessibility microsite."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="permissions-heading">
        <div className="container container-content">
          <h2 id="permissions-heading">Permissions Testing</h2>
          <p className="intro-text">
            This page is for testing permissions functionality.
          </p>
          
          {/* Permissions testing content would go here */}
          <div className="permissions-content">
            <p>Permissions testing content will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 