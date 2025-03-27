import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";

export default function TestingTemplatesIndex() {
  return (
    <Layout title="Testing Templates">
      <Helmet>
        <title>Testing Templates - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Accessibility testing templates and review frameworks to ensure comprehensive accessibility testing across your digital products."
        />
      </Helmet>

      <section className="content-section" aria-labelledby="page-title">
        <div className="container container-content">
          <p className="intro-text">
            In line with our fifth principle &ldquo;Party Party (Test)
            Party&rdquo;, we believe testing should be a collaborative and
            enjoyable process that brings teams together to create more
            accessible products.
          </p>

          <figure>
            <img src="/img/testing-template.png" alt="Testing templates" />
            <figcaption>Screenshot of the testing template on Miro</figcaption>
          </figure>

          <p>
            Our accessibility review template provides a structured approach to
            testing digital products across different platforms and interaction
            methods. It&rsquo;s designed to align with ustwo&rsquo;s inclusivity
            principles and ensure comprehensive coverage of accessibility
            requirements.
          </p>

          <div className="template-cta">
            <p>
              Ready to start testing? Access our template on Miro and begin your
              accessibility review journey.
            </p>
            <a
              href="https://miro.com/miroverse/accessibility-audit-issue-tracker/"
              className="button"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Template on Miro
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
}
