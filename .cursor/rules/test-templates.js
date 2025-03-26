// Cursor rules for testing templates and conventions
module.exports = {
  name: 'Testing Templates and Conventions',
  description: 'Provides templates and enforces conventions for component testing',
  
  templates: {
    // Template for component test files
    componentTest: `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <ComponentName />
      </MemoryRouter>
    );
    
    // Add assertions for component rendering
    expect(screen.getByText(/expected text/i)).toBeInTheDocument();
  });
  
  it('is accessible', () => {
    const { container } = render(
      <MemoryRouter>
        <ComponentName />
      </MemoryRouter>
    );
    
    // Check for accessibility issues
    expect(container).toBeAccessible();
  });
  
  it('handles user interactions correctly', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ComponentName />
      </MemoryRouter>
    );
    
    // Example: clicking a button
    const button = screen.getByRole('button', { name: /button text/i });
    await user.click(button);
    
    // Add assertions for the expected behavior after interaction
    expect(screen.getByText(/result text/i)).toBeInTheDocument();
  });
});`,

    // Template for accessibility testing setup in vitest.setup.ts
    accessibilityTestSetup: `import '@testing-library/jest-dom';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

// Extend Jest matchers
expect.extend({
  toBeAccessible: async (received) => {
    const { default: axe } = await import('jest-axe');
    const results = await axe(received);
    const pass = results.violations.length === 0;
    
    if (pass) {
      return {
        pass: true,
        message: () => 'Expected element to have accessibility violations, but none were found',
      };
    }
    
    return {
      pass: false,
      message: () => \`Expected element to have no accessibility violations, but found \${results.violations.length} violations:\n\${results.violations.map(v => v.description).join('\n')}\`,
    };
  },
});`
  },
  
  // Rules that apply to all test files
  rules: [
    {
      name: 'Ensure accessibility testing in components',
      description: 'All component tests should include accessibility checks',
      validate: ({ fileContent, fileName }) => {
        // Only apply to component test files
        if (!fileName.match(/\.(test|spec)\.(tsx|jsx)$/) || 
            !fileContent.includes('render(')) {
          return true;
        }
        
        const hasAccessibilityCheck = 
          fileContent.includes('toBeAccessible') || 
          fileContent.includes('axe');
        
        return {
          valid: hasAccessibilityCheck,
          reason: hasAccessibilityCheck ? '' : 'Component tests should include accessibility checks using jest-axe or a similar library.'
        };
      }
    },
    {
      name: 'Include keyboard navigation tests',
      description: 'Interactive components should be tested with keyboard navigation',
      validate: ({ fileContent, fileName }) => {
        // Only apply to component test files with interactive elements
        if (!fileName.match(/\.(test|spec)\.(tsx|jsx)$/) || 
            !fileContent.includes('userEvent') || 
            !fileContent.includes('click')) {
          return true;
        }
        
        const hasKeyboardTest = 
          fileContent.includes('keyboard') || 
          fileContent.includes('tab') || 
          fileContent.includes('key(') ||
          fileContent.includes('keyDown');
        
        return {
          valid: hasKeyboardTest,
          reason: hasKeyboardTest ? '' : 'Components with click interactions should also be tested with keyboard navigation.'
        };
      }
    },
    {
      name: 'Use semantic queries in tests',
      description: 'Tests should use semantic queries rather than test IDs when possible',
      validate: ({ fileContent, fileName }) => {
        // Only apply to component test files
        if (!fileName.match(/\.(test|spec)\.(tsx|jsx)$/) || 
            !fileContent.includes('render(')) {
          return true;
        }
        
        // Count occurrences of different query types
        const testIdQueries = (fileContent.match(/getByTestId|queryByTestId|findByTestId/g) || []).length;
        const semanticQueries = (fileContent.match(/getByRole|queryByRole|findByRole|getByLabelText|queryByLabelText|findByLabelText|getByText|queryByText|findByText/g) || []).length;
        
        // Allow some test IDs, but prefer semantic queries
        const valid = semanticQueries >= testIdQueries;
        
        return {
          valid,
          reason: valid ? '' : 'Prefer semantic queries (getByRole, getByText, etc.) over test IDs for better accessibility testing.'
        };
      }
    }
  ]
}; 