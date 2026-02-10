import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { ArrowLeft, User, MapPin, Phone, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import type { OrderStatus } from '@repo/types';
import StatusBadge from '../components/StatusBadge';

const STATUS_FLOW: OrderStatus[] = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'];

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'CONFIRMED',
  CONFIRMED: 'PREPARING',
  PREPARING: 'SHIPPING',
  SHIPPING: 'DELIVERED',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => adminService.getOrder(id!),
    enabled: !!id,
  });

  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => adminService.updateOrderStatus(id!, status),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['admin', 'order', id] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] });
    },
    onError: () => toast.error('Failed to update status'),
  });

  const order = data?.data;

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <div className="bg-card border-border h-12 w-48 animate-pulse rounded-xl border" />
        <div className="bg-card border-border h-60 animate-pulse rounded-xl border" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(order.status);
  const nextStatus = NEXT_STATUS[order.status];
  const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="hover:bg-muted rounded-lg p-2 transition-colors"
          >
            <ArrowLeft className="text-muted-foreground h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-foreground text-xl font-bold">Order #{order.id.slice(-8)}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-muted-foreground text-sm">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isCancelled && nextStatus && (
            <button
              onClick={() => statusMutation.mutate(nextStatus)}
              disabled={statusMutation.isPending}
              className="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {statusMutation.isPending ? 'Updating...' : `Mark as ${nextStatus}`}
            </button>
          )}
          {order.status === 'PENDING' && (
            <button
              onClick={() => statusMutation.mutate('CANCELLED')}
              disabled={statusMutation.isPending}
              className="bg-danger/10 text-danger hover:bg-danger/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {!isCancelled && (
        <div className="bg-card border-border rounded-xl border p-5">
          <div className="flex justify-between">
            {STATUS_FLOW.map((s, i) => {
              const isCompleted = i <= currentIdx;
              const isCurrent = i === currentIdx;
              return (
                <div key={s} className="flex flex-1 flex-col items-center">
                  <div className="relative flex w-full items-center justify-center">
                    {i > 0 && (
                      <div
                        className={`absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 ${
                          isCompleted ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                    {i < STATUS_FLOW.length - 1 && (
                      <div
                        className={`absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 ${
                          i < currentIdx ? 'bg-primary' : 'bg-border'
                        }`}
                      />
                    )}
                    <div
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        isCurrent
                          ? 'bg-primary ring-primary/20 text-white ring-4'
                          : isCompleted
                            ? 'bg-primary text-white'
                            : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {i + 1}
                    </div>
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium ${
                      isCompleted ? 'text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Items */}
        <div className="bg-card border-border rounded-xl border lg:col-span-2">
          <h2 className="text-foreground border-border border-b px-5 py-4 text-sm font-semibold">
            Order Items ({order.items?.length ?? 0})
          </h2>
          <div className="divide-border divide-y">
            {(order.items ?? []).map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                <img
                  src={item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                  alt={item.name}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-medium">{item.name}</p>
                  <p className="text-muted-foreground text-xs">Qty: {item.quantity}</p>
                </div>
                <span className="text-foreground text-sm font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-border space-y-1 border-t px-5 py-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-foreground">
                {order.shippingFee === 0 ? 'Free' : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="border-border flex justify-between border-t pt-2 text-sm font-bold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="bg-card border-border rounded-xl border p-5">
            <h3 className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
              <User className="h-4 w-4" /> Customer
            </h3>
            <p className="text-foreground text-sm">{order.user?.name ?? 'Unknown'}</p>
            <p className="text-muted-foreground text-xs">{order.user?.email ?? ''}</p>
          </div>

          {/* Shipping */}
          <div className="bg-card border-border rounded-xl border p-5">
            <h3 className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
              <Truck className="h-4 w-4" /> Shipping
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="text-muted-foreground mt-0.5 h-3 w-3 shrink-0" />
                <span className="text-foreground">
                  {order.shippingAddress}, {order.shippingCity}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="text-muted-foreground h-3 w-3" />
                <span className="text-foreground">{order.shippingPhone}</span>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-card border-border rounded-xl border p-5">
            <h3 className="text-foreground mb-3 flex items-center gap-2 text-sm font-semibold">
              <CreditCard className="h-4 w-4" /> Payment
            </h3>
            <span className="bg-muted text-foreground rounded px-2 py-0.5 text-xs font-medium">
              {order.paymentMethod}
            </span>
          </div>

          {/* Note */}
          {order.note && (
            <div className="bg-card border-border rounded-xl border p-5">
              <h3 className="text-foreground mb-2 text-sm font-semibold">Note</h3>
              <p className="text-muted-foreground text-xs">{order.note}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
