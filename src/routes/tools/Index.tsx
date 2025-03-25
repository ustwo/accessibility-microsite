import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function ToolsIndex() {
  return (
    <Layout title="Accessibility Tools">
      <Helmet>
        <title>Accessibility Tools - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="A collection of accessibility testing and development tools recommended by ustwo."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="tools-heading">
        <div className="container container-content">
          <p className="intro-text">
            These are the tools we recommend for testing and developing accessible digital products.
          </p>
          
          {/* Tool listings would go here */}
          <div className="tools-grid">
            <p>Tool listings will be populated here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 