import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function PatternsIndex() {
  return (
    <Layout title="Accessibility Patterns">
      <Helmet>
        <title>Accessibility Patterns - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="A collection of accessible design patterns recommended by ustwo."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="patterns-heading">
        <div className="container container-content">
          <p className="intro-text">
            These are the design patterns we recommend for creating accessible digital products.
          </p>
          
          {/* Pattern listings would go here */}
          <div className="patterns-grid">
            <p>Pattern listings will be populated here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 