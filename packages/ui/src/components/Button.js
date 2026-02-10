import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../utils/cn';
export const Button = forwardRef(({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (_jsx("button", { ref: ref, className: cn('focus-visible:ring-primary inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50', 
        // variants
        variant === 'primary' && 'bg-primary hover:bg-primary-dark shadow-card text-white', variant === 'secondary' && 'bg-secondary hover:bg-secondary-dark text-white', variant === 'outline' && 'border-border hover:bg-muted border bg-transparent', variant === 'ghost' && 'hover:bg-muted bg-transparent', variant === 'danger' && 'bg-danger text-white hover:bg-red-600', 
        // sizes
        size === 'sm' && 'h-8 rounded-md px-3 text-xs', size === 'md' && 'h-10 rounded-lg px-4 text-sm', size === 'lg' && 'h-12 rounded-xl px-6 text-base', className), ...props, children: children }));
});
Button.displayName = 'Button';
