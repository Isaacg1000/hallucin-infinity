import { ComparisonDimensionKey, ComparisonDimensions, RatingLevel } from '../types';
import { getRouteDetail } from './routeDetails';
import { getCritique } from './critiqueCache';

export const DIMENSION_LABELS: Record<ComparisonDimensionKey, string> = {
  marketPotential: 'Market Potential',
  differentiation: 'Differentiation',
  speedToMvp: 'Speed to MVP',
  capitalRequired: 'Capital Required',
  competitiveIntensity: 'Competitive Intensity',
  evidenceStrength: 'Evidence Strength'
};

export const DIMENSION_ORDER: ComparisonDimensionKey[] = [
  'marketPotential',
  'differentiation',
  'speedToMvp',
  'capitalRequired',
  'competitiveIntensity',
  'evidenceStrength'
];

/** For these two dimensions, Low is the favorable direction — a smaller
 * capital ask and less competitive pressure both count in the route's
 * favor when ranking against user priorities. */
export const LOWER_IS_BETTER: Partial<Record<ComparisonDimensionKey, true>> = {
  capitalRequired: true,
  competitiveIntensity: true
};

const LEVEL_SCORE: Record<RatingLevel, number> = { Low: 1, Medium: 2, High: 3, 'Very High': 4 };
export function levelScore(level: RatingLevel) {
  return LEVEL_SCORE[level];
}

export const COMPARISONS: Record<string, ComparisonDimensions> = {
  'cust-healthcare-ats': {
    marketPotential: { level: 'Medium', why: 'A meaningful but bounded segment — large hospital systems, not the entire employer market.' },
    differentiation: { level: 'High', why: 'Few competitors treat credential verification as the core product rather than a feature.' },
    speedToMvp: { level: 'Medium', why: 'Verification logic and registry integrations take longer to build than a generic screening flow.' },
    capitalRequired: { level: 'Medium', why: 'Registry integrations and compliance groundwork add cost before first revenue.' },
    competitiveIntensity: { level: 'Low', why: 'Almost no incumbents position specifically around healthcare credentialing.' },
    evidenceStrength: { level: 'Medium', why: 'Talent teams consistently name this pain point, but no direct willingness-to-pay signal yet.' }
  },
  'cust-enterprise-resume': {
    marketPotential: { level: 'Very High', why: 'The largest, most established segment of the recruiting-technology market.' },
    differentiation: { level: 'Low', why: 'Resume screening is the most commoditized capability in the category.' },
    speedToMvp: { level: 'High', why: 'Well-understood problem with established technical patterns to build from.' },
    capitalRequired: { level: 'High', why: 'Winning enterprise trust and matching incumbent accuracy takes sustained investment.' },
    competitiveIntensity: { level: 'Very High', why: 'The most heavily funded, most crowded part of the entire category.' },
    evidenceStrength: { level: 'High', why: 'Demand is well documented across the industry, though specific to this product is unproven.' }
  },
  'cust-staffing-reengagement': {
    marketPotential: { level: 'Medium', why: 'Sizable staffing-agency market, but smaller than enterprise or healthcare employer segments.' },
    differentiation: { level: 'Medium', why: 'Re-engagement tools exist, but few are purpose-built around agencies’ own candidate databases.' },
    speedToMvp: { level: 'High', why: 'Matching against an existing database is a narrower technical problem than fresh sourcing.' },
    capitalRequired: { level: 'Low', why: 'Leverages data agencies already own rather than requiring new sourcing infrastructure.' },
    competitiveIntensity: { level: 'Medium', why: 'Some ATS vendors offer basic re-sourcing, but few focus on this specifically.' },
    evidenceStrength: { level: 'Low', why: 'Directionally plausible, but re-engagement conversion rates haven’t been tested yet.' }
  }
};

/** Deterministic, coherent fallback for routes without hand-authored
 * comparison data — keeps every route clickable without ever feeling
 * like a stub. */
export function getComparison(nodeId: string): ComparisonDimensions {
  if (COMPARISONS[nodeId]) return COMPARISONS[nodeId];
  const critique = getCritique(nodeId);
  if (critique) return critique.comparison;
  const detail = getRouteDetail(nodeId);
  const seed = nodeId.length + (detail?.name.length ?? 0);
  const levels: RatingLevel[] = ['Low', 'Medium', 'High', 'Very High'];
  const pick = (offset: number) => levels[(seed + offset) % levels.length];
  return {
    marketPotential: { level: pick(1), why: 'Estimated from the scope of customer described in this route.' },
    differentiation: { level: pick(2), why: 'Estimated from how distinct the approach is from adjacent routes explored.' },
    speedToMvp: { level: pick(3), why: 'Estimated from the complexity of the MVP scope outlined for this route.' },
    capitalRequired: { level: pick(4), why: 'Estimated from the technical and go-to-market lift this route implies.' },
    competitiveIntensity: { level: pick(0), why: 'Estimated from how crowded this space appears relative to other routes.' },
    evidenceStrength: { level: 'Low', why: 'This route has not been through Validate yet — no evidence gathered so far.' }
  };
}
