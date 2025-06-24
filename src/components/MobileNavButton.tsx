import React from "react";

interface MobileNavButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  ariaControls: string;
}

export default function MobileNavButton({ isOpen, onToggle, ariaControls }: MobileNavButtonProps) {
  return (
    <button
      className={`mobile-nav-button ${isOpen ? 'active' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
      aria-expanded={isOpen}
      aria-controls={ariaControls}
      type="button"
    >
      <span className="mobile-nav-line top" />
      <span className="mobile-nav-line middle" />
      <span className="mobile-nav-line bottom" />
    </button>
  );
} 