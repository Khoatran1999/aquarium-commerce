import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../utils/cn';
export const Select = forwardRef(({ className, label, error, options, placeholder, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: selectId, className: "text-foreground text-sm font-medium", children: label })), _jsxs("select", { ref: ref, id: selectId, className: cn('border-border bg-background text-foreground flex h-10 w-full rounded-lg border px-3 py-2 text-sm transition-colors', 'focus:border-primary focus:ring-primary/20 focus:outline-none focus:ring-2', 'disabled:cursor-not-allowed disabled:opacity-50', error && 'border-danger focus:border-danger focus:ring-danger/20', className), ...props, children: [placeholder && (_jsx("option", { value: "", disabled: true, children: placeholder })), options.map((opt) => (_jsx("option", { value: opt.value, disabled: opt.disabled, children: opt.label }, opt.value)))] }), error && _jsx("p", { className: "text-danger text-xs", children: error })] }));
});
Select.displayName = 'Select';
