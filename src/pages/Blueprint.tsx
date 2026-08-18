import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon, PresentationIcon } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { InitiativeTable } from '../components/blueprint/InitiativeTable';
import { RoadmapChart } from '../components/blueprint/RoadmapChart';
import { companies } from '../data/companies';
import { initiatives, blueprintMetrics, roadmap } from '../data/blueprint';

const WORKSTREAMS = ['Commercial', 'Operational', 'AI / Automation'] as const;

export function Blueprint() {
  const { companyId } = useParams();
  const company = companies.find((c) => c.id === companyId) ?? companies[0];

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <Link
        to={`/companies/${company.id}`}
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        {company.name} workspace
      </Link>

      <header className="mt-4 flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <p className="text-2xs font-medium uppercase tracking-label text-muted">{company.name}</p>
          <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink">
            Value Creation Blueprint
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Every initiative underwritten for this hold, with its owner, expected impact, confidence and
            position in the value creation pipeline.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <DownloadIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export
          </Button>
          <Button variant="primary">
            <PresentationIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Present
          </Button>
        </div>
      </header>

      <section
        aria-label="Blueprint metrics"
        className="mt-6 grid grid-cols-2 border border-line bg-surface md:grid-cols-5">
        
        {blueprintMetrics.map((m, i) =>
        <div
          key={m.label}
          className={`border-b border-line p-5 md:border-b-0 ${i > 0 ? 'md:border-l' : ''}`}>
          
            <p className="text-2xs uppercase tracking-label text-muted">{m.label}</p>
            <p
            className={`mt-2.5 font-mono text-2xl font-semibold tabular ${
            i === 0 ? 'text-ink' : i === blueprintMetrics.length - 1 ? 'text-positive' : 'text-accent'}`
            }>
            
              {m.value}
            </p>
            <p className="mt-1.5 text-xs text-muted">{m.note}</p>
          </div>
        )}
      </section>

      <div className="mt-6 flex flex-col gap-6">
        {WORKSTREAMS.map((ws) => {
          const rows = initiatives.filter((i) => i.workstream === ws);
          return (
            <Panel
              key={ws}
              eyebrow="Workstream"
              title={ws}
              description={`${rows.length} initiatives · $${rows.
              reduce((s, i) => s + i.impact, 0).
              toFixed(1)}M expected EBITDA`}
              bodyClassName="">
              
              <InitiativeTable initiatives={rows} />
            </Panel>);

        })}
      </div>

      <div className="mt-6">
        <Panel
          title="100-Day Roadmap"
          description="Work is sequenced against decision gates. Nothing scales before its validation threshold is met.">
          
          <RoadmapChart items={roadmap} />
        </Panel>
      </div>
    </div>);

}