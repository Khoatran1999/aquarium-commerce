import { type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Spinner } from './Spinner';

/* ── Column definition ────────────────────── */
export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T, index: number) => ReactNode;
  className?: string;
}

/* ── DataTable props ──────────────────────── */
export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading,
  emptyMessage = 'No data found',
  className,
  onRowClick,
}: DataTableProps<T>) {
  return (
    <div className={cn('border-border overflow-auto rounded-lg border', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted/50 border-border border-b">
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'text-muted-foreground px-4 py-3 text-left font-medium',
                  col.className,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <Spinner className="mx-auto" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-muted-foreground px-4 py-12 text-center">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={keyExtractor(row, i)}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-border border-b transition-colors last:border-b-0',
                  onRowClick && 'hover:bg-muted/30 cursor-pointer',
                )}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-4 py-3', col.className)}>
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
