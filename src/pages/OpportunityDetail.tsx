import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  FlaskConicalIcon,
  GavelIcon,
  CheckIcon,
  XCircleIcon,
  ArrowDownRightIcon } from
'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { ShareButton } from '../components/ui/ShareButton';
import { StatusPill } from '../components/ui/StatusPill';
import { ScoreBadge } from '../components/ui/ScoreBadge';
import { EpistemicTag } from '../components/ui/EpistemicTag';
import { EvidenceCard } from '../components/opportunities/EvidenceCard';
import { RiskCard } from '../components/opportunities/RiskCard';
import { AssumptionTable } from '../components/opportunities/AssumptionTable';
import { opportunities, portfolioTopOpportunities } from '../data/opportunities';
import { pricingDetail } from '../data/opportunityDetail';
import { useExploration } from '../state/ExplorationContext';

const SECTIONS = [
['thesis', 'Strategic Thesis'],
['why', 'Why This Exists'],
['evidence', 'Supporting Evidence'],
['contradicting', 'Contradicting Evidence'],
['assumptions', 'Critical Assumptions'],
['risks', 'Why This Could Fail'],
['rejected', 'What Was Rejected'],
['next', 'Recommended Next Step']] as
const;

export function OpportunityDetail() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const { trackedOpportunities } = useExploration();
  const all = [...opportunities, ...portfolioTopOpportunities, ...trackedOpportunities];
  const opportunity = all.find((o) => o.id === opportunityId) ?? opportunities[0];
  const detail = pricingDetail;

  const supporting = detail.evidence.filter((e) => e.direction === 'supports');
  const contradicting = detail.evidence.filter((e) => e.direction === 'contradicts');

  const summary: [string, string, boolean?][] = [
  ['Overall Score', `${opportunity.score} / 100`, true],
  ['Estimated EBITDA Impact', opportunity.ebitda > 0 ? `+$${opportunity.ebitda.toFixed(1)}M` : 'Not yet sized', true],
  ['Confidence', `${opportunity.confidence}%`],
  ['Evidence Strength', opportunity.evidence],
  ['Implementation Complexity', opportunity.complexity],
  ['Estimated Timeline', opportunity.timeToImpact],
  ['Payback Period', opportunity.paybackPeriod]];


  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <Link
        to="/opportunities"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        Opportunity Explorer
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
        <div className="max-w-3xl">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <span className="text-2xs uppercase tracking-label text-muted">
              {opportunity.company} · {opportunity.category}
            </span>
            <StatusPill label={opportunity.status} />
          </div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink">
            {opportunity.title}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{opportunity.summary}</p>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton label={opportunity.title} />
          <Button onClick={() => navigate('/decisions/pricing-pilot')}>
            <GavelIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Create Decision
          </Button>
          <Button variant="primary" onClick={() => navigate('/experiments')}>
            <FlaskConicalIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Create Experiment
          </Button>
        </div>
      </header>

      <section
        aria-label="Opportunity summary"
        className="mt-6 grid grid-cols-2 divide-line border border-line bg-surface md:grid-cols-4 xl:grid-cols-7 xl:divide-x">
        
        {summary.map(([label, value, emphasis]) =>
        <div key={label} className="border-b border-line p-4 xl:border-b-0">
            <p className="text-2xs uppercase tracking-label text-muted">{label}</p>
            <p
            className={`mt-2.5 font-mono text-[17px] font-semibold tabular ${
            emphasis ? 'text-accent' : 'text-ink'}`
            }>
            
              {value}
            </p>
          </div>
        )}
      </section>

      <nav
        aria-label="Section navigation"
        className="sticky top-0 z-20 -mx-8 mt-6 flex gap-1 overflow-x-auto border-b border-line bg-canvas/95 px-8 py-2.5 backdrop-blur">
        
        {SECTIONS.map(([id, label]) =>
        <a
          key={id}
          href={`#${id}`}
          className="whitespace-nowrap border border-transparent px-2.5 py-1.5 text-xs text-muted transition-colors hover:border-line hover:bg-surface hover:text-ink">
          
            {label}
          </a>
        )}
      </nav>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-6">
          <Panel
            id="thesis"
            title="Strategic Thesis"
            actions={<EpistemicTag kind="Hypothesis" />}>
            
            <div className="max-w-3xl space-y-4">
              {detail.thesis.map((p) =>
              <p key={p.slice(0, 20)} className="text-[13px] leading-[1.75] text-ink-soft">
                  {p}
                </p>
              )}
            </div>
          </Panel>

          <Panel
            id="why"
            title="Why This Opportunity Exists"
            actions={<EpistemicTag kind="Inference" />}
            bodyClassName="">
            
            <ol className="divide-y divide-line">
              {detail.whyExists.map((w, i) =>
              <li key={w.slice(0, 20)} className="flex gap-4 px-5 py-3.5">
                  <span className="font-mono text-xs tabular text-muted-soft">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <p className="text-[13px] leading-relaxed text-ink-soft">{w}</p>
                </li>
              )}
            </ol>
          </Panel>

          <Panel
            id="evidence"
            title="Supporting Evidence"
            description={`${supporting.length} sources reviewed. Each claim is traceable to a source and dated.`}
            actions={<EpistemicTag kind="Evidence" />}>
            
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {supporting.map((e) =>
              <EvidenceCard key={e.id} source={e} />
              )}
            </div>
          </Panel>

          <section id="contradicting" className="border-2 border-critical bg-critical-soft/30">
            <header className="flex flex-wrap items-start justify-between gap-3 border-b border-critical-line px-5 py-3.5">
              <div>
                <h2 className="text-sm font-semibold text-critical">Contradicting Evidence</h2>
                <p className="mt-1 max-w-2xl text-xs leading-relaxed text-ink-soft">
                  Evidence that weakens this recommendation. We search for disconfirming data
                  before ranking, and don't discard it.
                </p>
              </div>
              <span className="font-mono text-2xs uppercase tracking-label text-critical">
                {contradicting.length} material contradictions
              </span>
            </header>
            <div className="grid grid-cols-1 gap-3 p-5 lg:grid-cols-2">
              {contradicting.map((e) =>
              <EvidenceCard key={e.id} source={e} />
              )}
            </div>
            <p className="border-t border-critical-line px-5 py-3 text-xs leading-relaxed text-ink-soft">
              <span className="font-medium">Net read · </span>
              Contradictions constrain scope rather than invalidate the thesis. Contracted revenue is carved
              out and the Midwest region is held flat, reducing the modeled opportunity from $11.1M to
              $8.4M.
            </p>
          </section>

          <Panel
            id="assumptions"
            title="Critical Assumptions"
            description="The recommendation is only as strong as these. Unverified assumptions are not treated as facts."
            actions={<EpistemicTag kind="Assumption" />}
            bodyClassName="">
            
            <AssumptionTable assumptions={detail.assumptions} />
          </Panel>

          <Panel
            id="risks"
            title="Why This Could Fail"
            description="Four failure modes with the highest combined severity and likelihood.">
            
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {detail.risks.map((r, i) =>
              <RiskCard key={r.id} risk={r} index={i} />
              )}
            </div>
          </Panel>

          <Panel
            id="rejected"
            title="What Was Rejected"
            description="Neighbouring approaches that were considered and ranked lower, with the reason."
            bodyClassName="">
            
            <ul className="divide-y divide-line">
              {detail.rejected.map((r) =>
              <li key={r.id} className="flex items-start gap-4 px-5 py-4">
                  {r.verdict === 'Rejected' ?
                <XCircleIcon className="mt-0.5 h-4 w-4 shrink-0 text-critical" strokeWidth={1.75} /> :

                <ArrowDownRightIcon className="mt-0.5 h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />
                }
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-[13px] font-medium text-ink">{r.title}</h4>
                      <StatusPill label={r.verdict} />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      <span className="text-ink-soft">
                        {r.verdict === 'Rejected' ? 'Rejected because: ' : 'Ranked lower because: '}
                      </span>
                      {r.reason}
                    </p>
                  </div>
                  <span className="font-mono text-xs tabular text-muted-soft">{r.score}</span>
                </li>
              )}
            </ul>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <div className="sticky top-4 flex flex-col gap-6">
            <section id="next" className="border-2 border-accent bg-surface">
              <header className="border-b border-accent-line bg-accent-soft px-5 py-3.5">
                <p className="text-2xs font-medium uppercase tracking-label text-accent">
                  Recommended Next Step
                </p>
                <h2 className="mt-1.5 text-[15px] font-semibold leading-snug text-ink">
                  {detail.nextStep.title}
                </h2>
                <p className="mt-1 font-mono text-2xs tabular text-accent">{detail.nextStep.duration}</p>
              </header>
              <ul className="divide-y divide-line">
                {detail.nextStep.steps.map((s) =>
                <li key={s} className="flex gap-3 px-5 py-3">
                    <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
                    <span className="text-xs leading-relaxed text-ink-soft">{s}</span>
                  </li>
                )}
              </ul>
              <div className="border-t border-line bg-raised px-5 py-3.5">
                <p className="text-2xs font-medium uppercase tracking-label text-muted">
                  Success threshold
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-ink">
                  {detail.nextStep.successThreshold}
                </p>
              </div>
              <div className="px-5 py-4">
                <Button variant="primary" className="w-full" onClick={() => navigate('/experiments')}>
                  <FlaskConicalIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Create Experiment
                </Button>
              </div>
            </section>

            <Panel title="Score Composition" bodyClassName="p-5">
              <div className="mb-4 flex items-end justify-between">
                <span className="text-xs text-muted">Weighted across five dimensions</span>
                <ScoreBadge score={opportunity.score} size="lg" />
              </div>
              <ul className="space-y-3">
                {[
                ['EBITDA magnitude', 94],
                ['Evidence strength', 90],
                ['Confidence', opportunity.confidence],
                ['Speed to impact', 86],
                ['Execution risk (inverted)', 78]].
                map(([label, v]) =>
                <li key={label as string}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs text-ink-soft">{label}</span>
                      <span className="font-mono text-2xs tabular text-muted">{v}</span>
                    </div>
                    <div className="mt-1.5 h-[3px] w-full bg-line">
                      <div className="h-full bg-ink-soft" style={{ width: `${v as number}%` }} />
                    </div>
                  </li>
                )}
              </ul>
            </Panel>

            <Panel title="Provenance" bodyClassName="p-5">
              <dl className="space-y-3 text-xs">
                {[
                ['Analysis run', 'Jul 22, 2026 · 04:12 duration'],
                ['Hypotheses considered', '342 generated, 218 eliminated'],
                ['Sources cited', '67 across 5 source types'],
                ['Internal data used', 'Invoice detail, contract register, spend cube'],
                ['Last reviewed by', 'P. Raghunathan · Aug 11, 2026']].
                map(([k, v]) =>
                <div key={k} className="flex justify-between gap-4">
                    <dt className="text-muted">{k}</dt>
                    <dd className="text-right text-ink-soft">{v}</dd>
                  </div>
                )}
              </dl>
            </Panel>
          </div>
        </div>
      </div>
    </div>);

}