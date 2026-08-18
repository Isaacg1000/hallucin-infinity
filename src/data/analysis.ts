export interface AnalysisStage {
  id: string;
  label: string;
  detail: string;
  metric: string;
}

export const analysisStages: AnalysisStage[] = [
{ id: 's1', label: 'Understanding business context', detail: 'Parsing CIM, financial statements and management materials', metric: 'Complete' },
{ id: 's2', label: 'Generating strategic hypotheses', detail: 'Exploring approaches across eight value-creation categories', metric: '342 possibilities explored' },
{ id: 's3', label: 'Challenging assumptions', detail: 'Testing each hypothesis against thesis constraints and feasibility', metric: '218 eliminated' },
{ id: 's4', label: 'Researching supporting evidence', detail: 'Market research, benchmarks, portfolio precedent, internal data', metric: '67 evidence sources reviewed' },
{ id: 's5', label: 'Searching for contradictory evidence', detail: 'Actively seeking disconfirming data before ranking', metric: '23 material contradictions identified' },
{ id: 's6', label: 'Evaluating financial impact', detail: 'Sizing EBITDA effect, payback and capital requirement', metric: 'In progress' },
{ id: 's7', label: 'Ranking opportunities', detail: 'Weighting impact, confidence, evidence strength and speed', metric: 'Pending' }];


export interface ActivityItem {
  id: string;
  text: string;
  kind: 'finding' | 'evidence' | 'risk' | 'rejection';
  at: string;
}

export const analysisActivity: ActivityItem[] = [
{ id: 'a1', text: 'Identified pricing inconsistency across customer segments', kind: 'finding', at: '00:41' },
{ id: 'a2', text: 'Found three comparable manufacturing pricing transformations', kind: 'evidence', at: '00:58' },
{ id: 'a3', text: 'Flagged implementation risk in ERP-dependent automation initiative', kind: 'risk', at: '01:12' },
{ id: 'a4', text: 'Detected potential cross-sell opportunity within aftermarket services', kind: 'finding', at: '01:29' },
{ id: 'a5', text: 'Rejected 17 low-impact AI use cases', kind: 'rejection', at: '01:44' },
{ id: 'a6', text: 'Contradictory signal: regional overcapacity in fabricated components', kind: 'risk', at: '02:03' },
{ id: 'a7', text: 'Matched spend cube against three legacy purchasing entities', kind: 'finding', at: '02:21' },
{ id: 'a8', text: 'Retrieved 14 prior portfolio pricing outcomes from institutional memory', kind: 'evidence', at: '02:38' },
{ id: 'a9', text: 'Eliminated 6 initiatives exceeding the $10M CapEx constraint', kind: 'rejection', at: '02:52' },
{ id: 'a10', text: 'Aftermarket parts elasticity confirmed at -0.2 to -0.4 in category research', kind: 'evidence', at: '03:07' },
{ id: 'a11', text: 'Six top-20 accounts under fixed escalators — carved out of base case', kind: 'risk', at: '03:24' },
{ id: 'a12', text: 'Ranked 12 surviving opportunities by risk-adjusted EBITDA', kind: 'finding', at: '03:39' }];


export const analysisAgents = [
{ name: 'Context', task: 'Reading management presentation, p.42–68', status: 'Complete' },
{ name: 'Hypothesis', task: 'Exploring procurement category structures', status: 'Complete' },
{ name: 'Adversarial', task: 'Stress-testing pricing churn tolerance', status: 'Running' },
{ name: 'Evidence', task: 'Cross-referencing 4 industrial benchmarks', status: 'Running' },
{ name: 'Financial', task: 'Sizing risk-adjusted EBITDA bridge', status: 'Running' },
{ name: 'Memory', task: 'Matching against 14 prior portfolio outcomes', status: 'Queued' }];