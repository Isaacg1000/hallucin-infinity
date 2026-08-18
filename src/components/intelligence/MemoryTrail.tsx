import React from 'react';

interface MemoryTrailProps {
  total: number;
  segments: { label: string; count: number; tone: 'positive' | 'neutral' | 'critical' }[];
}

const TONE_BAR: Record<string, string> = {
  positive: 'bg-emerald-500',
  neutral: 'bg-line-strong',
  critical: 'bg-critical'
};

const TONE_TEXT: Record<string, string> = {
  positive: 'text-emerald-700',
  neutral: 'text-ink-soft',
  critical: 'text-critical'
};

/** A breakdown, not a funnel — these categories are parallel outcomes of
 * the same 14 initiatives, not a sequential narrowing, so a segmented bar
 * is the honest shape (reusing PossibilityFunnel's narrowing-strand visual
 * here would misrepresent the actual data relationship). */
export function MemoryTrail({ total, segments }: MemoryTrailProps) {
  return (
    <div>
      <p className="font-mono text-2xl font-semibold tabular text-ink">{total}</p>
      <p className="text-xs text-muted">prior initiatives</p>
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-sunken">
        {segments.map((s) => (
          <div
            key={s.label}
            className={`h-full ${TONE_BAR[s.tone]}`}
            style={{ width: `${(s.count / total) * 100}%` }}
            title={`${s.label}: ${s.count}`}
          />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1.5 text-xs">
            <span className={`h-1.5 w-1.5 rounded-full ${TONE_BAR[s.tone]}`} aria-hidden="true" />
            <span className={`font-mono font-medium tabular ${TONE_TEXT[s.tone]}`}>{s.count}</span>
            <span className="text-muted">{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
