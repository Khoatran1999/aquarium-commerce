import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { orderService } from '@repo/services';
import { Skeleton } from '@repo/ui';
import { queryKeys } from '../hooks';
const STEPS = ['PENDING', 'CONFIRMED', 'PREPARING', 'SHIPPING', 'DELIVERED'];
const stepLabels = {
    PENDING: 'Pending',
    CONFIRMED: 'Confirmed',
    PREPARING: 'Preparing',
    SHIPPING: 'Shipping',
    DELIVERED: 'Delivered',
};
const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    SHIPPING: 'bg-cyan-100 text-cyan-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
};
function ProgressBar({ status }) {
    const cancelled = status === 'CANCELLED' || status === 'REFUNDED';
    const activeIdx = cancelled ? -1 : STEPS.indexOf(status);
    return (_jsx("div", { className: "flex items-center gap-1", children: STEPS.map((step, i) => {
            const done = !cancelled && i <= activeIdx;
            return (_jsxs("div", { className: "flex flex-1 flex-col items-center gap-2", children: [_jsxs("div", { className: "flex w-full items-center", children: [_jsx(motion.div, { className: `z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${done ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`, initial: { scale: 0.8 }, animate: { scale: 1 }, transition: { delay: i * 0.1 }, children: done ? '✓' : i + 1 }), i < STEPS.length - 1 && (_jsx("div", { className: "bg-muted relative mx-1 h-1 flex-1 overflow-hidden rounded-full", children: !cancelled && i < activeIdx && (_jsx(motion.div, { className: "bg-primary absolute inset-0", initial: { scaleX: 0 }, animate: { scaleX: 1 }, transition: { delay: i * 0.15, duration: 0.3 }, style: { transformOrigin: 'left' } })) }))] }), _jsx("span", { className: `text-center text-[10px] font-medium md:text-xs ${done ? 'text-primary' : 'text-muted-foreground'}`, children: stepLabels[step] })] }, step));
        }) }));
}
export default function OrderDetailPage() {
    const { id } = useParams();
    const { data, isLoading } = useQuery({
        queryKey: queryKeys.orders.detail(id),
        queryFn: () => orderService.getOrder(id),
        enabled: !!id,
    });
    const order = data?.data;
    if (isLoading) {
        return (_jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [_jsx(Skeleton, { className: "mb-4 h-8 w-48" }), _jsx(Skeleton, { className: "mb-8 h-20 w-full rounded-2xl" }), _jsx(Skeleton, { className: "h-64 w-full rounded-2xl" })] }));
    }
    if (!order) {
        return (_jsxs("div", { className: "flex min-h-[50vh] flex-col items-center justify-center text-center", children: [_jsx("p", { className: "text-5xl", children: "\uD83D\uDD0D" }), _jsx("p", { className: "text-foreground mt-3 text-lg font-semibold", children: "Order not found" }), _jsx(Link, { to: "/orders", className: "text-primary mt-2 text-sm hover:underline", children: "Back to Orders" })] }));
    }
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsxs("title", { children: ["Order #", order.id.slice(0, 8), " \u2013 AquaLuxe"] }), _jsx("meta", { name: "robots", content: "noindex" })] }), _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [_jsxs("div", { className: "mb-6 flex flex-wrap items-center justify-between gap-4", children: [_jsxs("div", { children: [_jsx(Link, { to: "/orders", className: "text-primary mb-2 inline-flex items-center gap-1 text-sm hover:underline", children: "\u2190 Back to Orders" }), _jsxs("h1", { className: "text-foreground text-2xl font-bold", children: ["Order #", order.id.slice(0, 8)] }), _jsxs("p", { className: "text-muted-foreground text-sm", children: ["Placed on", ' ', new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })] })] }), _jsx("span", { className: `rounded-full px-4 py-2 text-sm font-semibold ${statusColor[order.status] ?? 'bg-gray-100 text-gray-800'}`, children: order.status })] }), order.status !== 'CANCELLED' && order.status !== 'REFUNDED' && (_jsx("div", { className: "bg-card border-border mb-8 rounded-2xl border p-6", children: _jsx(ProgressBar, { status: order.status }) })), _jsxs("div", { className: "grid gap-8 lg:grid-cols-[1fr_380px]", children: [_jsxs("div", { className: "bg-card border-border rounded-2xl border p-6", children: [_jsx("h2", { className: "text-foreground mb-4 text-lg font-bold", children: "Items" }), _jsx("div", { className: "flex flex-col gap-4", children: order.items?.map((item) => (_jsxs("div", { className: "flex items-center gap-4", children: [item.product?.images?.[0]?.url ? (_jsx("img", { src: item.product.images[0].url, alt: item.name, className: "h-14 w-14 rounded-xl object-cover" })) : (_jsx("div", { className: "bg-muted flex h-14 w-14 items-center justify-center rounded-xl text-xl", children: "\uD83D\uDC1F" })), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx(Link, { to: `/products/${item.product?.slug ?? item.productId}`, className: "text-foreground hover:text-primary line-clamp-1 text-sm font-medium", children: item.name }), _jsxs("p", { className: "text-muted-foreground text-xs", children: ["Qty: ", item.quantity] })] }), _jsxs("span", { className: "text-foreground text-sm font-semibold", children: ["$", (item.price * item.quantity).toFixed(2)] })] }, item.id))) })] }), _jsxs("div", { className: "flex flex-col gap-6", children: [_jsxs("div", { className: "bg-card border-border rounded-2xl border p-6", children: [_jsx("h2", { className: "text-foreground mb-4 text-lg font-bold", children: "Summary" }), _jsxs("div", { className: "flex flex-col gap-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Subtotal" }), _jsxs("span", { className: "text-foreground", children: ["$", order.subtotal.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Shipping" }), _jsx("span", { className: "text-foreground", children: order.shippingFee === 0 ? 'Free' : `$${order.shippingFee.toFixed(2)}` })] }), _jsx("div", { className: "border-border my-1 border-t" }), _jsxs("div", { className: "flex justify-between text-base", children: [_jsx("span", { className: "text-foreground font-bold", children: "Total" }), _jsxs("span", { className: "text-primary font-bold", children: ["$", order.total.toFixed(2)] })] })] })] }), _jsxs("div", { className: "bg-card border-border rounded-2xl border p-6", children: [_jsx("h2", { className: "text-foreground mb-4 text-lg font-bold", children: "Shipping" }), _jsxs("div", { className: "text-sm", children: [_jsx("p", { className: "text-foreground", children: order.shippingPhone }), _jsx("p", { className: "text-muted-foreground mt-1", children: order.shippingAddress }), _jsx("p", { className: "text-muted-foreground", children: order.shippingCity })] })] }), _jsxs("div", { className: "bg-card border-border rounded-2xl border p-6", children: [_jsx("h2", { className: "text-foreground mb-4 text-lg font-bold", children: "Payment" }), _jsx("p", { className: "text-foreground text-sm font-medium", children: order.paymentMethod }), order.note && (_jsxs("p", { className: "text-muted-foreground mt-2 text-sm", children: [_jsx("span", { className: "font-medium", children: "Note:" }), " ", order.note] }))] })] })] })] })] }));
}
