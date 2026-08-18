import React from 'react';
import { RefreshCwIcon, DownloadIcon, LayersIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { company } from '../../data/company';
import { Opportunity } from '../../types';

interface ContextHeaderProps {
  opportunities: Opportunity[];
}

const DISTRIBUTION = [4, 9, 17, 28, 41, 63, 58, 49, 38, 22, 13];

export function ContextHeader({ opportunities }: ContextHeaderProps) {
  const total = opportunities.reduce((s, o) => s + o.ebitda, 0);
  const maxBar = Math.max(...DISTRIBUTION);

  return (
    <header className="shrink-0 border-b border-line bg-surface">
      <div className="flex h-11 items-center gap-3 border-b border-line px-4">
        <h1 className="text-md font-semibold tracking-[-0.01em] text-ink">{company.name}</h1>
        <span className="h-3 w-px bg-line-strong" />
        <p className="truncate text-xs text-muted">
          {company.industry} · {company.revenue} Revenue · {company.ebitda} EBITDA · {company.hold}
        </p>
        <div className="ml-auto flex items-center gap-1.5">
          <Button size="xs">
            <RefreshCwIcon className="h-3 w-3" strokeWidth={1.75} />
            Re-run
          </Button>
          <Button size="xs">
            <DownloadIcon className="h-3 w-3" strokeWidth={1.75} />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-3xl font-semibold tabular tracking-[-0.02em] text-ink">
            342
          </span>
          <span className="text-sm text-muted">opportunities explored</span>
        </div>

        <span className="hidden h-8 w-px bg-line lg:block" />

        <dl className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {[
          ['67', 'supported by meaningful evidence'],
          ['41', 'currently under review'],
          ['18', 'high-confidence']].
          map(([v, l]) =>
          <div key={l} className="flex items-baseline gap-1.5">
              <dt className="sr-only">{l}</dt>
              <dd className="font-mono text-md font-semibold tabular text-ink">{v}</dd>
              <span className="text-xs text-muted">{l}</span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5">
            <dd className="font-mono text-md font-semibold tabular text-accent">$31.5M</dd>
            <span className="text-xs text-muted">estimated EBITDA opportunity</span>
          </div>
        </dl>

        <div className="ml-auto hidden items-end gap-3 xl:flex">
          <div className="flex items-end gap-[3px]" title="Score distribution across 342 explored opportunities">
            {DISTRIBUTION.map((d, i) =>
            <span
              key={i}
              className={`block w-[7px] ${i >= 7 ? 'bg-accent' : 'bg-line-strong'}`}
              style={{ height: `${d / maxBar * 28 + 3}px` }} />

            )}
          </div>
          <div className="leading-tight">
            <p className="text-2xs uppercase tracking-label text-muted-soft">Score distribution</p>
            <p className="font-mono text-2xs tabular text-muted">
              {opportunities.length} shortlisted · ${total.toFixed(1)}M in view
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 border border-line bg-raised px-2 py-1 text-2xs text-muted">
            <LayersIcon className="h-3 w-3" strokeWidth={1.75} />
            218 eliminated
          </span>
        </div>
      </div>
    </header>);

}