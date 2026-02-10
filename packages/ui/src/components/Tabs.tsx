import { useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface TabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export function Tabs({ items, defaultValue, value, onChange, className }: TabsProps) {
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.value ?? '');
  const active = value ?? internal;

  const handleChange = (val: string) => {
    if (!value) setInternal(val);
    onChange?.(val);
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Tab List */}
      <div role="tablist" className="border-border flex gap-1 border-b">
        {items.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active === tab.value}
            disabled={tab.disabled}
            onClick={() => handleChange(tab.value)}
            className={cn(
              '-mb-px px-4 py-2.5 text-sm font-medium transition-colors',
              'hover:text-foreground focus-visible:ring-primary focus-visible:outline-none focus-visible:ring-2',
              'disabled:pointer-events-none disabled:opacity-50',
              active === tab.value
                ? 'border-primary text-primary border-b-2'
                : 'text-muted-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {/* Tab Panels */}
      {items.map((tab) => (
        <div key={tab.value} role="tabpanel" hidden={active !== tab.value} className="pt-4">
          {active === tab.value && tab.content}
        </div>
      ))}
    </div>
  );
}
