import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../utils/cn';
import { Inbox } from 'lucide-react';
export function EmptyState({ icon, title, description, action, className }) {
    return (_jsxs("div", { className: cn('flex flex-col items-center justify-center py-16 text-center', className), children: [_jsx("div", { className: "text-muted-foreground/40 mb-4", children: icon ?? _jsx(Inbox, { className: "h-16 w-16" }) }), _jsx("h3", { className: "text-foreground text-lg font-semibold", children: title }), description && _jsx("p", { className: "text-muted-foreground mt-1 max-w-sm text-sm", children: description }), action && _jsx("div", { className: "mt-6", children: action })] }));
}
