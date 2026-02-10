import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../utils/cn';
import { Minus, Plus } from 'lucide-react';
export function QuantitySelector({ value, min = 1, max = 99, onChange, disabled, className, }) {
    const canDecrease = value > min;
    const canIncrease = value < max;
    return (_jsxs("div", { className: cn('inline-flex items-center', className), children: [_jsx("button", { type: "button", onClick: () => canDecrease && onChange(value - 1), disabled: disabled || !canDecrease, "aria-label": "Decrease quantity", className: cn('border-border flex h-9 w-9 items-center justify-center rounded-l-lg border transition-colors', 'hover:bg-muted disabled:pointer-events-none disabled:opacity-50'), children: _jsx(Minus, { className: "h-3.5 w-3.5" }) }), _jsx("div", { className: "border-border flex h-9 w-12 items-center justify-center border-y text-sm font-medium", children: value }), _jsx("button", { type: "button", onClick: () => canIncrease && onChange(value + 1), disabled: disabled || !canIncrease, "aria-label": "Increase quantity", className: cn('border-border flex h-9 w-9 items-center justify-center rounded-r-lg border transition-colors', 'hover:bg-muted disabled:pointer-events-none disabled:opacity-50'), children: _jsx(Plus, { className: "h-3.5 w-3.5" }) })] }));
}
