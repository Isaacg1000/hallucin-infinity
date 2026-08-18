export interface MemoryAnswer {
  query: string;
  headline: string;
  stats: {label: string;value: string;}[];
  bullets: {label: string;value: string;}[];
  contradictions: {company: string;note: string;}[];
  basis: string;
}

export const suggestedQueries = [
'Which pricing initiatives have produced the fastest EBITDA improvement across our portfolio?',
'What has caused procurement consolidation programs to underperform?',
'How accurate have our first-100-day EBITDA estimates been?',
'Where has AI automation actually produced measurable margin?'];


export const defaultAnswer: MemoryAnswer = {
  query: 'Which pricing initiatives have produced the fastest EBITDA improvement across our portfolio?',
  headline: 'Across 14 prior commercial pricing initiatives:',
  stats: [
  { label: 'Exceeded target', value: '9' },
  { label: 'Met target', value: '3' },
  { label: 'Underperformed', value: '2' },
  { label: 'Median time to impact', value: '7.2 months' }],

  bullets: [
  {
    label: 'Most predictive success factor',
    value: 'Strong customer segmentation completed before implementation began.'
  },
  {
    label: 'Most common failure mode',
    value: 'Sales-team discount exceptions eroding capture within two quarters.'
  },
  {
    label: 'Fastest observed impact',
    value: 'Aftermarket parts repricing — measurable margin effect in 3.1 months on average.'
  },
  {
    label: 'Slowest observed impact',
    value: 'Compensation-led pricing change — 14.6 months, gated by annual plan cycles.'
  }],

  contradictions: [
    {
      company: 'Vantage Specialty Chemicals, 2020 (excluded from the 14 above)',
      note:
        'Segmentation was completed before rollout — the pattern that predicts success in 9 of 9 other cases — but the initiative still missed target by 40%, attributed to a regional demand shock unrelated to pricing design. The one case on record where the pattern didn’t hold.'
    }
  ],
  basis: 'Derived from 14 initiatives across 9 portfolio companies, Fund II–IV, 2019–2026. Excludes 2 initiatives with insufficient post-implementation reporting.'
};

export interface HistoricalDecision {
  id: string;
  company: string;
  title: string;
  year: string;
  outcome: 'Exceeded' | 'Met' | 'Underperformed';
  target: string;
  actual: string;
  timeToImpact: string;
  lesson: string;
}

export const historicalDecisions: HistoricalDecision[] = [
{
  id: 'h1',
  company: 'Cascade Building Products',
  title: 'Segmented price architecture, distribution channel',
  year: '2024',
  outcome: 'Exceeded',
  target: '+$4.0M',
  actual: '+$5.6M',
  timeToImpact: '6.4 months',
  lesson: 'Segmentation preceded rollout; exception authority removed from field at go-live.'
},
{
  id: 'h2',
  company: 'Ironvale Components',
  title: 'Aftermarket parts repricing',
  year: '2023',
  outcome: 'Exceeded',
  target: '+$2.2M',
  actual: '+$3.4M',
  timeToImpact: '3.1 months',
  lesson: 'Installed-base elasticity was materially lower than management assumed.'
},
{
  id: 'h3',
  company: 'Meridian Health Services',
  title: 'Payer contract renegotiation, wave one',
  year: '2025',
  outcome: 'Met',
  target: '+$3.5M',
  actual: '+$3.6M',
  timeToImpact: '9.8 months',
  lesson: 'Contract cycle timing, not negotiation quality, governed the pace.'
},
{
  id: 'h4',
  company: 'Harborline Distribution',
  title: 'List price increase, all customers',
  year: '2022',
  outcome: 'Underperformed',
  target: '+$6.1M',
  actual: '+$1.9M',
  timeToImpact: '11.2 months',
  lesson: 'Uniform increase without segmentation; 3.8% volume loss concentrated in contested regions.'
},
{
  id: 'h5',
  company: 'Fund II — Exited 2023',
  title: 'Discount governance program',
  year: '2021',
  outcome: 'Underperformed',
  target: '+$2.8M',
  actual: '+$0.9M',
  timeToImpact: '13.4 months',
  lesson: 'Reps retained exception authority; 42% of modeled capture eroded by quarter three.'
},
{
  id: 'h6',
  company: 'Vantage Specialty Chemicals',
  title: 'Value-based pricing, two product lines',
  year: '2026',
  outcome: 'Met',
  target: '+$2.4M',
  actual: '+$2.5M',
  timeToImpact: '7.0 months',
  lesson: 'Pilot cohort design translated cleanly to full rollout.'
}];


export const memoryStats = [
{ label: 'Decisions recorded', value: '1,284' },
{ label: 'Initiatives with measured outcomes', value: '312' },
{ label: 'Portfolio companies, Fund II–IV', value: '41' },
{ label: 'Evidence sources indexed', value: '18,940' }];