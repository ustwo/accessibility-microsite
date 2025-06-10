import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Helmet } from "react-helmet";
import Section from "../components/Section";
import Grid, { Col } from "../components/Grid";

export default function About() {
  return (
    <Layout title="About this site">
      <Helmet>
        <title>About this site - ustwo Accessibility Microsite</title>
        <meta
          name="description"
          content="Learn about our commitment to accessibility and inclusive design at ustwo."
        />
      </Helmet>

      <Section aria-labelledby="about-intro" padding="bottom">
        <Grid>
          <Col start={1} span={8}>
            <h2 id="about-intro">Our commitment to accessibility</h2>
            <p>
              At ustwo, we believe that digital experiences should be accessible to everyone. We&apos;re a world-leading digital product studio renowned for creating experiences that delight and empower users. When we craft digital products, we ensure that each user – in all their beautiful diversity – can access the information and services our clients provide.
            </p>
            <p>
              With the European Accessibility Act (EAA) coming into effect in June 2025, we&apos;re excited to lead the way in making digital products accessible to all. This site represents our commitment to sharing knowledge and best practices with the wider community.
            </p>
          </Col>
        </Grid>
      </Section>

      <Section aria-labelledby="about-principles" padding="bottom">
        <Grid>
          <Col start={1} span={8}>
            <h2 id="about-principles">Our inclusivity principles</h2>
            <p>
              We&apos;ve developed a set of guiding principles to help teams create accessible digital experiences. These principles are designed to be practical, engaging, and effective:
            </p>
            <ul>
              <li><Link to="/tools">Level-up your gear</Link> - Discover the best tools for accessibility testing and development</li>
              <li><Link to="/patterns">Enjoy the patterns</Link> - Learn from proven accessibility patterns and solutions</li>
              <li><Link to="/checklist">Think beyond touch</Link> - Consider all interaction methods and user needs</li>
              <li><Link to="/screen-reader-guide">Close your eyes</Link> - Master screen reader testing and optimization</li>
              <li><Link to="/testing-templates">Party party (test) party</Link> - Make testing fun and thorough</li>
            </ul>
          </Col>
        </Grid>
      </Section>

      <Section aria-labelledby="about-facts" padding="bottom">
        <Grid>
          <Col start={1} span={8}>
            <h2 id="about-facts">Why accessibility matters</h2>
            <ul>
              <li>Inclusive design improves the experience for everyone</li>
              <li>Accessibility and innovation go hand in hand</li>
              <li>Building for accessibility from the start saves time and resources</li>
            </ul>
          </Col>
        </Grid>
      </Section>

      <Section aria-labelledby="about-examples" padding="bottom">
        <Grid>
          <Col start={1} span={8}>
            <h2 id="about-examples">Real-world impact</h2>
            <p>
              Our commitment to accessibility has led to significant achievements:
            </p>
            <ul>
              <li>Fully accessible apps like Bodycoach and Spotscan</li>
              <li>Accessible payment flows handling billions in transactions</li>
              <li>Comprehensive design systems with accessibility built-in</li>
            </ul>
          </Col>
        </Grid>
      </Section>
    </Layout>
  );
} 