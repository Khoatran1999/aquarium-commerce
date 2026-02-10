import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
export function Progress({ value, className, indicatorClassName }) {
    const clamped = Math.max(0, Math.min(100, value));
    return (_jsx("div", { role: "progressbar", "aria-valuenow": clamped, "aria-valuemin": 0, "aria-valuemax": 100, className: cn('bg-muted relative h-2 w-full overflow-hidden rounded-full', className), children: _jsx("div", { className: cn('bg-primary h-full transition-all duration-300 ease-out', indicatorClassName), style: { width: `${clamped}%` } }) }));
}
