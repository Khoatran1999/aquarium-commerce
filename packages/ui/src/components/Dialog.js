import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../utils/cn';
import { X } from 'lucide-react';
const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
};
export function Dialog({ open, onClose, title, description, children, className, size = 'md', }) {
    const dialogRef = useRef(null);
    useEffect(() => {
        const el = dialogRef.current;
        if (!el)
            return;
        if (open) {
            el.showModal();
        }
        else {
            el.close();
        }
    }, [open]);
    // Close on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === dialogRef.current)
            onClose();
    };
    // Close on Escape handled natively by <dialog>
    useEffect(() => {
        const el = dialogRef.current;
        if (!el)
            return;
        const handler = () => onClose();
        el.addEventListener('close', handler);
        return () => el.removeEventListener('close', handler);
    }, [onClose]);
    if (typeof window === 'undefined')
        return null;
    return createPortal(_jsx("dialog", { ref: dialogRef, onClick: handleBackdropClick, className: cn('bg-card text-foreground fixed inset-0 m-auto w-full rounded-xl border p-0 shadow-xl backdrop:bg-black/50', sizeClasses[size], className), children: _jsxs("div", { className: "flex flex-col", children: [(title || description) && (_jsxs("div", { className: "flex items-start justify-between gap-4 p-6 pb-0", children: [_jsxs("div", { children: [title && _jsx("h2", { className: "text-lg font-semibold", children: title }), description && _jsx("p", { className: "text-muted-foreground mt-1 text-sm", children: description })] }), _jsx("button", { onClick: onClose, "aria-label": "Close dialog", className: "hover:bg-muted -mt-1 rounded-lg p-1.5 transition-colors", children: _jsx(X, { className: "h-4 w-4" }) })] })), _jsx("div", { className: "p-6", children: children })] }) }), document.body);
}
