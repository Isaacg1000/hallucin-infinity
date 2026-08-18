import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { DecisionRecord } from '../../types';
import { opportunities, portfolioTopOpportunities } from '../../data/opportunities';
import { experiments } from '../../data/experiments';

const ALL_OPPORTUNITIES = [...opportunities, ...portfolioTopOpportunities];

interface TrailStep {
  label: string;
  value: string;
  to?: string;
}

/** Question -> Routes considered -> Evidence -> Decision -> Experiment ->
 * Outcome, built entirely from data the decision, its opportunity, and any
 * experiment testing it already carry — no step is fabricated, and a step
 * with nothing behind it (no experiment run yet) says so plainly instead
 * of being skipped silently. */
export function DecisionTrail({ decision }: { decision: DecisionRecord }) {
  const opportunity = ALL_OPPORTUNITIES.find((o) => o.id === decision.relatedOpportunityId);
  const experiment = experiments.find((e) => e.relatedOpportunityId === decision.relatedOpportunityId);

  const steps: TrailStep[] = [
    {
      label: 'Opportunity',
      value: opportunity?.title ?? decision.relatedOpportunityId,
      to: opportunity ? `/opportunities/${opportunity.id}` : undefined
    },
    { label: 'Alternatives considered', value: `${decision.alternatives.length} approaches evaluated` },
    { label: 'Decision', value: decision.status },
    experiment
      ? { label: 'Experiment', value: experiment.name, to: '/experiments' }
      : { label: 'Experiment', value: 'Not yet designed' },
    {
      label: 'Outcome',
      value: decision.status === 'Approved' ? decision.expectedOutcome : 'Not yet realized'
    }
  ];

  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-3">
      {steps.map((step, i) => (
        <li key={step.label} className="flex items-center gap-1.5">
          {i > 0 && <ArrowRightIcon className="h-3 w-3 shrink-0 text-line-strong" strokeWidth={2} />}
          <div className={`rounded-md border px-2.5 py-1.5 ${step.to ? 'border-line-strong bg-surface' : 'border-line bg-raised'}`}>
            <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">{step.label}</p>
            {step.to ? (
              <Link to={step.to} className="mt-0.5 block max-w-[180px] truncate text-xs font-medium text-accent hover:text-accent-hover">
                {step.value}
              </Link>
            ) : (
              <p className="mt-0.5 max-w-[180px] truncate text-xs text-ink-soft">{step.value}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
