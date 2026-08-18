import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ExternalLinkIcon, ArrowRightIcon } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { CompanyOverviewTab } from '../components/company/CompanyOverviewTab';
import { InitiativeTable } from '../components/blueprint/InitiativeTable';
import { RoadmapChart } from '../components/blueprint/RoadmapChart';
import { OpportunityTable } from '../components/opportunities/OpportunityTable';
import { EvidenceCard } from '../components/opportunities/EvidenceCard';
import { DecisionTimeline } from '../components/decisions/DecisionTimeline';
import { companies } from '../data/companies';
import { opportunities } from '../data/opportunities';
import { initiatives, roadmap } from '../data/blueprint';
import { pricingDetail } from '../data/opportunityDetail';
import { decisions } from '../data/decisions';

const TABS = [
'Overview',
'Value Creation',
'Opportunities',
'Evidence',
'100-Day Plan',
'Decisions',
'Outcomes'] as
const;

type Tab = (typeof TABS)[number];

const OUTCOMES = [
['Procurement Wave One', '+$2.1M', '+$2.4M', 'Ahead', 'Aug 2026'],
['Freight Lane Re-Bid', '+$0.6M', '+$0.7M', 'Ahead', 'Jul 2026'],
['Service Deflection', '+$0.5M', '+$0.3M', 'Behind', 'In flight'],
['Terms Discipline', '+$0.4M', '+$0.0M', 'Too Early', 'In flight']];


export function CompanyWorkspace() {
  const { companyId } = useParams();
  const company = companies.find((c) => c.id === companyId) ?? companies[0];
  const [tab, setTab] = useState<Tab>('Overview');

  const companyOpportunities = opportunities.filter((o) => o.companyId === company.id);
  const companyDecisions = decisions.filter((d) => d.company === company.name);

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <Link
        to="/companies"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
        
        <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        Portfolio Companies
      </Link>

      <header className="mt-4 border-b border-line pb-5">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-ink">
                {company.name}
              </h1>
              <StatusPill label={company.thesisStatus} />
            </div>
            <p className="mt-1.5 text-sm text-muted">
              {company.industry} · {company.fund}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button>
              <ExternalLinkIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              Company data room
            </Button>
            <Link to={`/companies/${company.id}/blueprint`}>
              <Button variant="primary">
                Value Creation Blueprint
                <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={2} />
              </Button>
            </Link>
          </div>
        </div>

        <dl className="mt-5 grid grid-cols-2 gap-y-4 md:grid-cols-4 xl:grid-cols-7">
          {[
          ['Industry', company.industry],
          ['Revenue', company.revenue],
          ['EBITDA', company.ebitda],
          ['Employees', company.employees],
          ['Acquisition Date', company.acquired],
          ['Hold Period', company.holdPeriod],
          ['Investment Thesis', company.thesisStatus]].
          map(([k, v]) =>
          <div key={k}>
              <dt className="text-2xs uppercase tracking-label text-muted-soft">{k}</dt>
              <dd className="mt-1 text-[13px] text-ink">{v}</dd>
            </div>
          )}
        </dl>
      </header>

      <nav aria-label="Workspace sections" className="sticky top-0 z-20 -mx-8 border-b border-line bg-canvas/95 px-8 backdrop-blur">
        <ul className="flex gap-1 overflow-x-auto">
          {TABS.map((t) =>
          <li key={t}>
              <button
              type="button"
              onClick={() => setTab(t)}
              aria-current={tab === t ? 'page' : undefined}
              className={`whitespace-nowrap border-b-2 px-3 py-3 text-[13px] transition-colors ${
              tab === t ?
              'border-accent font-medium text-ink' :
              'border-transparent text-muted hover:text-ink'}`
              }>
              
                {t}
              </button>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-6">
        {tab === 'Overview' && <CompanyOverviewTab company={company} />}

        {tab === 'Value Creation' &&
        <div className="flex flex-col gap-6">
            {(['Commercial', 'Operational', 'AI / Automation'] as const).map((ws) =>
          <Panel key={ws} title={ws} eyebrow="Workstream" bodyClassName="">
                <InitiativeTable initiatives={initiatives.filter((i) => i.workstream === ws)} />
              </Panel>
          )}
          </div>
        }

        {tab === 'Opportunities' &&
        <Panel
          title={`${companyOpportunities.length} ranked opportunities`}
          description="Surviving hypotheses from the July 22 analysis, ranked by risk-adjusted EBITDA."
          bodyClassName="">
          
            <OpportunityTable rows={companyOpportunities} />
          </Panel>
        }

        {tab === 'Evidence' &&
        <Panel
          title="Evidence Library"
          description="Every source cited across this company's analyses, including evidence that weakens recommendations.">
          
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {pricingDetail.evidence.map((e) =>
            <EvidenceCard key={e.id} source={e} />
            )}
            </div>
          </Panel>
        }

        {tab === '100-Day Plan' &&
        <Panel
          title="100-Day Value Creation Plan"
          description="Sequenced against decision gates, not calendar convenience.">
          
            <RoadmapChart items={roadmap} />
          </Panel>
        }

        {tab === 'Decisions' &&
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {companyDecisions.map((d) =>
          <Panel
            key={d.id}
            title={d.title}
            eyebrow={`Raised ${d.raisedOn}`}
            actions={<StatusPill label={d.status} />}>
            
                <p className="mb-5 text-[13px] leading-relaxed text-ink-soft">{d.recommendation}</p>
                <DecisionTimeline timeline={d.timeline} />
                <Link
              to={`/decisions/${d.id}`}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:text-accent-hover">
              
                  Open decision
                  <ArrowRightIcon className="h-3 w-3" strokeWidth={2} />
                </Link>
              </Panel>
          )}
          </div>
        }

        {tab === 'Outcomes' &&
        <Panel
          title="Realized Outcomes"
          description="Estimated impact measured against confirmed EBITDA. Estimates are held accountable."
          bodyClassName="">
          
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {['Initiative', 'Estimated', 'Realized', 'Signal', 'Confirmed'].map((h) =>
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
                {OUTCOMES.map((row) =>
              <tr key={row[0]} className="border-b border-line last:border-b-0 hover:bg-raised">
                    <td className="px-4 py-3 text-[13px] font-medium text-ink">{row[0]}</td>
                    <td className="px-4 py-3 font-mono text-[13px] tabular text-muted">{row[1]}</td>
                    <td className="px-4 py-3 font-mono text-[13px] tabular text-ink">{row[2]}</td>
                    <td className="px-4 py-3">
                      <StatusPill label={row[3]} />
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted">{row[4]}</td>
                  </tr>
              )}
              </tbody>
            </table>
          </Panel>
        }
      </div>
    </div>);

}