import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function TestingTemplatesIndex() {
  return (
    <Layout title="Testing Templates">
      <Helmet>
        <title>Testing Templates - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Testing templates for accessibility testing."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="guide-heading">
        <div className="container container-content">
          <p className="intro-text">
           Testing templates for accessibility testing.
          </p>
          
          {/* Guide content would go here */}
          <div className="guide-content">
            <p>Testing Templates content will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 