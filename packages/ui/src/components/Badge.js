import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
const variants = {
    default: 'bg-muted text-muted-foreground',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    danger: 'bg-danger/10 text-danger',
    info: 'bg-info/10 text-info',
};
export function Badge({ className, variant = 'default', children, ...props }) {
    return (_jsx("span", { className: cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant], className), ...props, children: children }));
}
