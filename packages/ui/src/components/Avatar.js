import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
};
export function Avatar({ className, src, alt, fallback, size = 'md', ...props }) {
    const initials = fallback ??
        alt
            ?.split(' ')
            .map((w) => w[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();
    return (_jsx("div", { className: cn('bg-muted text-muted-foreground relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium', sizeClasses[size], className), ...props, children: src ? (_jsx("img", { src: src, alt: alt ?? '', className: "h-full w-full object-cover" })) : (_jsx("span", { children: initials })) }));
}
