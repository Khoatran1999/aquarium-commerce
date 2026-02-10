import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { orderService } from '@repo/services';
import type { OrderStatus } from '@repo/types';
import { Skeleton } from '@repo/ui';
import { queryKeys } from '../hooks';

const STEPS: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'];

const stepLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  SHIPPING: 'Shipping',
  DELIVERED: 'Delivered',
};

const statusColor: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PREPARING: 'bg-purple-100 text-purple-800',
  SHIPPING: 'bg-cyan-100 text-cyan-800',
  DELIVERED: 'bg-emerald-100 text-emerald-800',
  CANCELLED: 'bg-red-100 text-red-800',
  REFUNDED: 'bg-gray-100 text-gray-800',
};

function ProgressBar({ status }: { status: OrderStatus }) {
  const cancelled = status === 'CANCELLED' || status === 'REFUNDED';
  const activeIdx = cancelled ? -1 : STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1">
      {STEPS.map((step, i) => {
        const done = !cancelled && i <= activeIdx;
        return (
          <div key={step} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex w-full items-center">
              <motion.div
                className={`z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  done ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                }`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                {done ? '✓' : i + 1}
              </motion.div>
              {i < STEPS.length - 1 && (
                <div className="bg-muted relative mx-1 h-1 flex-1 overflow-hidden rounded-full">
                  {!cancelled && i < activeIdx && (
                    <motion.div
                      className="bg-primary absolute inset-0"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: i * 0.15, duration: 0.3 }}
                      style={{ transformOrigin: 'left' }}
                    />
                  )}
                </div>
              )}
            </div>
            <span
              className={`text-center text-[10px] font-medium md:text-xs ${done ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {stepLabels[step]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.orders.detail(id!),
    queryFn: () => orderService.getOrder(id!),
    enabled: !!id,
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        <Skeleton className="mb-4 h-8 w-48" />
        <Skeleton className="mb-8 h-20 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
        <p className="text-5xl">🔍</p>
        <p className="text-foreground mt-3 text-lg font-semibold">Order not found</p>
        <Link to="/orders" className="text-primary mt-2 text-sm hover:underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Order #{order.id.slice(0, 8)} – AquaLuxe</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              to="/orders"
              className="text-primary mb-2 inline-flex items-center gap-1 text-sm hover:underline"
            >
              ← Back to Orders
            </Link>
            <h1 className="text-foreground text-2xl font-bold">Order #{order.id.slice(0, 8)}</h1>
            <p className="text-muted-foreground text-sm">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <span
            className={`rounded-full px-4 py-2 text-sm font-semibold ${statusColor[order.status] ?? 'bg-gray-100 text-gray-800'}`}
          >
            {order.status}
          </span>
        </div>

        {/* Progress */}
        {order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (
          <div className="bg-card border-border mb-8 rounded-2xl border p-6">
            <ProgressBar status={order.status} />
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* Items */}
          <div className="bg-card border-border rounded-2xl border p-6">
            <h2 className="text-foreground mb-4 text-lg font-bold">Items</h2>
            <div className="flex flex-col gap-4">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  {item.product?.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="bg-muted flex h-14 w-14 items-center justify-center rounded-xl text-xl">
                      🐟
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${item.product?.slug ?? item.productId}`}
                      className="text-foreground hover:text-primary line-clamp-1 text-sm font-medium"
                    >
                      {item.name}
                    </Link>
                    <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-foreground text-sm font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Summary */}
            <div className="bg-card border-border rounded-2xl border p-6">
              <h2 className="text-foreground mb-4 text-lg font-bold">Summary</h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {order.shippingFee === 0 ? 'Free' : `$${order.shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="border-border my-1 border-t" />
                <div className="flex justify-between text-base">
                  <span className="text-foreground font-bold">Total</span>
                  <span className="text-primary font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping info */}
            <div className="bg-card border-border rounded-2xl border p-6">
              <h2 className="text-foreground mb-4 text-lg font-bold">Shipping</h2>
              <div className="text-sm">
                <p className="text-foreground">{order.shippingPhone}</p>
                <p className="text-muted-foreground mt-1">{order.shippingAddress}</p>
                <p className="text-muted-foreground">{order.shippingCity}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-card border-border rounded-2xl border p-6">
              <h2 className="text-foreground mb-4 text-lg font-bold">Payment</h2>
              <p className="text-foreground text-sm font-medium">{order.paymentMethod}</p>
              {order.note && (
                <p className="text-muted-foreground mt-2 text-sm">
                  <span className="font-medium">Note:</span> {order.note}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
