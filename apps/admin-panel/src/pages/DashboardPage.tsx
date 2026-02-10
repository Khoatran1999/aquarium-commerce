import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Users,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  CONFIRMED: '#136dec',
  PREPARING: '#00ced1',
  SHIPPING: '#ff7f50',
  DELIVERED: '#10b981',
  CANCELLED: '#ef4444',
  REFUNDED: '#94a3b8',
};

type Period = '7d' | '30d' | '12m';
const PERIOD_LABELS: Record<Period, string> = {
  '7d': '7 Days',
  '30d': '30 Days',
  '12m': '12 Months',
};

export default function DashboardPage() {
  const [period, setPeriod] = useState<Period>('30d');

  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin', 'stats', period],
    queryFn: () => adminService.getStats(period),
    refetchInterval: 30_000,
  });

  const d = stats?.data;

  const orderStatusData =
    d?.ordersByStatus?.map((s) => ({
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

  const formatCurrency = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M đ`
      : n >= 1_000
        ? `${(n / 1_000).toFixed(0)}K đ`
        : `${n.toFixed(0)} đ`;

  const formatCompactCurrency = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M`
      : n >= 1_000
        ? `${(n / 1_000).toFixed(0)}K`
        : `${n}`;

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card border-border h-28 animate-pulse rounded-xl border" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="bg-card border-border h-80 animate-pulse rounded-xl border" />
          <div className="bg-card border-border h-80 animate-pulse rounded-xl border" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Overview of your store performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(d?.totalRevenue ?? 0)}
          icon={DollarSign}
        />
        <StatsCard title="Total Orders" value={d?.totalOrders ?? 0} icon={ShoppingCart} />
        <StatsCard title="Active Products" value={d?.totalProducts ?? 0} icon={Package} />
        <StatsCard title="Total Customers" value={d?.totalUsers ?? 0} icon={Users} />
      </div>

      {/* Revenue Trend Chart — Full Width */}
      <div className="bg-card border-border rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-primary h-4 w-4" />
            <h2 className="text-foreground text-sm font-semibold">Revenue Trend</h2>
          </div>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-800">
            {(Object.entries(PERIOD_LABELS) as [Period, string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  period === key
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {revenueTrendData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueTrendData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ced1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ced1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#136dec" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#136dec" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis
                yAxisId="revenue"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCompactCurrency(v)}
              />
              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: 12,
                }}
                formatter={(value: number, name: string) => [
                  name === 'revenue' ? formatCurrency(value) : value,
                  name === 'revenue' ? 'Revenue' : 'Orders',
                ]}
              />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
              />
              <Area
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#00ced1"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                name="Revenue"
              />
              <Area
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="#136dec"
                strokeWidth={2}
                fill="url(#colorOrders)"
                name="Orders"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-muted-foreground flex h-60 items-center justify-center text-sm">
            No revenue data for this period
          </div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Orders by Status */}
        <div className="bg-card border-border rounded-xl border p-5">
          <h2 className="text-foreground mb-4 text-sm font-semibold">Orders by Status</h2>
          {orderStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  stroke="none"
                >
                  {orderStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: 12,
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted-foreground flex h-60 items-center justify-center text-sm">
              No order data yet
            </div>
          )}
        </div>

        {/* Top Selling Products */}
        <div className="bg-card border-border rounded-xl border p-5">
          <h2 className="text-foreground mb-4 text-sm font-semibold">Top Selling Products</h2>
          {topProductsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProductsData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    fontSize: 12,
                  }}
                  formatter={(val: number, name: string) => [
                    val,
                    name === 'totalSold' ? 'Units Sold' : 'Orders',
                  ]}
                  labelFormatter={(label) => {
                    const item = topProductsData.find((p) => p.name === label);
                    return item?.fullName ?? label;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 11, paddingBottom: 10 }}
                />
                <Bar
                  dataKey="totalSold"
                  fill="#00ced1"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                  name="Units Sold"
                />
                <Bar
                  dataKey="orderCount"
                  fill="#136dec"
                  radius={[0, 4, 4, 0]}
                  barSize={16}
                  name="Orders"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-muted-foreground flex h-60 items-center justify-center text-sm">
              No sales data yet
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row: Recent Orders + Low Stock */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="bg-card border-border rounded-xl border lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-foreground text-sm font-semibold">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-primary flex items-center gap-1 text-xs font-medium hover:underline"
            >
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-border border-t">
                  <th className="text-muted-foreground px-5 py-2.5 text-left text-xs font-semibold">
                    Order ID
                  </th>
                  <th className="text-muted-foreground px-5 py-2.5 text-left text-xs font-semibold">
                    Customer
                  </th>
                  <th className="text-muted-foreground px-5 py-2.5 text-left text-xs font-semibold">
                    Status
                  </th>
                  <th className="text-muted-foreground px-5 py-2.5 text-right text-xs font-semibold">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {(d?.recentOrders ?? []).map((order) => (
                  <tr key={order.id} className="border-border border-t">
                    <td className="text-foreground px-5 py-2.5 font-mono text-xs">
                      <Link to={`/orders/${order.id}`} className="text-primary hover:underline">
                        #{order.id.slice(-8)}
                      </Link>
                    </td>
                    <td className="text-foreground px-5 py-2.5 text-xs">
                      {order.user?.name ?? 'Unknown'}
                    </td>
                    <td className="px-5 py-2.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="text-foreground px-5 py-2.5 text-right text-xs font-semibold">
                      {order.total.toLocaleString()} đ
                    </td>
                  </tr>
                ))}
                {(!d?.recentOrders || d.recentOrders.length === 0) && (
                  <tr>
                    <td colSpan={4} className="text-muted-foreground px-5 py-8 text-center text-xs">
                      No recent orders
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card border-border rounded-xl border">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="text-foreground flex items-center gap-2 text-sm font-semibold">
              <AlertTriangle className="text-warning h-4 w-4" />
              Low Stock
            </h2>
            <Link to="/inventory" className="text-primary text-xs font-medium hover:underline">
              Manage
            </Link>
          </div>
          <div className="space-y-1 px-3 pb-3">
            {(d?.lowStockProducts ?? []).map((p) => (
              <div
                key={p.id}
                className="hover:bg-muted flex items-center gap-3 rounded-lg px-2 py-2 transition-colors"
              >
                <img
                  src={p.images?.[0]?.url ?? '/placeholder-fish.jpg'}
                  alt={p.name}
                  className="h-8 w-8 rounded-lg object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-xs font-medium">{p.name}</p>
                  <p
                    className={`text-xs font-semibold ${p.available <= 2 ? 'text-danger' : 'text-warning'}`}
                  >
                    {p.available} left
                  </p>
                </div>
              </div>
            ))}
            {(!d?.lowStockProducts || d.lowStockProducts.length === 0) && (
              <p className="text-muted-foreground py-6 text-center text-xs">All stocked up!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
