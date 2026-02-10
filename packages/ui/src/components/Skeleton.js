import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
export function Skeleton({ className, ...props }) {
    return _jsx("div", { className: cn('bg-muted animate-pulse rounded-lg', className), ...props });
}
