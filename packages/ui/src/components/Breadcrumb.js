import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../utils/cn';
import { ChevronRight } from 'lucide-react';
export function Breadcrumb({ items, className }) {
    return (_jsx("nav", { "aria-label": "Breadcrumb", className: cn('flex items-center gap-1 text-sm', className), children: items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (_jsxs("span", { className: "flex items-center gap-1", children: [i > 0 && _jsx(ChevronRight, { className: "text-muted-foreground h-3.5 w-3.5" }), isLast || (!item.href && !item.onClick) ? (_jsx("span", { className: cn(isLast ? 'text-foreground font-medium' : 'text-muted-foreground'), children: item.label })) : (_jsx("button", { onClick: item.onClick, className: "text-muted-foreground hover:text-foreground transition-colors", children: item.label }))] }, i));
        }) }));
}
