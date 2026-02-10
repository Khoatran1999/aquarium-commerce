import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { Package, AlertTriangle, Plus, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import type { Product, InventoryLog } from '@repo/types';
import DataTable from '../components/DataTable';
import StatsCard from '../components/StatsCard';

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [logPage, setLogPage] = useState(1);
  const [search, setSearch] = useState('');
  const [restockOpen, setRestockOpen] = useState(false);
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(1);

  // Products (for stock overview)
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['admin', 'products', { page: 1, limit: 100, search }],
    queryFn: () => adminService.getProducts({ page: 1, limit: 100, search: search || undefined }),
  });

  // Inventory logs
  const { data: logsData, isLoading: logsLoading } = useQuery({
    queryKey: ['admin', 'inventory-logs', { page: logPage }],
    queryFn: () => adminService.getInventoryLogs({ page: logPage, limit: 10 }),
  });

  const restockMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      adminService.restockProduct(productId, quantity),
    onSuccess: () => {
      toast.success('Product restocked!');
      queryClient.invalidateQueries({ queryKey: ['admin'] });
      setRestockOpen(false);
      setRestockProduct(null);
      setRestockQty(1);
    },
    onError: () => toast.error('Failed to restock'),
  });

  const products: Product[] = productsData?.data ?? [];
  const logs: InventoryLog[] = logsData?.data ?? [];
  const logsMeta = logsData?.meta;

  const totalAvailable = products.reduce((sum, p) => sum + p.available, 0);
  const totalReserved = products.reduce((sum, p) => sum + p.reserved, 0);
  const lowStockCount = products.filter((p) => p.available <= 5 && p.isActive).length;

  // Product stock table columns
  const stockColumns = [
    {
      key: 'product',
      label: 'Product',
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <img
            src={p.images?.[0]?.url ?? '/placeholder-fish.jpg'}
            alt={p.name}
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="text-foreground text-sm font-medium">{p.name}</span>
        </div>
      ),
    },
    {
      key: 'available',
      label: 'Available',
      render: (p: Product) => (
        <span
          className={`text-sm font-semibold ${
            p.available <= 0 ? 'text-danger' : p.available <= 5 ? 'text-warning' : 'text-success'
          }`}
        >
          {p.available}
        </span>
      ),
    },
    {
      key: 'reserved',
      label: 'Reserved',
      render: (p: Product) => <span className="text-foreground text-sm">{p.reserved}</span>,
    },
    {
      key: 'sold',
      label: 'Sold',
      render: (p: Product) => <span className="text-foreground text-sm">{p.sold}</span>,
    },
    {
      key: 'actions',
      label: '',
      className: 'w-28',
      render: (p: Product) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setRestockProduct(p);
            setRestockOpen(true);
          }}
          className="bg-primary/10 text-primary hover:bg-primary/20 inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
        >
          <Plus className="h-3 w-3" />
          Restock
        </button>
      ),
    },
  ];

  // Logs table columns
  const logColumns = [
    {
      key: 'date',
      label: 'Date',
      render: (l: InventoryLog) => (
        <span className="text-muted-foreground text-xs">
          {new Date(l.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      ),
    },
    {
      key: 'product',
      label: 'Product',
      render: (l: InventoryLog) => (
        <span className="text-foreground text-sm">{l.product?.name ?? l.productId.slice(-8)}</span>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      render: (l: InventoryLog) => {
        const colors: Record<string, string> = {
          ADD: 'bg-success/10 text-success',
          RESERVE: 'bg-warning/10 text-warning',
          RELEASE: 'bg-info/10 text-info',
          SELL: 'bg-primary/10 text-primary',
          RETURN: 'bg-secondary/10 text-secondary',
        };
        return (
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[l.action] ?? 'bg-muted text-muted-foreground'}`}
          >
            {l.action}
          </span>
        );
      },
    },
    {
      key: 'quantity',
      label: 'Qty',
      render: (l: InventoryLog) => (
        <span
          className={`text-sm font-semibold ${
            l.action === 'ADD' || l.action === 'RELEASE' || l.action === 'RETURN'
              ? 'text-success'
              : 'text-foreground'
          }`}
        >
          {l.action === 'ADD' || l.action === 'RELEASE' || l.action === 'RETURN' ? '+' : '-'}
          {l.quantity}
        </span>
      ),
    },
    {
      key: 'note',
      label: 'Note',
      render: (l: InventoryLog) => (
        <span className="text-muted-foreground text-xs">{l.note ?? '—'}</span>
      ),
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-foreground text-2xl font-bold">Inventory</h1>
        <p className="text-muted-foreground text-sm">Manage stock levels and restock products</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatsCard title="Total Available" value={totalAvailable} icon={Package} />
        <StatsCard title="Total Reserved" value={totalReserved} icon={Package} />
        <StatsCard
          title="Low Stock Alerts"
          value={lowStockCount}
          icon={AlertTriangle}
          className={lowStockCount > 0 ? 'border-warning/30' : ''}
        />
      </div>

      {/* Product Stock Table */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-foreground text-lg font-semibold">Stock Levels</h2>
          <div className="relative w-64">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2"
            />
          </div>
        </div>
        <DataTable
          columns={stockColumns}
          data={products}
          page={1}
          totalPages={1}
          total={products.length}
          loading={productsLoading}
          onPageChange={() => {}}
          getRowKey={(p) => p.id}
          emptyMessage="No products found"
        />
      </div>

      {/* Inventory Logs */}
      <div>
        <h2 className="text-foreground mb-3 text-lg font-semibold">Activity Log</h2>
        <DataTable
          columns={logColumns}
          data={logs}
          page={logPage}
          totalPages={logsMeta?.totalPages ?? 1}
          total={logsMeta?.total ?? 0}
          loading={logsLoading}
          onPageChange={setLogPage}
          getRowKey={(l) => l.id}
          emptyMessage="No inventory activity yet"
        />
      </div>

      {/* Restock Dialog */}
      <AnimatePresence>
        {restockOpen && restockProduct && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            onClick={() => setRestockOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border-border relative z-10 mx-4 w-full max-w-sm rounded-xl border p-6 shadow-lg"
            >
              <button
                onClick={() => setRestockOpen(false)}
                className="text-muted-foreground absolute right-3 top-3"
              >
                <X className="h-4 w-4" />
              </button>
              <h3 className="text-foreground text-lg font-semibold">Restock Product</h3>
              <p className="text-muted-foreground mb-4 text-sm">{restockProduct.name}</p>
              <div className="mb-4">
                <label className="text-foreground mb-1 block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  min={1}
                  value={restockQty}
                  onChange={(e) => setRestockQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-card border-border text-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setRestockOpen(false)}
                  className="border-border text-foreground hover:bg-muted rounded-lg border px-4 py-2 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    restockMutation.mutate({
                      productId: restockProduct.id,
                      quantity: restockQty,
                    })
                  }
                  disabled={restockMutation.isPending}
                  className="bg-primary rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                  {restockMutation.isPending ? 'Restocking...' : 'Confirm Restock'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
