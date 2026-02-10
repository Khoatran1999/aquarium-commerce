import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';
const STATUS_TABS = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'PENDING' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Shipping', value: 'SHIPPING' },
    { label: 'Delivered', value: 'DELIVERED' },
    { label: 'Cancelled', value: 'CANCELLED' },
];
export default function OrderListPage() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [search, setSearch] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'orders', { page, status: statusFilter, search }],
        queryFn: () => adminService.getOrders({
            page,
            limit: 10,
            status: statusFilter === 'ALL' ? undefined : statusFilter,
            search: search || undefined,
        }),
    });
    const orders = data?.data ?? [];
    const meta = data?.meta;
    const columns = [
        {
            key: 'id',
            label: 'Order ID',
            render: (o) => (_jsxs("span", { className: "text-primary font-mono text-xs font-medium", children: ["#", o.id.slice(-8)] })),
        },
        {
            key: 'customer',
            label: 'Customer',
            render: (o) => (_jsxs("div", { children: [_jsx("p", { className: "text-foreground text-sm font-medium", children: o.user?.name ?? 'Unknown' }), _jsx("p", { className: "text-muted-foreground text-xs", children: o.user?.email ?? '' })] })),
        },
        {
            key: 'items',
            label: 'Items',
            render: (o) => _jsx("span", { className: "text-foreground text-sm", children: o.items?.length ?? 0 }),
        },
        {
            key: 'total',
            label: 'Total',
            render: (o) => (_jsxs("span", { className: "text-foreground text-sm font-semibold", children: ["$", o.total.toFixed(2)] })),
        },
        {
            key: 'status',
            label: 'Status',
            render: (o) => _jsx(StatusBadge, { status: o.status }),
        },
        {
            key: 'date',
            label: 'Date',
            render: (o) => (_jsx("span", { className: "text-muted-foreground text-xs", children: new Date(o.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                }) })),
        },
    ];
    return (_jsxs("div", { className: "space-y-4 p-6", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-foreground text-2xl font-bold", children: "Orders" }), _jsxs("p", { className: "text-muted-foreground text-sm", children: [meta?.total ?? 0, " total orders"] })] }), _jsx("div", { className: "border-border flex flex-wrap gap-1 border-b", children: STATUS_TABS.map((tab) => (_jsx("button", { onClick: () => {
                        setStatusFilter(tab.value);
                        setPage(1);
                    }, className: `px-3 py-2 text-sm font-medium transition-colors ${statusFilter === tab.value
                        ? 'border-primary text-primary border-b-2'
                        : 'text-muted-foreground hover:text-foreground'}`, children: tab.label }, tab.value))) }), _jsxs("div", { className: "relative max-w-sm", children: [_jsx(Search, { className: "text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" }), _jsx("input", { type: "text", placeholder: "Search by order ID, customer...", value: search, onChange: (e) => {
                            setSearch(e.target.value);
                            setPage(1);
                        }, className: "bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2" })] }), _jsx(DataTable, { columns: columns, data: orders, page: page, totalPages: meta?.totalPages ?? 1, total: meta?.total ?? 0, loading: isLoading, onPageChange: setPage, onRowClick: (o) => navigate(`/orders/${o.id}`), getRowKey: (o) => o.id, emptyMessage: "No orders found" })] }));
}
