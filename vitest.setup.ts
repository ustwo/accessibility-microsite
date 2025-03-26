import '@testing-library/jest-dom';
import type { AxeResults } from 'jest-axe';

// Add global expect type for better TypeScript support
import { expect } from 'vitest';

// Make sure globals are properly typed
declare global {
  // eslint-disable-next-line no-var
  var expect: typeof import('vitest').expect;

  // Add other globals provided by vitest
  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;
  const it: typeof test;
  
  // Add custom matchers for accessibility testing
  interface CustomMatchers<R = unknown> {
    toBeAccessible(): Promise<R>;
  }
  
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
}

// Fix document type error in JSDOM environment
if (typeof document !== 'undefined') {
  // Add closest() if needed
  if (!Element.prototype.closest) {
    Element.prototype.closest = function(selector: string) {
      let self = this as Element;
      while (self && self.nodeType === 1) {
        if (self.matches(selector)) {
          return self;
        }
        self = self.parentElement as Element;
      }
      return null;
    };
  }
}

// Add custom matcher for accessibility testing
expect.extend({
  async toBeAccessible(received) {
    if (typeof document === 'undefined') {
      return {
        pass: true,
        message: () => 'No accessibility check performed outside browser environment',
      };
    }

    try {
      // Dynamic import of jest-axe to avoid issues in non-browser environments
      const { default: axe } = await import('jest-axe');
      const results = await axe(received);
      const violations = results.violations;
      
      return {
        pass: violations.length === 0,
        message: () => 
          violations.length === 0
            ? 'Expected element to have accessibility violations, but none were found'
            : `Expected element to have no accessibility violations, but found ${violations.length} violations:\n${violations.map((v: any) => `- ${v.description} (${v.id}): ${v.nodes.length} instances`).join('\n')}`,
      };
    } catch (error) {
      return {
        pass: false,
        message: () => `Error running accessibility tests: ${error}`,
      };
    }
  },
}); 