import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from './Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders as span element', () => {
    render(<Badge>Tag</Badge>);
    expect(screen.getByText('Tag').tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(<Badge className="mt-2">Test</Badge>);
    expect(screen.getByText('Test')).toHaveClass('mt-2');
  });

  it('passes through HTML attributes', () => {
    render(<Badge data-testid="badge">Status</Badge>);
    expect(screen.getByTestId('badge')).toBeInTheDocument();
  });

  it('has base styling classes', () => {
    render(<Badge>Test</Badge>);
    const el = screen.getByText('Test');
    expect(el).toHaveClass('inline-flex');
    expect(el).toHaveClass('rounded-full');
    expect(el).toHaveClass('text-xs');
    expect(el).toHaveClass('font-medium');
  });
});
