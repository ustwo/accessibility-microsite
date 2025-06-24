import { Link, useLocation } from "react-router-dom";
import { ReactNode, useState } from "react";
import UsTwo from "./UsTwo";
import Grid, { Col } from "./Grid";
import Section from "./Section";
import DarkModeToggle from "./DarkModeToggle";
import MobileNavButton from "./MobileNavButton";
import MobileNavOverlay from "./MobileNavOverlay";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  introText?: string;
  theme?: string;
}

export default function Layout({ children, title, introText, theme }: LayoutProps) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper function to check if a link path matches the current path
  const isCurrentPage = (linkPath: string) => {
    // Remove trailing slashes for comparison
    const cleanCurrentPath = currentPath.replace(/\/$/, '');
    const cleanLinkPath = linkPath.replace(/\/$/, '');
    return cleanCurrentPath === cleanLinkPath;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className={`page-wrapper ${theme ? `theme-${theme}` : ''}`}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header className="site-header" role="banner">
        <div className="header-inner">          
          <Link 
            to="/" 
            className="site-logo" 
            aria-current={currentPath === "/" ? "page" : undefined}
          >
            <UsTwo className="logo-svg" />
            <div className="accessibility-text">Accessibility</div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="site-nav-wrapper desktop-nav">
            <nav className="site-nav" aria-label="Main navigation">
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
            </nav>
            <DarkModeToggle />
          </div>

          {/* Mobile Navigation Button */}
          <div className="mobile-nav-wrapper">
            <MobileNavButton 
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
              ariaControls="mobile-nav-menu"
            />
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileNavOverlay 
        isOpen={isMobileMenuOpen}
        onClose={closeMobileMenu}
        id="mobile-nav-menu"
      />

      <main id="main-content" className="site-main">
        {title && (
          <Section header>
            <Grid>
              <Col start={1} span={12}>
                <h1 className="h1 colorOffBlack" id="page-header">{title}</h1>
              </Col>
            </Grid>
            <Grid>
              <Col start={1} span={6}>
                {introText && <p className="introText">{introText}</p>}
              </Col>
            </Grid>
          </Section>
        )}
        {children}
      </main>

      <footer className="site-footer backgroundOffBlack lightOnDark" role="contentinfo">
        <Section lightOnDark backgroundColor="offBlack" padding="both">
          <Grid>
            <Col start={1} span={12}>
              <div className="company-footer">

                <ul className="company-links">
                  <li>
                  <div className="company-logo">
                  <span>Copyright © ustwo Ltd 2025. All rights reserved.</span>
                </div>
                  </li>
                  <li><a href="https://ustwo.com/legal/" target="_blank" rel="noopener noreferrer">Legal</a></li>
                  <li><a href="https://ustwo.com/privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy<span className="hideOnTinyScreens"> Policy</span></a></li>
                  <li><Link aria-current={isCurrentPage("/about") ? "page" : undefined} to="/about">About this site</Link></li>
                </ul>
                <div className="social-icons">
                  <div>
                    <a href="https://instagram.com/ustwo" target="_blank" rel="noopener noreferrer" aria-label="Follow ustwo on Instagram">
                      <span className="icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"></path>
                        </svg>
                      </span>
                    </a>
                  </div>
                  <div>
                    <a href="https://linkedin.com/company/ustwo-" target="_blank" rel="noopener noreferrer" aria-label="Follow ustwo on LinkedIn">
                      <span className="icon" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"></path>
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </Col>
          </Grid>
        </Section>
      </footer>
    </div>
  );
} 