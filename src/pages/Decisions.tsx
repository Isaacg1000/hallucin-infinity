import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { StatusPill } from '../components/ui/StatusPill';
import { decisions } from '../data/decisions';

export function Decisions() {
  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <PageHeader
        eyebrow="Meridian Capital · Fund IV"
        title="Decisions"
        subtitle="Every material recommendation becomes a structured decision with its evidence, assumptions, alternatives, and owners attached." />
      

      <div className="mt-6 grid grid-cols-1 gap-3">
        {decisions.map((d) =>
        <Link
          key={d.id}
          to={`/decisions/${d.id}`}
          className="group grid grid-cols-1 gap-5 border border-line bg-surface p-5 transition-colors hover:border-line-strong lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_auto]">
          
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-2xs uppercase tracking-label text-muted">{d.company}</span>
                <StatusPill label={d.status} />
              </div>
              <h2 className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{d.title}</h2>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-muted">
                {d.recommendation}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 self-center">
              <div>
                <p className="text-2xs uppercase tracking-label text-muted-soft">Expected outcome</p>
                <p className="mt-1 text-[13px] text-ink">{d.expectedOutcome}</p>
              </div>
              <div>
                <p className="text-2xs uppercase tracking-label text-muted-soft">Owners</p>
                <p className="mt-1 text-[13px] text-ink">
                  {d.owners.filter((o) => o.state !== 'Pending').length} of {d.owners.length} reviewed
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-accent">
                Open
                <ArrowRightIcon className="h-3 w-3 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </span>
            </div>
          </Link>
        )}
      </div>

      <div className="mt-6">
        <Panel
          title="Decision Discipline"
          description="How this fund's decisions have held up. Every closed decision is scored against its realized outcome.">
          
          <dl className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
            ['Decisions closed, trailing 12mo', '38'],
            ['Approved on first review', '61%'],
            ['Median days to decision', '11'],
            ['Estimates within ±15% of realized', '72%']].
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