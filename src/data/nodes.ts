import { MapNode } from '../types';

// ============================================================================
// The Exploration Map — mocked as a static tree for the demo idea:
// "We're considering building an AI recruiting platform that helps
//  companies screen candidates more efficiently."
//
// root
//  └─ 7 category nodes (Customer, Problem, Product, Market, Business Model,
//     Distribution, Positioning) — revealed immediately, progressive
//     disclosure below that.
// ============================================================================

export const IDEA_TEXT =
  "We're considering building an AI recruiting platform that helps companies screen candidates more efficiently.";

export const NODES: Record<string, MapNode> = {
  root: {
    id: 'root',
    kind: 'root',
    parentId: null,
    title: 'AI Recruiting Platform',
    subtitle: 'Your idea',
    childIds: ['cat-customer', 'cat-problem', 'cat-product', 'cat-market', 'cat-business-model', 'cat-distribution', 'cat-positioning']
  },

  // ---------------------------------------------------------------- CUSTOMER
  'cat-customer': {
    id: 'cat-customer',
    kind: 'category',
    parentId: 'root',
    title: 'Customer',
    question: 'Who else could this serve?',
    childIds: ['cust-healthcare', 'cust-staffing', 'cust-enterprise', 'cust-smb']
  },
  'cust-healthcare': {
    id: 'cust-healthcare',
    kind: 'route',
    parentId: 'cat-customer',
    title: 'Healthcare Employers',
    subtitle: 'Credential-heavy hiring',
    reasoning:
      'Healthcare hiring combines specialized roles, credentials, compliance requirements, and high costs associated with unfilled positions.',
    bullets: [
      'Complex screening requirements',
      'Credential verification',
      'High cost of unfilled roles',
      'Fragmented workflows'
    ],
    childIds: ['cust-healthcare-hospitals']
  },
  'cust-healthcare-hospitals': {
    id: 'cust-healthcare-hospitals',
    kind: 'route',
    parentId: 'cust-healthcare',
    title: 'Hospitals',
    subtitle: 'Large systems, high compliance burden',
    reasoning:
      'Hospital systems hire continuously across dozens of licensed roles, each with its own credentialing chain. That repetition is exactly where an automated layer compounds in value.',
    bullets: [
      'Continuous, high-volume licensed hiring',
      'Every role has a distinct credential chain',
      'Compliance teams already track expirations manually',
      'Understaffing has a direct patient-care cost'
    ],
    childIds: ['cust-healthcare-credential']
  },
  'cust-healthcare-credential': {
    id: 'cust-healthcare-credential',
    kind: 'route',
    parentId: 'cust-healthcare-hospitals',
    title: 'Credential Verification',
    subtitle: 'Where hiring actually slows down',
    reasoning:
      "Talent teams at hospitals consistently point to credential verification — not sourcing or interviewing — as the step that stalls a hire. It's manual, repetitive, and high-stakes if done wrong.",
    bullets: [
      'The single biggest bottleneck teams report',
      'Manual cross-checking against multiple registries',
      'Errors carry compliance and licensing risk',
      'Ripe for structured automation, not another sourcing tool'
    ],
    childIds: ['cust-healthcare-ats']
  },
  'cust-healthcare-ats': {
    id: 'cust-healthcare-ats',
    kind: 'route',
    parentId: 'cust-healthcare-credential',
    title: 'ATS Integration',
    subtitle: 'Sit inside the system talent teams already use',
    reasoning:
      'Hospital talent teams will not switch their system of record. A credential layer that reads and writes into their existing ATS removes the single biggest adoption objection.',
    bullets: [
      'No workflow migration required to adopt',
      'Credential data becomes usable where recruiters already work',
      'Turns a point solution into infrastructure',
      'Matches how healthcare buyers actually evaluate software'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'cust-staffing': {
    id: 'cust-staffing',
    kind: 'route',
    parentId: 'cat-customer',
    title: 'Staffing Agencies',
    subtitle: 'High-volume, repeat placements',
    reasoning:
      'Staffing firms re-screen similar candidate pools over and over across client requisitions. A platform that remembers and re-activates prior candidates changes their unit economics directly.',
    bullets: [
      'Same candidate pool, screened repeatedly for new roles',
      'Placement volume rewards even small efficiency gains',
      'Existing databases of past applicants go mostly unused',
      'Willing to pay per placement, not just per seat'
    ],
    childIds: ['cust-staffing-reengagement']
  },
  'cust-staffing-reengagement': {
    id: 'cust-staffing-reengagement',
    kind: 'route',
    parentId: 'cust-staffing',
    title: 'Candidate Re-engagement',
    subtitle: 'Past applicants are an underused pool',
    reasoning:
      'Every staffing firm sits on a database of previously screened candidates. Automatically re-matching that pool against new requisitions turns a sunk cost into a sourcing advantage.',
    bullets: [
      'Screening work has already been done once',
      'Faster time-to-submit than fresh sourcing',
      'Improves fill rate on hard-to-place roles',
      'Differentiated from generic ATS re-sourcing tools'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'cust-enterprise': {
    id: 'cust-enterprise',
    kind: 'route',
    parentId: 'cat-customer',
    title: 'Enterprise Employers',
    subtitle: 'Thousands of applicants per requisition',
    reasoning:
      'Large employers are drowning in applicant volume for high-visibility roles. The pain is acute and budget already exists for recruiting tooling at this scale.',
    bullets: [
      'Applicant volume outpaces recruiter capacity',
      'Existing budget for recruiting software',
      'Procurement is slower but contracts are larger',
      'Crowded, competitive category'
    ],
    childIds: ['cust-enterprise-resume']
  },
  'cust-enterprise-resume': {
    id: 'cust-enterprise-resume',
    kind: 'route',
    parentId: 'cust-enterprise',
    title: 'Resume Screening at Scale',
    subtitle: 'Thousands of applicants per req',
    reasoning:
      'Automating first-pass resume screening for high-volume requisitions is a well-understood need with an established buying motion — but also the most contested part of the market.',
    bullets: [
      'Clear, quantifiable time savings per requisition',
      'Well-understood buying process for TA leaders',
      'Most crowded segment of the recruiting-tech market',
      'Differentiation depends on accuracy, not novelty'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'cust-smb': {
    id: 'cust-smb',
    kind: 'route',
    parentId: 'cat-customer',
    title: 'SMB Employers',
    subtitle: 'Infrequent, ad hoc hiring',
    reasoning:
      'Small businesses hire rarely and without dedicated recruiting staff, so the value has to come from removing the process entirely rather than optimizing a workflow they don’t already have.',
    bullets: [
      'No dedicated recruiting function to sell into',
      'Price-sensitive, low willingness to pay for tooling',
      'High volume of businesses, low value per account',
      'Better suited to a bundled or embedded product'
    ],
    childIds: [],
    isLeafRoute: true
  },

  // ----------------------------------------------------------------- PROBLEM
  'cat-problem': {
    id: 'cat-problem',
    kind: 'category',
    parentId: 'root',
    title: 'Problem',
    question: 'What pain could we go deeper on?',
    childIds: ['prob-speed', 'prob-noshow', 'prob-bias']
  },
  'prob-speed': {
    id: 'prob-speed',
    kind: 'route',
    parentId: 'cat-problem',
    title: 'Screening Speed',
    subtitle: 'Time-to-shortlist is the real bottleneck',
    reasoning:
      'Recruiters lose the most time between "applicant received" and "shortlist ready" — a step that is largely mechanical and well-suited to automation.',
    bullets: [
      'Most requisition time is lost before the first interview',
      'A mechanical step, not a judgment-heavy one',
      'Directly shortens time-to-fill, an easy ROI story',
      'Easy to demo and quantify in a sales cycle'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'prob-noshow': {
    id: 'prob-noshow',
    kind: 'route',
    parentId: 'cat-problem',
    title: 'Interview No-Show Rate',
    subtitle: 'Half of scheduled interviews never happen',
    reasoning:
      'Recruiting teams lose significant capacity to candidates who accept an interview slot and never show. Almost no recruiting software addresses this directly today.',
    bullets: [
      'A capacity problem, not just a screening one',
      'Underserved — most tools assume the candidate shows up',
      'Compounds every other inefficiency in the funnel',
      'Signal-rich: no-show patterns predict candidate intent'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'prob-bias': {
    id: 'prob-bias',
    kind: 'route',
    parentId: 'cat-problem',
    title: 'Bias & Compliance Exposure',
    subtitle: 'Screening decisions are legally sensitive',
    reasoning:
      'Automated screening introduces new legal exposure around adverse-impact and hiring-algorithm regulation. A product built around defensibility, not just speed, addresses a growing compliance mandate.',
    bullets: [
      'Emerging regulation specifically targets hiring algorithms',
      'Legal and HR both need to sign off, widening the buying committee',
      'Few competitors lead with defensibility as the core value prop',
      'Compliance budget is separate from recruiting-tools budget'
    ],
    childIds: [],
    isLeafRoute: true
  },

  // ----------------------------------------------------------------- PRODUCT
  'cat-product': {
    id: 'cat-product',
    kind: 'category',
    parentId: 'root',
    title: 'Product',
    question: 'What could we actually build?',
    childIds: ['prod-workflow', 'prod-assessment', 'prod-sourcing']
  },
  'prod-workflow': {
    id: 'prod-workflow',
    kind: 'route',
    parentId: 'cat-product',
    title: 'Workflow Automation Layer',
    subtitle: 'Sit inside existing ATS, not replace it',
    reasoning:
      'Recruiting teams have already invested in an ATS and resist switching systems of record. A layer that automates the screening step inside their existing stack lowers adoption friction dramatically.',
    bullets: [
      'No system-of-record migration required',
      'Faster sales cycle than a full ATS replacement',
      'Value is visible from week one, not after a rollout',
      'Positions the product as infrastructure, not another tool'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'prod-assessment': {
    id: 'prod-assessment',
    kind: 'route',
    parentId: 'cat-product',
    title: 'Structured Assessment Intelligence',
    subtitle: 'Turn interviews into comparable signal',
    reasoning:
      'Interview notes today are inconsistent and hard to compare across candidates. Structuring that signal turns screening into a defensible, comparable process rather than a subjective one.',
    bullets: [
      'Interview signal is currently unstructured and lost',
      'Comparable scoring supports better, faster decisions',
      'Creates a defensible record for compliance purposes',
      'Deepens the product beyond first-pass resume filtering'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'prod-sourcing': {
    id: 'prod-sourcing',
    kind: 'route',
    parentId: 'cat-product',
    title: 'Passive Sourcing Engine',
    subtitle: "Most candidates aren't applying anywhere",
    reasoning:
      'The strongest candidates for specialized roles are rarely active applicants. A sourcing layer that surfaces and pre-screens passive candidates extends the product upstream of the funnel.',
    bullets: [
      'Expands total addressable candidate pool',
      'Upstream positioning ahead of screening-only competitors',
      'Requires new sourcing data, a heavier technical lift',
      'Closer to a sales/prospecting tool than pure screening'
    ],
    childIds: [],
    isLeafRoute: true
  },

  // ------------------------------------------------------------------ MARKET
  'cat-market': {
    id: 'cat-market',
    kind: 'category',
    parentId: 'root',
    title: 'Market',
    question: 'Where else could this apply?',
    childIds: ['mkt-vertical', 'mkt-international']
  },
  'mkt-vertical': {
    id: 'mkt-vertical',
    kind: 'route',
    parentId: 'cat-market',
    title: 'Vertical Specialization',
    subtitle: 'Depth beats breadth in regulated hiring',
    reasoning:
      'Regulated industries — healthcare, finance, transportation — share a pattern: credential-heavy, compliance-driven hiring. Depth in one vertical builds a defensible moat that horizontal tools can’t easily copy.',
    bullets: [
      'Credential logic transfers cleanly across regulated verticals',
      'Vertical depth is harder for horizontal competitors to replicate',
      'Smaller addressable market per vertical, but higher willingness to pay',
      'Sales motion can reuse the same playbook per vertical'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'mkt-international': {
    id: 'mkt-international',
    kind: 'route',
    parentId: 'cat-market',
    title: 'International Expansion',
    subtitle: 'Screening rules change by geography',
    reasoning:
      'Employment screening regulation varies significantly by country, which is a real expansion opportunity but also a substantial compliance and localization burden before day one revenue.',
    bullets: [
      'Large expansion surface once the core product works',
      'Every new geography adds its own regulatory research',
      'Not a good place to start pre-product-market-fit',
      'Better framed as a later-stage expansion path, not a launch market'
    ],
    childIds: [],
    isLeafRoute: true
  },

  // ------------------------------------------------------------ BUSINESS MODEL
  'cat-business-model': {
    id: 'cat-business-model',
    kind: 'category',
    parentId: 'root',
    title: 'Business Model',
    question: 'How else could this make money?',
    childIds: ['biz-usage', 'biz-marketplace']
  },
  'biz-usage': {
    id: 'biz-usage',
    kind: 'route',
    parentId: 'cat-business-model',
    title: 'Usage-Based Pricing',
    subtitle: 'Pay per candidate screened, not per seat',
    reasoning:
      'Per-seat pricing penalizes exactly the hiring surges that make the product valuable. Pricing on screening volume aligns cost with the moments customers need the product most.',
    bullets: [
      'Aligns price with the value moment, not headcount',
      'Naturally scales revenue with hiring surges',
      'Easier to start small with a pilot team',
      'Revenue is less predictable quarter to quarter'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'biz-marketplace': {
    id: 'biz-marketplace',
    kind: 'route',
    parentId: 'cat-business-model',
    title: 'Marketplace Take Rate',
    subtitle: 'Get paid when a hire happens',
    reasoning:
      'A success-based fee tied to completed hires removes the upfront budget objection entirely, at the cost of a longer, less predictable path to revenue.',
    bullets: [
      'Zero upfront cost removes the main budget objection',
      'Revenue directly tracks customer outcomes',
      'Longer, lumpier path to predictable revenue',
      'Requires trust in the product before a single hire closes'
    ],
    childIds: [],
    isLeafRoute: true
  },

  // ------------------------------------------------------------- DISTRIBUTION
  'cat-distribution': {
    id: 'cat-distribution',
    kind: 'category',
    parentId: 'root',
    title: 'Distribution',
    question: 'How else could we reach customers?',
    childIds: ['dist-marketplace', 'dist-agency']
  },
  'dist-marketplace': {
    id: 'dist-marketplace',
    kind: 'route',
    parentId: 'cat-distribution',
    title: 'ATS Marketplace Partnerships',
    subtitle: 'Distribution through existing platforms',
    reasoning:
      'Every major ATS runs an app marketplace actively seeking screening integrations. Listing there gives access to a warm, already-qualified buyer base without building direct sales first.',
    bullets: [
      'Buyers arrive already using a compatible system',
      'Lowers customer acquisition cost versus direct sales',
      'Ties roadmap priorities to the partner’s platform',
      'Revenue share reduces margin on every deal'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'dist-agency': {
    id: 'dist-agency',
    kind: 'route',
    parentId: 'cat-distribution',
    title: 'Recruiting Agency Channel',
    subtitle: 'Agencies as a wedge into employers',
    reasoning:
      'Staffing and recruiting agencies already sell into the exact employers this product targets. Partnering with agencies turns them into a distribution channel rather than a competitor.',
    bullets: [
      'Agencies bring an existing book of employer relationships',
      'Faster path to enterprise logos than direct enterprise sales',
      'Channel conflict risk if the product also sells direct',
      'Margin shared with the channel on every account'
    ],
    childIds: [],
    isLeafRoute: true
  },

  // -------------------------------------------------------------- POSITIONING
  'cat-positioning': {
    id: 'cat-positioning',
    kind: 'category',
    parentId: 'root',
    title: 'Positioning',
    question: 'How else could we frame this?',
    childIds: ['pos-category', 'pos-compliance']
  },
  'pos-category': {
    id: 'pos-category',
    kind: 'route',
    parentId: 'cat-positioning',
    title: 'Category Creator',
    subtitle: 'Define "credential intelligence" as a category',
    reasoning:
      'Rather than competing as another recruiting tool, naming a new category around credential intelligence gives the product room to lead a conversation instead of joining one already crowded.',
    bullets: [
      'Avoids direct feature-for-feature comparison with incumbents',
      'Higher ceiling if the category framing takes hold',
      'Requires sustained investment in market education',
      'Slower initial traction than a familiar category pitch'
    ],
    childIds: [],
    isLeafRoute: true
  },
  'pos-compliance': {
    id: 'pos-compliance',
    kind: 'route',
    parentId: 'cat-positioning',
    title: 'Compliance-First Framing',
    subtitle: 'Sell risk reduction, not efficiency',
    reasoning:
      'Efficiency claims are easy for competitors to match. Framing the product around defensible, auditable screening speaks to a budget line — legal and compliance risk — that most recruiting tools ignore.',
    bullets: [
      'Risk reduction budget is separate from recruiting-tools budget',
      'Differentiates from efficiency-only competitor messaging',
      'Widens the buying committee to include legal and compliance',
      'Requires credible proof points, not just claims'
    ],
    childIds: [],
    isLeafRoute: true
  }
};

export const ROOT_ID = 'root';

// Snapshot of the original demo tree, kept as a fallback for when a live
// generation call fails (no API key configured, network error, etc).
const DEMO_NODES: Record<string, MapNode> = { ...NODES };

/** Replaces the exploration tree in place with a freshly generated one
 * (from api/explore.ts), so every module that reads NODES — the canvas,
 * the layout engine, route lookups — sees the new tree without needing to
 * be threaded a tree prop individually. */
export function loadGeneratedTree(tree: Record<string, MapNode>) {
  for (const key of Object.keys(NODES)) delete NODES[key];
  Object.assign(NODES, tree);
}

/** Restores the static NorthPeak demo tree — used as a fallback if a live
 * generation call fails. */
export function resetToDemoNodes() {
  loadGeneratedTree(DEMO_NODES);
}

export function getNode(id: string): MapNode | undefined {
  return NODES[id];
}

export function getChildren(id: string): MapNode[] {
  const node = NODES[id];
  if (!node) return [];
  return node.childIds.map((cid) => NODES[cid]).filter(Boolean);
}

export function getBreadcrumb(id: string): MapNode[] {
  const trail: MapNode[] = [];
  let current: MapNode | undefined = NODES[id];
  while (current) {
    trail.unshift(current);
    current = current.parentId ? NODES[current.parentId] : undefined;
  }
  return trail;
}

/** All route nodes (used to compute "possibilities explored" style counts) */
export const ALL_ROUTE_NODES = Object.values(NODES).filter((n) => n.kind === 'route');
export const ALL_LEAF_ROUTES = ALL_ROUTE_NODES.filter((n) => n.isLeafRoute);
