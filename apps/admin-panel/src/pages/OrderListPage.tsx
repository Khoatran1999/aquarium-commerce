import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Order, OrderStatus } from '@repo/types';
import DataTable from '../components/DataTable';
import StatusBadge from '../components/StatusBadge';

const STATUS_TABS: { label: string; value: OrderStatus | 'ALL' }[] = [
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
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', { page, status: statusFilter, search }],
    queryFn: () =>
      adminService.getOrders({
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
      render: (o: Order) => (
        <span className="text-primary font-mono text-xs font-medium">#{o.id.slice(-8)}</span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (o: Order) => (
        <div>
          <p className="text-foreground text-sm font-medium">{o.user?.name ?? 'Unknown'}</p>
          <p className="text-muted-foreground text-xs">{o.user?.email ?? ''}</p>
        </div>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (o: Order) => <span className="text-foreground text-sm">{o.items?.length ?? 0}</span>,
    },
    {
      key: 'total',
      label: 'Total',
      render: (o: Order) => (
        <span className="text-foreground text-sm font-semibold">${o.total.toFixed(2)}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (o: Order) => <StatusBadge status={o.status} />,
    },
    {
      key: 'date',
      label: 'Date',
      render: (o: Order) => (
        <span className="text-muted-foreground text-xs">
          {new Date(o.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Orders</h1>
        <p className="text-muted-foreground text-sm">{meta?.total ?? 0} total orders</p>
      </div>

      {/* Status Tabs */}
      <div className="border-border flex flex-wrap gap-1 border-b">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setStatusFilter(tab.value);
              setPage(1);
            }}
            className={`px-3 py-2 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'border-primary text-primary border-b-2'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by order ID, customer..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2"
        />
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={orders}
        page={page}
        totalPages={meta?.totalPages ?? 1}
        total={meta?.total ?? 0}
        loading={isLoading}
        onPageChange={setPage}
        onRowClick={(o) => navigate(`/orders/${o.id}`)}
        getRowKey={(o) => o.id}
        emptyMessage="No orders found"
      />
    </div>
  );
}
