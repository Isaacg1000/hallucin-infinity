import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';

interface ValidationSummaryProps {
  label: string;
  explanation?: string;
  size?: 'compact' | 'large';
}

export function ValidationSummary({ label, explanation, size = 'compact' }: ValidationSummaryProps) {
  if (size === 'large') {
    return (
      <div className="border-t-2 border-ink pt-5">
        <div className="flex items-center gap-2">
          <StatusBadge status="inference" size="md" />
          <span className="text-2xs font-medium uppercase tracking-label text-muted-soft">Conclusion</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-[-0.01em] text-ink">{label}</p>
        {explanation && <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-soft">{explanation}</p>}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-raised px-3.5 py-2">
      <StatusBadge status="inference" />
      <span className="text-[13px] font-medium uppercase tracking-label text-ink-soft">{label}</span>
    </div>
  );
}
