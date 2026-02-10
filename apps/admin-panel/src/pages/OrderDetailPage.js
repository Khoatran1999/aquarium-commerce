import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { ArrowLeft, User, MapPin, Phone, CreditCard, Truck } from 'lucide-react';
import toast from 'react-hot-toast';
import StatusBadge from '../components/StatusBadge';
const STATUS_FLOW = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'];
const NEXT_STATUS = {
    PENDING: 'CONFIRMED',
    CONFIRMED: 'PREPARING',
    PREPARING: 'SHIPPING',
    SHIPPING: 'DELIVERED',
};
export default function OrderDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'order', id],
        queryFn: () => adminService.getOrder(id),
        enabled: !!id,
    });
    const statusMutation = useMutation({
        mutationFn: (status) => adminService.updateOrderStatus(id, status),
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
        return (_jsxs("div", { className: "space-y-4 p-6", children: [_jsx("div", { className: "bg-card border-border h-12 w-48 animate-pulse rounded-xl border" }), _jsx("div", { className: "bg-card border-border h-60 animate-pulse rounded-xl border" })] }));
    }
    if (!order) {
        return (_jsx("div", { className: "p-6", children: _jsx("p", { className: "text-muted-foreground", children: "Order not found." }) }));
    }
    const currentIdx = STATUS_FLOW.indexOf(order.status);
    const nextStatus = NEXT_STATUS[order.status];
    const isCancelled = order.status === 'CANCELLED' || order.status === 'REFUNDED';
    return (_jsxs("div", { className: "mx-auto max-w-4xl space-y-6 p-6", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => navigate('/orders'), className: "hover:bg-muted rounded-lg p-2 transition-colors", children: _jsx(ArrowLeft, { className: "text-muted-foreground h-5 w-5" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("h1", { className: "text-foreground text-xl font-bold", children: ["Order #", order.id.slice(-8)] }), _jsx(StatusBadge, { status: order.status })] }), _jsxs("p", { className: "text-muted-foreground text-sm", children: ["Placed on", ' ', new Date(order.createdAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })] })] })] }), _jsxs("div", { className: "flex gap-2", children: [!isCancelled && nextStatus && (_jsx("button", { onClick: () => statusMutation.mutate(nextStatus), disabled: statusMutation.isPending, className: "bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50", children: statusMutation.isPending ? 'Updating...' : `Mark as ${nextStatus}` })), order.status === 'PENDING' && (_jsx("button", { onClick: () => statusMutation.mutate('CANCELLED'), disabled: statusMutation.isPending, className: "bg-danger/10 text-danger hover:bg-danger/20 rounded-lg px-4 py-2 text-sm font-medium transition-colors", children: "Cancel Order" }))] })] }), !isCancelled && (_jsx("div", { className: "bg-card border-border rounded-xl border p-5", children: _jsx("div", { className: "flex justify-between", children: STATUS_FLOW.map((s, i) => {
                        const isCompleted = i <= currentIdx;
                        const isCurrent = i === currentIdx;
                        return (_jsxs("div", { className: "flex flex-1 flex-col items-center", children: [_jsxs("div", { className: "relative flex w-full items-center justify-center", children: [i > 0 && (_jsx("div", { className: `absolute left-0 right-1/2 top-1/2 h-0.5 -translate-y-1/2 ${isCompleted ? 'bg-primary' : 'bg-border'}` })), i < STATUS_FLOW.length - 1 && (_jsx("div", { className: `absolute left-1/2 right-0 top-1/2 h-0.5 -translate-y-1/2 ${i < currentIdx ? 'bg-primary' : 'bg-border'}` })), _jsx("div", { className: `relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isCurrent
                                                ? 'bg-primary ring-primary/20 text-white ring-4'
                                                : isCompleted
                                                    ? 'bg-primary text-white'
                                                    : 'bg-muted text-muted-foreground'}`, children: i + 1 })] }), _jsx("span", { className: `mt-2 text-xs font-medium ${isCompleted ? 'text-primary' : 'text-muted-foreground'}`, children: s.charAt(0) + s.slice(1).toLowerCase() })] }, s));
                    }) }) })), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "bg-card border-border rounded-xl border lg:col-span-2", children: [_jsxs("h2", { className: "text-foreground border-border border-b px-5 py-4 text-sm font-semibold", children: ["Order Items (", order.items?.length ?? 0, ")"] }), _jsx("div", { className: "divide-border divide-y", children: (order.items ?? []).map((item) => (_jsxs("div", { className: "flex items-center gap-4 px-5 py-3", children: [_jsx("img", { src: item.product?.images?.[0]?.url ?? '/placeholder-fish.jpg', alt: item.name, className: "h-12 w-12 rounded-lg object-cover" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-foreground text-sm font-medium", children: item.name }), _jsxs("p", { className: "text-muted-foreground text-xs", children: ["Qty: ", item.quantity] })] }), _jsxs("span", { className: "text-foreground text-sm font-semibold", children: ["$", (item.price * item.quantity).toFixed(2)] })] }, item.id))) }), _jsxs("div", { className: "border-border space-y-1 border-t px-5 py-4", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { className: "text-foreground", children: ["$", order.subtotal.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-muted-foreground", children: "Shipping" }), _jsx("span", { className: "text-foreground", children: order.shippingFee === 0 ? 'Free' : `$${order.shippingFee.toFixed(2)}` })] }), _jsxs("div", { className: "border-border flex justify-between border-t pt-2 text-sm font-bold", children: [_jsx("span", { className: "text-foreground", children: "Total" }), _jsxs("span", { className: "text-foreground", children: ["$", order.total.toFixed(2)] })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsxs("h3", { className: "text-foreground mb-3 flex items-center gap-2 text-sm font-semibold", children: [_jsx(User, { className: "h-4 w-4" }), " Customer"] }), _jsx("p", { className: "text-foreground text-sm", children: order.user?.name ?? 'Unknown' }), _jsx("p", { className: "text-muted-foreground text-xs", children: order.user?.email ?? '' })] }), _jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsxs("h3", { className: "text-foreground mb-3 flex items-center gap-2 text-sm font-semibold", children: [_jsx(Truck, { className: "h-4 w-4" }), " Shipping"] }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { className: "flex items-start gap-2", children: [_jsx(MapPin, { className: "text-muted-foreground mt-0.5 h-3 w-3 shrink-0" }), _jsxs("span", { className: "text-foreground", children: [order.shippingAddress, ", ", order.shippingCity] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Phone, { className: "text-muted-foreground h-3 w-3" }), _jsx("span", { className: "text-foreground", children: order.shippingPhone })] })] })] }), _jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsxs("h3", { className: "text-foreground mb-3 flex items-center gap-2 text-sm font-semibold", children: [_jsx(CreditCard, { className: "h-4 w-4" }), " Payment"] }), _jsx("span", { className: "bg-muted text-foreground rounded px-2 py-0.5 text-xs font-medium", children: order.paymentMethod })] }), order.note && (_jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsx("h3", { className: "text-foreground mb-2 text-sm font-semibold", children: "Note" }), _jsx("p", { className: "text-muted-foreground text-xs", children: order.note })] }))] })] })] }));
}
