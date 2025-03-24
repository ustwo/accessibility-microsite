import { Link } from "@remix-run/react";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="page-wrapper">
      <header className="site-header bg-dark py-4">
        <div className="container flex justify-between items-center">
          <div className="site-logo">
            <Link to="/" className="flex items-center gap-2">
              {/* <img src="/logo-light.png" alt="ustwo logo" className="h-8" /> */}
              <span className="text-light font-bold">Accessibility</span>
            </Link>
          </div>
          <nav aria-label="Main navigation">
            <ul className="flex gap-6">
              <li>
                <Link to="/" className="text-light hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tools" className="text-light hover:text-primary">
                  Tools
                </Link>
              </li>
              <li>
                <Link to="/patterns" className="text-light hover:text-primary">
                  Patterns
                </Link>
              </li>
              <li>
                <Link
                  to="/screen-reader-guide"
                  className="text-light hover:text-primary"
                >
                  Screen Reader Guide
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main id="main-content" className="site-main">
        {title && (
          <div className="page-header bg-primary py-6">
            <div className="container">
              <h1 className="text-light">{title}</h1>
            </div>
          </div>
        )}
        <div className="container py-8">{children}</div>
      </main>

      <footer className="site-footer bg-dark py-8">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h2 className="text-light text-xl mb-4">ustwo Accessibility</h2>
              <p className="text-light">
                Helping designers, developers, product owners, and QAs design
                and deliver accessible digital products and services.
              </p>
            </div>
            <div>
              <h2 className="text-light text-xl mb-4">Quick Links</h2>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link to="/" className="text-light hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/tools" className="text-light hover:text-primary">
                    Tools
                  </Link>
                </li>
                <li>
                  <Link
                    to="/patterns"
                    className="text-light hover:text-primary"
                  >
                    Patterns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/screen-reader-guide"
                    className="text-light hover:text-primary"
                  >
                    Screen Reader Guide
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-light text-xl mb-4">Resources</h2>
              <ul className="flex flex-col gap-2">
                <li>
                  <a
                    href="https://www.w3.org/WAI/standards-guidelines/wcag/"
                    className="text-light hover:text-primary"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    WCAG Guidelines
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.a11yproject.com/"
                    className="text-light hover:text-primary"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    A11y Project
                  </a>
                </li>
                <li>
                  <a
                    href="https://ustwo.com/"
                    className="text-light hover:text-primary"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    ustwo Website
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-light text-center">
              &copy; {new Date().getFullYear()} ustwo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
