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

      <Section id="principles" padding="bottom" aria-labelledby="principles-heading">
        <Grid>
          <Col start={1} span={12}>
            <h2 id="principles-heading" className="sr-only">ustwo's Five Accessibility Principles</h2>
          </Col>
        </Grid>
          <Link to="/tools" className="principle-card-link" aria-label="Go to recommended accessibility tools - Level-up your gear">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div 
                  className="principle-icon" 
                  data-icon="arrow"
                  style={{ backgroundImage: 'url(/img/animate-icon-arrow.png)' }}
                  aria-hidden="true"
                />
              </Col>
              <Col start={2} span={3}>
              <h3 className="h2Biggest">Level-up your gear</h3>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Use accessibility testing
                  tools (contrast checkers, checklists, simulators) to
                  ensure your work meets basic accessibility standards.
                </p>
                <div className="callToAction" aria-hidden="true">
                  Recommended tools
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/patterns" className="principle-card-link" aria-label="Go to accessibility pattern library - Enjoy the patterns">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div 
                  className="principle-icon" 
                  data-icon="plus"
                  style={{ backgroundImage: 'url(/img/animate-icon-plus2.png)' }}
                  aria-hidden="true"
                />
              </Col>
              <Col start={2} span={3}>
              <h3 className="h2Biggest">Enjoy the patterns</h3>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  An accessible design pattern is a repeatable solution that
                  solves a common accessibility problem.
                </p>
                <div className="callToAction callToAction--red" aria-hidden="true">
                  Pattern library
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/checklist" className="principle-card-link" aria-label="Go to accessibility checklist - Think beyond touch">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div 
                  className="principle-icon" 
                  data-icon="tick"
                  style={{ backgroundImage: 'url(/img/animate-icon-tick.png)' }}
                  aria-hidden="true"
                />
              </Col>
              <Col start={2} span={3}>
              <h3 className="h2Biggest">Think beyond touch</h3>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Try navigating your product using only a keyboard — it's a great
                  way to test for perceivability, operability, and robustness.
                </p>
                <div className="callToAction callToAction--blue" aria-hidden="true">
                  Accessibility checklist
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/screen-reader-guide" className="principle-card-link" aria-label="Go to screen reader tutorial - Close your eyes">
            <Grid className="principle-card">
              <Col start={1} span={1}>
                <div 
                  className="principle-icon" 
                  data-icon="blink"
                  style={{ backgroundImage: 'url(/img/animate-icon-blink.png)' }}
                  aria-hidden="true"
                />
              </Col>
              <Col start={2} span={3}>
              <h3 className="h2Biggest">Close your eyes</h3>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Learn and regularly test using a screen reader. If it works with a keyboard, there&apos;s a good
                  chance it&apos;ll work with assistive tech.
                </p>
                <div className="callToAction callToAction--yellow" aria-hidden="true">
                  Screenreader tutorial
                </div>
              </Col>
            </Grid>
          </Link>

          <Link to="/testing-templates" className="principle-card-link" aria-label="Go to testing templates - Party party test party">
            <Grid className="principle-card principle-card-no-border">
              <Col start={1} span={1}>
                <div 
                  className="principle-icon" 
                  data-icon="click"
                  style={{ backgroundImage: 'url(/img/animate-icon-click.png)' }}
                  aria-hidden="true"
                />
              </Col>
              <Col start={2} span={3}>
              <h3 className="h2Biggest">Party party (test) party!</h3>
              </Col>
              <Col start={5} span={5}>
                <p className="smallBodyText">
                  Not just for QA. Get the team together,
                  test on different devices, and wherever possible, test with real
                  users with access needs.
                </p>
                <div className="callToAction callToAction--lightBlue" aria-hidden="true">
                  Testing templates
                </div>
              </Col>
            </Grid>
          </Link>
      </Section>
    </Layout>
  );
} 