import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, TargetIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { experiments } from '../data/experiments';
import { opportunities, portfolioTopOpportunities } from '../data/opportunities';

const ALL_OPPORTUNITIES = [...opportunities, ...portfolioTopOpportunities];
function opportunityFor(id: string) {
  return ALL_OPPORTUNITIES.find((o) => o.id === id);
}

const FILTERS = ['All', 'Running', 'Designing', 'Complete', 'Blocked'];

export function Experiments() {
  const [filter, setFilter] = useState('All');

  const rows = useMemo(
    () => filter === 'All' ? experiments : experiments.filter((e) => e.status === filter),
    [filter]
  );

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <PageHeader
        eyebrow="Meridian Capital · Fund IV"
        title="Experiments"
        subtitle="Recommendations are validated before they are scaled. Each experiment carries a success threshold agreed in advance."
        actions={<Button variant="primary">Design Experiment</Button>} />
      

      <div className="mt-6 flex flex-wrap gap-2">
        {FILTERS.map((f) =>
        <button
          key={f}
          type="button"
          onClick={() => setFilter(f)}
          aria-pressed={filter === f}
          className={`h-8 border px-3 text-xs transition-colors ${
          filter === f ?
          'border-ink bg-ink text-white' :
          'border-line bg-surface text-muted hover:border-line-strong hover:text-ink'}`
          }>
          
            {f}
            <span className="ml-1.5 font-mono text-2xs tabular opacity-60">
              {f === 'All' ? experiments.length : experiments.filter((e) => e.status === f).length}
            </span>
          </button>
        )}
      </div>

      {rows.length === 0 ?
      <p className="mt-6 border border-dashed border-line-strong bg-surface px-6 py-16 text-center text-sm text-muted">
          No experiments in this state.
        </p> :

      <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
          {rows.map((e) => {
          const pct = Math.round(e.day / e.duration * 100);
          const opportunity = opportunityFor(e.relatedOpportunityId);
          return (
            <article
              key={e.id}
              className="flex flex-col border border-line bg-surface transition-colors hover:border-line-strong">

                <header className="border-b border-line p-4">
                  <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Testing assumption</p>
                  <p className="mt-1 text-[13px] leading-snug text-ink-soft">"{e.hypothesis}"</p>

                  {opportunity && (
                    <Link
                      to={`/opportunities/${opportunity.id}`}
                      className="mt-2.5 flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-accent">
                      <TargetIcon className="h-3 w-3 shrink-0" strokeWidth={1.75} />
                      <span className="truncate">{opportunity.title}</span>
                      <ArrowRightIcon className="h-2.5 w-2.5 shrink-0" strokeWidth={2} />
                    </Link>
                  )}

                  <div className="mb-2 mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-3">
                    <span className="text-2xs uppercase tracking-label text-muted">{e.company}</span>
                    <StatusPill label={e.status} />
                    <StatusPill label={e.signal} />
                  </div>
                  <h2 className="text-[15px] font-semibold leading-snug tracking-[-0.01em] text-ink">
                    {e.name}
                  </h2>
                </header>

                <div className="p-4">
                  <div className="flex items-baseline justify-between">
                    <span className="text-2xs uppercase tracking-label text-muted">Progress</span>
                    <span className="font-mono text-xs tabular text-ink">
                      Day {e.day} of {e.duration}
                    </span>
                  </div>
                  <div className="mt-2 h-[3px] w-full bg-line">
                    <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>

                  <dl className="mt-4 space-y-3">
                    <div>
                      <dt className="text-2xs uppercase tracking-label text-muted-soft">
                        Success threshold
                      </dt>
                      <dd className="mt-1 text-xs text-ink-soft">{e.successThreshold}</dd>
                    </div>
                    <div>
                      <dt className="text-2xs uppercase tracking-label text-muted-soft">Current reading</dt>
                      <dd
                      className={`mt-1 text-xs font-medium ${
                      e.signal === 'Behind' ?
                      'text-critical' :
                      e.signal === 'Ahead' ?
                      'text-positive' :
                      'text-ink'}`
                      }>
                      
                        {e.reading}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-line px-4 py-2.5">
                  <span className="text-xs text-muted">Owner · {e.owner}</span>
                  <button
                  type="button"
                  className="text-xs font-medium text-accent transition-colors hover:text-accent-hover">
                  
                    View readout →
                  </button>
                </div>
              </article>);

        })}
        </div>
      }

      <div className="mt-6">
        <Panel
          title="Experiment Discipline"
          description="How reliably validation predicts realized outcomes across this portfolio.">
          
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
            ['Experiments run, trailing 12mo', '34'],
            ['Met their success threshold', '68%'],
            ['Scaled after passing', '21'],
            ['Scaled initiatives that hit plan', '81%']].
            map(([k, v]) =>
            <div key={k}>
                <dt className="text-2xs uppercase tracking-label text-muted">{k}</dt>
                <dd className="mt-2 font-mono text-2xl font-semibold tabular text-ink">{v}</dd>
              </div>
            )}
          </dl>
        </Panel>
      </div>
    </div>);

}