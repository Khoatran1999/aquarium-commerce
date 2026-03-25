import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Package } from 'lucide-react';
import { orderService } from '@repo/services';
import type { Order, OrderStatus } from '@repo/types';
import { Skeleton } from '@repo/ui';
import { queryKeys } from '../hooks';

const TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Preparing', value: 'PREPARING' },
  { label: 'Shipping', value: 'SHIPPING' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const statusColor: Record<string, string> = {
  PENDING: 'bg-warning/10 text-warning',
  CONFIRMED: 'bg-primary/10 text-primary',
  PREPARING: 'bg-accent/10 text-accent',
  SHIPPING: 'bg-primary/20 text-primary',
  DELIVERED: 'bg-success/10 text-success',
  CANCELLED: 'bg-danger/10 text-danger',
  REFUNDED: 'bg-muted text-muted-foreground',
};

function OrderCard({ order }: { order: Order }) {
  const firstItem = order.items?.[0];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Link
        to={`/orders/${order.id}`}
        className="bg-card border-border hover:shadow-card block cursor-pointer rounded-2xl border p-5 transition-shadow"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[order.status] ?? 'bg-muted text-muted-foreground'}`}
              >
                {order.status}
              </span>
              <span className="text-muted-foreground text-xs">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
            <p className="text-muted-foreground mt-2 font-mono text-xs">#{order.id.slice(0, 8)}</p>
          </div>
          <p className="text-primary text-lg font-bold">${order.total.toFixed(2)}</p>
        </div>

        {/* Item preview */}
        {firstItem && (
          <div className="border-border mt-4 flex items-center gap-3 border-t pt-4">
            {firstItem.product?.images?.[0]?.url && (
              <img
                src={firstItem.product.images[0].url}
                alt={firstItem.name}
                className="h-10 w-10 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="text-foreground line-clamp-1 text-sm font-medium">{firstItem.name}</p>
              <p className="text-muted-foreground text-xs">
                x{firstItem.quantity}
                {(order.items?.length ?? 0) > 1 && ` and ${(order.items?.length ?? 0) - 1} more`}
              </p>
            </div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default function OrdersPage() {
  const [tab, setTab] = useState<OrderStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: [...queryKeys.orders.all, page],
    queryFn: () => orderService.getOrders({ page, limit: 10 }),
  });

  const orders: Order[] = data?.data ?? [];
  const filtered = tab === 'ALL' ? orders : orders.filter((o) => o.status === tab);
  const meta = data?.meta;

  return (
    <>
      <Helmet>
        <title>My Orders – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        <h1 className="text-foreground mb-6 text-2xl font-bold">My Orders</h1>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          {TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`cursor-pointer whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                tab === t.value
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-3 flex justify-center">
              <Package size={48} className="text-border" />
            </div>
            <p className="text-muted-foreground mt-3">No orders found</p>
            <Link
              to="/products"
              className="text-primary mt-2 inline-block cursor-pointer text-sm font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Start Shopping
            </Link>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className="cursor-pointer text-muted-foreground hover:text-foreground text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Previous
            </button>
            <span className="text-muted-foreground text-sm">
              Page {page} of {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="cursor-pointer text-muted-foreground hover:text-foreground text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
