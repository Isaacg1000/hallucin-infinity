// ============================================================================
// Hallucinate — Strategic Exploration Platform
// Core domain types
// ============================================================================

/** The four-part trust model. Every piece of generated or gathered content
 * carries one of these so users always know what kind of claim they're
 * looking at — never inferred from color alone. */
export type EpistemicStatus = 'hypothesis' | 'evidence' | 'inference' | 'unknown';

export type NodeKind = 'root' | 'category' | 'route';

/** A single node in the Exploration Map tree. Root → Category → Route,
 * and Route nodes may themselves have Route children (deeper travel). */
export interface MapNode {
  id: string;
  kind: NodeKind;
  parentId: string | null;
  title: string;
  /** Short quoted descriptor shown under the title, e.g. "Credential-heavy hiring" */
  subtitle?: string;
  /** The guiding question a category node poses, e.g. "Who else could this serve?" */
  question?: string;
  /** Paragraph reasoning shown in the "Why this?" panel */
  reasoning?: string;
  /** "What makes this interesting" bullets shown in the "Why this?" panel */
  bullets?: string[];
  childIds: string[];
  /** True when this node has a fully authored Route Detail record */
  isLeafRoute?: boolean;
}

// ----------------------------------------------------------------------------
// Route detail (Screen 4)
// ----------------------------------------------------------------------------

export type AssumptionStatus = 'Unvalidated' | 'Needs Research' | 'Supported' | 'Mixed' | 'Unknown';
export type Importance = 'Critical' | 'High' | 'Medium';

export interface AssumptionItem {
  id: string;
  text: string;
  importance: Importance;
  status: AssumptionStatus;
}

export interface RouteDetailData {
  nodeId: string;
  name: string;
  thesis: string;
  whyExists: string[];
  potentialCustomer: string;
  problem: string;
  product: string;
  businessModel: string;
  mvp: string[];
  upside: string[];
  challenges: string[];
  assumptions: AssumptionItem[];
  unknowns: string[];
}

// ----------------------------------------------------------------------------
// Compare (Screen 5)
// ----------------------------------------------------------------------------

export type RatingLevel = 'Very High' | 'High' | 'Medium' | 'Low';

export interface DimensionRating {
  level: RatingLevel;
  why: string;
}

export type ComparisonDimensionKey =
  | 'marketPotential'
  | 'differentiation'
  | 'speedToMvp'
  | 'capitalRequired'
  | 'competitiveIntensity'
  | 'evidenceStrength';

export type ComparisonDimensions = Record<ComparisonDimensionKey, DimensionRating>;

// ----------------------------------------------------------------------------
// Validate (Screen 6)
// ----------------------------------------------------------------------------

export interface EvidenceItem {
  id: string;
  claim: string;
  evidence: string;
  source: string;
  relevance: 'High' | 'Medium' | 'Low';
  date: string;
}

export type ValidationVerdict = 'Promising' | 'Worth Testing' | 'Weak Signal' | 'Not Yet';

export interface ValidationData {
  nodeId: string;
  assessmentLabel: string;
  evidenceFor: EvidenceItem[];
  evidenceAgainst: EvidenceItem[];
  assumptionLedger: AssumptionItem[];
  unknowns: string[];
  finalAssessment: ValidationVerdict;
  finalExplanation: string;
}

// ----------------------------------------------------------------------------
// Action plan (Screen 7)
// ----------------------------------------------------------------------------

export interface WeekPlan {
  week: string;
  title: string;
  detail: string;
}

export interface ActionPlanData {
  nodeId: string;
  routeName: string;
  hypothesis: string;
  targetCustomerRole: string;
  targetCustomerOrg: string;
  mvp: string[];
  weeks: WeekPlan[];
  successCriteria: string[];
  failureCriteria: string[];
}

// ----------------------------------------------------------------------------
// Context screen (Screen 2)
// ----------------------------------------------------------------------------

export interface ContextAnswers {
  goals: string[];
  audience: string;
  priorities: string[];
  constraints: string;
  decided: string;
}

// ----------------------------------------------------------------------------
// Explorations list
// ----------------------------------------------------------------------------

export interface ExplorationSummary {
  id: string;
  ideaText: string;
  category: string;
  createdAt: string;
  possibilitiesExplored: number;
  savedCount: number;
  promisingCount: number;
}

// ============================================================================
// Portfolio Value Creation — the original Meridian Capital PE workspace.
// Kept alongside the Strategic Exploration types above (different product
// surface, same app).
// ============================================================================

export type Impact = 'Very High' | 'High' | 'Medium' | 'Low';

export type EvidenceStrength = 'Strong' | 'Moderate' | 'Limited' | 'Contested';

export type OpportunityStatus =
'Validate' |
'Pilot' |
'Review' |
'Approved' |
'Executing' |
'Realized' |
'Rejected';

export type Complexity = 'Low' | 'Medium' | 'High';

export type Category =
'Revenue Growth' |
'Pricing' |
'Operations' |
'AI / Automation' |
'Procurement' |
'Product' |
'M&A' |
'Working Capital';

export type PipelineStage =
'Identified' |
'Validating' |
'Approved' |
'Executing' |
'Realized';

export interface Company {
  id: string;
  name: string;
  industry: string;
  revenue: string;
  ebitda: string;
  employees: string;
  acquired: string;
  holdPeriod: string;
  thesisStatus: 'On Track' | 'Watch' | 'Off Track';
  identified: number;
  validated: number;
  inExecution: number;
  realized: number;
  openOpportunities: number;
  fund: string;
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  companyId: string;
  category: Category;
  score: number;
  ebitda: number;
  impact: Impact;
  confidence: number;
  evidence: EvidenceStrength;
  complexity: Complexity;
  timeToImpact: string;
  paybackPeriod: string;
  status: OpportunityStatus;
  tags: string[];
  summary: string;
}

export interface EvidenceSource {
  id: string;
  title: string;
  publisher: string;
  date: string;
  summary: string;
  relevance: 'High' | 'Medium' | 'Low';
  direction: 'supports' | 'contradicts';
  type: 'Research' | 'Internal Data' | 'Benchmark' | 'Interview' | 'Market';
}

export interface Assumption {
  id: string;
  assumption: string;
  confidence: 'High' | 'Medium' | 'Low';
  impactIfWrong: 'Critical' | 'High' | 'Medium';
  status: 'Must Validate' | 'Supported' | 'Unverified' | 'Validated';
  note: string;
}

export interface Risk {
  id: string;
  title: string;
  detail: string;
  severity: 'High' | 'Medium' | 'Low';
  likelihood: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

export interface RejectedAlternative {
  id: string;
  title: string;
  verdict: 'Rejected' | 'Ranked Lower';
  reason: string;
  score: number;
}

export interface OpportunityDetail {
  thesis: string[];
  whyExists: string[];
  evidence: EvidenceSource[];
  assumptions: Assumption[];
  risks: Risk[];
  rejected: RejectedAlternative[];
  nextStep: {
    title: string;
    duration: string;
    steps: string[];
    successThreshold: string;
  };
}

export interface Initiative {
  id: string;
  name: string;
  workstream: 'Commercial' | 'Operational' | 'AI / Automation';
  impact: number;
  owner: string;
  ownerRole: string;
  confidence: number;
  status: PipelineStage;
  timeline: string;
}

export interface DecisionRecord {
  id: string;
  title: string;
  company: string;
  status: 'Pending Approval' | 'Approved' | 'Deferred' | 'Rejected';
  /** The opportunity this decision is about — a real id in
   * data/opportunities.ts, the anchor for the decision trail. */
  relatedOpportunityId: string;
  recommendation: string;
  expectedOutcome: string;
  raisedOn: string;
  owners: {name: string;role: string;state: 'Reviewed' | 'Pending' | 'Approved';}[];
  timeline: {
    label: string;
    date: string;
    state: 'complete' | 'current' | 'upcoming';
    detail: string;
  }[];
  alternatives: {title: string;note: string;verdict: string;}[];
}
