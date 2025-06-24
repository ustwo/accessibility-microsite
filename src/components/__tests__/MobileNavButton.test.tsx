import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MobileNavButton from '../MobileNavButton';

describe('MobileNavButton', () => {
  it('renders with correct accessibility attributes when closed', () => {
    const mockToggle = vi.fn();
    
    render(
      <MobileNavButton 
        isOpen={false} 
        onToggle={mockToggle} 
        ariaControls="mobile-nav-menu" 
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Open navigation menu');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav-menu');
    expect(button).not.toHaveClass('active');
  });

  it('renders with correct accessibility attributes when open', () => {
    const mockToggle = vi.fn();
    
    render(
      <MobileNavButton 
        isOpen={true} 
        onToggle={mockToggle} 
        ariaControls="mobile-nav-menu" 
      />
    );

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Close navigation menu');
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', 'mobile-nav-menu');
    expect(button).toHaveClass('active');
  });

  it('calls onToggle when clicked', () => {
    const mockToggle = vi.fn();
    
    render(
      <MobileNavButton 
        isOpen={false} 
        onToggle={mockToggle} 
        ariaControls="mobile-nav-menu" 
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockToggle).toHaveBeenCalledTimes(1);
  });

  it('renders three lines', () => {
    const mockToggle = vi.fn();
    
    render(
      <MobileNavButton 
        isOpen={false} 
        onToggle={mockToggle} 
        ariaControls="mobile-nav-menu" 
      />
    );

    const lines = screen.getAllByRole('generic').filter(el => 
      el.classList.contains('mobile-nav-line')
    );
    expect(lines).toHaveLength(3);
    
    const topLine = lines[0];
    const middleLine = lines[1];
    const bottomLine = lines[2];
    
    expect(topLine).toHaveClass('mobile-nav-line', 'top');
    expect(middleLine).toHaveClass('mobile-nav-line', 'middle');
    expect(bottomLine).toHaveClass('mobile-nav-line', 'bottom');
  });
}); 