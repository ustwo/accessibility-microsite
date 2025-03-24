import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorMessage, ErrorSummary } from './formUtils';

describe('ErrorMessage', () => {
  test('should render error message when provided', () => {
    render(<ErrorMessage id="test-error" error="This is an error" />);
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  test('should not render anything when no error is provided', () => {
    const { container } = render(<ErrorMessage id="test-error" error={undefined} />);
    expect(container.firstChild).toBeNull();
  });

  test('should have correct id and class', () => {
    const { container } = render(<ErrorMessage id="test-error" error="This is an error" />);
    const errorElement = container.querySelector('#test-error');
    expect(errorElement).not.toBeNull();
    expect(errorElement).toHaveClass('error-message');
  });
});

describe('ErrorSummary', () => {
  test('should render summary with errors', () => {
    const errors = {
      name: 'Name is required',
      email: 'Email is invalid'
    };

    render(<ErrorSummary errors={errors} />);
    
    expect(screen.getByText('There is a problem')).toBeInTheDocument();
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is invalid')).toBeInTheDocument();
  });

  test('should not render when no errors exist', () => {
    const { container } = render(<ErrorSummary errors={{}} />);
    expect(container.firstChild).toBeNull();
  });

  test('should render form-level errors without links', () => {
    const errors = {
      _form: 'Form submission failed'
    };

    render(<ErrorSummary errors={errors} />);
    expect(screen.getByText('Form submission failed')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  test('should render field-level errors with links', () => {
    const errors = {
      name: 'Name is required'
    };

    render(<ErrorSummary errors={errors} />);
    const link = screen.getByRole('link', { name: 'Name is required' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '#name');
  });
}); 