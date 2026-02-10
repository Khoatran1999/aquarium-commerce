import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PriceDisplay } from './PriceDisplay';

describe('PriceDisplay', () => {
  it('renders price', () => {
    render(<PriceDisplay price={100000} />);
    // Intl.NumberFormat in vi-VN/VND format
    const el = screen.getByText(/100/);
    expect(el).toBeInTheDocument();
  });

  it('shows compare price when higher than price', () => {
    const { container } = render(<PriceDisplay price={80000} comparePrice={100000} />);
    const lineThrough = container.querySelector('.line-through');
    expect(lineThrough).not.toBeNull();
  });

  it('shows discount percentage', () => {
    render(<PriceDisplay price={80000} comparePrice={100000} />);
    expect(screen.getByText('-20%')).toBeInTheDocument();
  });

  it('does not show discount when comparePrice is null', () => {
    const { container } = render(<PriceDisplay price={50000} comparePrice={null} />);
    expect(container.querySelector('.line-through')).toBeNull();
    expect(screen.queryByText(/%/)).toBeNull();
  });

  it('does not show discount when comparePrice <= price', () => {
    const { container } = render(<PriceDisplay price={100000} comparePrice={80000} />);
    expect(container.querySelector('.line-through')).toBeNull();
  });

  it('applies custom className', () => {
    const { container } = render(<PriceDisplay price={50000} className="my-class" />);
    expect(container.firstChild).toHaveClass('my-class');
  });

  it('calculates correct discount percent (rounded)', () => {
    // 70000 / 100000 = 30% off
    render(<PriceDisplay price={70000} comparePrice={100000} />);
    expect(screen.getByText('-30%')).toBeInTheDocument();
  });

  it('handles zero price', () => {
    render(<PriceDisplay price={0} />);
    const el = screen.getByText(/0/);
    expect(el).toBeInTheDocument();
  });
});
