import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2Icon,
  FileSearchIcon,
  ClockIcon,
  XCircleIcon,
  ArrowLeftIcon,
  ExternalLinkIcon,
  UndoIcon } from
'lucide-react';
import { Section, Label } from '../components/ui/Section';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { CaseColumns } from '../components/decision/CaseColumns';
import { UncertaintyPanel } from '../components/decision/UncertaintyPanel';
import { DecisionTimeline } from '../components/decision/DecisionTimeline';
import { AlternativesView } from '../components/analysis/AlternativesView';
import {
  decision,
  caseFor,
  caseAgainst,
  decisionOwners,
  decisionTimeline,
  TimelineEvent } from
'../data/decision';
import { alternatives } from '../data/analysis';
import { opportunityById } from '../data/opportunities';
import { useScreenInit } from '../useScreenInit.js';

const ACTIONS = [
{
  id: 'approve',
  label: 'Approve Validation Sprint',
  icon: CheckCircle2Icon,
  variant: 'primary' as const,
  status: 'Approved',
  confirmation:
  'Sprint approved. Owners notified, the initiative moves to Executing, and the 45-day measurement window opens Monday.',
  event: 'Sprint approved'
},
{
  id: 'evidence',
  label: 'Request More Evidence',
  icon: FileSearchIcon,
  variant: 'default' as const,
  status: 'Evidence requested',
  confirmation:
  'Evidence request logged. Retrieval will re-run against the two unresolved assumptions and the decision returns to the queue.',
  event: 'More evidence requested'
},
{
  id: 'defer',
  label: 'Defer',
  icon: ClockIcon,
  variant: 'default' as const,
  status: 'Deferred',
  confirmation:
  'Decision deferred. It re-enters the queue when the ERP segmentation question is resolved.',
  event: 'Decision deferred'
},
{
  id: 'reject',
  label: 'Reject',
  icon: XCircleIcon,
  variant: 'danger' as const,
  status: 'Rejected',
  confirmation:
  'Decision rejected. The rationale is recorded against this opportunity and carried into institutional memory.',
  event: 'Decision rejected'
}];


export function DecisionWorkspace() {
  const screenInit = useScreenInit() as {taken?: string | null;};
  const [taken, setTaken] = useState<(typeof ACTIONS)[number] | null>(
    ACTIONS.find((a) => a.id === screenInit.taken) ?? null
  );
  const o = opportunityById(decision.opportunityId);

  const timeline: TimelineEvent[] = taken ?
  [
  ...decisionTimeline.slice(0, 3),
  { ...decisionTimeline[3], state: 'complete' as const },
  {
    id: 't6',
    label: taken.event,
    date: 'Today',
    detail: 'Recorded by Priya Raghunathan, VP Portfolio Value Creation',
    state: 'complete' as const
  }] :

  decisionTimeline;

  const metrics = [
  { label: 'Recommendation', value: decision.recommendation, mono: false, tone: 'text-ink' },
  { label: 'Potential upside', value: decision.upside, mono: true, tone: 'text-accent' },
  { label: 'Downside', value: decision.downside, mono: false, tone: 'text-ink' },
  { label: 'Confidence', value: `${decision.confidence}%`, mono: true, tone: 'text-ink' },
  { label: 'Required investment', value: decision.investment, mono: true, tone: 'text-ink' },
  { label: 'Decision deadline', value: decision.deadline, mono: false, tone: 'text-caution' }];


  return (
    <div className="flex h-full w-full flex-col">
      <header className="shrink-0 border-b border-line bg-surface">
        <div className="flex items-center gap-3 px-4 pb-2.5 pt-3">
          <Link
            to={`/analysis/${decision.opportunityId}`}
            aria-label="Back to analysis"
            className="flex h-6 w-6 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:bg-sunken hover:text-ink">
            
            <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          </Link>
          <h1 className="text-lg font-semibold tracking-[-0.015em] text-ink">{decision.title}</h1>
          <StatusPill
            label={taken ? taken.status : decision.status}
            tone={taken ? taken.id === 'approve' ? 'positive' : taken.id === 'reject' ? 'critical' : 'caution' : 'caution'}
            dot />
          
          <Link
            to={`/analysis/${decision.opportunityId}`}
            className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
            
            <ExternalLinkIcon className="h-3 w-3" strokeWidth={1.75} />
            Open underlying analysis
          </Link>
        </div>

        <dl className="grid grid-cols-2 divide-x divide-y divide-line border-t border-line md:grid-cols-3 xl:grid-cols-6 xl:divide-y-0">
          {metrics.map((m) =>
          <div key={m.label} className="px-4 py-2.5">
              <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">
                {m.label}
              </dt>
              <dd
              className={`mt-1 ${m.mono ? 'font-mono text-lg font-semibold tabular' : 'text-base font-medium'} ${m.tone}`}>
              
                {m.value}
              </dd>
            </div>
          )}
        </dl>
      </header>

      <AnimatePresence>
        {taken &&
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
          className="shrink-0 overflow-hidden border-b border-line bg-accent-soft">
          
            <div className="flex items-start gap-2.5 px-4 py-2.5">
              <taken.icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2} />
              <div className="min-w-0 flex-1">
                <p className="text-base font-medium text-ink">{taken.status}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{taken.confirmation}</p>
              </div>
              <Button size="xs" onClick={() => setTaken(null)}>
                <UndoIcon className="h-3 w-3" strokeWidth={1.75} />
                Undo
              </Button>
            </div>
          </motion.div>
        }
      </AnimatePresence>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-3 p-3 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-3">
            <CaseColumns caseFor={caseFor} caseAgainst={caseAgainst} />

            <Section
              title="Remaining uncertainty"
              meta="What is still unknown, and whether it changes this decision"
              bodyClassName="p-0">
              
              <UncertaintyPanel baseEbitda={o.ebitda} />
            </Section>

            <Section
              title="Alternatives considered"
              meta="Ranked against the recommendation at the time of decision"
              bodyClassName="p-0">
              
              <AlternativesView
                alternatives={alternatives}
                recommendedTitle="45-day validation sprint, then staged rollout"
                recommendedScore={o.score}
                recommendedEbitda={o.ebitda} />
              
            </Section>
          </div>

          <div className="flex flex-col gap-3">
            <div className="sticky top-0 flex flex-col gap-3">
              <Section title="Decision" bodyClassName="p-3">
                {taken ?
                <div>
                    <div className="flex items-center gap-2">
                      <taken.icon
                      className={`h-4 w-4 ${taken.id === 'reject' ? 'text-critical' : 'text-accent'}`}
                      strokeWidth={2} />
                    
                      <span className="text-base font-semibold text-ink">{taken.status}</span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{taken.confirmation}</p>
                    <dl className="mt-3 space-y-1.5 border-t border-line pt-2.5 text-2xs">
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">Recorded by</dt>
                        <dd className="text-ink-soft">P. Raghunathan</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">Recorded at</dt>
                        <dd className="font-mono tabular text-ink-soft">Today · 09:42</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-muted">Basis</dt>
                        <dd className="text-ink-soft">Score {o.score} · Conf {decision.confidence}%</dd>
                      </div>
                    </dl>
                    <Button size="sm" className="mt-3 w-full" onClick={() => setTaken(null)}>
                      <UndoIcon className="h-3 w-3" strokeWidth={1.75} />
                      Reopen decision
                    </Button>
                  </div> :

                <div className="flex flex-col gap-2">
                    {ACTIONS.map((a) =>
                  <Button
                    key={a.id}
                    size="md"
                    variant={a.variant}
                    className="w-full justify-start"
                    onClick={() => setTaken(a)}>
                    
                        <a.icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                        {a.label}
                      </Button>
                  )}
                    <p className="mt-1 text-2xs leading-relaxed text-muted">
                      Every action is attributed, timestamped, and recorded with the score and evidence
                      state it was taken against.
                    </p>
                  </div>
                }
              </Section>

              <Section title="Owners" bodyClassName="p-0">
                <ul className="divide-y divide-line">
                  {decisionOwners.map((ow) =>
                  <li key={ow.name} className="flex items-center justify-between gap-2 px-3 py-2">
                      <span className="min-w-0">
                        <span className="block truncate text-xs text-ink">{ow.name}</span>
                        <span className="block truncate text-2xs text-muted">{ow.role}</span>
                      </span>
                      <StatusPill
                      label={taken?.id === 'approve' ? 'Approved' : ow.state}
                      tone={
                      taken?.id === 'approve' || ow.state === 'Approved' ?
                      'positive' :
                      ow.state === 'Pending' ?
                      'quiet' :
                      'neutral'
                      } />
                    
                    </li>
                  )}
                </ul>
              </Section>

              <Section title="Decision timeline" bodyClassName="p-3">
                <DecisionTimeline events={timeline} />
              </Section>

              <Section title="Basis of decision" bodyClassName="p-3">
                <dl className="space-y-2 text-2xs">
                  {[
                  ['Opportunity', o.title],
                  ['Score at decision', `${o.score} / 100`],
                  ['Evidence', `${o.evidenceCount.supporting} supporting · ${o.evidenceCount.contradicting} contradicting`],
                  ['Unresolved assumptions', `${o.assumptionCount.unresolved} of ${o.assumptionCount.total}`],
                  ['Worst modelled case', '+$2.1M · score 61']].
                  map(([k, v]) =>
                  <div key={k} className="flex justify-between gap-3">
                      <dt className="shrink-0 text-muted">{k}</dt>
                      <dd className="text-right text-ink-soft">{v}</dd>
                    </div>
                  )}
                </dl>
                <Label className="mt-3 block">Next step if approved</Label>
                <p className="mt-1 text-2xs leading-relaxed text-muted">
                  25-account cohort outside the Midwest, contracted revenue excluded. Success threshold:
                  3%+ margin improvement with under 1% incremental churn.
                </p>
              </Section>
            </div>
          </div>
        </div>
      </div>
    </div>);

}