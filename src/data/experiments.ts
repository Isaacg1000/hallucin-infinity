export interface Experiment {
  id: string;
  name: string;
  company: string;
  /** The opportunity this experiment exists to test — a real id in
   * data/opportunities.ts, not a display-only label. */
  relatedOpportunityId: string;
  hypothesis: string;
  status: 'Running' | 'Designing' | 'Complete' | 'Blocked';
  day: number;
  duration: number;
  successThreshold: string;
  reading: string;
  signal: 'Ahead' | 'On Track' | 'Behind' | 'Too Early';
  owner: string;
}

export const experiments: Experiment[] = [
{
  id: 'x1',
  name: '45-Day Pricing Validation Sprint',
  company: 'NorthPeak Industrial',
  relatedOpportunityId: 'pricing-architecture',
  hypothesis: 'Segmented pricing improves gross margin 3%+ without material churn.',
  status: 'Running',
  day: 12,
  duration: 45,
  successThreshold: '3%+ margin improvement, <1% incremental churn',
  reading: '+2.1% margin · 0.0% churn (25-account cohort)',
  signal: 'On Track',
  owner: 'E. Castellanos'
},
{
  id: 'x2',
  name: 'Aftermarket Contract Attach Test',
  company: 'NorthPeak Industrial',
  relatedOpportunityId: 'aftermarket-expansion',
  hypothesis: 'Installed-base customers will accept an annual service contract at 1.4x parts spend.',
  status: 'Running',
  day: 28,
  duration: 60,
  successThreshold: '20%+ attach across 80 contacted accounts',
  reading: '26% attach on 47 accounts contacted',
  signal: 'Ahead',
  owner: 'T. Bergeron'
},
{
  id: 'x3',
  name: 'Service Deflection Pilot',
  company: 'NorthPeak Industrial',
  relatedOpportunityId: 'service-automation',
  hypothesis: 'Order-status and parts-lookup contacts can be deflected without CSAT loss.',
  status: 'Running',
  day: 34,
  duration: 45,
  successThreshold: '40%+ deflection, CSAT within 2 points',
  reading: '31% deflection · CSAT -1.1 points',
  signal: 'Behind',
  owner: 'D. Whitfield'
},
{
  id: 'x4',
  name: 'Dynamic Dispatch A/B',
  company: 'Apex Logistics',
  relatedOpportunityId: 'apex-route',
  hypothesis: 'Algorithmic dispatch reduces cost per stop across the Midwest network.',
  status: 'Running',
  day: 51,
  duration: 90,
  successThreshold: '6%+ cost per stop reduction',
  reading: '7.4% reduction across 210 routes',
  signal: 'Ahead',
  owner: 'J. Okafor'
},
{
  id: 'x5',
  name: 'Cross-Sell Play — Enterprise Cohort',
  company: 'BrightPath Software',
  relatedOpportunityId: 'brightpath-crosssell',
  hypothesis: 'Second-product attach lifts net revenue retention above 112%.',
  status: 'Running',
  day: 19,
  duration: 60,
  successThreshold: 'NRR 112%+ in test cohort',
  reading: 'Too early — 3 of 40 accounts closed',
  signal: 'Too Early',
  owner: 'L. Fontaine'
},
{
  id: 'x6',
  name: 'Supplier Wave One Negotiation',
  company: 'NorthPeak Industrial',
  relatedOpportunityId: 'procurement-consolidation',
  hypothesis: 'Consolidated volume yields 7%+ unit cost reduction on 18 categories.',
  status: 'Running',
  day: 40,
  duration: 75,
  successThreshold: '7%+ weighted unit cost reduction',
  reading: '8.2% on 11 categories awarded',
  signal: 'Ahead',
  owner: 'A. Whitmore'
},
{
  id: 'x7',
  name: 'SKU Tail Exit — Customer Response',
  company: 'NorthPeak Industrial',
  relatedOpportunityId: 'sku-rationalization',
  hypothesis: 'Retiring the SKU tail does not trigger account-level defection.',
  status: 'Designing',
  day: 0,
  duration: 45,
  successThreshold: '<0.5% revenue loss on affected accounts',
  reading: 'Design review scheduled Aug 21',
  signal: 'Too Early',
  owner: 'A. Whitmore'
},
{
  id: 'x8',
  name: 'Batch Yield Control Test',
  company: 'Vantage Specialty Chemicals',
  relatedOpportunityId: 'vantage-yield',
  hypothesis: 'Tighter in-process control reduces off-spec rate on two lines.',
  status: 'Running',
  day: 22,
  duration: 60,
  successThreshold: 'Off-spec rate below 2.5%',
  reading: '2.9% off-spec, down from 4.1%',
  signal: 'On Track',
  owner: 'M. Duarte'
},
{
  id: 'x9',
  name: 'Terms Standardization Wave',
  company: 'Harborline Distribution',
  relatedOpportunityId: 'harborline-terms',
  hypothesis: 'Returning legacy accounts to policy terms reduces DSO by 6 days.',
  status: 'Blocked',
  day: 8,
  duration: 60,
  successThreshold: '6-day DSO reduction',
  reading: 'Blocked — legal review of 140 legacy agreements',
  signal: 'Behind',
  owner: 'R. Menon'
},
{
  id: 'x10',
  name: 'Payer Contract Pilot',
  company: 'Meridian Health Services',
  relatedOpportunityId: 'meridian-network',
  hypothesis: 'Two below-market contracts can be repriced without volume loss.',
  status: 'Complete',
  day: 60,
  duration: 60,
  successThreshold: '4%+ rate improvement, no volume loss',
  reading: '4.8% rate improvement · volume flat',
  signal: 'Ahead',
  owner: 'S. Adeyemi'
},
{
  id: 'x11',
  name: 'Territory Coverage Simulation',
  company: 'NorthPeak Industrial',
  relatedOpportunityId: 'sales-territory',
  hypothesis: 'Potential-based territories increase covered pipeline 15%+.',
  status: 'Designing',
  day: 0,
  duration: 30,
  successThreshold: '15%+ covered pipeline increase in simulation',
  reading: 'Awaiting account potential model',
  signal: 'Too Early',
  owner: 'E. Castellanos'
},
{
  id: 'x12',
  name: 'Freight Lane Spot Test',
  company: 'NorthPeak Industrial',
  relatedOpportunityId: 'freight-rebid',
  hypothesis: 'Competitive re-bid reduces cost on the top 20 outbound lanes.',
  status: 'Running',
  day: 15,
  duration: 30,
  successThreshold: '5%+ cost reduction on bid lanes',
  reading: '6.1% on 9 lanes bid',
  signal: 'Ahead',
  owner: 'A. Whitmore'
}];