import React from "react";
import { BoxIcon } from "lucide-react";
interface MetricCardProps {
  label: string;
  value: string;
  note?: string;
  icon?: BoxIcon;
  delta?: {
    value: string;
    direction: 'up' | 'down' | 'flat';
  };
  emphasis?: boolean;
}
export function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  delta,
  emphasis
}: MetricCardProps) {
  return <div className={`group flex flex-col justify-between border bg-surface p-4 transition-colors duration-150 ${emphasis ? 'border-accent-line bg-accent-soft/40' : 'border-line hover:border-line-strong'}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-2xs font-medium uppercase tracking-label text-muted">{label}</span>
        {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-muted-soft" strokeWidth={1.75} />}
      </div>
      <div className="mt-5 flex items-end justify-between gap-2">
        <span className={`font-mono text-2xl font-semibold tabular ${emphasis ? 'text-accent' : 'text-ink'}`}>
          {value}
        </span>
        {delta && <span className={`font-mono text-xs tabular ${delta.direction === 'up' ? 'text-positive' : delta.direction === 'down' ? 'text-critical' : 'text-muted'}`}>
            {delta.direction === 'up' ? '▲' : delta.direction === 'down' ? '▼' : '—'} {delta.value}
          </span>}
      </div>
      {note && <p className="mt-1.5 text-xs leading-relaxed text-muted">{note}</p>}
    </div>;
}