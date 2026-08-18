export const decision = {
  id: 'pricing-validation-sprint',
  title: 'Approve Pricing Architecture Validation Sprint',
  opportunityId: 'pricing-architecture',
  recommendation: 'Proceed with 45-day validation sprint',
  upside: '+$8.4M EBITDA',
  downside: 'Limited — validation only',
  confidence: 88,
  investment: '$180K',
  deadline: 'September 4',
  status: 'Awaiting decision'
};

export const caseFor = [
{
  id: 'f1',
  claim: 'The dispersion is real and large',
  detail:
  '11.4% realized price spread across matched cohorts, measured on 41,200 transactions, uncorrelated with volume or cost to serve.',
  strength: 'Strong evidence'
},
{
  id: 'f2',
  claim: 'The test is cheap relative to what it resolves',
  detail:
  '$180K and 45 days buys a read on the two assumptions that carry $6.3M of the $8.4M base case.',
  strength: 'Structural'
},
{
  id: 'f3',
  claim: 'Portfolio precedent favours this sequence',
  detail:
  'All nine prior pricing initiatives that exceeded target completed segmentation before rollout. Both that underperformed did not.',
  strength: 'Strong precedent'
},
{
  id: 'f4',
  claim: 'Downside is bounded and reversible',
  detail:
  '25 accounts, non-Midwest, contracted revenue excluded. Pricing can be reset inside one quote cycle.',
  strength: 'Structural'
}];


export const caseAgainst = [
{
  id: 'g1',
  claim: 'A pilot delays capture by a quarter',
  detail:
  'Full rollout models $9.6M against $8.4M. Sequencing through validation costs roughly $1.2M of timing value in-hold.',
  strength: 'Quantified'
},
{
  id: 'g2',
  claim: 'Two competitors are quoting aggressively in the Midwest',
  detail:
  'Regional overcapacity means any price movement there carries above-baseline churn risk, and the pilot will not read it.',
  strength: 'Moderate evidence'
},
{
  id: 'g3',
  claim: 'A 25-account cohort may not generalise',
  detail:
  'The cohort excludes the Midwest and all contracted accounts, which together represent 31% of revenue.',
  strength: 'Methodological'
},
{
  id: 'g4',
  claim: 'Sales bandwidth is already committed',
  detail:
  'Territory redesign and the procurement wave both draw on the same commercial leadership in Q4.',
  strength: 'Operational'
}];


export const uncertainties = [
{
  id: 'a1',
  label: 'Customer churn sensitivity',
  assumptionId: 'a1',
  decisionRelevant: true,
  swing: '$6.3M',
  detail:
  'If tolerance for differentiated pricing is materially lower than estimated, capture falls to $2.1M and the score drops to 61.',
  resolvedBy: 'The sprint reads this directly through the 25-account cohort.'
},
{
  id: 'a3',
  label: 'ERP segmentation capability',
  assumptionId: 'a3',
  decisionRelevant: true,
  swing: '$1.5M',
  detail:
  'Unverified. If tiers cannot sit outside the ERP price master, timeline extends a quarter and the no-ERP constraint is engaged.',
  resolvedBy: 'A two-day technical spike in week 2 of the sprint.'
},
{
  id: 'a2',
  label: 'Sales compliance',
  assumptionId: 'a2',
  decisionRelevant: false,
  swing: '$3.4M',
  detail:
  'Material to the outcome, but already addressable through quoting guardrails. It does not change whether the sprint should run.',
  resolvedBy: 'Instrumented during the sprint, not gating for this decision.'
}];


export const decisionOwners = [
{ name: 'Marcus Ellery', role: 'Operating Partner', state: 'Reviewed' as const },
{ name: 'Dana Whitfield', role: 'CEO, NorthPeak', state: 'Approved' as const },
{ name: 'Rahul Menon', role: 'CFO, NorthPeak', state: 'Reviewed' as const },
{ name: 'Erin Castellanos', role: 'VP Sales, NorthPeak', state: 'Pending' as const }];


export interface TimelineEvent {
  id: string;
  label: string;
  date: string;
  detail: string;
  state: 'complete' | 'current' | 'upcoming';
}

export const decisionTimeline: TimelineEvent[] = [
{
  id: 't1',
  label: 'Analysis completed',
  date: 'Jul 22',
  detail: '342 explored · 218 eliminated · 17 sources cited',
  state: 'complete'
},
{
  id: 't2',
  label: 'Evidence reviewed',
  date: 'Jul 29',
  detail: '3 material contradictions logged and adjudicated',
  state: 'complete'
},
{
  id: 't3',
  label: 'CFO feedback',
  date: 'Aug 4',
  detail: 'Contracted accounts carved out of the base case',
  state: 'complete'
},
{
  id: 't4',
  label: 'Operating Partner review',
  date: 'Aug 12',
  detail: 'Reviewing Midwest churn exposure before committing pilot scope',
  state: 'current'
},
{
  id: 't5',
  label: 'Decision due',
  date: 'Sep 4',
  detail: 'Investment committee standing slot',
  state: 'upcoming'
}];