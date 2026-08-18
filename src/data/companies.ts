import { Company } from '../types';

export const companies: Company[] = [
{
  id: 'northpeak',
  name: 'NorthPeak Industrial',
  industry: 'Industrial Manufacturing',
  revenue: '$420M',
  ebitda: '$54M',
  employees: '1,850',
  acquired: 'March 2026',
  holdPeriod: 'Month 5',
  thesisStatus: 'On Track',
  identified: 31.5,
  validated: 18.2,
  inExecution: 9.8,
  realized: 3.4,
  openOpportunities: 24,
  fund: 'Fund IV'
},
{
  id: 'apex',
  name: 'Apex Logistics',
  industry: 'Transportation & Logistics',
  revenue: '$312M',
  ebitda: '$38M',
  employees: '2,400',
  acquired: 'September 2025',
  holdPeriod: 'Month 11',
  thesisStatus: 'On Track',
  identified: 22.4,
  validated: 12.9,
  inExecution: 7.1,
  realized: 2.6,
  openOpportunities: 18,
  fund: 'Fund IV'
},
{
  id: 'brightpath',
  name: 'BrightPath Software',
  industry: 'Vertical SaaS',
  revenue: '$96M',
  ebitda: '$21M',
  employees: '540',
  acquired: 'June 2025',
  holdPeriod: 'Month 14',
  thesisStatus: 'Watch',
  identified: 17.8,
  validated: 9.4,
  inExecution: 4.2,
  realized: 1.9,
  openOpportunities: 15,
  fund: 'Fund IV'
},
{
  id: 'meridian',
  name: 'Meridian Health Services',
  industry: 'Healthcare Services',
  revenue: '$268M',
  ebitda: '$31M',
  employees: '3,100',
  acquired: 'January 2025',
  holdPeriod: 'Month 19',
  thesisStatus: 'On Track',
  identified: 19.6,
  validated: 11.2,
  inExecution: 6.4,
  realized: 4.1,
  openOpportunities: 12,
  fund: 'Fund III'
},
{
  id: 'cascade',
  name: 'Cascade Building Products',
  industry: 'Building Products',
  revenue: '$540M',
  ebitda: '$67M',
  employees: '2,050',
  acquired: 'August 2024',
  holdPeriod: 'Month 24',
  thesisStatus: 'Watch',
  identified: 26.1,
  validated: 14.5,
  inExecution: 11.3,
  realized: 6.8,
  openOpportunities: 21,
  fund: 'Fund III'
},
{
  id: 'vantage',
  name: 'Vantage Specialty Chemicals',
  industry: 'Specialty Chemicals',
  revenue: '$389M',
  ebitda: '$48M',
  employees: '1,120',
  acquired: 'November 2025',
  holdPeriod: 'Month 9',
  thesisStatus: 'On Track',
  identified: 18.9,
  validated: 8.7,
  inExecution: 3.9,
  realized: 1.2,
  openOpportunities: 16,
  fund: 'Fund IV'
},
{
  id: 'harborline',
  name: 'Harborline Distribution',
  industry: 'Industrial Distribution',
  revenue: '$610M',
  ebitda: '$52M',
  employees: '1,690',
  acquired: 'February 2024',
  holdPeriod: 'Month 30',
  thesisStatus: 'Off Track',
  identified: 24.3,
  validated: 10.1,
  inExecution: 5.5,
  realized: 2.2,
  openOpportunities: 11,
  fund: 'Fund III'
},
{
  id: 'ironvale',
  name: 'Ironvale Components',
  industry: 'Precision Components',
  revenue: '$174M',
  ebitda: '$26M',
  employees: '780',
  acquired: 'May 2026',
  holdPeriod: 'Month 3',
  thesisStatus: 'On Track',
  identified: 11.7,
  validated: 4.3,
  inExecution: 1.1,
  realized: 0,
  openOpportunities: 9,
  fund: 'Fund IV'
}];


export const northpeak = companies[0];

export const northpeakThesis =
'NorthPeak was acquired as a fragmented-market consolidator with durable aftermarket revenue and structurally under-managed commercial discipline. The thesis assumes 400–600bps of EBITDA margin expansion driven by pricing sophistication, procurement consolidation across three legacy acquisitions, and a shift of aftermarket parts from a reactive channel into a managed service motion — without material CapEx or an ERP replacement.';

export const northpeakPriorities = [
{
  title: 'Install commercial pricing discipline',
  detail:
  'Move from cost-plus quoting to segmented, willingness-to-pay based architecture across the top three product families.',
  owner: 'VP Commercial Excellence',
  horizon: 'Days 1–120'
},
{
  title: 'Consolidate procurement across legacy entities',
  detail:
  'Three acquisitions still buy independently. Consolidate the top 40 direct-material categories under a single supplier framework.',
  owner: 'COO',
  horizon: 'Days 30–180'
},
{
  title: 'Convert aftermarket into a managed service',
  detail:
  'Attach contracted service and parts programs to the installed base rather than transactional break-fix orders.',
  owner: 'GM, Aftermarket',
  horizon: 'Days 60–270'
}];