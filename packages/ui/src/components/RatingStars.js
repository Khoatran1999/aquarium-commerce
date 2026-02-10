import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '../utils/cn';
import { Star } from 'lucide-react';
const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
};
export function RatingStars({ value, max = 5, size = 'md', showValue, count, interactive, onChange, className, }) {
    return (_jsxs("div", { className: cn('flex items-center gap-1', className), children: [_jsx("div", { className: "flex", children: Array.from({ length: max }, (_, i) => {
                    const starValue = i + 1;
                    const isFilled = value >= starValue;
                    const isHalf = !isFilled && value >= starValue - 0.5;
                    return (_jsx("button", { type: "button", disabled: !interactive, onClick: () => interactive && onChange?.(starValue), className: cn('transition-colors', interactive && 'cursor-pointer hover:scale-110', !interactive && 'cursor-default'), "aria-label": `Rate ${starValue} of ${max}`, children: _jsx(Star, { className: cn(iconSizes[size], isFilled && 'fill-accent text-accent', isHalf && 'fill-accent/50 text-accent', !isFilled && !isHalf && 'text-muted-foreground/30') }) }, i));
                }) }), showValue && (_jsx("span", { className: "text-muted-foreground text-sm font-medium", children: value.toFixed(1) })), count != null && _jsxs("span", { className: "text-muted-foreground text-sm", children: ["(", count, ")"] })] }));
}
