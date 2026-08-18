import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowRightIcon, AlertTriangleIcon, CheckCircle2Icon, GaugeIcon } from 'lucide-react';
import { AnalysisHeader, ANALYSIS_TABS, AnalysisTab } from '../components/analysis/AnalysisHeader';
import { ScoreBreakdown } from '../components/analysis/ScoreBreakdown';
import { ReasoningChain } from '../components/analysis/ReasoningChain';
import { EvidenceGrid } from '../components/analysis/EvidenceGrid';
import { AssumptionsTable } from '../components/analysis/AssumptionsTable';
import { AssumptionDetail } from '../components/analysis/AssumptionDetail';
import { RisksView } from '../components/analysis/RisksView';
import { AlternativesView } from '../components/analysis/AlternativesView';
import { FinancialModel } from '../components/analysis/FinancialModel';
import { ChallengePanel } from '../components/analysis/ChallengePanel';
import { Section, Label } from '../components/ui/Section';
import { SidePanel } from '../components/ui/SidePanel';
import { Button } from '../components/ui/Button';
import { opportunityById } from '../data/opportunities';
import {
  recommendation,
  reasoningChain,
  evidence,
  assumptions,
  risks,
  alternatives,
  challenges } from
'../data/analysis';
import { useScreenInit } from '../useScreenInit.js';

export function Analysis() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const o = opportunityById(opportunityId);
  const screenInit = useScreenInit() as {
    tab?: AnalysisTab;
    assumptionId?: string | null;
    challengeOpen?: boolean;
    activeChallenges?: string[];
  };

  const [tab, setTab] = useState<AnalysisTab>(screenInit.tab ?? 'Overview');
  const [assumptionId, setAssumptionId] = useState<string | null>(screenInit.assumptionId ?? null);
  const [challengeOpen, setChallengeOpen] = useState(screenInit.challengeOpen ?? false);
  const [activeChallenges, setActiveChallenges] = useState<string[]>(
    screenInit.activeChallenges ?? []
  );
  const [addedToDecision, setAddedToDecision] = useState(true);

  const stressed = useMemo(() => {
    if (!activeChallenges.length) return null;
    const applied = challenges.filter((c) => activeChallenges.includes(c.id));
    return {
      score: Math.max(
        20,
        o.score + applied.reduce((s, c) => s + c.scoreDelta, 0)
      ),
      ebitda: Math.max(
        0,
        Number((o.ebitda + applied.reduce((s, c) => s + c.ebitdaDelta, 0)).toFixed(1))
      )
    };
  }, [activeChallenges, o]);

  const assumptionStatus = useMemo(
    () => Object.fromEntries(assumptions.map((a) => [a.id, a.status])),
    []
  );

  const supporting = evidence.filter((e) => e.direction === 'supports');
  const contradicting = evidence.filter((e) => e.direction === 'contradicts');
  const unresolved = assumptions.filter(
    (a) => a.status === 'Must Validate' || a.status === 'Unverified'
  );

  const counts: Partial<Record<AnalysisTab, string | number>> = {
    Evidence: evidence.length,
    Assumptions: assumptions.length,
    Risks: risks.length,
    Alternatives: alternatives.length
  };

  const openAssumption = (id: string) => {
    setAssumptionId(id);
    setChallengeOpen(false);
  };

  const activeAssumption = assumptions.find((a) => a.id === assumptionId) ?? null;

  return (
    <div className="relative flex h-full w-full flex-col">
      <AnalysisHeader
        opportunity={o}
        status={recommendation.status}
        tab={tab}
        onTab={setTab}
        counts={counts}
        onChallenge={() => {
          setChallengeOpen((v) => !v);
          setAssumptionId(null);
        }}
        challengeActive={challengeOpen || activeChallenges.length > 0}
        onAddToDecision={() => {
          setAddedToDecision(true);
          navigate('/decision');
        }}
        addedToDecision={addedToDecision}
        scoreOverride={stressed?.score ?? null}
        ebitdaOverride={stressed?.ebitda ?? null} />
      

      <div className="min-h-0 flex-1 overflow-y-auto">
        {tab === 'Overview' &&
        <div className="flex flex-col gap-3 p-3">
            <div className="grid grid-cols-1 gap-3 2xl:grid-cols-[minmax(0,1fr)_640px]">
              <section className="border-l-2 border-accent bg-surface">
                <div className="flex h-9 items-center justify-between border-b border-line bg-raised px-3">
                  <h2 className="text-2xs font-semibold uppercase tracking-label text-ink-soft">
                    Recommendation
                  </h2>
                  <span className="font-mono text-2xs tabular text-muted">
                    Generated Jul 22 · reviewed Aug 11
                  </span>
                </div>
                <div className="p-4">
                  <p className="max-w-3xl text-lg font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {recommendation.statement}
                  </p>
                  <p className="mt-2.5 max-w-3xl text-xs leading-relaxed text-muted">
                    {recommendation.detail}
                  </p>

                  <div className="mt-4 flex flex-wrap items-end gap-x-8 gap-y-3 border-t border-line pt-3">
                    <div>
                      <Label>Potential EBITDA impact</Label>
                      <p className="mt-1 font-mono text-2xl font-semibold tabular text-accent">
                        {recommendation.upside}
                      </p>
                    </div>
                    <div>
                      <Label>Hallucinate&rsquo;s confidence</Label>
                      <p className="mt-1 font-mono text-2xl font-semibold tabular text-ink">
                        {recommendation.confidence}%
                      </p>
                    </div>
                    <div>
                      <Label>Required to proceed</Label>
                      <p className="mt-1 text-base text-ink">$180K · 45 days · 2 FTE</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                      <Button size="sm" onClick={() => setChallengeOpen(true)}>
                        Challenge this
                      </Button>
                      <Button size="sm" variant="primary" onClick={() => navigate('/decision')}>
                        Take to decision
                        <ArrowRightIcon className="h-3 w-3" strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                </div>
              </section>

              <Section title="Score composition" meta="Weighted against portfolio medians">
                <ScoreBreakdown
                score={o.score}
                components={o.scoreComponents}
                stressedScore={stressed?.score ?? null} />
              
              </Section>
            </div>

            <Section
            title="Why Hallucinate believes this"
            meta="Evidence → inference → assumption. Each chain is inspectable."
            bodyClassName=""
            actions={
            <span className="inline-flex items-center gap-3">
                  {[
              ['bg-positive', 'Evidence'],
              ['bg-accent', 'Inference'],
              ['bg-caution', 'Assumption']].
              map(([c, l]) =>
              <span key={l} className="inline-flex items-center gap-1.5 text-2xs text-muted">
                      <span className={`h-1.5 w-1.5 ${c}`} />
                      {l}
                    </span>
              )}
                </span>
            }>
            
              <ReasoningChain
              links={reasoningChain}
              onOpenAssumption={openAssumption}
              assumptionStatus={assumptionStatus} />
            
            </Section>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
              <Section
              title="Evidence"
              meta={`${supporting.length} supporting · ${contradicting.length} contradicting`}
              actions={
              <button
                type="button"
                onClick={() => setTab('Evidence')}
                className="text-2xs font-medium text-accent hover:text-accent-hover">
                
                    View all →
                  </button>
              }
              bodyClassName="p-3">
              
                <div className="flex h-1.5 w-full overflow-hidden">
                  <span
                  className="block h-full bg-positive"
                  style={{ width: `${supporting.length / evidence.length * 100}%` }} />
                
                  <span className="block h-full flex-1 bg-critical" />
                </div>
                <ul className="mt-3 space-y-2">
                  <li className="flex gap-2">
                    <CheckCircle2Icon className="mt-0.5 h-3 w-3 shrink-0 text-positive" strokeWidth={2} />
                    <span className="text-xs leading-relaxed text-ink-soft">
                      {supporting[0].finding}
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <AlertTriangleIcon className="mt-0.5 h-3 w-3 shrink-0 text-critical" strokeWidth={2} />
                    <span className="text-xs leading-relaxed text-ink-soft">
                      {contradicting[0].finding}
                    </span>
                  </li>
                </ul>
              </Section>

              <Section
              title="Unresolved assumptions"
              meta={`${unresolved.length} of ${assumptions.length}`}
              actions={
              <button
                type="button"
                onClick={() => setTab('Assumptions')}
                className="text-2xs font-medium text-accent hover:text-accent-hover">
                
                    View all →
                  </button>
              }
              bodyClassName="p-0">
              
                <ul className="divide-y divide-line">
                  {unresolved.slice(0, 3).map((a) =>
                <li key={a.id}>
                      <button
                    type="button"
                    onClick={() => openAssumption(a.id)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left transition-colors hover:bg-raised">
                    
                        <span className="min-w-0">
                          <span className="block truncate text-xs text-ink">{a.text}</span>
                          <span className="block text-2xs text-muted">
                            {a.confidence} confidence · {a.impactIfWrong} if wrong
                          </span>
                        </span>
                        <span className="shrink-0 font-mono text-2xs tabular text-critical">
                          →{a.ebitdaIfFalse.toFixed(1)}M
                        </span>
                      </button>
                    </li>
                )}
                </ul>
              </Section>

              <Section
              title="Downside"
              meta={`${risks.length} material risks`}
              actions={
              <button
                type="button"
                onClick={() => setTab('Risks')}
                className="text-2xs font-medium text-accent hover:text-accent-hover">
                
                    View all →
                  </button>
              }
              bodyClassName="p-3">
              
                <ul className="space-y-2">
                  {risks.slice(0, 2).map((r) =>
                <li key={r.id} className="flex items-start justify-between gap-3">
                      <span className="text-xs leading-relaxed text-ink-soft">{r.title}</span>
                      <span className="shrink-0 font-mono text-2xs tabular text-critical">
                        {r.exposure.split(' of ')[0]}
                      </span>
                    </li>
                )}
                </ul>
                <p className="mt-3 inline-flex items-center gap-1.5 border-t border-line pt-2.5 text-2xs text-muted">
                  <GaugeIcon className="h-3 w-3" strokeWidth={1.75} />
                  Worst modelled case: +$2.1M with score 61
                </p>
              </Section>
            </div>
          </div>
        }

        {tab === 'Evidence' && <EvidenceGrid evidence={evidence} />}

        {tab === 'Assumptions' &&
        <div className="p-3">
            <Section
            title="Critical assumptions"
            meta="Select an assumption to inspect what supports it, what challenges it, and what happens if it is false."
            bodyClassName="p-0">
            
              <AssumptionsTable
              assumptions={assumptions}
              activeId={assumptionId}
              onSelect={openAssumption} />
            
            </Section>
          </div>
        }

        {tab === 'Risks' &&
        <div className="p-3">
            <RisksView risks={risks} />
          </div>
        }

        {tab === 'Alternatives' &&
        <div className="p-3">
            <Section
            title="Alternatives considered"
            meta="Neighbouring approaches evaluated and ranked against the recommendation."
            bodyClassName="p-0">
            
              <AlternativesView
              alternatives={alternatives}
              recommendedTitle="Validation sprint, then staged rollout"
              recommendedScore={o.score}
              recommendedEbitda={o.ebitda} />
            
            </Section>
          </div>
        }

        {tab === 'Financial Model' &&
        <div className="p-3">
            <FinancialModel />
          </div>
        }
      </div>

      <SidePanel
        open={!!activeAssumption}
        onClose={() => setAssumptionId(null)}
        eyebrow="Assumption"
        title={activeAssumption?.text ?? ''}
        width="w-[440px]"
        footer={
        <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" className="flex-1">
              Add to validation sprint
            </Button>
            <Button size="sm" onClick={() => setAssumptionId(null)}>
              Close
            </Button>
          </div>
        }>
        
        {activeAssumption &&
        <AssumptionDetail
          assumption={activeAssumption}
          baseScore={o.score}
          baseEbitda={o.ebitda} />

        }
      </SidePanel>

      <SidePanel
        open={challengeOpen}
        onClose={() => setChallengeOpen(false)}
        eyebrow="Stress test"
        title="Challenge recommendation"
        width="w-[460px]">
        
        <ChallengePanel
          challenges={challenges}
          active={activeChallenges}
          onToggle={(id) =>
          setActiveChallenges((prev) =>
          prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
          )
          }
          onReset={() => setActiveChallenges([])}
          baseScore={o.score}
          baseEbitda={o.ebitda}
          score={stressed?.score ?? o.score}
          ebitda={stressed?.ebitda ?? o.ebitda} />
        
      </SidePanel>
    </div>);

}