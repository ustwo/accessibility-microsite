import { Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";
import Grid, { Col } from "../components/Grid";
import { Helmet } from 'react-helmet';
import { useData } from "../context/DataContext";
import Section from "../components/Section";

export default function Index() {
  const { refreshData } = useData();

  // Refresh data when homepage loads
  useEffect(() => {
    // Add slight delay to not block initial render
    const timeoutId = setTimeout(() => {
      refreshData();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [refreshData]);

  return (
    <Layout>
      <Helmet>
        <title>ustwo Accessibility Microsite - Resources for Designers and Developers</title>
        <meta
          name="description"
          content="Helping designers, developers, product owners, and QAs design and deliver accessible digital products and services."
        />
      </Helmet>

      <Section header aria-labelledby="hero-heading">
        <Grid>
          <Col span={8} start={1}>
            <h1 id="hero-heading">
              Helping teams build better, more inclusive digital experiences
            </h1>
          </Col>
        </Grid>
        <Grid>
          <Col span={6} start={1}>
            <p className="introText">
              Resources and tools for designers, developers, product managers and QAs built around ustwo’s five inclusivity principles.
            </p>
          </Col>
        </Grid>
      </Section>

      <Section id="principles" padding="bottom">
        <div className="principles-row homepage-principles">
          <div className="principle-card">
            <h2><span className="principle-emoji">⭐</span> Level-up your gear</h2>
            <p className="smallBodyText">
              Just use the tools. There is a wealth of accessibility testing
              tools—contrast checkers, checklists, simulators. Use them to
              ensure your work meets basic accessibility standards.
            </p>
            <Link to="/tools" className="callToAction">
              Recommended tools
            </Link>
          </div>

          <div className="principle-card">
            <h2><span className="principle-emoji">🎨</span> Enjoy the patterns</h2>
            <p className="smallBodyText">
              An accessible design pattern is a repeatable solution that
              solves a common accessibility problem. Even the most original
              designers don&apos;t need to reinvent the tooltip.
            </p>
            <Link to="/patterns" className="callToAction callToAction--red">
              Pattern library
            </Link>
          </div>

          <div className="principle-card">
            <h2><span className="principle-emoji">⌨️</span> Think beyond touch</h2>
            <p className="smallBodyText">
              Try navigating your product using only a keyboard—it&apos;s a great
              way to test for perceivability, operability, and robustness.
            </p>
            <Link to="/checklist" className="callToAction callToAction--blue">
              Accessibility checklist
            </Link>
          </div>

          <div className="principle-card">
            <h2><span className="principle-emoji">🙈</span> Close your eyes</h2>
            <p className="smallBodyText">
              Everyone should learn and regularly test using at least one
              screen reader. If it works with a keyboard, there&apos;s a good
              chance it&apos;ll work with assistive tech.
            </p>
            <Link to="/screen-reader-guide" className="callToAction callToAction--yellow">
              Screenreader tutorial
            </Link>
          </div>

          <div className="principle-card">
            <h2><span className="principle-emoji">🎉</span> Party party (test) party!</h2>
            <p className="smallBodyText">
              Accessibility testing isn&apos;t just for QA. Get the team together,
              test on different devices, and wherever possible, test with real
              users with access needs.
            </p>
            <a href="/testing-templates" className="callToAction callToAction--lightBlue">
              Testing templates
            </a>
          </div>
        </div>
      </Section>
    </Layout>
  );
} 