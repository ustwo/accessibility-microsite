import '@testing-library/jest-dom';

// Add global expect type for better TypeScript support
import { expect } from 'vitest';

// Make sure globals are properly typed
declare global {
  // eslint-disable-next-line no-var
  var expect: typeof expect;

  // Add other globals provided by vitest
  function describe(name: string, fn: () => void): void;
  function test(name: string, fn: () => void | Promise<void>, timeout?: number): void;
  function beforeEach(fn: () => void | Promise<void>): void;
  function afterEach(fn: () => void | Promise<void>): void;
  function beforeAll(fn: () => void | Promise<void>): void;
  function afterAll(fn: () => void | Promise<void>): void;
  const it: typeof test;
}

// Fix document type error in JSDOM environment
if (typeof document !== 'undefined') {
  // Add closest() if needed
  if (!Element.prototype.closest) {
    Element.prototype.closest = function (selector: string) {
      // Using 'self' instead of 'this' to avoid linter error
      let element = this;
      while (element && element.nodeType === 1) {
        if (element.matches(selector)) {
          return element;
        }
        element = element.parentElement as Element;
      }
      return null;
    };
  }
} 