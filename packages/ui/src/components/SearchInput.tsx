import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../utils/cn';
import { Search, X } from 'lucide-react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onClear, ...props }, ref) => {
    const hasValue = value != null && String(value).length > 0;

    return (
      <div className="relative">
        <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <input
          ref={ref}
          type="search"
          value={value}
          className={cn(
            'border-border bg-background text-foreground placeholder:text-muted-foreground flex h-10 w-full rounded-lg border pl-9 pr-9 text-sm transition-colors',
            'focus:border-primary focus:ring-primary/20 focus:outline-none focus:ring-2',
            className,
          )}
          {...props}
        />
        {hasValue && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="text-muted-foreground hover:text-foreground absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  },
);

SearchInput.displayName = 'SearchInput';
