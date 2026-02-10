import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
export function Separator({ className, orientation = 'horizontal', ...props }) {
    return (_jsx("div", { role: "separator", className: cn('bg-border shrink-0', orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px', className), ...props }));
}
