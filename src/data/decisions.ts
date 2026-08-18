import { DecisionRecord } from '../types';

export const decisions: DecisionRecord[] = [
{
  id: 'pricing-pilot',
  title: 'Approve Pricing Architecture Pilot',
  company: 'NorthPeak Industrial',
  status: 'Pending Approval',
  relatedOpportunityId: 'pricing-architecture',
  recommendation:
  'Proceed with a controlled pilot across 25 accounts in two non-Midwest regions, holding contracted accounts out of scope. Full rollout contingent on a 3%+ margin improvement with under 1% incremental churn over the 45-day measurement window.',
  expectedOutcome: '+$8.4M EBITDA opportunity if scaled portfolio-wide across repriceable revenue.',
  raisedOn: 'August 4, 2026',
  owners: [
  { name: 'Marcus Ellery', role: 'Operating Partner', state: 'Reviewed' },
  { name: 'Dana Whitfield', role: 'Portfolio CEO, NorthPeak', state: 'Approved' },
  { name: 'Rahul Menon', role: 'CFO, NorthPeak', state: 'Reviewed' },
  { name: 'Erin Castellanos', role: 'VP Sales, NorthPeak', state: 'Pending' }],

  timeline: [
  {
    label: 'Analysis Created',
    date: 'Jul 22, 2026',
    state: 'complete',
    detail: '342 possibilities explored, 218 eliminated against thesis constraints.'
  },
  {
    label: 'Evidence Reviewed',
    date: 'Jul 29, 2026',
    state: 'complete',
    detail: '67 sources reviewed, 23 material contradictions logged and adjudicated.'
  },
  {
    label: 'CFO Feedback',
    date: 'Aug 4, 2026',
    state: 'complete',
    detail: 'Requested carve-out of the six contracted top-20 accounts. Applied to base case.'
  },
  {
    label: 'Operating Partner Review',
    date: 'Aug 12, 2026',
    state: 'current',
    detail: 'Reviewing churn exposure in the Midwest region before committing pilot scope.'
  },
  {
    label: 'Final Decision',
    date: 'Target Aug 19, 2026',
    state: 'upcoming',
    detail: 'Investment committee standing slot.'
  }],

  alternatives: [
  { title: 'Full rollout without pilot', verdict: 'Rejected', note: 'Unbounded churn exposure; no measurement window.' },
  { title: 'Across-the-board increase', verdict: 'Rejected', note: 'High churn risk, low differentiation.' },
  { title: 'Discount-reduction campaign', verdict: 'Rejected', note: 'Insufficient evidence of competitive discounting.' },
  { title: 'Sales compensation redesign', verdict: 'Ranked Lower', note: 'Longer time to impact; tied to annual plan cycle.' },
  { title: 'Defer to FY27 planning', verdict: 'Ranked Lower', note: 'Forfeits two quarters of margin capture in-hold.' }]

},
{
  id: 'procurement-wave-one',
  title: 'Approve Procurement Wave One Scope',
  company: 'NorthPeak Industrial',
  status: 'Approved',
  relatedOpportunityId: 'procurement-consolidation',
  recommendation: 'Consolidate the top 18 direct-material categories under a single supplier framework beginning Q4.',
  expectedOutcome: '+$5.3M EBITDA at full run-rate; $2.1M in year one.',
  raisedOn: 'July 11, 2026',
  owners: [
  { name: 'Marcus Ellery', role: 'Operating Partner', state: 'Approved' },
  { name: 'Dana Whitfield', role: 'Portfolio CEO, NorthPeak', state: 'Approved' },
  { name: 'Rahul Menon', role: 'CFO, NorthPeak', state: 'Approved' }],

  timeline: [
  { label: 'Analysis Created', date: 'Jun 18, 2026', state: 'complete', detail: 'Spend cube built across three legacy entities.' },
  { label: 'Evidence Reviewed', date: 'Jun 27, 2026', state: 'complete', detail: '41 sources reviewed.' },
  { label: 'CFO Feedback', date: 'Jul 2, 2026', state: 'complete', detail: 'Requested supplier concentration cap of 35%.' },
  { label: 'Operating Partner Review', date: 'Jul 9, 2026', state: 'complete', detail: 'Approved with cap applied.' },
  { label: 'Final Decision', date: 'Jul 11, 2026', state: 'complete', detail: 'Approved. Wave one kickoff scheduled.' }],

  alternatives: [
  { title: 'Full 40-category consolidation', verdict: 'Ranked Lower', note: 'Exceeds available sourcing capacity in one wave.' },
  { title: 'Third-party GPO membership', verdict: 'Rejected', note: 'Lower capture on the largest categories.' },
  { title: 'Entity-level negotiation', verdict: 'Rejected', note: 'Preserves the fragmentation causing the leakage.' },
  { title: 'Defer until ERP unification', verdict: 'Rejected', note: 'ERP work is explicitly out of thesis scope.' },
  { title: 'Sole-source top 5 categories', verdict: 'Ranked Lower', note: 'Supply concentration risk above tolerance.' }]

},
{
  id: 'forecasting-evidence',
  title: 'Demand Forecasting — Evidence Request',
  company: 'NorthPeak Industrial',
  status: 'Deferred',
  relatedOpportunityId: 'demand-forecasting',
  recommendation: 'Defer pending an ERP data-quality assessment. Model accuracy claims are unverifiable on current master data.',
  expectedOutcome: '+$3.1M EBITDA if data foundation proves adequate.',
  raisedOn: 'July 30, 2026',
  owners: [
  { name: 'Marcus Ellery', role: 'Operating Partner', state: 'Reviewed' },
  { name: 'Priya Raghunathan', role: 'VP Portfolio Value Creation', state: 'Reviewed' },
  { name: 'Rahul Menon', role: 'CFO, NorthPeak', state: 'Pending' }],

  timeline: [
  { label: 'Analysis Created', date: 'Jul 14, 2026', state: 'complete', detail: 'Forecast error decomposed by SKU tier.' },
  { label: 'Evidence Reviewed', date: 'Jul 24, 2026', state: 'complete', detail: 'Contradictory evidence on master-data completeness.' },
  { label: 'CFO Feedback', date: 'Jul 30, 2026', state: 'complete', detail: 'Requested independent data-quality read.' },
  { label: 'Operating Partner Review', date: 'Deferred', state: 'current', detail: 'Awaiting data assessment before re-tabling.' },
  { label: 'Final Decision', date: 'Not scheduled', state: 'upcoming', detail: '' }],

  alternatives: [
  { title: 'Proceed with vendor pilot', verdict: 'Rejected', note: 'Vendor accuracy claims unverifiable on current data.' },
  { title: 'Manual forecast governance first', verdict: 'Ranked Lower', note: 'Lower ceiling, but no data dependency.' },
  { title: 'Buy packaged forecasting module', verdict: 'Rejected', note: 'ERP-dependent; violates thesis constraint.' },
  { title: 'Safety-stock policy reset only', verdict: 'Ranked Lower', note: 'Captures ~30% of value with no model risk.' },
  { title: 'Do nothing', verdict: 'Ranked Lower', note: 'Leaves $3.1M unexamined.' }]

}];