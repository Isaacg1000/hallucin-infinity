import React from 'react';
import { Risk } from '../../types';

const SEVERITY: Record<string, string> = {
  High: 'bg-critical',
  Medium: 'bg-caution',
  Low: 'bg-muted-soft'
};

export function RiskCard({ risk, index }: {risk: Risk;index: number;}) {
  return (
    <article className="flex gap-3 border border-line bg-surface p-4 transition-colors hover:border-line-strong">
      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center border border-line font-mono text-2xs text-muted">
        {index + 1}
      </span>
      <div className="min-w-0">
        <h4 className="text-[13px] font-semibold text-ink">{risk.title}</h4>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">{risk.detail}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-2xs uppercase tracking-label text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 ${SEVERITY[risk.severity]}`} />
            Severity {risk.severity}
          </span>
          <span>Likelihood {risk.likelihood}</span>
        </div>
        <p className="mt-3 border-t border-line pt-2.5 text-xs leading-relaxed text-muted">
          <span className="font-medium text-ink-soft">Mitigation · </span>
          {risk.mitigation}
        </p>
      </div>
    </article>);

}