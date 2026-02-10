import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'info' | 'success' | 'warning' | 'danger';
  icon?: ReactNode;
}

const variantClasses = {
  info: 'border-info/30 bg-info/5 text-info',
  success: 'border-success/30 bg-success/5 text-success',
  warning: 'border-warning/30 bg-warning/5 text-warning',
  danger: 'border-danger/30 bg-danger/5 text-danger',
} as const;

export function Alert({ className, variant = 'info', icon, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex items-start gap-3 rounded-lg border p-4 text-sm',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div>{children}</div>
    </div>
  );
}
