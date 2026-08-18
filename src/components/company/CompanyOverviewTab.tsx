import React from 'react';
import { Panel } from '../ui/Panel';
import { MetricCard } from '../ui/MetricCard';
import { EpistemicTag } from '../ui/EpistemicTag';
import { OpportunityPipeline } from '../portfolio/OpportunityPipeline';
import { northpeakThesis, northpeakPriorities } from '../../data/companies';
import { Company } from '../../types';

const PIPELINE = [
{ stage: 'Identified' as const, value: 31.5, count: 24 },
{ stage: 'Validating' as const, value: 18.2, count: 11 },
{ stage: 'Approved' as const, value: 14.7, count: 7 },
{ stage: 'Executing' as const, value: 9.8, count: 5 },
{ stage: 'Realized' as const, value: 3.4, count: 2 }];


export function CompanyOverviewTab({ company }: {company: Company;}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Panel title="Investment Thesis" actions={<EpistemicTag kind="Hypothesis" />}>
          <p className="max-w-3xl text-[13px] leading-[1.75] text-ink-soft">{northpeakThesis}</p>
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 md:grid-cols-4">
            {[
            ['Entry multiple', '8.4x EBITDA'],
            ['Target margin expansion', '400–600 bps'],
            ['Underwritten exit', 'FY2031'],
            ['Thesis status', company.thesisStatus]].
            map(([k, v]) =>
            <div key={k}>
                <dt className="text-2xs uppercase tracking-label text-muted-soft">{k}</dt>
                <dd className="mt-1 font-mono text-[13px] tabular text-ink">{v}</dd>
              </div>
            )}
          </dl>
        </Panel>

        <Panel title="Value Creation Progress" bodyClassName="p-5">
          <div className="grid grid-cols-2 gap-3">
            <MetricCard label="Identified Opportunity" value={`$${company.identified.toFixed(1)}M`} />
            <MetricCard label="Validated Opportunity" value={`$${company.validated.toFixed(1)}M`} />
            <MetricCard label="In Execution" value={`$${company.inExecution.toFixed(1)}M`} />
            <MetricCard label="Realized EBITDA" value={`$${company.realized.toFixed(1)}M`} emphasis />
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Realized value is confirmed against reported EBITDA by the portfolio CFO each month. Validated
            value has cleared the evidence threshold but is not yet approved.
          </p>
        </Panel>
      </div>

      <Panel
        title="Current Priorities"
        description="The three strategic priorities the operating plan is organized around."
        bodyClassName="">
        
        <ol className="divide-y divide-line md:flex md:divide-x md:divide-y-0">
          {northpeakPriorities.map((p, i) =>
          <li key={p.title} className="flex-1 p-5">
              <div className="flex items-baseline gap-2.5">
                <span className="font-mono text-xs tabular text-muted-soft">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-[13px] font-semibold text-ink">{p.title}</h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{p.detail}</p>
              <p className="mt-3 font-mono text-2xs uppercase tracking-label text-muted">
                {p.owner} · {p.horizon}
              </p>
            </li>
          )}
        </ol>
      </Panel>

      <section aria-label="Opportunity pipeline">
        <div className="mb-2.5 flex items-baseline justify-between">
          <h2 className="text-2xs font-medium uppercase tracking-label text-muted">
            Opportunity pipeline
          </h2>
          <span className="font-mono text-2xs tabular text-muted-soft">EBITDA, $M</span>
        </div>
        <OpportunityPipeline stages={PIPELINE} />
      </section>
    </div>);

}