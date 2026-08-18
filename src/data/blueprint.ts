import { Initiative } from '../types';

export const initiatives: Initiative[] = [
{
  id: 'i1',
  name: 'Pricing Architecture Redesign',
  workstream: 'Commercial',
  impact: 8.4,
  owner: 'Erin Castellanos',
  ownerRole: 'VP Sales',
  confidence: 88,
  status: 'Validating',
  timeline: 'Q3 2026 – Q1 2027'
},
{
  id: 'i2',
  name: 'Sales Territory Optimization',
  workstream: 'Commercial',
  impact: 4.1,
  owner: 'Erin Castellanos',
  ownerRole: 'VP Sales',
  confidence: 84,
  status: 'Identified',
  timeline: 'Q4 2026 – Q2 2027'
},
{
  id: 'i3',
  name: 'Aftermarket Expansion',
  workstream: 'Commercial',
  impact: 3.2,
  owner: 'Tom Bergeron',
  ownerRole: 'GM, Aftermarket',
  confidence: 76,
  status: 'Identified',
  timeline: 'Q4 2026 – Q3 2027'
},
{
  id: 'i4',
  name: 'Procurement Consolidation',
  workstream: 'Operational',
  impact: 5.3,
  owner: 'Alan Whitmore',
  ownerRole: 'COO',
  confidence: 86,
  status: 'Executing',
  timeline: 'Q3 2026 – Q2 2027'
},
{
  id: 'i5',
  name: 'SKU Rationalization',
  workstream: 'Operational',
  impact: 2.7,
  owner: 'Alan Whitmore',
  ownerRole: 'COO',
  confidence: 81,
  status: 'Approved',
  timeline: 'Q4 2026 – Q1 2027'
},
{
  id: 'i6',
  name: 'Demand Forecasting',
  workstream: 'AI / Automation',
  impact: 3.1,
  owner: 'Sonia Patel',
  ownerRole: 'VP Supply Chain',
  confidence: 71,
  status: 'Identified',
  timeline: 'Q1 2027 – Q4 2027'
},
{
  id: 'i7',
  name: 'Customer Service Automation',
  workstream: 'AI / Automation',
  impact: 1.4,
  owner: 'Dana Whitfield',
  ownerRole: 'CEO',
  confidence: 68,
  status: 'Executing',
  timeline: 'Q3 2026 – Q1 2027'
}];


export const blueprintMetrics = [
{ label: 'Total Opportunity', value: '$31.5M', note: 'EBITDA, gross of execution risk' },
{ label: 'Validated', value: '$18.2M', note: 'Evidence threshold met' },
{ label: 'Approved', value: '$14.7M', note: 'Signed off by IC' },
{ label: 'In Execution', value: '$9.8M', note: 'Owner assigned, work underway' },
{ label: 'Realized', value: '$3.4M', note: 'Confirmed in reported EBITDA' }];


export interface RoadmapItem {
  name: string;
  workstream: 'Commercial' | 'Operational' | 'AI / Automation';
  start: number;
  end: number;
  owner: string;
}

export const roadmap: RoadmapItem[] = [
{ name: 'Pricing validation sprint', workstream: 'Commercial', start: 0, end: 45, owner: 'E. Castellanos' },
{ name: 'Pricing pilot — 25 accounts', workstream: 'Commercial', start: 45, end: 100, owner: 'E. Castellanos' },
{ name: 'Territory potential model', workstream: 'Commercial', start: 20, end: 75, owner: 'E. Castellanos' },
{ name: 'Aftermarket contract design', workstream: 'Commercial', start: 55, end: 100, owner: 'T. Bergeron' },
{ name: 'Spend cube + category waves', workstream: 'Operational', start: 0, end: 35, owner: 'A. Whitmore' },
{ name: 'Wave one supplier negotiation', workstream: 'Operational', start: 35, end: 90, owner: 'A. Whitmore' },
{ name: 'SKU tail review + exit plan', workstream: 'Operational', start: 30, end: 80, owner: 'A. Whitmore' },
{ name: 'Service deflection pilot', workstream: 'AI / Automation', start: 15, end: 70, owner: 'D. Whitfield' },
{ name: 'Forecast data-quality assessment', workstream: 'AI / Automation', start: 60, end: 100, owner: 'S. Patel' }];


export const roadmapMilestones = [
{ day: 30, label: 'Pricing dispersion baseline signed off' },
{ day: 45, label: 'Validation sprint decision gate' },
{ day: 70, label: 'Wave one supplier awards' },
{ day: 100, label: 'Board readout — value creation plan' }];