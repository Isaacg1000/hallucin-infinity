import React, { useState } from 'react';
import { ChevronDownIcon, ShieldIcon } from 'lucide-react';
import { Risk } from '../../types';
import { StatusPill } from '../ui/StatusPill';

const CELL: Record<string, string> = {
  'High-High': 'bg-critical text-white',
  'High-Medium': 'bg-critical-soft text-critical',
  'Medium-High': 'bg-critical-soft text-critical',
  'Medium-Medium': 'bg-caution-soft text-caution'
};

export function RisksView({ risks }: {risks: Risk[];}) {
  const [open, setOpen] = useState<string | null>(risks[0]?.id ?? null);
  const levels = ['High', 'Medium', 'Low'] as const;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <ul className="divide-y divide-line border border-line bg-surface">
        {risks.map((r, i) => {
          const expanded = open === r.id;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => setOpen(expanded ? null : r.id)}
                aria-expanded={expanded}
                className="flex w-full items-start gap-3 px-3 py-2.5 text-left transition-colors hover:bg-raised">
                
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border border-line font-mono text-2xs text-muted">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-medium text-ink">{r.title}</span>
                    <StatusPill
                      label={`${r.severity} severity`}
                      tone={r.severity === 'High' ? 'critical' : 'caution'} />
                    
                    <StatusPill label={`${r.likelihood} likelihood`} tone="quiet" />
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">{r.detail}</span>
                </span>
                <span className="flex shrink-0 items-center gap-3">
                  <span className="font-mono text-2xs tabular text-critical">{r.exposure}</span>
                  <ChevronDownIcon
                    className={`h-3.5 w-3.5 text-muted-soft transition-transform ${expanded ? 'rotate-180' : ''}`}
                    strokeWidth={2} />
                  
                </span>
              </button>
              {expanded &&
              <div className="border-t border-line bg-raised px-3 py-2.5 pl-10">
                  <p className="inline-flex items-start gap-2 text-xs leading-relaxed text-ink-soft">
                    <ShieldIcon className="mt-0.5 h-3 w-3 shrink-0 text-accent" strokeWidth={1.75} />
                    <span>
                      <span className="font-medium text-ink">Mitigation · </span>
                      {r.mitigation}
                    </span>
                  </p>
                </div>
              }
            </li>);

        })}
      </ul>

      <div className="border border-line bg-surface">
        <div className="flex h-9 items-center border-b border-line bg-raised px-3">
          <h3 className="text-2xs font-semibold uppercase tracking-label text-ink-soft">
            Severity × Likelihood
          </h3>
        </div>
        <div className="p-3">
          <div className="grid grid-cols-[52px_repeat(3,1fr)] gap-px bg-line text-2xs">
            <div className="bg-surface p-1.5" />
            {levels.map((l) =>
            <div key={l} className="bg-surface p-1.5 text-center uppercase tracking-label text-muted">
                {l}
              </div>
            )}
            {levels.map((sev) =>
            <React.Fragment key={sev}>
                <div className="flex items-center bg-surface p-1.5 uppercase tracking-label text-muted">
                  {sev}
                </div>
                {levels.map((like) => {
                const hits = risks.filter((r) => r.severity === sev && r.likelihood === like);
                const key = `${sev}-${like}`;
                return (
                  <div
                    key={key}
                    className={`flex h-10 items-center justify-center ${
                    hits.length ? CELL[key] ?? 'bg-caution-soft text-caution' : 'bg-raised text-muted-soft'}`
                    }
                    title={hits.map((h) => h.title).join(', ')}>
                    
                      <span className="font-mono text-xs tabular">{hits.length || '·'}</span>
                    </div>);

              })}
              </React.Fragment>
            )}
          </div>
          <p className="mt-2.5 text-2xs leading-relaxed text-muted">
            Rows are severity, columns are likelihood. Two risks sit in the high-severity band; both are
            addressed inside the validation sprint rather than after rollout.
          </p>
        </div>
      </div>
    </div>);

}