import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DatabaseIcon, ArrowRightIcon, AlertTriangleIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { StatusPill } from '../components/ui/StatusPill';
import { EpistemicTag } from '../components/ui/EpistemicTag';
import { StrategicMemorySearch } from '../components/intelligence/StrategicMemorySearch';
import { MemoryTrail } from '../components/intelligence/MemoryTrail';
import {
  defaultAnswer,
  suggestedQueries,
  historicalDecisions,
  memoryStats } from
'../data/memory';

export function Intelligence() {
  const [query, setQuery] = useState(defaultAnswer.query);
  const [loading, setLoading] = useState(false);

  const onSubmit = (q: string) => {
    setLoading(true);
    setQuery(q);
    window.setTimeout(() => setLoading(false), 700);
  };

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <PageHeader
        eyebrow="Strategic Memory · Fund II–IV"
        title="Institutional Intelligence"
        subtitle="Every analysis, decision, assumption and outcome this firm has produced, queryable as one body of evidence."
        meta={
        <dl className="flex flex-wrap gap-x-10 gap-y-3">
            {memoryStats.map((s) =>
          <div key={s.label}>
                <dt className="text-2xs uppercase tracking-label text-muted-soft">{s.label}</dt>
                <dd className="mt-1 font-mono text-[15px] tabular font-medium text-ink">{s.value}</dd>
              </div>
          )}
          </dl>
        } />
      

      <div className="mt-8">
        <StrategicMemorySearch
          suggestions={suggestedQueries}
          onSubmit={onSubmit}
          initialQuery={defaultAnswer.query}
          loading={loading} />
        
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_400px]">
        <Panel eyebrow="Institutional memory" title={query} actions={<EpistemicTag kind="Inference" />} bodyClassName="">
          {loading ? (
            <div className="space-y-3 p-6">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-3 animate-pulse bg-line" style={{ width: `${90 - i * 18}%` }} />
              ))}
            </div>
          ) : (
            <>
              <div className="border-b border-line px-6 py-5">
                <p className="text-2xs font-semibold uppercase tracking-label text-muted-soft">What we've learned</p>
                <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">{defaultAnswer.headline}</p>
              </div>

              <div className="border-b border-line px-6 py-5">
                <p className="text-2xs font-semibold uppercase tracking-label text-muted-soft">Historical evidence</p>
                <div className="mt-4 flex flex-wrap items-start gap-x-10 gap-y-4">
                  <MemoryTrail
                    total={14}
                    segments={[
                      { label: 'Exceeded', count: 9, tone: 'positive' },
                      { label: 'Met', count: 3, tone: 'neutral' },
                      { label: 'Underperformed', count: 2, tone: 'critical' }
                    ]}
                  />
                  <div className="border-l-2 border-ink-soft/30 pl-3">
                    <p className="font-mono text-xl font-semibold tabular text-ink">
                      {defaultAnswer.stats.find((s) => s.label === 'Median time to impact')?.value}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">Median time to impact</p>
                  </div>
                </div>
                <ul className="mt-5 divide-y divide-line">
                  {defaultAnswer.bullets.map((b) => (
                    <li key={b.label} className="py-3.5 first:pt-0 last:pb-0">
                      <p className="text-2xs font-medium uppercase tracking-label text-muted">{b.label}</p>
                      <p className="mt-1.5 text-[13px] leading-relaxed text-ink">{b.value}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-b border-line px-6 py-5">
                <p className="flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-label text-muted-soft">
                  <AlertTriangleIcon className="h-3 w-3 text-caution" strokeWidth={2} />
                  Contradictions
                </p>
                <ul className="mt-3 space-y-3">
                  {defaultAnswer.contradictions.map((c) => (
                    <li key={c.company} className="border border-dashed border-caution-line bg-caution-soft/40 px-3.5 py-3">
                      <p className="text-xs font-medium text-ink-soft">{c.company}</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted">{c.note}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="px-6 py-5">
                <p className="flex items-start gap-2 text-2xs font-semibold uppercase tracking-label text-muted-soft">
                  <DatabaseIcon className="mt-0.5 h-3 w-3 shrink-0" strokeWidth={2} />
                  Sources
                </p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{defaultAnswer.basis}</p>
              </div>
            </>
          )}
        </Panel>

        <Panel
          title="What This Implies for Live Work"
          description="Institutional memory is applied to the analyses currently in flight."
          bodyClassName="">
          
          {[
          {
            title: 'NorthPeak — Pricing Architecture Redesign',
            note: 'Segmentation is complete before rollout, matching the pattern in all 9 initiatives that exceeded target.',
            tone: 'positive',
            to: '/opportunities/pricing-architecture'
          },
          {
            title: 'NorthPeak — Sales exception authority',
            note: 'The most common failure mode in this portfolio. Guardrails are a precondition, not an enhancement.',
            tone: 'caution',
            to: '/opportunities/pricing-architecture'
          },
          {
            title: 'Meridian — Payer renegotiation timing',
            note: 'Prior payer work was gated by contract cycles, not negotiation quality. Expect a 9–10 month curve.',
            tone: 'quiet',
            to: '/opportunities/meridian-network'
          }].
          map((item) =>
          <Link
            key={item.title}
            to={item.to}
            className="block border-b border-line px-5 py-4 last:border-b-0 hover:bg-raised">
            
              <p className="text-[13px] font-medium text-ink">{item.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{item.note}</p>
            </Link>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel
          title="Related Historical Decisions"
          description="Prior initiatives matched on category, sector and mechanism — with what actually happened."
          bodyClassName="">
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {['Company', 'Initiative', 'Year', 'Target', 'Actual', 'Time to Impact', 'Outcome'].map(
                    (h) =>
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted">
                      
                        {h}
                      </th>

                  )}
                </tr>
              </thead>
              <tbody>
                {historicalDecisions.map((h) =>
                <tr key={h.id} className="border-b border-line align-top last:border-b-0 hover:bg-raised">
                    <td className="px-4 py-3 text-[13px] text-ink-soft">{h.company}</td>
                    <td className="max-w-sm px-4 py-3">
                      <span className="block text-[13px] font-medium text-ink">{h.title}</span>
                      <span className="mt-1 block text-xs leading-relaxed text-muted">{h.lesson}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] tabular text-muted">{h.year}</td>
                    <td className="px-4 py-3 font-mono text-[13px] tabular text-muted">{h.target}</td>
                    <td
                    className={`px-4 py-3 font-mono text-[13px] tabular ${
                    h.outcome === 'Underperformed' ? 'text-critical' : 'text-ink'}`
                    }>
                    
                      {h.actual}
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] tabular text-muted">{h.timeToImpact}</td>
                    <td className="px-4 py-3">
                      <StatusPill
                      label={h.outcome}
                      tone={
                      h.outcome === 'Exceeded' ?
                      'positive' :
                      h.outcome === 'Met' ?
                      'neutral' :
                      'critical'
                      } />
                    
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-line px-5 py-3">
            <Link
              to="/reports"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover">
              
              See how this shaped the current recommendation
              <ArrowRightIcon className="h-3 w-3" strokeWidth={2} />
            </Link>
          </div>
        </Panel>
      </div>
    </div>);

}