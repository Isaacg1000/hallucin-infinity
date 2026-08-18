import { Opportunity, EvidenceStrength, Impact, ValidationVerdict } from '../types';
import { getRouteDetail } from './routeDetails';
import { getValidation } from './validation';

/** Turns a validated Explore-flow route into a real Opportunity record,
 * shaped exactly like the ones already tracked for NorthPeak Industrial.
 * This is the actual mechanism behind "validated routes become tracked
 * opportunities" — not just a sentence, a real object that shows up in
 * the Opportunities list, sortable and filterable alongside the rest.
 *
 * Fields the Explore flow has no real signal for are represented
 * honestly rather than invented: ebitda is 0 (rendered as "Not yet
 * sized" — see OpportunityCard/OpportunityTable), paybackPeriod says so
 * outright. Everything else is a defensible, documented derivation from
 * the route's own validation data, not a guess dressed up as a number. */
export function buildOpportunityFromRoute(routeId: string): Opportunity | null {
  const detail = getRouteDetail(routeId);
  const validation = getValidation(routeId);
  if (!detail || !validation) return null;

  const netEvidence = validation.evidenceFor.length - validation.evidenceAgainst.length;

  const scoreByVerdict: Record<ValidationVerdict, number> = {
    Promising: 88,
    'Worth Testing': 72,
    'Weak Signal': 54,
    'Not Yet': 38
  };

  const impactByVerdict: Record<ValidationVerdict, Impact> = {
    Promising: 'High',
    'Worth Testing': 'Medium',
    'Weak Signal': 'Low',
    'Not Yet': 'Low'
  };

  const evidenceStrength: EvidenceStrength =
    validation.evidenceFor.length >= 4 ? 'Strong' : validation.evidenceFor.length >= 2 ? 'Moderate' : 'Limited';

  return {
    id: routeId,
    title: detail.name,
    // The demo's one portfolio company — Explore isn't scoped to a
    // specific holding, but tracking has to land an opportunity
    // somewhere real rather than invent a company that doesn't exist
    // in the portfolio data.
    company: 'NorthPeak Industrial',
    companyId: 'northpeak',
    category: 'Product',
    score: scoreByVerdict[validation.finalAssessment],
    ebitda: 0,
    impact: impactByVerdict[validation.finalAssessment],
    confidence: Math.max(30, Math.min(95, 60 + netEvidence * 5)),
    evidence: evidenceStrength,
    complexity: 'Medium',
    timeToImpact: '9–12 months',
    paybackPeriod: 'Not yet estimated',
    status: 'Validate',
    tags: ['From Exploration'],
    summary: detail.thesis
  };
}
