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
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  SHIPPING: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
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
        className="bg-card border-border hover:shadow-card block rounded-2xl border p-5 transition-shadow"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor[order.status] ?? 'bg-gray-100 text-gray-800'}`}
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
              className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

        {/* Orders */}
        {!isLoading && filtered.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-3 flex justify-center">
              <Package size={48} className="text-muted-foreground/40" />
            </div>
            <p className="text-muted-foreground mt-3">No orders found</p>
            <Link
              to="/products"
              className="text-primary mt-2 inline-block text-sm font-medium hover:underline"
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
              className="text-muted-foreground hover:text-foreground text-sm font-medium disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-muted-foreground text-sm">
              Page {page} of {meta.totalPages}
            </span>
            <button
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="text-muted-foreground hover:text-foreground text-sm font-medium disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}
