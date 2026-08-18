import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  FileSearchIcon,
  InfoIcon } from
'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { EpistemicTag } from '../components/ui/EpistemicTag';
import { DecisionTimeline } from '../components/decisions/DecisionTimeline';
import { DecisionTrail } from '../components/decisions/DecisionTrail';
import { AssumptionTable } from '../components/opportunities/AssumptionTable';
import { RiskCard } from '../components/opportunities/RiskCard';
import { EvidenceCard } from '../components/opportunities/EvidenceCard';
import { decisions } from '../data/decisions';
import { pricingDetail } from '../data/opportunityDetail';

const ACTIONS = [
{ id: 'approve', label: 'Approve', icon: CheckCircle2Icon, variant: 'primary' as const },
{ id: 'evidence', label: 'Request More Evidence', icon: FileSearchIcon, variant: 'secondary' as const },
{ id: 'reject', label: 'Reject', icon: XCircleIcon, variant: 'danger' as const },
{ id: 'defer', label: 'Defer', icon: ClockIcon, variant: 'secondary' as const }];


const RESULT_COPY: Record<string, string> = {
  approve: 'Decision approved. Owners notified and the initiative moved to Executing on the blueprint.',
  evidence: "Evidence request logged. We'll re-run retrieval on the two unresolved assumptions.",
  reject: 'Decision rejected. The rationale is recorded in institutional memory for future analyses.',
  defer: 'Decision deferred. It will re-enter the queue when the ERP segmentation question is resolved.'
};

export function DecisionDetail() {
  const { decisionId } = useParams();
  const decision = decisions.find((d) => d.id === decisionId) ?? decisions[0];
  const [action, setAction] = useState<string | null>(null);

  const unresolved = pricingDetail.assumptions.filter(
    (a) => a.status === 'Must Validate' || a.status === 'Unverified'
  );

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <Link
        to="/decisions"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        Decisions
      </Link>

      <header className="mt-4 flex flex-wrap items-start justify-between gap-6 border-b border-line pb-6">
        <div className="max-w-3xl">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            <EpistemicTag kind="Decision" />
            <span className="text-2xs uppercase tracking-label text-muted">
              {decision.company} · raised {decision.raisedOn}
            </span>
          </div>
          <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink">
            Decision: {decision.title}
          </h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-2xs uppercase tracking-label text-muted">Decision status</span>
          <StatusPill label={action === 'approve' ? 'Approved' : decision.status} className="text-xs" />
        </div>
      </header>

      {action &&
      <div className="mt-5 flex items-start gap-2.5 border border-accent-line bg-accent-soft px-4 py-3">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
          <p className="text-[13px] text-ink">{RESULT_COPY[action]}</p>
        </div>
      }

      <div className="mt-6 overflow-x-auto border border-line bg-raised px-4 py-4">
        <p className="mb-3 text-2xs font-medium uppercase tracking-label text-muted-soft">Decision trail</p>
        <DecisionTrail decision={decision} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex flex-col gap-6">
          <Panel title="Recommendation">
            <p className="max-w-3xl text-[15px] font-medium leading-relaxed text-ink">
              {decision.recommendation}
            </p>
          </Panel>

          <Panel
            title="Alternatives Considered"
            description="Five approaches were evaluated. Each was scored and either rejected or ranked lower."
            bodyClassName="">
            
            <ul className="divide-y divide-line">
              {decision.alternatives.map((a) =>
              <li key={a.title} className="flex items-start justify-between gap-4 px-5 py-3.5">
                  <div>
                    <h4 className="text-[13px] font-medium text-ink">{a.title}</h4>
                    <p className="mt-1 text-xs text-muted">{a.note}</p>
                  </div>
                  <StatusPill label={a.verdict} />
                </li>
              )}
            </ul>
          </Panel>

          <Panel
            title="Evidence"
            description="Strongest supporting and contradicting sources behind this decision."
            actions={<EpistemicTag kind="Evidence" />}>
            
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {[pricingDetail.evidence[0], pricingDetail.evidence[1], pricingDetail.evidence[5], pricingDetail.evidence[6]].map(
                (e) =>
                <EvidenceCard key={e.id} source={e} />

              )}
            </div>
          </Panel>

          <Panel
            title="Key Assumptions"
            description="Unresolved assumptions carried into this decision. Approving accepts this exposure."
            actions={<EpistemicTag kind="Assumption" />}
            bodyClassName="">
            
            <AssumptionTable assumptions={unresolved} />
          </Panel>

          <Panel title="Risks">
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {pricingDetail.risks.slice(0, 4).map((r, i) =>
              <RiskCard key={r.id} risk={r} index={i} />
              )}
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Expected Outcome" actions={<EpistemicTag kind="Outcome" />}>
            <p className="font-mono text-2xl font-semibold tabular text-accent">
              +$8.4M
            </p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{decision.expectedOutcome}</p>
            <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-xs">
              {[
              ['Pilot cost', '$340K'],
              ['Pilot duration', '45 days'],
              ['Downside if wrong', '<0.4% revenue at risk'],
              ['Reversibility', 'High — pricing can be reset']].
              map(([k, v]) =>
              <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted">{k}</dt>
                  <dd className="text-ink-soft">{v}</dd>
                </div>
              )}
            </dl>
          </Panel>

          <Panel title="Decision Owners" bodyClassName="">
            <ul className="divide-y divide-line">
              {decision.owners.map((o) =>
              <li key={o.name} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-[13px] text-ink">{o.name}</p>
                    <p className="text-xs text-muted">{o.role}</p>
                  </div>
                  <StatusPill
                  label={o.state}
                  tone={o.state === 'Pending' ? 'quiet' : o.state === 'Approved' ? 'positive' : 'neutral'} />
                
                </li>
              )}
            </ul>
          </Panel>

          <Panel title="Decision Actions" bodyClassName="p-5">
            <div className="flex flex-col gap-2">
              {ACTIONS.map((a) =>
              <Button
                key={a.id}
                variant={a.variant}
                className="w-full justify-start"
                onClick={() => setAction(a.id)}>
                
                  <a.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  {a.label}
                </Button>
              )}
            </div>
            <p className="mt-3 text-xs leading-relaxed text-muted">
              Actions are recorded against your name and enter institutional memory.
            </p>
          </Panel>

          <Panel title="Decision Timeline" bodyClassName="p-5">
            <DecisionTimeline timeline={decision.timeline} />
          </Panel>
        </div>
      </div>
    </div>);

}