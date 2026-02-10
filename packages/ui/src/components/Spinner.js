import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
export function Spinner({ className, size = 'md' }) {
    return (_jsx("div", { className: cn('border-primary animate-spin rounded-full border-2 border-t-transparent', size === 'sm' && 'h-4 w-4', size === 'md' && 'h-8 w-8', size === 'lg' && 'h-12 w-12', className) }));
}
