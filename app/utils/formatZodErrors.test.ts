import { describe, test, expect } from 'vitest';
import { z } from 'zod';
import { formatZodErrors } from './formUtils';

describe('formatZodErrors', () => {
  test('should format Zod errors correctly', () => {
    // Create a sample Zod error format
    const zodErrors = {
      _errors: [],
      name: { _errors: ['Name is required'] },
      email: { _errors: ['Invalid email format'] },
      age: { _errors: ['Must be at least 18'] }
    };

    const result = formatZodErrors(zodErrors as z.ZodFormattedError<unknown>);

    // Check that errors are formatted correctly
    expect(result).toEqual({
      name: 'Name is required',
      email: 'Invalid email format',
      age: 'Must be at least 18'
    });
  });

  test('should handle empty error object', () => {
    const result = formatZodErrors({ _errors: [] } as z.ZodFormattedError<unknown>);
    expect(result).toEqual({});
  });

  test('should skip fields with empty error arrays', () => {
    const zodErrors = {
      _errors: [],
      name: { _errors: [] },
      email: { _errors: ['Invalid email'] }
    };

    const result = formatZodErrors(zodErrors as z.ZodFormattedError<unknown>);
    expect(result).toEqual({
      email: 'Invalid email'
    });
  });
}); 