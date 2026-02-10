import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { DollarSign, ShoppingCart, Package, Users, AlertTriangle, ArrowRight, TrendingUp, } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, } from 'recharts';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
const STATUS_COLORS = {
    PENDING: '#f59e0b',
    CONFIRMED: '#136dec',
    PREPARING: '#00ced1',
    SHIPPING: '#ff7f50',
    DELIVERED: '#10b981',
    CANCELLED: '#ef4444',
    REFUNDED: '#94a3b8',
};
const PERIOD_LABELS = {
    '7d': '7 Days',
    '30d': '30 Days',
    '12m': '12 Months',
};
export default function DashboardPage() {
    const [period, setPeriod] = useState('30d');
    const { data: stats, isLoading } = useQuery({
        queryKey: ['admin', 'stats', period],
        queryFn: () => adminService.getStats(period),
        refetchInterval: 30_000,
    });
    const d = stats?.data;
    const orderStatusData = d?.ordersByStatus?.map((s) => ({
        name: s.status,
        value: s._count,
        fill: STATUS_COLORS[s.status] ?? '#94a3b8',
    })) ?? [];
    const revenueTrendData = (d?.revenueTrend ?? []).map((item) => ({
        ...item,
        revenue: Number(item.revenue),
        orders: Number(item.orders),
        // Shorten date label
        label: item.date.length > 7 ? item.date.slice(5) : item.date,
    }));
    const topProductsData = (d?.topProducts ?? []).map((item) => ({
        ...item,
        name: item.name.length > 20 ? item.name.slice(0, 18) + '…' : item.name,
        fullName: item.name,
    }));
    const formatCurrency = (n) => n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M đ`
        : n >= 1_000
            ? `${(n / 1_000).toFixed(0)}K đ`
            : `${n.toFixed(0)} đ`;
    const formatCompactCurrency = (n) => n >= 1_000_000
        ? `${(n / 1_000_000).toFixed(1)}M`
        : n >= 1_000
            ? `${(n / 1_000).toFixed(0)}K`
            : `${n}`;
    if (isLoading) {
        return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", children: Array.from({ length: 4 }).map((_, i) => (_jsx("div", { className: "bg-card border-border h-28 animate-pulse rounded-xl border" }, i))) }), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsx("div", { className: "bg-card border-border h-80 animate-pulse rounded-xl border" }), _jsx("div", { className: "bg-card border-border h-80 animate-pulse rounded-xl border" })] })] }));
    }
    return (_jsxs("div", { className: "space-y-6 p-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-foreground text-2xl font-bold", children: "Dashboard" }), _jsx("p", { className: "text-muted-foreground text-sm", children: "Overview of your store performance" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4", children: [_jsx(StatsCard, { title: "Total Revenue", value: formatCurrency(d?.totalRevenue ?? 0), icon: DollarSign }), _jsx(StatsCard, { title: "Total Orders", value: d?.totalOrders ?? 0, icon: ShoppingCart }), _jsx(StatsCard, { title: "Active Products", value: d?.totalProducts ?? 0, icon: Package }), _jsx(StatsCard, { title: "Total Customers", value: d?.totalUsers ?? 0, icon: Users })] }), _jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsxs("div", { className: "mb-4 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(TrendingUp, { className: "text-primary h-4 w-4" }), _jsx("h2", { className: "text-foreground text-sm font-semibold", children: "Revenue Trend" })] }), _jsx("div", { className: "flex gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800", children: Object.entries(PERIOD_LABELS).map(([key, label]) => (_jsx("button", { onClick: () => setPeriod(key), className: `rounded-md px-3 py-1 text-xs font-medium transition-colors ${period === key
                                        ? 'bg-primary text-white shadow-sm'
                                        : 'text-muted-foreground hover:text-foreground'}`, children: label }, key))) })] }), revenueTrendData.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 300, children: _jsxs(AreaChart, { data: revenueTrendData, margin: { top: 5, right: 20, left: 10, bottom: 5 }, children: [_jsxs("defs", { children: [_jsxs("linearGradient", { id: "colorRevenue", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#00ced1", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#00ced1", stopOpacity: 0 })] }), _jsxs("linearGradient", { id: "colorOrders", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#136dec", stopOpacity: 0.3 }), _jsx("stop", { offset: "95%", stopColor: "#136dec", stopOpacity: 0 })] })] }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#e5e7eb", vertical: false }), _jsx(XAxis, { dataKey: "label", tick: { fontSize: 11 }, axisLine: false, tickLine: false }), _jsx(YAxis, { yAxisId: "revenue", tick: { fontSize: 11 }, axisLine: false, tickLine: false, tickFormatter: (v) => formatCompactCurrency(v) }), _jsx(YAxis, { yAxisId: "orders", orientation: "right", tick: { fontSize: 11 }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: {
                                        borderRadius: 8,
                                        border: 'none',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                        fontSize: 12,
                                    }, formatter: (value, name) => [
                                        name === 'revenue' ? formatCurrency(value) : value,
                                        name === 'revenue' ? 'Revenue' : 'Orders',
                                    ] }), _jsx(Legend, { verticalAlign: "top", align: "right", iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: 11, paddingBottom: 10 } }), _jsx(Area, { yAxisId: "revenue", type: "monotone", dataKey: "revenue", stroke: "#00ced1", strokeWidth: 2, fill: "url(#colorRevenue)", name: "Revenue" }), _jsx(Area, { yAxisId: "orders", type: "monotone", dataKey: "orders", stroke: "#136dec", strokeWidth: 2, fill: "url(#colorOrders)", name: "Orders" })] }) })) : (_jsx("div", { className: "text-muted-foreground flex h-60 items-center justify-center text-sm", children: "No revenue data for this period" }))] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-2", children: [_jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsx("h2", { className: "text-foreground mb-4 text-sm font-semibold", children: "Orders by Status" }), orderStatusData.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(PieChart, { children: [_jsx(Pie, { data: orderStatusData, dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", innerRadius: 60, outerRadius: 100, paddingAngle: 3, stroke: "none", children: orderStatusData.map((entry, i) => (_jsx(Cell, { fill: entry.fill }, i))) }), _jsx(Tooltip, { contentStyle: {
                                                borderRadius: 8,
                                                border: 'none',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                fontSize: 12,
                                            } }), _jsx(Legend, { verticalAlign: "bottom", iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: 11 } })] }) })) : (_jsx("div", { className: "text-muted-foreground flex h-60 items-center justify-center text-sm", children: "No order data yet" }))] }), _jsxs("div", { className: "bg-card border-border rounded-xl border p-5", children: [_jsx("h2", { className: "text-foreground mb-4 text-sm font-semibold", children: "Top Selling Products" }), topProductsData.length > 0 ? (_jsx(ResponsiveContainer, { width: "100%", height: 260, children: _jsxs(BarChart, { data: topProductsData, layout: "vertical", margin: { left: 10, right: 20 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", horizontal: false, stroke: "#e5e7eb" }), _jsx(XAxis, { type: "number", tick: { fontSize: 11 }, axisLine: false, tickLine: false }), _jsx(YAxis, { dataKey: "name", type: "category", width: 140, tick: { fontSize: 10 }, axisLine: false, tickLine: false }), _jsx(Tooltip, { contentStyle: {
                                                borderRadius: 8,
                                                border: 'none',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                fontSize: 12,
                                            }, formatter: (val, name) => [
                                                val,
                                                name === 'totalSold' ? 'Units Sold' : 'Orders',
                                            ], labelFormatter: (label) => {
                                                const item = topProductsData.find((p) => p.name === label);
                                                return item?.fullName ?? label;
                                            } }), _jsx(Legend, { verticalAlign: "top", iconType: "circle", iconSize: 8, wrapperStyle: { fontSize: 11, paddingBottom: 10 } }), _jsx(Bar, { dataKey: "totalSold", fill: "#00ced1", radius: [0, 4, 4, 0], barSize: 16, name: "Units Sold" }), _jsx(Bar, { dataKey: "orderCount", fill: "#136dec", radius: [0, 4, 4, 0], barSize: 16, name: "Orders" })] }) })) : (_jsx("div", { className: "text-muted-foreground flex h-60 items-center justify-center text-sm", children: "No sales data yet" }))] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-4 lg:grid-cols-3", children: [_jsxs("div", { className: "bg-card border-border rounded-xl border lg:col-span-2", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4", children: [_jsx("h2", { className: "text-foreground text-sm font-semibold", children: "Recent Orders" }), _jsxs(Link, { to: "/orders", className: "text-primary flex items-center gap-1 text-xs font-medium hover:underline", children: ["View All ", _jsx(ArrowRight, { className: "h-3 w-3" })] })] }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-border border-t", children: [_jsx("th", { className: "text-muted-foreground px-5 py-2.5 text-left text-xs font-semibold", children: "Order ID" }), _jsx("th", { className: "text-muted-foreground px-5 py-2.5 text-left text-xs font-semibold", children: "Customer" }), _jsx("th", { className: "text-muted-foreground px-5 py-2.5 text-left text-xs font-semibold", children: "Status" }), _jsx("th", { className: "text-muted-foreground px-5 py-2.5 text-right text-xs font-semibold", children: "Total" })] }) }), _jsxs("tbody", { children: [(d?.recentOrders ?? []).map((order) => (_jsxs("tr", { className: "border-border border-t", children: [_jsx("td", { className: "text-foreground px-5 py-2.5 font-mono text-xs", children: _jsxs(Link, { to: `/orders/${order.id}`, className: "text-primary hover:underline", children: ["#", order.id.slice(-8)] }) }), _jsx("td", { className: "text-foreground px-5 py-2.5 text-xs", children: order.user?.name ?? 'Unknown' }), _jsx("td", { className: "px-5 py-2.5", children: _jsx(StatusBadge, { status: order.status }) }), _jsxs("td", { className: "text-foreground px-5 py-2.5 text-right text-xs font-semibold", children: [order.total.toLocaleString(), " \u0111"] })] }, order.id))), (!d?.recentOrders || d.recentOrders.length === 0) && (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "text-muted-foreground px-5 py-8 text-center text-xs", children: "No recent orders" }) }))] })] }) })] }), _jsxs("div", { className: "bg-card border-border rounded-xl border", children: [_jsxs("div", { className: "flex items-center justify-between px-5 py-4", children: [_jsxs("h2", { className: "text-foreground flex items-center gap-2 text-sm font-semibold", children: [_jsx(AlertTriangle, { className: "text-warning h-4 w-4" }), "Low Stock"] }), _jsx(Link, { to: "/inventory", className: "text-primary text-xs font-medium hover:underline", children: "Manage" })] }), _jsxs("div", { className: "space-y-1 px-3 pb-3", children: [(d?.lowStockProducts ?? []).map((p) => (_jsxs("div", { className: "hover:bg-muted flex items-center gap-3 rounded-lg px-2 py-2 transition-colors", children: [_jsx("img", { src: p.images?.[0]?.url ?? '/placeholder-fish.jpg', alt: p.name, className: "h-8 w-8 rounded-lg object-cover" }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("p", { className: "text-foreground truncate text-xs font-medium", children: p.name }), _jsxs("p", { className: `text-xs font-semibold ${p.available <= 2 ? 'text-danger' : 'text-warning'}`, children: [p.available, " left"] })] })] }, p.id))), (!d?.lowStockProducts || d.lowStockProducts.length === 0) && (_jsx("p", { className: "text-muted-foreground py-6 text-center text-xs", children: "All stocked up!" }))] })] })] })] }));
}
