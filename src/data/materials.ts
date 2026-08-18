import { FileTextIcon, FileSpreadsheetIcon, PresentationIcon, LucideIcon } from 'lucide-react';

export interface Material {
  name: string;
  size: string;
  kind: string;
  icon: LucideIcon;
}

/** The one shared source of truth for "what's been uploaded to this
 * analysis" — used by the New Exploration modal and the Context drawer,
 * so the document count shown in Context is never a separately
 * maintained (and driftable) number. */
export const MATERIALS: Material[] = [
  { name: 'NorthPeak_CIM_2026.pdf', size: '14.2 MB', kind: 'CIM', icon: FileTextIcon },
  { name: 'FY24-FY26_Financials.xlsx', size: '3.8 MB', kind: 'Financials', icon: FileSpreadsheetIcon },
  { name: 'Mgmt_Presentation_Q2.pptx', size: '22.1 MB', kind: 'Management', icon: PresentationIcon },
  { name: 'Invoice_Level_Detail_14mo.csv', size: '48.6 MB', kind: 'Customer Data', icon: FileSpreadsheetIcon }
];
