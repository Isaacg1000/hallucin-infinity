import React from 'react';
import { ArrowRightIcon, CornerDownRightIcon } from 'lucide-react';
import { ReasoningLink } from '../../types';
import { StatusPill } from '../ui/StatusPill';

const KIND = {
  evidence: { label: 'Evidence', className: 'border-positive-line bg-positive-soft text-positive' },
  inference: { label: 'Inference', className: 'border-accent-line bg-accent-soft text-accent' },
  assumption: { label: 'Assumption', className: 'border-caution-line bg-caution-soft text-caution' }
};

interface ReasoningChainProps {
  links: ReasoningLink[];
  onOpenAssumption: (id: string) => void;
  assumptionStatus: Record<string, string>;
}

export function ReasoningChain({ links, onOpenAssumption, assumptionStatus }: ReasoningChainProps) {
  return (
    <ol className="divide-y divide-line">
      {links.map((l, i) =>
      <li key={l.id} className="grid grid-cols-1 gap-px bg-line lg:grid-cols-[1fr_1fr_1fr]">
          <div className="relative bg-surface p-3">
            <span className="absolute left-0 top-0 h-full w-[2px] bg-positive" />
            <div className="flex items-center gap-2">
              <span
              className={`inline-flex items-center border px-1.5 py-px text-2xs font-medium uppercase tracking-label ${KIND.evidence.className}`}>
              
                {KIND.evidence.label}
              </span>
              <span className="font-mono text-2xs tabular text-muted-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
            </div>
            <p className="mt-2 text-base leading-relaxed text-ink">{l.evidence}</p>
            <p className="mt-1.5 text-2xs text-muted">{l.evidenceSource}</p>
          </div>

          <div className="relative bg-surface p-3">
            <ArrowRightIcon
            className="absolute -left-[9px] top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 bg-surface text-muted-soft lg:block"
            strokeWidth={2} />
          
            <CornerDownRightIcon
            className="mb-1 h-3 w-3 text-muted-soft lg:hidden"
            strokeWidth={2} />
          
            <span
            className={`inline-flex items-center border px-1.5 py-px text-2xs font-medium uppercase tracking-label ${KIND.inference.className}`}>
            
              {KIND.inference.label}
            </span>
            <p className="mt-2 text-base leading-relaxed text-ink">{l.inference}</p>
            <p className="mt-1.5 text-2xs text-muted">Our reading of the evidence</p>
          </div>

          <button
          type="button"
          onClick={() => onOpenAssumption(l.assumptionId)}
          className="group relative bg-surface p-3 text-left transition-colors hover:bg-raised">
          
            <ArrowRightIcon
            className="absolute -left-[9px] top-1/2 hidden h-3.5 w-3.5 -translate-y-1/2 bg-surface text-muted-soft group-hover:bg-raised lg:block"
            strokeWidth={2} />
          
            <div className="flex items-center justify-between gap-2">
              <span
              className={`inline-flex items-center border px-1.5 py-px text-2xs font-medium uppercase tracking-label ${KIND.assumption.className}`}>
              
                {KIND.assumption.label}
              </span>
              <StatusPill label={assumptionStatus[l.assumptionId] ?? 'Unverified'} />
            </div>
            <p className="mt-2 text-base leading-relaxed text-ink">{l.assumption}</p>
            <p className="mt-1.5 text-2xs text-accent opacity-0 transition-opacity group-hover:opacity-100">
              Inspect assumption →
            </p>
          </button>
        </li>
      )}
    </ol>);

}