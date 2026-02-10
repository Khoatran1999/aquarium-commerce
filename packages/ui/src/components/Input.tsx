import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-foreground text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'border-border bg-background text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors',
            'focus:border-primary focus:ring-primary/20 focus:outline-none focus:ring-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className,
          )}
          {...props}
        />
        {error && <p className="text-danger text-xs">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
