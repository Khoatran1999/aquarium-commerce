import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cn } from '../utils/cn';
const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
};
export function PriceDisplay({ price, comparePrice, currency = 'VND', locale = 'vi-VN', className, size = 'md', }) {
    const fmt = (v) => new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(v);
    const hasDiscount = comparePrice != null && comparePrice > price;
    const discountPercent = hasDiscount
        ? Math.round(((comparePrice - price) / comparePrice) * 100)
        : 0;
    return (_jsxs("div", { className: cn('flex flex-wrap items-center gap-2', sizeClasses[size], className), children: [_jsx("span", { className: cn('font-bold', hasDiscount ? 'text-danger' : 'text-foreground'), children: fmt(price) }), hasDiscount && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-muted-foreground text-sm line-through", children: fmt(comparePrice) }), _jsxs("span", { className: "bg-danger/10 text-danger rounded-full px-1.5 py-0.5 text-xs font-medium", children: ["-", discountPercent, "%"] })] }))] }));
}
