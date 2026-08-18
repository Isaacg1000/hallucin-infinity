import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  GavelIcon,
  FlaskConicalIcon,
  Share2Icon,
  MoreHorizontalIcon,
  SwordsIcon } from
'lucide-react';
import { Opportunity } from '../../types';
import { Button } from '../ui/Button';
import { StatusPill } from '../ui/StatusPill';
import { Tabs } from '../ui/Tabs';

export const ANALYSIS_TABS = [
'Overview',
'Evidence',
'Assumptions',
'Risks',
'Alternatives',
'Financial Model'] as
const;

export type AnalysisTab = (typeof ANALYSIS_TABS)[number];

interface AnalysisHeaderProps {
  opportunity: Opportunity;
  status: string;
  tab: AnalysisTab;
  onTab: (t: AnalysisTab) => void;
  counts: Partial<Record<AnalysisTab, string | number>>;
  onChallenge: () => void;
  challengeActive: boolean;
  onAddToDecision: () => void;
  addedToDecision: boolean;
  scoreOverride?: number | null;
  ebitdaOverride?: number | null;
}

export function AnalysisHeader({
  opportunity: o,
  status,
  tab,
  onTab,
  counts,
  onChallenge,
  challengeActive,
  onAddToDecision,
  addedToDecision,
  scoreOverride,
  ebitdaOverride
}: AnalysisHeaderProps) {
  const score = scoreOverride ?? o.score;
  const ebitda = ebitdaOverride ?? o.ebitda;
  const stressed = scoreOverride != null && scoreOverride !== o.score;

  return (
    <header className="shrink-0 border-b border-line bg-surface">
      <div className="flex items-start gap-4 px-4 pb-2.5 pt-3">
        <Link
          to="/overview"
          aria-label="Back to opportunities"
          className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:bg-sunken hover:text-ink">
          
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-lg font-semibold tracking-[-0.015em] text-ink">{o.title}</h1>
            <StatusPill label={status} tone="caution" />
            {stressed && <StatusPill label="Stressed view" tone="critical" dot />}
          </div>

          <dl className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <div className="flex items-baseline gap-1.5">
              <dd
                className={`font-mono text-xl font-semibold tabular ${
                stressed ? 'text-critical' : 'text-accent'}`
                }>
                
                {score}
              </dd>
              <dt className="text-xs text-muted">Overall Score</dt>
            </div>
            <span className="h-3 w-px bg-line" />
            <div className="flex items-baseline gap-1.5">
              <dd
                className={`font-mono text-xl font-semibold tabular ${
                stressed ? 'text-critical' : 'text-ink'}`
                }>
                
                +${ebitda.toFixed(1)}M
              </dd>
              <dt className="text-xs text-muted">EBITDA</dt>
            </div>
            <span className="h-3 w-px bg-line" />
            <div className="flex items-baseline gap-1.5">
              <dd className="font-mono text-md font-semibold tabular text-ink">{o.confidence}%</dd>
              <dt className="text-xs text-muted">Confidence</dt>
            </div>
            <span className="h-3 w-px bg-line" />
            <div className="flex items-baseline gap-1.5">
              <dd className="text-md font-medium text-ink">{o.evidence}</dd>
              <dt className="text-xs text-muted">Evidence</dt>
            </div>
            <span className="h-3 w-px bg-line" />
            <div className="flex items-baseline gap-1.5">
              <dd className="font-mono text-xs tabular text-muted">{o.timeToImpact}</dd>
              <dt className="text-xs text-muted">to impact</dt>
            </div>
          </dl>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            size="sm"
            variant={challengeActive ? 'danger' : 'default'}
            onClick={onChallenge}
            className={challengeActive ? '' : 'border-critical-line text-critical hover:bg-critical-soft'}>
            
            <SwordsIcon className="h-3 w-3" strokeWidth={1.75} />
            Challenge Recommendation
          </Button>
          <Button size="sm" variant="primary" onClick={onAddToDecision}>
            <GavelIcon className="h-3 w-3" strokeWidth={1.75} />
            {addedToDecision ? 'In Decision' : 'Add to Decision'}
          </Button>
          <Button size="sm">
            <FlaskConicalIcon className="h-3 w-3" strokeWidth={1.75} />
            Create Experiment
          </Button>
          <Button size="sm">
            <Share2Icon className="h-3 w-3" strokeWidth={1.75} />
            Share
          </Button>
          <Button size="sm" variant="ghost" aria-label="More actions">
            <MoreHorizontalIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Button>
        </div>
      </div>

      <div className="border-t border-line px-2">
        <Tabs tabs={ANALYSIS_TABS} active={tab} onChange={onTab} counts={counts} />
      </div>
    </header>);

}