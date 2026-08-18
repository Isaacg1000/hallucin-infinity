import React from 'react';

interface ConfidenceBadgeProps {
  value: number;
  withBar?: boolean;
  label?: string;
}

export function ConfidenceBadge({ value, withBar = true, label }: ConfidenceBadgeProps) {
  const filled = Math.round(value / 20);
  const tone = value >= 80 ? 'text-ink' : value >= 65 ? 'text-caution' : 'text-critical';

  return (
    <div className="inline-flex items-center gap-2" title={`Model confidence: ${value}%`}>
      {withBar &&
      <div className="flex items-center gap-[2px]" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) =>
        <span
          key={i}
          className={`block h-3 w-[3px] ${i < filled ? 'bg-ink-soft' : 'bg-line'}`} />

        )}
        </div>
      }
      <span className={`font-mono text-xs tabular ${tone}`}>
        {value}%{label ? <span className="text-muted-soft"> {label}</span> : null}
      </span>
    </div>);

}