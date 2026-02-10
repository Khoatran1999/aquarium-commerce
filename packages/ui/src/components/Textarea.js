import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { cn } from '../utils/cn';
export const Textarea = forwardRef(({ className, label, error, id, ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (_jsxs("div", { className: "flex flex-col gap-1.5", children: [label && (_jsx("label", { htmlFor: textareaId, className: "text-foreground text-sm font-medium", children: label })), _jsx("textarea", { ref: ref, id: textareaId, className: cn('border-border bg-background text-foreground placeholder:text-muted-foreground flex min-h-[80px] w-full rounded-lg border px-3 py-2 text-sm transition-colors', 'focus:border-primary focus:ring-primary/20 focus:outline-none focus:ring-2', 'disabled:cursor-not-allowed disabled:opacity-50', error && 'border-danger focus:border-danger focus:ring-danger/20', className), ...props }), error && _jsx("p", { className: "text-danger text-xs", children: error })] }));
});
Textarea.displayName = 'Textarea';
