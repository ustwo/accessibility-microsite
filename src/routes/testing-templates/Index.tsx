import Layout from "../../components/Layout";
import { Helmet } from "react-helmet";
import Section from "../../components/Section";
import Grid, { Col } from "../../components/Grid";

export default function TestingTemplatesIndex() {
  return (
    <Layout
      title="Testing templates"
      introText="Our fifth and final principle is to party party (test) party. We believe testing should be a collaborative and enjoyable process that brings teams together to create more accessible products."
      theme="testing"
    >
      <Helmet>
        <title>Testing templates - ustwo Accessibility</title>
        <meta
          name="description"
          content="Testing templates and review frameworks to ensure comprehensive accessibility testing across your digital products."
        />
      </Helmet>

      <Section padding="bottom">
        <Grid>
          <Col start={1} span={5}>
            <figure>
              <img src="/img/testing-template.png" alt="Testing templates" />
              <figcaption>
                Screenshot of the testing template on Miro
              </figcaption>
            </figure>
          </Col>
          <Col start={7} span={5}>
            <p>
              Our accessibility review template provides a structured approach
              to testing digital products across different platforms and
              interaction methods. It&rsquo;s designed to align with
              ustwo&rsquo;s inclusivity principles and ensure comprehensive
              coverage of accessibility requirements.
            </p>
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
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
}
