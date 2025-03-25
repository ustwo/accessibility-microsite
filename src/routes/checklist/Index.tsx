import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function ChecklistIndex() {
  return (
    <Layout title="Checklist">
      <Helmet>
        <title>Checklist - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Checklist for accessibility testing."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="guide-heading">
        <div className="container container-content">
          <p className="intro-text">
           Checklist for accessibility testing.
          </p>
          
          {/* Guide content would go here */}
          <div className="guide-content">
            <p>Checklist content will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 