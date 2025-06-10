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
              Resources and tools for designers, developers, product managers and QAs built around <strong>ustwo's five inclusivity principles</strong>.
            </p>
          </Col>
        </Grid>
      </Section>

      <Section id="principles" padding="bottom">
          <Link to="/tools" className="principle-card-link">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div className="h1 colorDarkGrey">1</div>
              </Col>
              <Col start={2} span={3}>
              <h2 className="h2Biggest">Level-up your gear</h2>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Use accessibility testing
                  tools (contrast checkers, checklists, simulators) to
                  ensure your work meets basic accessibility standards.
                </p>
                <div className="callToAction">
                  <span className="principle-emoji">⭐</span> Recommended tools
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/patterns" className="principle-card-link">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div className="h1 colorDarkGrey">2</div>
              </Col>
              <Col start={2} span={3}>
              <h2 className="h2Biggest">Enjoy the patterns</h2>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  An accessible design pattern is a repeatable solution that
                  solves a common accessibility problem.
                </p>
                <div className="callToAction callToAction--red">
                  <span className="principle-emoji">🎨</span> Pattern library
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/checklist" className="principle-card-link">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div className="h1 colorDarkGrey">3</div>
              </Col>
              <Col start={2} span={3}>
              <h2 className="h2Biggest">Think beyond touch</h2>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Try navigating your product using only a keyboard — it's a great
                  way to test for perceivability, operability, and robustness.
                </p>
                <div className="callToAction callToAction--blue">
                  <span className="principle-emoji">⌨️</span> Accessibility checklist
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/screen-reader-guide" className="principle-card-link">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div className="h1 colorDarkGrey">4</div>
              </Col>
              <Col start={2} span={3}>
              <h2 className="h2Biggest">Close your eyes</h2>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Learn and regularly test using at least one
                  screen reader. If it works with a keyboard, there&apos;s a good
                  chance it&apos;ll work with assistive tech.
                </p>
                <div className="callToAction callToAction--yellow">
                  <span className="principle-emoji">🙈</span> Screenreader tutorial
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/testing-templates" className="principle-card-link">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div className="h1 colorDarkGrey">5</div>
              </Col>
              <Col start={2} span={3}>
              <h2 className="h2Biggest">Party party (test) party!</h2>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Not just for QA. Get the team together,
                  test on different devices, and wherever possible, test with real
                  users with access needs.
                </p>
                <div className="callToAction callToAction--lightBlue">
                  <span className="principle-emoji">🎉</span> Testing templates
                </div>
              </Col>
            </Grid>
          </Link>
      </Section>
    </Layout>
  );
} 