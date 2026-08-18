import { EvidenceStrength, OpportunityStatus } from '../types';

export type Assessment = 'Leading' | 'Promising' | 'Needs Evidence' | 'Mixed' | 'Weak';

/** A semantic read replaces the score as the primary signal — derived
 * from the same score/evidence fields already on the record, not a
 * separately hand-authored label that could drift from what the numbers
 * actually say. */
export function assessmentFor(score: number, evidence: EvidenceStrength): { label: Assessment; why: string } {
  if (evidence === 'Contested') {
    return { label: 'Mixed', why: 'Evidence is contested — supporting and contradicting findings are both material.' };
  }
  if (score >= 85 && evidence !== 'Limited') {
    return { label: 'Leading', why: `High confidence, backed by ${evidence.toLowerCase()} evidence.` };
  }
  if (score >= 70) {
    return { label: 'Promising', why: 'A solid case, but not yet the strongest one in the portfolio.' };
  }
  if (evidence === 'Limited') {
    return { label: 'Needs Evidence', why: "Hasn't been tested enough yet to rank with confidence." };
  }
  return { label: 'Weak', why: 'Low score and limited support — not a near-term priority.' };
}

const NEXT_ACTION: Record<OpportunityStatus, string> = {
  Validate: 'Validate the underlying assumptions',
  Pilot: 'Review pilot results',
  Review: 'Complete stakeholder review',
  Approved: 'Move into execution',
  Executing: 'Track execution against plan',
  Realized: 'Confirm realized value',
  Rejected: 'Archived — not being pursued'
};

/** Derived from the existing status field — a real next step, not a
 * decorative label, and one that stays in sync with status by
 * construction rather than by hand-keeping two fields aligned. */
export function nextActionFor(status: OpportunityStatus): string {
  return NEXT_ACTION[status];
}
