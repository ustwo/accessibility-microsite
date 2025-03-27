import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function ChecklistIndex() {
  return (
    <Layout title="Accessibility Checklist">
      <Helmet>
        <title>Accessibility Checklist - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Interactive accessibility checklist and tools guide to help ensure your digital products meet accessibility standards."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="page-header">
        <div className="container container-content">
          <p className="intro-text">
            Our comprehensive accessibility checklist helps you ensure your digital products 
            meet accessibility standards. Use this interactive guide to review and track your progress.
          </p>

          <div 
            className="checklist-iframe-container"
            role="region" 
            aria-label="Interactive Accessibility Checklist"
          >
            <iframe
              className="checklist-iframe"
              src="https://embed.figma.com/design/fIdhHFVcBYnXAvD5xdXgf5/Accessibility-Tools?node-id=41-1062&embed-host=share"
              title="Accessibility Checklist Figma"
              aria-label="Interactive accessibility checklist embedded from Figma"
              allowFullScreen
            />
          </div>

          <a 
            href="https://www.figma.com/design/fIdhHFVcBYnXAvD5xdXgf5/Accessibility-Tools?node-id=41-1062"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open accessibility checklist in Figma (opens in new tab)"
          >
            View checklist directly in Figma
          </a>
        </div>
      </section>
    </Layout>
  );
} 