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

        <hr className="footer-divider" />

        <div className="container container-content">
          <div className="company-footer">
            <div className="company-logo">
              <span>ustwo © 2025</span>
            </div>
            <ul className="company-links">
              <li><Link to="https://ustwo.com/legal/">Legal</Link></li>
              <li><Link to="https://ustwo.com/privacy-policy/">Privacy<span className="hideOnTinyScreens"> Policy</span></Link></li>
              <li><Link aria-current={isCurrentPage("/about") ? "page" : undefined} to="/about">About this site</Link></li>
            </ul>
            <div className="social-icons">
              <div>
                <a href="https://instagram.com/ustwo" target="_blank" rel="noopener noreferrer" title="https://instagram.com/ustwo">
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                    </svg>
                  </span>
                </a>
              </div>
              <div>
                <a href="https://linkedin.com/company/ustwo-" target="_blank" rel="noopener noreferrer" title="https://linkedin.com/company/ustwo-">
                  <span className="icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                      <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 