import { Link, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import UsTwo from "./UsTwo";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper function to check if a link path matches the current path
  const isCurrentPage = (linkPath: string) => {
    // Remove trailing slashes for comparison
    const cleanCurrentPath = currentPath.replace(/\/$/, '');
    const cleanLinkPath = linkPath.replace(/\/$/, '');
    return cleanCurrentPath === cleanLinkPath;
  };

  return (
    <div className="page-wrapper">
      <header className="site-header bg-dark-theme" role="banner">
        <div className="container container-content header-inner">
          <Link 
            to="/" 
            className="logo" 
            aria-current={currentPath === "/" ? "page" : undefined}
          >
            <UsTwo className="fill-current" />
          </Link>
          <nav className="site-nav" aria-label="Main navigation">
            <ul>
              <li>
                <Link to="/#principles">
                  Accessibility Principles
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        {title && (
          <div className="page-header py-6">
            <div className="container container-content">
              <h1 className="text-light">{title}</h1>
            </div>
          </div>
        )}
        {children}
        <section
          className="content-section contribute-section"
          aria-labelledby="contribute-heading"
        >
          <div className="container container-content">
            <h2 id="contribute-heading" className="mb-6">
              Contribute Your Knowledge
            </h2>
            <p className="mb-6">
              We welcome contributions from the accessibility community. Share
              your favorite tools or patterns to help others create more
              accessible digital experiences.
            </p>
            <div className="flex gap-4">
              <Link to="/tools/submit" className="button">
                Submit a Tool
              </Link>
              <Link to="/patterns/submit" className="button">
                Submit a Pattern
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer bg-dark-theme" role="contentinfo">
        <div className="container container-content footer-inner">
          <div className="footer-logo">
            <UsTwo className="fill-current text-light" />
          </div>
          <div className="footer-links">
            <div>
              <h4>Principles</h4>
              <ol>
                <li>
                  <Link to="/tools">Level-up your gear</Link>
                </li>
                <li>
                  <Link to="/patterns">Enjoy the patterns</Link>
                </li>
                <li>
                  <Link to="/checklist">Think beyond touch</Link>
                </li>
                <li>
                  <Link to="/screen-reader-guide">Close your eyes</Link>
                </li>
                <li>
                  <Link to="/testing-templates">Party party (test) party</Link>
                </li>
              </ol>
            </div>
            <div>
              <h4>Resources</h4>
              <ul>
                <li>
                  <Link 
                    to="/tools" 
                    aria-current={isCurrentPage("/tools") ? "page" : undefined}
                  >
                    Tools
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/patterns" 
                    aria-current={isCurrentPage("/patterns") ? "page" : undefined}
                  >
                    Patterns
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/checklist" 
                    aria-current={isCurrentPage("/checklist") ? "page" : undefined}
                  >
                    Checklist
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/screen-reader-guide" 
                    aria-current={isCurrentPage("/screen-reader-guide") ? "page" : undefined}
                  >
                    Screen reader guide
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/testing-templates" 
                    aria-current={isCurrentPage("/testing-templates") ? "page" : undefined}
                  >
                    Testing templates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4>Contribute</h4>
              <ul>
                <li>
                  <Link 
                    to="/tools/submit" 
                    aria-current={isCurrentPage("/tools/submit") ? "page" : undefined}
                  >
                    Submit a Tool
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/patterns/submit" 
                    aria-current={isCurrentPage("/patterns/submit") ? "page" : undefined}
                  >
                    Submit a Pattern
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 