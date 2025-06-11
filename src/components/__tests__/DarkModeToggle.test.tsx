import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import DarkModeToggle from '../DarkModeToggle';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('DarkModeToggle', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    
    // Reset document classes
    document.documentElement.classList.remove('dark');
    
    // Reset meta tag
    const metaTag = document.querySelector('meta[name="color-scheme"]');
    if (metaTag) {
      metaTag.setAttribute('content', 'light');
    }
  });

  it('renders with correct initial state (light mode)', () => {
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveClass('dark-mode-toggle');
  });

  it('has proper accessibility attributes', () => {
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label');
    expect(button).toHaveAttribute('aria-pressed');
    
    // Check for screen reader text
    expect(screen.getByText('Switch to dark mode')).toHaveClass('sr-only');
  });

  it('toggles to dark mode when clicked', () => {
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('toggles back to light mode when clicked again', () => {
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    
    // First click - to dark mode
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    
    // Second click - back to light mode
    fireEvent.click(button);
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(document.documentElement).not.toHaveClass('dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'light');
  });

  it('initializes with dark mode when saved preference is dark', () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('respects system preference when no saved preference exists', () => {
    // Mock system preference for dark mode
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(document.documentElement).toHaveClass('dark');
  });

  it('applies custom className when provided', () => {
    render(<DarkModeToggle className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('dark-mode-toggle', 'custom-class');
  });

  it('shows correct icons for light and dark modes', () => {
    render(<DarkModeToggle />);
    
    const button = screen.getByRole('button');
    
    // Initially in light mode, should show moon icon
    let svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg?.querySelector('path')).toHaveAttribute('d', 'M21 12.79A9 9 0 1 1 11.21 3A7 7 0 0 0 21 12.79z');
    
    // Click to switch to dark mode, should show sun icon
    fireEvent.click(button);
    svg = button.querySelector('svg');
    expect(svg?.querySelector('circle')).toHaveAttribute('cx', '12');
    expect(svg?.querySelector('circle')).toHaveAttribute('cy', '12');
  });
}); 