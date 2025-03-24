import { Link } from "@remix-run/react";
import { ReactNode } from "react";
import UsTwo from "./UsTwo";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="page-wrapper">
      <header className="site-header" role="banner">
        <div className="container container-content header-inner">
          <a href="/" className="logo" aria-current="page">
            <UsTwo className="fill-current" />
          </a>
          <nav className="site-nav" aria-label="Main navigation">
            <ul>
              <li>
                <Link to="/#principles">Accessibility Principles</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        {title && (
          <div className="page-header bg-primary py-6">
            <div className="container container-content">
              <h1 className="text-light">{title}</h1>
            </div>
          </div>
        )}
        {children}
        <section id="contribute-section" className="content-section bg-secondary" aria-labelledby="contribute-heading">
        <div className="container container-content">
          <h2 id="contribute-heading" className="mb-6 text-light">
            Contribute Your Knowledge
          </h2>
          <p className="mb-6 text-light">
            We welcome contributions from the accessibility community. Share
            your favorite tools or patterns to help others create more
            accessible digital experiences.
          </p>
          <div className="flex gap-4">
            <Link to="/tools/submit" className="button bg-light text-secondary">
              Submit a Tool
            </Link>
            <Link to="/patterns/submit" className="button bg-light text-secondary">
              Submit a Pattern
            </Link>
          </div>
        </div>
      </section>
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="container container-content footer-inner">
          <div className="footer-logo">
            <UsTwo className="fill-current text-light" />
          </div>
          <div className="footer-links">
            <div>
              <h4>Explore</h4>
              <ul>
                <li>
                  <Link to="/tools">Tools</Link>
                </li>
                <li>
                  <Link to="/patterns">Patterns</Link>
                </li>
                <li>
                  <Link to="/screen-reader-guide">Screen Reader Guide</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>Contribute</h4>
              <ul>
                <li>
                  <Link to="/tools/submit">Submit a Tool</Link>
                </li>
                <li>
                  <Link to="/patterns/submit">Submit a Pattern</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>About</h4>
              <ul>
                <li>
                  <a href="https://ustwo.com" target="_blank" rel="noreferrer">
                    ustwo.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
