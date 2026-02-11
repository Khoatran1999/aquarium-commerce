import type { OrderStatus } from '@repo/types';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  PENDING: { label: 'Pending', className: 'bg-warning/10 text-warning' },
  CONFIRMED: { label: 'Confirmed', className: 'bg-info/10 text-info' },
  PREPARING: { label: 'Preparing', className: 'bg-primary/10 text-primary' },
  SHIPPING: { label: 'Shipping', className: 'bg-secondary/10 text-secondary' },
  DELIVERED: { label: 'Delivered', className: 'bg-success/10 text-success' },
  CANCELLED: { label: 'Cancelled', className: 'bg-danger/10 text-danger' },
  REFUNDED: { label: 'Refunded', className: 'bg-muted text-muted-foreground' },
};

export default function StatusBadge({ status }: { status: OrderStatus | string }) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'bg-muted text-muted-foreground',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
