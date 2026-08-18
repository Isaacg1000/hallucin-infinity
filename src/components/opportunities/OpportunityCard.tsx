import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon, ArrowRightIcon } from 'lucide-react';
import { Opportunity } from '../../types';
import { AssessmentBadge } from '../ui/AssessmentBadge';
import { assessmentFor, nextActionFor } from '../../data/assessment';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';
import { StatusPill } from '../ui/StatusPill';

export function OpportunityCard({ opportunity }: {opportunity: Opportunity;}) {
  const [expanded, setExpanded] = useState(false);
  const o = opportunity;
  const { label: assessment, why } = assessmentFor(o.score, o.evidence);

  return (
    <article className="flex flex-col border border-line bg-surface transition-all duration-150 hover:border-line-strong hover:shadow-card">
      <div className="border-b border-line p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xs uppercase tracking-label text-muted">{o.category}</span>
            <StatusPill label={o.status} />
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <AssessmentBadge label={assessment} />
            <span className="font-mono text-2xs tabular text-muted-soft" title="Overall score, secondary to the assessment above">
              {o.score}/100
            </span>
          </div>
        </div>
        <h3 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink">{o.title}</h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">{o.summary}</p>
        <p className="mt-2.5 flex items-start gap-1.5 text-xs leading-relaxed text-muted">
          <span className="shrink-0 font-medium uppercase tracking-label text-muted-soft">Why</span>
          {why}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 p-4">
        <div>
          <dt className="text-2xs uppercase tracking-label text-muted-soft">Expected upside</dt>
          <dd className="mt-1 font-mono text-[15px] font-semibold tabular text-accent">
            {o.ebitda > 0 ? `+$${o.ebitda.toFixed(1)}M` : 'Not yet sized'}
          </dd>
        </div>
        <div>
          <dt className="text-2xs uppercase tracking-label text-muted-soft">Evidence state</dt>
          <dd className="mt-1">
            <EvidenceBadge strength={o.evidence} />
          </dd>
        </div>
        <div className="col-span-2">
          <dt className="text-2xs uppercase tracking-label text-muted-soft">Next action</dt>
          <dd className="mt-1 text-xs text-ink-soft">{nextActionFor(o.status)}</dd>
        </div>
      </dl>

      {expanded &&
      <div className="border-t border-line bg-raised px-4 py-3">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
            <div>
              <dt className="text-2xs uppercase tracking-label text-muted-soft">Confidence</dt>
              <dd className="mt-1">
                <ConfidenceBadge value={o.confidence} withBar={false} />
              </dd>
            </div>
            <div>
              <dt className="text-2xs uppercase tracking-label text-muted-soft">Implementation</dt>
              <dd className="mt-1 text-xs text-ink-soft">{o.complexity}</dd>
            </div>
            <div>
              <dt className="text-2xs uppercase tracking-label text-muted-soft">Time to impact</dt>
              <dd className="mt-1 text-xs text-ink-soft">{o.timeToImpact}</dd>
            </div>
            <div>
              <dt className="text-2xs uppercase tracking-label text-muted-soft">Payback</dt>
              <dd className="mt-1 text-xs text-ink-soft">{o.paybackPeriod}</dd>
            </div>
          </dl>
          <p className="mt-3 font-mono text-2xs tabular text-muted">{o.company}</p>
        </div>
      }

      <div className="mt-auto flex flex-wrap items-center gap-1.5 border-t border-line px-4 py-3">
        {o.tags.map((t) =>
        <span key={t} className="border border-line bg-raised px-1.5 py-[2px] text-2xs text-muted">
            {t}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-line px-4 py-2.5">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-ink">

          <ChevronDownIcon
            className={`h-3.5 w-3.5 transition-transform duration-150 ${expanded ? 'rotate-180' : ''}`}
            strokeWidth={1.75} />

          {expanded ? 'Less' : 'Details'}
        </button>
        <Link
          to={`/opportunities/${o.id}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-hover">

          View Analysis
          <ArrowRightIcon className="h-3 w-3" strokeWidth={2} />
        </Link>
      </div>
    </article>);

}
