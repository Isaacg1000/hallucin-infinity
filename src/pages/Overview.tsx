import React from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { ArrowRightIcon, AlertTriangleIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { OpportunityTable } from '../components/opportunities/OpportunityTable';
import { ValueCreationChart } from '../components/charts/ValueCreationChart';
import { StatusPill } from '../components/ui/StatusPill';
import { portfolioTopOpportunities, categoryValue } from '../data/opportunities';
import { decisions } from '../data/decisions';

const PIPELINE = [
{ stage: 'Identified' as const, value: 84.2, count: 126 },
{ stage: 'Validating' as const, value: 51.7, count: 44 },
{ stage: 'Approved' as const, value: 38.4, count: 27 },
{ stage: 'Executing' as const, value: 24.1, count: 19 },
{ stage: 'Realized' as const, value: 11.6, count: 12 }];


const ATTENTION = [
{
  title: 'Harborline Distribution is off thesis',
  detail: 'Realized EBITDA is 62% behind plan at month 30. Two initiatives stalled in legal review.',
  to: '/companies/harborline'
},
{
  title: 'Service Deflection Pilot below threshold',
  detail: 'Day 34 of 45 · 31% deflection against a 40% success threshold, CSAT down 1.1 points.',
  to: '/experiments'
},
{
  title: 'Contradictory evidence on AI Demand Forecasting',
  detail: 'Master-data completeness undermines the vendor accuracy claim. Decision deferred.',
  to: '/opportunities/demand-forecasting'
}];


export function Overview() {
  const { openNewAnalysis } = useOutletContext<{openNewAnalysis: () => void;}>();
  const pending = decisions.filter((d) => d.status === 'Pending Approval');

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <PageHeader
        eyebrow="Meridian Capital · Fund IV"
        title="Portfolio Intelligence"
        subtitle="Identify, validate, and prioritize the initiatives most likely to create enterprise value."
        actions={
          <>
            <Button onClick={() => window.print()}>Export snapshot</Button>
            <Button variant="primary" onClick={openNewAnalysis}>
              New Exploration
            </Button>
          </>
        }
      />

      <section className="mt-10" aria-label="Portfolio value creation summary">
        <p className="text-[34px] font-semibold leading-tight tracking-[-0.02em] text-ink">
          $84.2M in identified value creation opportunities
        </p>
        <p className="mt-2 text-[15px] text-muted">
          <span className="font-medium text-ink-soft">$24.1M</span> has reached execution ·{' '}
          <span className="font-medium text-ink-soft">$11.6M</span> realized · 18 portfolio companies · 12
          experiments running
        </p>

        <div className="mt-9 flex items-center">
          {PIPELINE.map((s, i) => (
            <React.Fragment key={s.stage}>
              <div className="shrink-0 text-center">
                <p className="font-mono text-[28px] font-semibold leading-none tabular text-ink">{s.count}</p>
                <p className="mt-2 text-xs font-medium uppercase tracking-label text-muted">{s.stage}</p>
                <p className="mt-0.5 font-mono text-2xs tabular text-muted-soft">${s.value.toFixed(1)}M</p>
              </div>
              {i < PIPELINE.length - 1 && (
                <div className="mx-3 h-px min-w-8 flex-1 bg-line sm:mx-5" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="mt-6">
        <Panel
          title="Highest Priority Opportunities"
          description="Ranked by risk-adjusted EBITDA impact. Every row carries its evidence strength and model confidence."
          bodyClassName=""
          actions={
          <Link
            to="/opportunities"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover">
            
              View all 126
              <ArrowRightIcon className="h-3 w-3" strokeWidth={2} />
            </Link>
          }>
          
          <OpportunityTable rows={portfolioTopOpportunities} />
        </Panel>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Panel
            title="Opportunity Value by Category"
            description="Estimated EBITDA opportunity across the portfolio, by value-creation category.">
            
            <ValueCreationChart data={categoryValue} />
          </Panel>
        </div>

        <div className="flex flex-col gap-6">
          <Panel title="Decisions Awaiting You" bodyClassName="">
            {pending.map((d) =>
            <Link
              key={d.id}
              to={`/decisions/${d.id}`}
              className="block border-b border-line px-5 py-4 last:border-b-0 hover:bg-raised">
              
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[13px] font-medium text-ink">{d.title}</span>
                  <StatusPill label={d.status} />
                </div>
                <p className="mt-1 text-xs text-muted">{d.company} · raised {d.raisedOn}</p>
              </Link>
            )}
            <div className="px-5 py-3">
              <Link to="/decisions" className="text-xs font-medium text-accent hover:text-accent-hover">
                All decisions →
              </Link>
            </div>
          </Panel>

          <Panel title="Requires Attention" bodyClassName="">
            {ATTENTION.map((a) =>
            <Link
              key={a.title}
              to={a.to}
              className="flex gap-3 border-b border-line px-5 py-4 last:border-b-0 hover:bg-raised">
              
                <AlertTriangleIcon
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caution"
                strokeWidth={1.75} />
              
                <span>
                  <span className="block text-[13px] font-medium text-ink">{a.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-muted">{a.detail}</span>
                </span>
              </Link>
            )}
          </Panel>
        </div>
      </div>
    </div>);

}