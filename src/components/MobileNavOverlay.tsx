import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export default function MobileNavOverlay({ isOpen, onClose, id }: MobileNavOverlayProps) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Helper function to check if a link path matches the current path
  const isCurrentPage = (linkPath: string) => {
    const cleanCurrentPath = currentPath.replace(/\/$/, '');
    const cleanLinkPath = linkPath.replace(/\/$/, '');
    return cleanCurrentPath === cleanLinkPath;
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="mobile-nav-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="mobile-nav-backdrop" onClick={onClose} />
      <div className="mobile-nav-content" id={id}>
        {/* Mobile navigation header with dark mode toggle on the left */}
        <div className="mobile-nav-header">
          <DarkModeToggle />
        </div>

        <nav className="mobile-nav" aria-label="Mobile navigation">
          <ul>
            <li>
              <Link 
                to="/tools" 
                onClick={onClose}
                aria-current={isCurrentPage("/tools") ? "page" : undefined}
              >
                1. Tools
              </Link>
            </li>
            <li>
              <Link 
                to="/patterns" 
                onClick={onClose}
                aria-current={isCurrentPage("/patterns") ? "page" : undefined}
              >
                2. Patterns
              </Link>
            </li>
            <li>
              <Link 
                to="/checklist" 
                onClick={onClose}
                aria-current={isCurrentPage("/checklist") ? "page" : undefined}
              >
                3. Checklist
              </Link>
            </li>
            <li>
              <Link 
                to="/screen-reader-guide" 
                onClick={onClose}
                aria-current={isCurrentPage("/screen-reader-guide") ? "page" : undefined}
              >
                4. Screen reader guide
              </Link>
            </li>
            <li>
              <Link 
                to="/testing-templates" 
                onClick={onClose}
                aria-current={isCurrentPage("/testing-templates") ? "page" : undefined}
              >
                5. Testing templates
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
} 