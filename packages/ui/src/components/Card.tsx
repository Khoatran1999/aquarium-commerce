import { type HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

/* ── Card ─────────────────────────────────── */
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export function Card({ className, hoverable, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-card border-border rounded-xl border shadow-sm',
        hoverable && 'hover:shadow-card transition-shadow duration-200',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/* ── Card Header ──────────────────────────── */
export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props}>
      {children}
    </div>
  );
}

/* ── Card Title ───────────────────────────── */
export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-lg font-semibold leading-none tracking-tight', className)} {...props}>
      {children}
    </h3>
  );
}

/* ── Card Content ─────────────────────────── */
export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-6 pb-6', className)} {...props}>
      {children}
    </div>
  );
}

/* ── Card Footer ──────────────────────────── */
export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center px-6 pb-6 pt-0', className)} {...props}>
      {children}
    </div>
  );
}
