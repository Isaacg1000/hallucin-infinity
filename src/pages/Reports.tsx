import React from 'react';
import { Link } from 'react-router-dom';
import { FileDownIcon, PresentationIcon, ShareIcon, MonitorPlayIcon } from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { ExecutiveRecommendation } from '../components/reports/ExecutiveRecommendation';
import { RiskCard } from '../components/opportunities/RiskCard';
import { RoadmapChart } from '../components/blueprint/RoadmapChart';
import { opportunities } from '../data/opportunities';
import { pricingDetail } from '../data/opportunityDetail';
import { roadmap } from '../data/blueprint';

const TOP_FIVE = opportunities.slice(0, 5);

const EVIDENCE_SUMMARY = [
['Sources reviewed', '67', 'Market research, benchmarks, internal data, interviews'],
['Supporting evidence', '44', 'Weighted toward invoice-level internal data'],
['Contradicting evidence', '23', 'Material contradictions logged and adjudicated'],
['Portfolio precedent', '14', 'Prior pricing initiatives, Fund II–IV']];


const DECISIONS_REQUIRED = [
{
  title: 'Approve the 45-day pricing validation sprint',
  owner: 'Operating Partner · CFO',
  by: 'August 19, 2026',
  status: 'Pending Approval'
},
{
  title: 'Confirm Midwest region is held flat during the pilot',
  owner: 'VP Sales',
  by: 'August 19, 2026',
  status: 'Pending Approval'
},
{
  title: 'Fund the external pricing analyst ($340K, opex)',
  owner: 'CFO',
  by: 'August 26, 2026',
  status: 'Pending Approval'
},
{
  title: 'Release the ERP segmentation technical spike',
  owner: 'COO',
  by: 'September 2, 2026',
  status: 'Deferred'
}];


export function Reports() {
  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
        <div>
          <p className="text-2xs font-medium uppercase tracking-label text-muted">
            Meridian Capital · Fund IV · Investment Committee · August 2026
          </p>
          <h1 className="mt-3 text-[30px] font-semibold leading-tight tracking-[-0.025em] text-ink">
            NorthPeak Industrial
          </h1>
          <p className="mt-1 text-[19px] font-medium tracking-[-0.01em] text-muted">Value Creation Recommendation</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => window.print()}>
            <FileDownIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export PDF
          </Button>
          <Button>
            <PresentationIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export PowerPoint
          </Button>
          <Button>
            <ShareIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Share
          </Button>
          <Button variant="primary">
            <MonitorPlayIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Present
          </Button>
        </div>
      </header>

      <div className="mt-8 flex flex-col gap-8">
        <ExecutiveRecommendation
          statement="Approve a controlled 45-day pricing validation sprint at NorthPeak, targeting $8.4M of the $31.5M identified EBITDA opportunity."
          paragraphs={[
          'Invoice-level analysis shows 1,140bps of realized-margin dispersion between comparable customers, uncorrelated with volume, freight or configuration. That dispersion is a pricing-architecture failure, not a market condition, and it is the single largest recoverable value pool in the hold.',
          'Two contradictions constrain the scope rather than the thesis: six top-20 accounts are under fixed escalators until Q3 2027, and two regional competitors added capacity in the Midwest. Both are carved out of the base case, reducing the modeled opportunity from $11.1M to $8.4M.',
          'Portfolio precedent supports the sequencing. Across 14 prior pricing initiatives, the nine that exceeded target completed customer segmentation before implementation; the two that underperformed left discount exception authority with the field.']
          }
          confidence={88}
          evidence="Strong"
          ask="Approve the pilot, confirm the Midwest carve-out, and release $340K of opex for external pricing support." />
        

        <Panel title="1. Top Five Opportunities" bodyClassName="">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {['#', 'Opportunity', 'Category', 'EBITDA', 'Confidence', 'Evidence', 'Timeline'].map(
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
                {TOP_FIVE.map((o, i) =>
                <tr key={o.id} className="border-b border-line last:border-b-0">
                    <td className="px-4 py-3 font-mono text-[13px] tabular text-muted-soft">{i + 1}</td>
                    <td className="px-4 py-3">
                      <Link
                      to={`/opportunities/${o.id}`}
                      className="text-[13px] font-medium text-ink hover:text-accent">
                      
                        {o.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-muted">{o.category}</td>
                    <td className="px-4 py-3 font-mono text-[13px] tabular font-medium text-accent">
                      +${o.ebitda.toFixed(1)}M
                    </td>
                    <td className="px-4 py-3 font-mono text-[13px] tabular text-ink-soft">
                      {o.confidence}%
                    </td>
                    <td className="px-4 py-3 text-[13px] text-ink-soft">{o.evidence}</td>
                    <td className="px-4 py-3 text-[13px] text-muted">{o.timeToImpact}</td>
                  </tr>
                )}
                <tr className="bg-raised">
                  <td className="px-4 py-3 text-2xs font-medium uppercase tracking-label text-muted" colSpan={3}>
                    Total, top five
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular font-semibold text-ink">
                    +${TOP_FIVE.reduce((s, o) => s + o.ebitda, 0).toFixed(1)}M
                  </td>
                  <td colSpan={3} />
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel
          title="2. Expected EBITDA Impact"
          description="Bridge from current EBITDA to the underwritten position, gross of execution risk.">
          
          <div className="flex flex-wrap items-end gap-3">
            {[
            ['Current EBITDA', 54, 'bg-ink-soft'],
            ['Commercial', 15.7, 'bg-accent'],
            ['Operational', 8.0, 'bg-[#3F7F72]'],
            ['AI / Automation', 4.5, 'bg-[#9FB9B2]'],
            ['Underwritten', 82.2, 'bg-ink']].
            map(([label, value, color]) =>
            <div key={label as string} className="flex min-w-[120px] flex-1 flex-col justify-end">
                <p className="mb-2 font-mono text-[15px] font-semibold tabular text-ink">
                  {label === 'Current EBITDA' || label === 'Underwritten' ? '' : '+'}${(value as number).toFixed(1)}M
                </p>
                <div
                className={`${color} w-full`}
                style={{ height: `${Math.max((value as number) / 82.2 * 120, 10)}px` }} />
              
                <p className="mt-2 text-2xs uppercase tracking-label text-muted">{label}</p>
              </div>
            )}
          </div>
          <p className="mt-5 border-t border-line pt-4 text-xs leading-relaxed text-muted">
            Risk-adjusted, the same bridge lands at $71.9M. The difference is concentrated in the two
            initiatives whose critical assumptions remain unvalidated.
          </p>
        </Panel>

        <Panel title="3. Evidence Summary" bodyClassName="">
          <ul className="divide-y divide-line md:flex md:divide-x md:divide-y-0">
            {EVIDENCE_SUMMARY.map(([label, value, note]) =>
            <li key={label} className="flex-1 p-5">
                <p className="text-2xs uppercase tracking-label text-muted">{label}</p>
                <p className="mt-2 font-mono text-2xl font-semibold tabular text-ink">{value}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{note}</p>
              </li>
            )}
          </ul>
        </Panel>

        <Panel
          title="4. Critical Risks"
          description="Presented in full, including the risks that argue against proceeding.">
          
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {pricingDetail.risks.map((r, i) =>
            <RiskCard key={r.id} risk={r} index={i} />
            )}
          </div>
        </Panel>

        <Panel
          title="5. Alternatives Rejected"
          description="What was considered and set aside, so the committee can test the reasoning rather than the conclusion."
          bodyClassName="">
          
          <ul className="divide-y divide-line">
            {pricingDetail.rejected.map((r) =>
            <li key={r.id} className="flex items-start justify-between gap-4 px-5 py-3.5">
                <div>
                  <h4 className="text-[13px] font-medium text-ink">{r.title}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{r.reason}</p>
                </div>
                <StatusPill label={r.verdict} />
              </li>
            )}
          </ul>
        </Panel>

        <Panel
          title="6. 100-Day Action Plan"
          description="Sequenced against decision gates. Nothing scales before its validation threshold is met.">
          
          <RoadmapChart items={roadmap} />
        </Panel>

        <Panel title="7. Decisions Required From Leadership" bodyClassName="">
          <ul className="divide-y divide-line">
            {DECISIONS_REQUIRED.map((d) =>
            <li key={d.title} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{d.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {d.owner} · required by {d.by}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill label={d.status} />
                  <Link
                  to="/decisions/pricing-pilot"
                  className="text-xs font-medium text-accent hover:text-accent-hover">
                  
                    Open decision →
                  </Link>
                </div>
              </li>
            )}
          </ul>
        </Panel>

        <footer className="border-t border-line pb-4 pt-5 text-xs leading-relaxed text-muted">
          Prepared by Hallucin∞ for Meridian Capital · Analysis run July 22, 2026 · 342 possibilities
          explored, 218 eliminated, 67 sources reviewed. Confidence and evidence strength are stated for
          every recommendation; unvalidated assumptions are marked as such and are not treated as facts.
        </footer>
      </div>
    </div>);

}