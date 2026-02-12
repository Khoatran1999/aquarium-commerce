import { type LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: { value: number; label: string };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className = '',
}: StatsCardProps) {
  return (
    <div className={`bg-card border-border rounded-xl border p-5 ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
            {title}
          </p>
          <p className="text-foreground mt-1 text-2xl font-bold">{value}</p>
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.value >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {trend.value >= 0 ? '+' : ''}
              {trend.value}% {trend.label}
            </p>
          )}
        </div>
        <div className="bg-primary/10 rounded-lg p-2.5">
          <Icon className="text-primary h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
