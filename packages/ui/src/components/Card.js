import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
export function Card({ className, hoverable, children, ...props }) {
    return (_jsx("div", { className: cn('bg-card border-border rounded-xl border shadow-sm', hoverable && 'hover:shadow-card transition-shadow duration-200', className), ...props, children: children }));
}
/* ── Card Header ──────────────────────────── */
export function CardHeader({ className, children, ...props }) {
    return (_jsx("div", { className: cn('flex flex-col gap-1.5 p-6', className), ...props, children: children }));
}
/* ── Card Title ───────────────────────────── */
export function CardTitle({ className, children, ...props }) {
    return (_jsx("h3", { className: cn('text-lg font-semibold leading-none tracking-tight', className), ...props, children: children }));
}
/* ── Card Content ─────────────────────────── */
export function CardContent({ className, children, ...props }) {
    return (_jsx("div", { className: cn('px-6 pb-6', className), ...props, children: children }));
}
/* ── Card Footer ──────────────────────────── */
export function CardFooter({ className, children, ...props }) {
    return (_jsx("div", { className: cn('flex items-center px-6 pb-6 pt-0', className), ...props, children: children }));
}
