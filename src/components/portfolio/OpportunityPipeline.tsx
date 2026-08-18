import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { PipelineStage } from '../../types';

interface Stage {
  stage: PipelineStage;
  value: number;
  count: number;
}

interface OpportunityPipelineProps {
  stages: Stage[];
  currency?: boolean;
}

export function OpportunityPipeline({ stages, currency = true }: OpportunityPipelineProps) {
  const max = Math.max(...stages.map((s) => s.value));

  return (
    <ol className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-0">
      {stages.map((s, i) => {
        const isLast = i === stages.length - 1;
        const intensity = max > 0 ? s.value / max : 0;
        return (
          <li key={s.stage} className="flex min-w-0 flex-1 items-stretch">
            <div className="group min-w-0 flex-1 border border-line bg-surface p-4 transition-colors hover:border-line-strong">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-2xs font-medium uppercase tracking-label text-muted">
                  {s.stage}
                </span>
                <span className="font-mono text-2xs tabular text-muted-soft">{s.count}</span>
              </div>
              <p className="mt-3 font-mono text-lg font-semibold tabular text-ink">
                {currency ? `$${s.value.toFixed(1)}M` : s.value}
              </p>
              <div className="mt-3 h-[3px] w-full bg-line">
                <div
                  className={`h-full ${isLast ? 'bg-positive' : 'bg-accent'}`}
                  style={{ width: `${Math.max(intensity * 100, 6)}%` }} />
                
              </div>
            </div>
            {!isLast &&
            <div className="hidden w-6 shrink-0 items-center justify-center lg:flex">
                <ChevronRightIcon className="h-3.5 w-3.5 text-muted-soft" strokeWidth={2} />
              </div>
            }
          </li>);

      })}
    </ol>);

}