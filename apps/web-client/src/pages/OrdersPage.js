import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '@repo/services';
import { Skeleton } from '@repo/ui';
import { queryKeys } from '../hooks';
const TABS = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Shipping', value: 'SHIPPING' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
];
const statusColor = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    PREPARING: 'bg-purple-100 text-purple-800',
    SHIPPING: 'bg-cyan-100 text-cyan-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    CANCELLED: 'bg-red-100 text-red-800',
    REFUNDED: 'bg-gray-100 text-gray-800',
};
function OrderCard({ order }) {
    const firstItem = order.items?.[0];
    return (_jsx(motion.div, { layout: true, initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -10 }, children: _jsxs(Link, { to: `/orders/${order.id}`, className: "bg-card border-border hover:shadow-card block rounded-2xl border p-5 transition-shadow", children: [_jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("span", { className: `rounded-full px-3 py-1 text-xs font-semibold ${statusColor[order.status] ?? 'bg-gray-100 text-gray-800'}`, children: order.status }), _jsx("span", { className: "text-muted-foreground text-xs", children: new Date(order.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            }) })] }), _jsxs("p", { className: "text-muted-foreground mt-2 font-mono text-xs", children: ["#", order.id.slice(0, 8)] })] }), _jsxs("p", { className: "text-primary text-lg font-bold", children: ["$", order.total.toFixed(2)] })] }), firstItem && (_jsxs("div", { className: "border-border mt-4 flex items-center gap-3 border-t pt-4", children: [firstItem.product?.images?.[0]?.url && (_jsx("img", { src: firstItem.product.images[0].url, alt: firstItem.name, className: "h-10 w-10 rounded-lg object-cover" })), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-foreground line-clamp-1 text-sm font-medium", children: firstItem.name }), _jsxs("p", { className: "text-muted-foreground text-xs", children: ["x", firstItem.quantity, (order.items?.length ?? 0) > 1 && ` and ${(order.items?.length ?? 0) - 1} more`] })] })] }))] }) }));
}
export default function OrdersPage() {
    const [tab, setTab] = useState('ALL');
    const [page, setPage] = useState(1);
    const { data, isLoading } = useQuery({
        queryKey: [...queryKeys.orders.all, page],
        queryFn: () => orderService.getOrders({ page, limit: 10 }),
    });
    const orders = data?.data ?? [];
    const filtered = tab === 'ALL' ? orders : orders.filter((o) => o.status === tab);
    const meta = data?.meta;
    return (_jsxs(_Fragment, { children: [_jsxs(Helmet, { children: [_jsx("title", { children: "My Orders \u2013 AquaLuxe" }), _jsx("meta", { name: "robots", content: "noindex" })] }), _jsxs("div", { className: "mx-auto max-w-[1280px] px-4 py-8 md:px-10", children: [_jsx("h1", { className: "text-foreground mb-6 text-2xl font-bold", children: "My Orders" }), _jsx("div", { className: "mb-6 flex gap-2 overflow-x-auto pb-2", children: TABS.map((t) => (_jsx("button", { onClick: () => setTab(t.value), className: `whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${tab === t.value
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'}`, children: t.label }, t.value))) }), isLoading && (_jsx("div", { className: "flex flex-col gap-4", children: Array.from({ length: 3 }).map((_, i) => (_jsx(Skeleton, { className: "h-32 w-full rounded-2xl" }, i))) })), !isLoading && filtered.length === 0 && (_jsxs("div", { className: "py-20 text-center", children: [_jsx("p", { className: "text-5xl", children: "\uD83D\uDCE6" }), _jsx("p", { className: "text-muted-foreground mt-3", children: "No orders found" }), _jsx(Link, { to: "/products", className: "text-primary mt-2 inline-block text-sm font-medium hover:underline", children: "Start Shopping" })] })), _jsx("div", { className: "flex flex-col gap-4", children: _jsx(AnimatePresence, { mode: "popLayout", children: filtered.map((order) => (_jsx(OrderCard, { order: order }, order.id))) }) }), meta && meta.totalPages > 1 && (_jsxs("div", { className: "mt-8 flex items-center justify-center gap-2", children: [_jsx("button", { disabled: page <= 1, onClick: () => setPage((p) => p - 1), className: "text-muted-foreground hover:text-foreground text-sm font-medium disabled:opacity-40", children: "Previous" }), _jsxs("span", { className: "text-muted-foreground text-sm", children: ["Page ", page, " of ", meta.totalPages] }), _jsx("button", { disabled: page >= meta.totalPages, onClick: () => setPage((p) => p + 1), className: "text-muted-foreground hover:text-foreground text-sm font-medium disabled:opacity-40", children: "Next" })] }))] })] }));
}
