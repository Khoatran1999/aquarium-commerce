import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';
export function Pagination({ page, totalPages, onPageChange, className }) {
    if (totalPages <= 1)
        return null;
    const pages = getPageNumbers(page, totalPages);
    return (_jsxs("nav", { "aria-label": "Pagination", className: cn('flex items-center justify-center gap-1', className), children: [_jsx("button", { onClick: () => onPageChange(page - 1), disabled: page <= 1, "aria-label": "Previous page", className: "hover:bg-muted inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50", children: _jsx(ChevronLeft, { className: "h-4 w-4" }) }), pages.map((p, i) => p === '...' ? (_jsx("span", { className: "text-muted-foreground flex h-9 w-9 items-center justify-center text-sm", children: "..." }, `ellipsis-${i}`)) : (_jsx("button", { onClick: () => onPageChange(p), "aria-current": p === page ? 'page' : undefined, className: cn('inline-flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-primary text-white' : 'hover:bg-muted text-foreground'), children: p }, p))), _jsx("button", { onClick: () => onPageChange(page + 1), disabled: page >= totalPages, "aria-label": "Next page", className: "hover:bg-muted inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors disabled:pointer-events-none disabled:opacity-50", children: _jsx(ChevronRight, { className: "h-4 w-4" }) })] }));
}
/** Generate an array of page numbers with ellipsis */
function getPageNumbers(current, total) {
    if (total <= 7)
        return Array.from({ length: total }, (_, i) => i + 1);
    const pages = [1];
    if (current > 3)
        pages.push('...');
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);
    for (let i = start; i <= end; i++)
        pages.push(i);
    if (current < total - 2)
        pages.push('...');
    pages.push(total);
    return pages;
}
