import { Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "../components/Layout";
import { Helmet } from 'react-helmet';
import { useData } from "../context/DataContext";

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

      <section className="hero-section content-section" aria-labelledby="hero-heading">
        <div className="container container-content text-center">
          <p className="hero-eyebrow">Accessibility</p>
          <h1 id="hero-heading" className="hero-title">
            Helping teams build better, more inclusive digital experiences
          </h1>
          <p className="hero-subtitle">
            Resources and tools for designers, developers, product managers and
            QAs.
          </p>
        </div>
      </section>

      <section
        id="principles"
        className="principles-section container-full content-section"
        aria-labelledby="principles-heading"
      >
        <h2 id="principles-heading">ustwo&apos;s Inclusivity Principles</h2>
        <div className="principles-row light-background">
          <div className="principle-card">
            <h3>1. Level-up your gear</h3>
            <p>
              Just use the tools. There is a wealth of accessibility testing
              tools—contrast checkers, checklists, simulators. Use them to
              ensure your work meets basic accessibility standards.
            </p>
            <Link to="/tools" className="button">
              recommended tools
            </Link>
          </div>

          <div className="principle-card">
            <h3>2. Enjoy the patterns</h3>
            <p>
              An accessible design pattern is a repeatable solution that
              solves a common accessibility problem. Even the most original
              designers don&apos;t need to reinvent the tooltip.
            </p>
            <Link to="/patterns" className="button">
              pattern library
            </Link>
          </div>

          <div className="principle-card">
            <h3>3. Think beyond touch</h3>
            <p>
              Try navigating your product using only a keyboard—it&apos;s a great
              way to test for perceivability, operability, and robustness.
            </p>
            <a
              href="https://www.w3.org/WAI/WCAG21/quickref/"
              target="_blank"
              rel="noopener noreferrer"
              className="button"
            >
              accessibility checklist
            </a>
          </div>

          <div className="principle-card">
            <h3>4. Close your eyes</h3>
            <p>
              Everyone should learn and regularly test using at least one
              screen reader. If it works with a keyboard, there&apos;s a good
              chance it&apos;ll work with assistive tech.
            </p>
            <Link to="/screen-reader-guide" className="button">
              screenreader tutorial
            </Link>
          </div>

          <div className="principle-card">
            <h3>5. Party party (test) party!</h3>
            <p>
              Accessibility testing isn&apos;t just for QA. Get the team together,
              test on different devices, and wherever possible, test with real
              users with access needs.
            </p>
            <a href="/testing-templates" className="button">
              testing templates
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
} 