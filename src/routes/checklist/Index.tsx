import Layout from "../../components/Layout";
import { Helmet } from 'react-helmet';
import Section from "../../components/Section";
import Grid, { Col } from "../../components/Grid";

export default function ChecklistIndex() {
  return (
    <Layout
      title="Accessibility Checklist"
      introText="Our comprehensive accessibility checklist helps you ensure your digital products 
      meet accessibility standards. Use this interactive guide to review and track your progress."
      theme="checklist"
    >
      <Helmet>
        <title>Accessibility Checklist - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Interactive accessibility checklist and tools guide to help ensure your digital products meet accessibility standards."
        />
      </Helmet>

      <Section aria-labelledby="page-header" padding="bottom">
        <Grid>
          <Col start={1} span={12}>
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
              className="button"
            >
              View checklist in Figma
            </a>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 