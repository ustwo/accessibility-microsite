# Cursor Rules for Accessibility Microsite

This directory contains Cursor rules to ensure all code meets the project's accessibility, testing, and styling requirements.

## Rule Categories

### 1. Accessibility and Testing Standards

The main ruleset that enforces:
- Unit testing for all components
- Keyboard accessibility for all interactive elements
- Proper semantic HTML
- Correct ARIA attribute usage
- No inline styles
- Use of CSS instead of Tailwind
- Proper image alt text
- Form label associations
- Correct React Router 7 usage
- Focus management for client-side routing

### 2. Testing Templates and Conventions

Provides:
- Template for component unit tests
- Template for accessibility testing setup
- Rules to ensure accessibility testing in all tests
- Rules for keyboard navigation testing
- Guidance on using semantic queries in tests

### 3. CSS Guidelines

Enforces:
- Descriptive class names
- Visible keyboard focus styles
- Use of relative units over pixels
- Accessible color contrast guidelines
- Support for reduced motion preferences
- Logical tab order (no positive tabindex values)
- Mobile-first responsive design
- Limited use of !important

## How to Use These Rules

Cursor will automatically check your code against these rules as you write it. Look for warnings in the Cursor interface to see if you're violating any rules.

## Adding to Test Suite

When adding new component tests, make sure to:
1. Include accessibility testing using jest-axe
2. Test keyboard navigation for interactive elements
3. Use semantic queries instead of test IDs

## CSS Best Practices

Follow these guidelines for CSS:
1. Use descriptive class names (consider BEM methodology)
2. Always provide visible focus styles for interactive elements
3. Prefer relative units (rem, em, %) over pixels
4. Add reduced motion alternatives for animations
5. Use a mobile-first approach with min-width media queries

## Keyboard Accessibility

All interactive elements must be:
1. Focusable with the keyboard
2. Operable with the keyboard (Enter for links/buttons, Space for buttons/checkboxes)
3. Have a visible focus indicator
4. Follow a logical tab order

## Screen Reader Accessibility

Ensure that:
1. All images have meaningful alt text (or empty alt for decorative images)
2. Form controls have proper labels
3. ARIA attributes are used correctly
4. Semantic HTML is used wherever possible 