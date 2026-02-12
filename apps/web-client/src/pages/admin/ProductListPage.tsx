import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@repo/services';
import { Plus, Search, Trash2, Pencil } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Product } from '@repo/types';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

export default function ProductListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'products', { page, search }],
    queryFn: () => adminService.getProducts({ page, limit: 10, search: search || undefined }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => adminService.deleteProduct(id),
    onSuccess: () => {
      toast.success('Product deleted');
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      setDeleteTarget(null);
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const products = data?.data ?? [];
  const meta = data?.meta;

  const columns = [
    {
      key: 'image',
      label: '',
      className: 'w-12',
      render: (p: Product) => (
        <img
          src={p.images?.[0]?.url ?? '/placeholder-fish.jpg'}
          alt={p.name}
          className="h-10 w-10 rounded-lg object-cover"
        />
      ),
    },
    {
      key: 'name',
      label: 'Product',
      render: (p: Product) => (
        <div>
          <p className="text-foreground font-medium">{p.name}</p>
          <p className="text-muted-foreground text-xs">{p.species?.name ?? 'No species'}</p>
        </div>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      render: (p: Product) => (
        <div>
          <span className="text-foreground font-semibold">${p.price.toFixed(2)}</span>
          {p.comparePrice && (
            <span className="text-muted-foreground ml-1 text-xs line-through">
              ${p.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      render: (p: Product) => (
        <span
          className={`text-xs font-semibold ${
            p.available <= 0 ? 'text-danger' : p.available <= 5 ? 'text-warning' : 'text-success'
          }`}
        >
          {p.available}
        </span>
      ),
    },
    {
      key: 'size',
      label: 'Size',
      render: (p: Product) => (
        <span className="bg-muted text-foreground rounded px-2 py-0.5 text-xs font-medium">
          {p.size}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (p: Product) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            p.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'
          }`}
        >
          {p.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-24',
      render: (p: Product) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Link
            to={`/admin/products/${p.id}/edit`}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
          >
            <Pencil className="text-muted-foreground h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(p)}
            className="hover:bg-danger/10 rounded-lg p-1.5 transition-colors"
          >
            <Trash2 className="text-danger h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Products</h1>
          <p className="text-muted-foreground text-sm">{meta?.total ?? 0} products in your store</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search products..."
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
        data={products}
        page={page}
        totalPages={meta?.totalPages ?? 1}
        total={meta?.total ?? 0}
        loading={isLoading}
        onPageChange={setPage}
        onRowClick={(p) => navigate(`/admin/products/${p.id}/edit`)}
        getRowKey={(p) => p.id}
        emptyMessage="No products found"
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Product"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This will deactivate the product.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={() => deleteTarget && deleteMutation.mutate(deleteTarget.id)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
