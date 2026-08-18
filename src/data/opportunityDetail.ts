import { OpportunityDetail } from '../types';

export const pricingDetail: OpportunityDetail = {
  thesis: [
  'NorthPeak prices as though it sells commodities, but it does not. Quoting is cost-plus with a uniform target margin applied across every product family, region, and account size. The result is a pricing surface that is internally consistent and externally wrong: the accounts with the least alternative supply pay the same premium as accounts with three qualified substitutes down the road.',
  'Invoice-level analysis of 14 months of transactions shows a 1,140bps realized-margin spread between the top and bottom quartile of customers within the same product family and order size. That spread is not explained by volume, freight, or configuration complexity. It is explained by which sales representative negotiated the account and when.',
  'The opportunity is to replace uniform cost-plus with a segmented architecture — value tiers defined by switching cost, criticality of the part, and available substitutes — enforced through guardrails in the quoting workflow rather than through negotiation discipline alone. Comparable industrial transformations recover 300–600bps of gross margin within three quarters, with the majority landing in the first two.'],

  whyExists: [
  'Pricing authority is fully delegated to 34 field sales representatives with no floor logic and no approval escalation above a 12% discount.',
  'Three legacy acquisitions were never repriced onto a common structure; two still run their inherited 2019 price books.',
  'The aftermarket parts catalog — the highest switching-cost revenue in the business — is priced on the same cost-plus rule as new equipment.',
  'No one owns pricing. It sits informally between the CFO and VP Sales, and neither is measured on realized margin.',
  'Customers have not seen a structural price change in 31 months, while input costs moved 14%.'],

  evidence: [
  {
    id: 'e1',
    title: 'Pricing Excellence in Industrial Markets',
    publisher: 'McKinsey & Company',
    date: 'Nov 2025',
    summary:
    'Industrial manufacturers moving from cost-plus to segmented value pricing captured 300–600bps of gross margin within 9 months, with churn effects below 1.5% where segmentation preceded rollout.',
    relevance: 'High',
    direction: 'supports',
    type: 'Research'
  },
  {
    id: 'e2',
    title: 'NorthPeak invoice-level margin analysis, 14 months',
    publisher: 'Internal — Hallucinate ingestion',
    date: 'Jul 2026',
    summary:
    '1,140bps realized-margin dispersion between top and bottom customer quartiles within matched product family and order size. Dispersion is uncorrelated with volume (R² = 0.07).',
    relevance: 'High',
    direction: 'supports',
    type: 'Internal Data'
  },
  {
    id: 'e3',
    title: 'Aftermarket parts elasticity in installed-base manufacturing',
    publisher: 'Journal of Revenue & Pricing Management',
    date: 'Mar 2026',
    summary:
    'Demand for critical replacement parts on installed equipment shows elasticity between -0.2 and -0.4, materially below new-equipment demand.',
    relevance: 'High',
    direction: 'supports',
    type: 'Research'
  },
  {
    id: 'e4',
    title: 'Three comparable industrial pricing transformations',
    publisher: 'Hallucinate Institutional Memory',
    date: 'Portfolio history',
    summary:
    'Cascade Building Products, Ironvale Components and a Fund III exit ran comparable programs. Median time to measurable EBITDA impact: 7.2 months. Two of three exceeded target.',
    relevance: 'High',
    direction: 'supports',
    type: 'Benchmark'
  },
  {
    id: 'e5',
    title: 'Interviews — 4 NorthPeak account executives',
    publisher: 'Management diligence call notes',
    date: 'Jun 2026',
    summary:
    'Reps report discounting primarily to close quarter-end, not in response to competitor quotes. Only 2 of 4 could name a competing quote in the last two quarters.',
    relevance: 'Medium',
    direction: 'supports',
    type: 'Interview'
  },
  {
    id: 'c1',
    title: 'Regional overcapacity in fabricated components',
    publisher: 'IBISWorld Sector Brief',
    date: 'May 2026',
    summary:
    'Two regional competitors added capacity in 2025 and are quoting aggressively in the Midwest. A price increase concentrated in that region carries above-baseline churn risk.',
    relevance: 'High',
    direction: 'contradicts',
    type: 'Market'
  },
  {
    id: 'c2',
    title: 'Top-20 customer contract review',
    publisher: 'Internal — Hallucinate ingestion',
    date: 'Jul 2026',
    summary:
    '6 of the top 20 accounts (representing 19% of revenue) hold multi-year agreements with fixed escalators, and cannot be repriced before Q3 2027.',
    relevance: 'High',
    direction: 'contradicts',
    type: 'Internal Data'
  },
  {
    id: 'c3',
    title: 'Failed pricing rollouts in fragmented sales organizations',
    publisher: 'Harvard Business Review',
    date: 'Feb 2025',
    summary:
    'Where field sales retains exception authority, roughly 40% of modeled price capture is eroded within two quarters through informal discounting.',
    relevance: 'Medium',
    direction: 'contradicts',
    type: 'Research'
  }],

  assumptions: [
  {
    id: 'a1',
    assumption: 'Customers tolerate differentiated pricing across segments',
    confidence: 'Medium',
    impactIfWrong: 'Critical',
    status: 'Must Validate',
    note: 'No customer-level willingness-to-pay research exists. Test with a 25-account cohort before broad rollout.'
  },
  {
    id: 'a2',
    assumption: 'Sales team can enforce the new structure',
    confidence: 'High',
    impactIfWrong: 'High',
    status: 'Supported',
    note: 'Compensation is already margin-linked at 40%; guardrails can be enforced in the quoting tool.'
  },
  {
    id: 'a3',
    assumption: 'ERP supports the required customer segmentation',
    confidence: 'Low',
    impactIfWrong: 'High',
    status: 'Unverified',
    note: 'Legacy ERP holds one price list per customer. Segment tiering may require an external pricing layer.'
  },
  {
    id: 'a4',
    assumption: 'Aftermarket elasticity holds at NorthPeak specifically',
    confidence: 'Medium',
    impactIfWrong: 'High',
    status: 'Must Validate',
    note: 'Category research is strong, but NorthPeak has never tested a parts price increase.'
  },
  {
    id: 'a5',
    assumption: 'Contracted accounts can be excluded without distorting the model',
    confidence: 'High',
    impactIfWrong: 'Medium',
    status: 'Validated',
    note: 'Contracted revenue is carved out of the $8.4M estimate; base case uses repriceable revenue only.'
  }],

  risks: [
  {
    id: 'r1',
    title: 'Churn concentrates in the Midwest',
    detail:
    'Two competitors added capacity in the region and are quoting aggressively. A uniform increase applied there could exceed the 1% churn tolerance.',
    severity: 'High',
    likelihood: 'Medium',
    mitigation: 'Region-aware guardrails; hold Midwest tier flat during the pilot window.'
  },
  {
    id: 'r2',
    title: 'Field sales erodes capture through exceptions',
    detail:
    'Historical precedent shows ~40% of modeled capture lost to informal discounting where reps retain exception authority.',
    severity: 'High',
    likelihood: 'High',
    mitigation: 'System-enforced floors, weekly exception reporting to the CEO, escalation above 6%.'
  },
  {
    id: 'r3',
    title: 'ERP cannot hold segment tiers',
    detail:
    'If segmentation requires an external pricing layer, the timeline extends by one quarter and touches the ERP constraint the thesis explicitly avoids.',
    severity: 'Medium',
    likelihood: 'Medium',
    mitigation: 'Technical spike in week 2 of the validation sprint; fallback is a quoting-tool overlay.'
  },
  {
    id: 'r4',
    title: 'Customer escalation reaches the CEO before the narrative does',
    detail:
    'Long-tenured accounts unaccustomed to price movement may escalate through relationships rather than procurement.',
    severity: 'Medium',
    likelihood: 'Medium',
    mitigation: 'Pre-brief the top 25 accounts; arm the CEO and GMs with a value narrative before invoices change.'
  }],

  rejected: [
  {
    id: 'x1',
    title: 'Across-the-board price increase',
    verdict: 'Rejected',
    reason: 'High churn risk with low differentiation. Ignores the 1,140bps dispersion that makes the opportunity real.',
    score: 41
  },
  {
    id: 'x2',
    title: 'Discount-reduction campaign only',
    verdict: 'Rejected',
    reason: 'Insufficient evidence that discounting is competitively driven; addresses the symptom, not the architecture.',
    score: 48
  },
  {
    id: 'x3',
    title: 'Sales compensation redesign',
    verdict: 'Ranked Lower',
    reason: 'Longer time to impact (12–18 months) and dependent on an annual plan cycle. Strong complement, weak lead.',
    score: 63
  },
  {
    id: 'x4',
    title: 'Dynamic AI pricing engine',
    verdict: 'Ranked Lower',
    reason: 'Requires transaction volume and data hygiene NorthPeak does not have. Revisit after segmentation exists.',
    score: 52
  },
  {
    id: 'x5',
    title: 'Surcharge program tied to input costs',
    verdict: 'Rejected',
    reason: 'Reversible by construction — captures cost recovery, not structural margin.',
    score: 37
  }],

  nextStep: {
    title: 'Run a 45-Day Pricing Validation Sprint',
    duration: '45 days · 2 FTE + external pricing analyst',
    steps: [
    'Analyze 12 months of invoice-level pricing across all product families',
    'Segment customers by switching cost and willingness to pay',
    'Interview 10 account executives on quoting behavior and exception drivers',
    'Test the new architecture with a 25-customer cohort',
    'Measure gross-margin improvement and churn signal weekly'],

    successThreshold: '3%+ margin improvement with <1% incremental churn across the test cohort'
  }
};