import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '../utils/cn';
import { Badge } from './Badge';
const statusConfig = {
    PENDING: { label: 'Pending', variant: 'warning' },
    CONFIRMED: { label: 'Confirmed', variant: 'info' },
    PREPARING: { label: 'Preparing', variant: 'info' },
    SHIPPING: { label: 'Shipping', variant: 'info' },
    DELIVERED: { label: 'Delivered', variant: 'success' },
    CANCELLED: { label: 'Cancelled', variant: 'danger' },
    REFUNDED: { label: 'Refunded', variant: 'default' },
};
export function StatusBadge({ status, className }) {
    const config = statusConfig[status] ?? { label: status, variant: 'default' };
    return (_jsx(Badge, { variant: config.variant, className: cn(className), children: config.label }));
}
