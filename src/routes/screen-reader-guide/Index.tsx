import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';

export default function ScreenReaderGuideIndex() {
  return (
    <Layout title="Screen Reader Guide">
      <Helmet>
        <title>Screen Reader Guide - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Learn how to use screen readers for accessibility testing."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="guide-heading">
        <div className="container container-content">
          <p className="intro-text">
            This guide will help you learn how to use screen readers for accessibility testing.
          </p>
          
          {/* Guide content would go here */}
          <div className="guide-content">
            <p>Screen reader guide content will be here</p>
          </div>
        </div>
      </section>
    </Layout>
  );
} 