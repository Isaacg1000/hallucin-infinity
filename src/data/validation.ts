import { ValidationData } from '../types';
import { getRouteDetail } from './routeDetails';

export const VALIDATIONS: Record<string, ValidationData> = {
  'cust-healthcare-ats': {
    nodeId: 'cust-healthcare-ats',
    assessmentLabel: 'Promising — Important Unknowns Remain',
    evidenceFor: [
      {
        id: 'ef1',
        claim: 'Credential verification is a named bottleneck in healthcare hiring.',
        evidence:
          'Talent acquisition leaders at multiple hospital systems independently describe credential and license verification as the step that most consistently delays a hire.',
        source: 'Healthcare TA leadership interviews (secondary research)',
        relevance: 'High',
        date: '2026-06'
      },
      {
        id: 'ef2',
        claim: 'Compliance risk from credentialing errors is real and costly.',
        evidence:
          'Regulatory guidance requires hospitals to verify licensure before a clinician begins work; lapses have led to documented compliance penalties in prior cases.',
        source: 'Industry compliance benchmark report',
        relevance: 'High',
        date: '2025-11'
      },
      {
        id: 'ef3',
        claim: 'ATS-embedded tools see faster adoption than standalone point solutions.',
        evidence:
          'Recruiting teams consistently favor tools that integrate into their existing system of record over ones requiring a separate workflow.',
        source: 'Recruiting technology adoption survey',
        relevance: 'Medium',
        date: '2025-09'
      }
    ],
    evidenceAgainst: [
      {
        id: 'ea1',
        claim: 'No direct signal yet that hospitals will pay for this as a separate line item.',
        evidence:
          'Existing research describes the pain but does not include any pricing or purchase-intent data specific to credential verification tooling.',
        source: 'Gap identified — no source found',
        relevance: 'High',
        date: '2026-08'
      },
      {
        id: 'ea2',
        claim: 'Some large ATS vendors already offer partial credentialing features.',
        evidence:
          'A subset of enterprise ATS platforms include basic license-expiration tracking, which could reduce perceived need for a dedicated tool.',
        source: 'Competitive product documentation review',
        relevance: 'Medium',
        date: '2026-05'
      },
      {
        id: 'ea3',
        claim: 'Credential registry access varies and may be inconsistent across states.',
        evidence:
          'Several state licensing boards do not expose machine-readable verification data, which would require manual fallback workflows.',
        source: 'Registry access audit (partial)',
        relevance: 'High',
        date: '2026-07'
      }
    ],
    assumptionLedger: [
      { id: 'al1', text: 'Credentialing is painful enough that teams will act on it.', importance: 'Critical', status: 'Supported' },
      { id: 'al2', text: 'Buyers will pay separately for a dedicated verification tool.', importance: 'Critical', status: 'Mixed' },
      { id: 'al3', text: 'Existing ATS credentialing features are insufficient on their own.', importance: 'High', status: 'Mixed' },
      { id: 'al4', text: 'Credential data is reliably accessible across target registries.', importance: 'Critical', status: 'Unknown' }
    ],
    unknowns: [
      'Willingness to pay as a standalone budget line',
      'Procurement and security review timeline',
      'Integration complexity per ATS vendor',
      'Credential registry data availability by state'
    ],
    finalAssessment: 'Worth Testing',
    finalExplanation:
      'The route appears differentiated and addresses a plausible workflow problem, but willingness to pay and integration feasibility remain critical uncertainties.'
  }
};

/** Deterministic fallback for routes without hand-authored validation data.
 * Builds real, specific evidence and reuses the route's own assumptions
 * and unknowns rather than inventing generic filler. */
export function getValidation(nodeId: string): ValidationData | undefined {
  if (VALIDATIONS[nodeId]) return VALIDATIONS[nodeId];
  const detail = getRouteDetail(nodeId);
  if (!detail) return undefined;

  return {
    nodeId,
    assessmentLabel: 'Early Signal — Not Yet Tested',
    evidenceFor: detail.upside.slice(0, 2).map((u, i) => ({
      id: `ef-auto-${i}`,
      claim: u,
      evidence: `Identified during exploration as a structural reason this route could work, based on the thesis: "${detail.thesis}"`,
      source: 'Derived from route reasoning — not yet externally sourced',
      relevance: 'Medium' as const,
      date: '—'
    })),
    evidenceAgainst: detail.challenges.slice(0, 2).map((c, i) => ({
      id: `ea-auto-${i}`,
      claim: c,
      evidence: 'Flagged as an open challenge during exploration; no supporting or refuting evidence has been gathered yet.',
      source: 'Gap identified — no source found',
      relevance: 'Medium' as const,
      date: '—'
    })),
    assumptionLedger: detail.assumptions,
    unknowns: detail.unknowns,
    finalAssessment: 'Not Yet',
    finalExplanation: `${detail.name} hasn't been through evidence-gathering yet — this route is still at the hypothesis stage. Validate it to find out what would need to be true.`
  };
}
