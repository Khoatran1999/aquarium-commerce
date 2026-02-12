import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  className?: string;
  render?: (row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  page: number;
  totalPages: number;
  total: number;
  loading?: boolean;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  getRowKey: (row: T) => string;
}

export default function DataTable<T>({
  columns,
  data,
  page,
  totalPages,
  total,
  loading = false,
  onPageChange,
  onRowClick,
  emptyMessage = 'No data found',
  getRowKey,
}: DataTableProps<T>) {
  return (
    <div className="bg-card border-border overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border border-b">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`text-muted-foreground px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${col.className ?? ''}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-border border-b">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div className="bg-muted h-4 w-3/4 animate-pulse rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-muted-foreground px-4 py-12 text-center"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={getRowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`border-border border-b transition-colors last:border-0 ${
                    onRowClick ? 'hover:bg-muted/50 cursor-pointer' : ''
                  }`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 ${col.className ?? ''}`}>
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="border-border flex items-center justify-between border-t px-4 py-3">
          <p className="text-muted-foreground text-xs">
            Showing{' '}
            <span className="text-foreground font-medium">
              {(page - 1) * (data.length || 10) + 1}–{Math.min(page * (data.length || 10), total)}
            </span>{' '}
            of <span className="text-foreground font-medium">{total}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(1)}
              disabled={page <= 1}
              className="hover:bg-muted disabled:text-muted-foreground rounded p-1 disabled:opacity-40"
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="hover:bg-muted disabled:text-muted-foreground rounded p-1 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-foreground px-2 text-xs font-medium">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="hover:bg-muted disabled:text-muted-foreground rounded p-1 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onPageChange(totalPages)}
              disabled={page >= totalPages}
              className="hover:bg-muted disabled:text-muted-foreground rounded p-1 disabled:opacity-40"
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
