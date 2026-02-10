import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../utils/cn';
const variantClasses = {
    info: 'border-info/30 bg-info/5 text-info',
    success: 'border-success/30 bg-success/5 text-success',
    warning: 'border-warning/30 bg-warning/5 text-warning',
    danger: 'border-danger/30 bg-danger/5 text-danger',
};
export function Alert({ className, variant = 'info', icon, children, ...props }) {
    return (_jsxs("div", { role: "alert", className: cn('flex items-start gap-3 rounded-lg border p-4 text-sm', variantClasses[variant], className), ...props, children: [icon && _jsx("span", { className: "mt-0.5 shrink-0", children: icon }), _jsx("div", { children: children })] }));
}
