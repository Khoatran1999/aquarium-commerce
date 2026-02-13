import { useState } from 'react';
import { Plus, Search, Trash2, Pencil, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { BlogPost, BlogStatus } from '@repo/types';
import { useAdminBlogs, useDeleteBlog, useUpdateBlogStatus } from '../../hooks/useBlogs';
import DataTable from '../../components/admin/DataTable';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const STATUS_CONFIG: Record<BlogStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Draft', className: 'bg-warning/10 text-warning' },
  PUBLISHED: { label: 'Published', className: 'bg-success/10 text-success' },
  ARCHIVED: { label: 'Archived', className: 'bg-muted text-muted-foreground' },
};

const STATUS_TABS: { label: string; value: BlogStatus | 'ALL' }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Archived', value: 'ARCHIVED' },
];

export default function BlogListPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<BlogStatus | 'ALL'>('ALL');
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);

  const { data, isLoading } = useAdminBlogs({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter === 'ALL' ? undefined : statusFilter,
  });

  const deleteMutation = useDeleteBlog();
  const statusMutation = useUpdateBlogStatus();

  const blogs = data?.data ?? [];
  const meta = data?.meta;

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        toast.success('Blog post deleted');
        setDeleteTarget(null);
      },
      onError: () => toast.error('Failed to delete blog post'),
    });
  };

  const togglePublish = (blog: BlogPost) => {
    const newStatus: BlogStatus = blog.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    statusMutation.mutate(
      { id: blog.id, status: newStatus },
      {
        onSuccess: () =>
          toast.success(newStatus === 'PUBLISHED' ? 'Blog published!' : 'Blog unpublished'),
        onError: () => toast.error('Failed to update status'),
      },
    );
  };

  const columns = [
    {
      key: 'cover',
      label: '',
      className: 'w-16',
      render: (b: BlogPost) =>
        b.coverImage ? (
          <img src={b.coverImage} alt={b.title} className="h-10 w-14 rounded-lg object-cover" />
        ) : (
          <div className="bg-muted text-muted-foreground flex h-10 w-14 items-center justify-center rounded-lg text-xs">
            No img
          </div>
        ),
    },
    {
      key: 'title',
      label: 'Title',
      render: (b: BlogPost) => (
        <div className="max-w-xs">
          <p className="text-foreground truncate font-medium">{b.title}</p>
          <p className="text-muted-foreground truncate text-xs">{b.excerpt ?? b.slug}</p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (b: BlogPost) => {
        const config = STATUS_CONFIG[b.status];
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
          >
            {config.label}
          </span>
        );
      },
    },
    {
      key: 'tags',
      label: 'Tags',
      render: (b: BlogPost) => (
        <div className="flex flex-wrap gap-1">
          {b.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-primary/10 text-primary rounded px-1.5 py-0.5 text-[10px] font-medium"
            >
              {tag}
            </span>
          ))}
          {b.tags.length > 3 && (
            <span className="text-muted-foreground text-[10px]">+{b.tags.length - 3}</span>
          )}
        </div>
      ),
    },
    {
      key: 'views',
      label: 'Views',
      render: (b: BlogPost) => <span className="text-muted-foreground text-sm">{b.viewCount}</span>,
    },
    {
      key: 'date',
      label: 'Created',
      render: (b: BlogPost) => (
        <span className="text-muted-foreground text-xs">
          {new Date(b.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      label: '',
      className: 'w-28',
      render: (b: BlogPost) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => togglePublish(b)}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
            title={b.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
          >
            {b.status === 'PUBLISHED' ? (
              <EyeOff className="text-muted-foreground h-4 w-4" />
            ) : (
              <Eye className="text-success h-4 w-4" />
            )}
          </button>
          <Link
            to={`/admin/blogs/${b.id}/edit`}
            className="hover:bg-muted rounded-lg p-1.5 transition-colors"
          >
            <Pencil className="text-muted-foreground h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteTarget(b)}
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
          <h1 className="text-foreground text-2xl font-bold">Blog Posts</h1>
          <p className="text-muted-foreground text-sm">{meta?.total ?? 0} posts in your blog</p>
        </div>
        <Link
          to="/admin/blogs/new"
          className="bg-primary inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {/* Status Tabs + Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === tab.value
                  ? 'bg-primary text-white'
                  : 'text-muted-foreground hover:bg-muted'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative max-w-sm">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="bg-card border-border text-foreground placeholder:text-muted-foreground focus:ring-primary/30 w-full rounded-lg border py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2"
          />
        </div>
      </div>

      {/* Table */}
      <DataTable
        columns={columns}
        data={blogs}
        page={page}
        totalPages={meta?.totalPages ?? 1}
        total={meta?.total ?? 0}
        loading={isLoading}
        onPageChange={setPage}
        onRowClick={(b) => navigate(`/admin/blogs/${b.id}/edit`)}
        getRowKey={(b) => b.id}
        emptyMessage="No blog posts found"
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Blog Post"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
