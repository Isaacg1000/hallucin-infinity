import { RouteDetailData } from '../types';
import { getCritique } from './critiqueCache';

// Full Route Detail records, keyed by leaf node id. The three routes used in
// the guided demo (Healthcare Credential Intelligence, Enterprise Resume
// Screening, Staffing Candidate Re-engagement) are written in depth; every
// other route a user can reach is fully real, just more concise.

export const ROUTE_DETAILS: Record<string, RouteDetailData> = {
  // ======================================================== DEMO ROUTE #1
  'cust-healthcare-ats': {
    nodeId: 'cust-healthcare-ats',
    name: 'Healthcare Credential Intelligence',
    thesis:
      'Instead of competing as another general-purpose recruiting platform, focus on automating credential verification and candidate qualification for healthcare employers — delivered as a layer inside the ATS they already use.',
    whyExists: [
      'Credential verification is the specific step healthcare talent teams name as their biggest bottleneck.',
      'The workflow is repetitive, rule-based, and high-stakes — exactly where automation earns trust fastest.',
      'A narrow, defensible wedge is easier to win than a broad recruiting platform competing on all fronts at once.'
    ],
    potentialCustomer: 'Directors of Talent Acquisition at large, multi-site hospital systems and healthcare networks.',
    problem:
      'Recruiters manually cross-check licenses, certifications, and registry status for every clinical hire, across multiple external databases, with real compliance risk if something is missed.',
    product:
      'A credential extraction and verification layer that reads candidate documents, checks them against relevant registries, and writes a qualification summary directly into the recruiter’s existing ATS.',
    businessModel: 'Per-seat or per-verification pricing sold to the talent acquisition and compliance teams jointly.',
    mvp: ['Candidate intake', 'Credential extraction', 'Verification workflow', 'Recruiter qualification summary'],
    upside: [
      'Clear, quantifiable time savings recruiters already understand and can champion internally',
      'Compliance framing widens the buying committee beyond talent acquisition alone',
      'A credentialing data asset that gets more valuable per employer over time'
    ],
    challenges: [
      'Hospital procurement and security review cycles run long',
      'Credential registries are fragmented and inconsistent across states and specialties',
      'Must prove reliability before any team will trust it with compliance-sensitive decisions'
    ],
    assumptions: [
      { id: 'a1', text: 'Hospitals experience enough pain to pay for a dedicated tool.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a2', text: 'Existing ATS products don’t solve this sufficiently on their own.', importance: 'High', status: 'Needs Research' },
      { id: 'a3', text: 'Credential data can be reliably accessed from source registries.', importance: 'Critical', status: 'Unknown' }
    ],
    unknowns: [
      'Willingness to pay as a standalone budget line',
      'Length of the security and procurement review cycle',
      'Depth of integration required per ATS vendor'
    ]
  },

  // ======================================================== DEMO ROUTE #2
  'cust-enterprise-resume': {
    nodeId: 'cust-enterprise-resume',
    name: 'Enterprise Resume Screening',
    thesis:
      'Compete directly in the largest, most established segment of recruiting technology: automated first-pass resume screening for enterprise employers managing high-volume requisitions.',
    whyExists: [
      'Enterprise TA teams already budget for recruiting software and understand this category well.',
      'Applicant volume for corporate roles routinely exceeds what recruiters can manually screen.',
      'The buying motion and success metrics are well established, which shortens the sales narrative.'
    ],
    potentialCustomer: 'VPs of Talent Acquisition at large corporate employers with centralized recruiting operations.',
    problem:
      'Recruiters can’t manually read thousands of applications per requisition, so strong candidates get missed or delayed while volume-heavy roles stay open longer than they should.',
    product:
      'An automated first-pass screening engine that ranks and shortlists applicants against a requisition’s criteria, with visible reasoning recruiters can review and override.',
    businessModel: 'Enterprise contract pricing, typically per seat or per requisition volume, sold through a direct sales motion.',
    mvp: ['Requisition criteria intake', 'Resume parsing and ranking', 'Recruiter review and override', 'Shortlist export'],
    upside: [
      'Large, well-funded market with an established buying process',
      'Quantifiable time-to-shortlist improvement is an easy ROI story',
      'Enterprise contracts are larger and stickier once adopted'
    ],
    challenges: [
      'The most crowded and heavily funded segment of recruiting technology',
      'Differentiation depends on screening accuracy, which is hard to prove pre-sale',
      'Enterprise procurement and security review cycles are long'
    ],
    assumptions: [
      { id: 'a1', text: 'Screening accuracy can meaningfully beat incumbent tools.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a2', text: 'Enterprise buyers will switch from an entrenched incumbent.', importance: 'Critical', status: 'Needs Research' },
      { id: 'a3', text: 'A new entrant can win enterprise trust without existing brand recognition.', importance: 'High', status: 'Unknown' }
    ],
    unknowns: [
      'Real switching cost from incumbent ATS screening features',
      'Whether accuracy claims will hold up under enterprise-scale evaluation',
      'Length of the enterprise sales cycle for a new vendor'
    ]
  },

  // ======================================================== DEMO ROUTE #3
  'cust-staffing-reengagement': {
    nodeId: 'cust-staffing-reengagement',
    name: 'Staffing Candidate Re-engagement',
    thesis:
      'Rather than sourcing new candidates, help staffing agencies automatically re-screen and re-activate their existing database of previously placed or previously screened candidates against new requisitions.',
    whyExists: [
      'Staffing firms already hold a large pool of previously screened candidates that goes mostly unused.',
      'Re-engaging a known candidate is faster and cheaper than sourcing a new one from scratch.',
      'Placement volume means even a small lift in fill rate has an outsized revenue effect.'
    ],
    potentialCustomer: 'Operations leads and branch managers at mid-sized staffing and recruiting agencies.',
    problem:
      'Agencies re-source candidates for every new requisition even when a qualified match already exists in their own database, wasting time and missing fast-turnaround placements.',
    product:
      'A matching layer that continuously scores an agency’s existing candidate database against new requisitions and surfaces qualified, already-screened matches automatically.',
    businessModel: 'Priced per successful placement or as a percentage of placement fee, aligning cost with agency revenue.',
    mvp: ['Candidate database ingestion', 'Requisition matching engine', 'Re-engagement outreach trigger', 'Placement tracking'],
    upside: [
      'Uses data agencies already own instead of requiring new sourcing spend',
      'Faster time-to-submit than sourcing candidates from scratch',
      'Placement-based pricing aligns directly with agency success'
    ],
    challenges: [
      'Candidate data quality varies significantly across agencies',
      'Candidates may have moved on or lost interest since last contact',
      'Agencies may be wary of a tool that touches their core candidate relationships'
    ],
    assumptions: [
      { id: 'a1', text: 'Agency candidate databases are large and current enough to be useful.', importance: 'Critical', status: 'Needs Research' },
      { id: 'a2', text: 'Re-engaged candidates convert to placements at a meaningful rate.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a3', text: 'Agencies are comfortable automating outreach to past candidates.', importance: 'Medium', status: 'Unknown' }
    ],
    unknowns: [
      'Actual re-engagement response and conversion rates',
      'How stale typical agency candidate databases really are',
      'Willingness to share candidate data with a third-party platform'
    ]
  },

  // ======================================================== OTHER ROUTES
  'cust-smb': {
    nodeId: 'cust-smb',
    name: 'SMB Hiring Concierge',
    thesis: 'Bundle screening into a fully managed, done-for-you hiring service for small businesses that have no dedicated recruiting function.',
    whyExists: ['SMBs hire too rarely to justify learning a self-serve tool.', 'The pain is the process itself, not a missing feature.', 'A managed service captures value a self-serve product would leave on the table.'],
    potentialCustomer: 'Owners and office managers at businesses under 200 employees hiring on an ad hoc basis.',
    problem: 'Small businesses have no one internally who owns hiring, so screening either doesn’t happen or happens badly.',
    product: 'A concierge intake form paired with automated screening, delivered as a finished shortlist rather than a tool to operate.',
    businessModel: 'Flat fee per open role, positioned as an alternative to a recruiting agency.',
    mvp: ['Simple role intake form', 'Automated screening pipeline', 'Delivered shortlist with summaries'],
    upside: ['Large volume of underserved businesses', 'Low switching cost since there’s no incumbent tool to displace'],
    challenges: ['Low willingness to pay for tooling at this segment', 'High-touch service model is harder to scale than software'],
    assumptions: [
      { id: 'a1', text: 'SMBs will pay a flat fee comparable to partial agency cost.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a2', text: 'Screening quality can stay high without a human recruiter in the loop.', importance: 'High', status: 'Unknown' }
    ],
    unknowns: ['True willingness to pay at this segment', 'Whether service costs scale sublinearly with volume']
  },

  'prob-speed': {
    nodeId: 'prob-speed',
    name: 'Instant Shortlist Engine',
    thesis: 'Focus the entire product on collapsing time-to-shortlist — the single largest source of delay in the hiring funnel — rather than any one customer segment.',
    whyExists: ['Recruiters consistently cite the gap between applications received and a usable shortlist as their biggest time loss.', 'It is a mechanical step, well suited to automation, with an easy-to-demo before/after.'],
    potentialCustomer: 'Recruiting teams of any size feeling the pinch of application volume outpacing review capacity.',
    problem: 'Applications pile up faster than recruiters can review them, so strong candidates wait — or get missed entirely.',
    product: 'A drop-in screening layer that turns a pile of applications into a ranked, explainable shortlist within minutes of a requisition opening.',
    businessModel: 'Usage-based pricing tied to requisitions processed.',
    mvp: ['Applicant ingestion', 'Ranking against requisition criteria', 'Explainable shortlist output'],
    upside: ['Easy to demo — before/after time-to-shortlist is immediate and visible', 'Segment-agnostic, broadens the addressable market'],
    challenges: ['Speed alone is easy for incumbents to copy', 'Without a specific wedge customer, sales motion is undifferentiated'],
    assumptions: [
      { id: 'a1', text: 'Speed is the binding constraint, not screening quality.', importance: 'Critical', status: 'Needs Research' },
      { id: 'a2', text: 'Buyers will adopt based on speed alone without deeper differentiation.', importance: 'High', status: 'Unvalidated' }
    ],
    unknowns: ['Whether speed alone justifies a purchase decision', 'How incumbents will respond once matched on speed']
  },

  'prob-noshow': {
    nodeId: 'prob-noshow',
    name: 'Interview Reliability Layer',
    thesis: 'Build the product around reducing interview no-shows — an underserved capacity problem — rather than screening speed or volume.',
    whyExists: ['A meaningful share of scheduled interviews never happen, quietly eating recruiter capacity.', 'Almost no recruiting software addresses this directly today.'],
    potentialCustomer: 'Recruiting operations leads managing high interview volume across a distributed team.',
    problem: 'Recruiters lose hours to candidates who accept an interview slot and never show, with no early warning signal.',
    product: 'A predictive layer that scores show-up likelihood at scheduling time and automates confirmation and re-engagement nudges.',
    businessModel: 'Add-on pricing to an existing recruiting stack, priced per interview scheduled.',
    mvp: ['Show-up likelihood scoring', 'Automated confirmation nudges', 'No-show pattern reporting'],
    upside: ['Underserved problem with little direct competition', 'Recovered recruiter capacity is easy to quantify'],
    challenges: ['Smaller, less obvious pain than screening speed', 'Requires historical interview data to train a useful signal'],
    assumptions: [
      { id: 'a1', text: 'No-show rate is high enough to justify a dedicated tool.', importance: 'Critical', status: 'Needs Research' },
      { id: 'a2', text: 'Show-up likelihood can be predicted with usable accuracy.', importance: 'High', status: 'Unknown' }
    ],
    unknowns: ['Actual no-show rates across target segments', 'Whether nudges meaningfully change candidate behavior']
  },

  'prob-bias': {
    nodeId: 'prob-bias',
    name: 'Defensible Screening Audit Trail',
    thesis: 'Lead with legal defensibility and compliance rather than efficiency — an auditable record of every automated screening decision.',
    whyExists: ['Regulation increasingly targets automated hiring decisions specifically.', 'Legal and HR both need to sign off on screening tools, widening the buying committee.'],
    potentialCustomer: 'General counsel and Heads of HR at employers with legal exposure to hiring-algorithm regulation.',
    problem: 'Employers using any automated screening face growing legal risk with no clear audit trail justifying decisions.',
    product: 'A compliance layer that documents and explains every automated screening decision in a form that satisfies legal review.',
    businessModel: 'Sold as risk-reduction software, priced against legal/compliance budget rather than recruiting-tools budget.',
    mvp: ['Decision logging', 'Explainability report per candidate', 'Adverse-impact monitoring dashboard'],
    upside: ['Separate, often larger budget line than recruiting tools', 'Differentiated positioning most competitors ignore'],
    challenges: ['Requires credible legal proof points, not just claims', 'Longer sales cycle involving legal stakeholders'],
    assumptions: [
      { id: 'a1', text: 'Legal teams will champion a recruiting-adjacent purchase.', importance: 'Critical', status: 'Unknown' },
      { id: 'a2', text: 'Regulatory pressure is acute enough to force near-term action.', importance: 'High', status: 'Mixed' }
    ],
    unknowns: ['Pace and specificity of upcoming hiring-algorithm regulation', 'Whether legal or HR ultimately owns the purchase decision']
  },

  'prod-workflow': {
    nodeId: 'prod-workflow',
    name: 'ATS-Native Automation Layer',
    thesis: 'Build purely as an automation layer inside existing ATS platforms rather than a standalone product, minimizing adoption friction.',
    whyExists: ['Recruiting teams resist switching systems of record.', 'A layer that lives inside the ATS they already use removes the biggest adoption objection outright.'],
    potentialCustomer: 'Recruiting teams already standardized on a major ATS, looking to automate without changing systems.',
    problem: 'Point solutions require recruiters to leave their system of record, which suppresses adoption regardless of the value delivered.',
    product: 'An embedded automation layer that reads and writes directly inside the customer’s existing ATS via integration.',
    businessModel: 'Per-seat pricing sold alongside, not instead of, the customer’s existing ATS contract.',
    mvp: ['ATS integration for one major platform', 'In-workflow screening automation', 'No new interface for recruiters to learn'],
    upside: ['Dramatically lower adoption friction', 'Positions the product as infrastructure rather than another tool to manage'],
    challenges: ['Dependent on ATS vendors’ integration APIs and goodwill', 'Harder to differentiate visually since it has no standalone interface'],
    assumptions: [
      { id: 'a1', text: 'Target ATS platforms expose sufficient integration access.', importance: 'Critical', status: 'Needs Research' },
      { id: 'a2', text: 'Recruiters prefer an embedded experience over a standalone product.', importance: 'Medium', status: 'Supported' }
    ],
    unknowns: ['Integration depth actually available per ATS vendor', 'Risk of an ATS vendor building the same feature natively']
  },

  'prod-assessment': {
    nodeId: 'prod-assessment',
    name: 'Structured Interview Intelligence',
    thesis: 'Focus the product on structuring interview signal into comparable, defensible scores rather than automating the earlier resume-screening step.',
    whyExists: ['Interview notes today are inconsistent and hard to compare across candidates.', 'Structured, comparable signal supports faster and more defensible hiring decisions.'],
    potentialCustomer: 'Hiring managers and recruiting teams conducting structured interview loops for specialized roles.',
    problem: 'Interview feedback is unstructured, inconsistent between interviewers, and hard to compare when deciding between finalists.',
    product: 'A structured interview capture and scoring tool that normalizes feedback into comparable signal across interviewers.',
    businessModel: 'Per-seat pricing sold to hiring teams as an add-on to existing interview scheduling tools.',
    mvp: ['Structured interview templates', 'Feedback capture and normalization', 'Comparable candidate scorecards'],
    upside: ['Deepens the product beyond first-pass filtering, closer to the final hiring decision', 'Creates a defensible record of how decisions were made'],
    challenges: ['Requires interviewer behavior change, which is slow to adopt', 'Harder to demo a clear before/after than pure speed gains'],
    assumptions: [
      { id: 'a1', text: 'Interviewers will adopt structured templates consistently.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a2', text: 'Comparable scoring measurably improves decision quality.', importance: 'High', status: 'Unknown' }
    ],
    unknowns: ['Actual interviewer compliance with structured formats', 'Whether better structure changes final hiring outcomes']
  },

  'prod-sourcing': {
    nodeId: 'prod-sourcing',
    name: 'Passive Talent Sourcing Engine',
    thesis: 'Move upstream of screening entirely and build a sourcing engine that surfaces and pre-screens passive candidates who never apply.',
    whyExists: ['The strongest candidates for specialized roles are rarely active applicants.', 'A sourcing layer extends the product ahead of screening-only competitors.'],
    potentialCustomer: 'Talent teams hiring for specialized or senior roles where the active applicant pool is thin.',
    problem: 'Relying only on inbound applicants misses the strongest candidates, who are rarely actively job-searching.',
    product: 'A sourcing engine that identifies, pre-screens, and ranks passive candidates against open requisitions before they ever apply.',
    businessModel: 'Per-seat or per-search pricing, positioned closer to a sourcing tool than a screening tool.',
    mvp: ['Passive candidate identification', 'Pre-screening against requisition criteria', 'Outreach-ready candidate summaries'],
    upside: ['Expands the addressable candidate pool meaningfully', 'Differentiated from screening-only competitors'],
    challenges: ['Requires new sourcing data infrastructure, a heavier technical lift', 'Closer to a prospecting tool, a more crowded adjacent category'],
    assumptions: [
      { id: 'a1', text: 'Reliable passive candidate data is accessible at reasonable cost.', importance: 'Critical', status: 'Unknown' },
      { id: 'a2', text: 'Passive candidates respond to automated outreach at a useful rate.', importance: 'High', status: 'Unvalidated' }
    ],
    unknowns: ['Cost and reliability of passive candidate data sources', 'Response rates to automated outreach at this seniority level']
  },

  'mkt-vertical': {
    nodeId: 'mkt-vertical',
    name: 'Vertical Recruiting Suite',
    thesis: 'Build a family of credential-aware screening products, each purpose-built for a single regulated vertical beyond healthcare.',
    whyExists: ['Regulated industries share a pattern: credential-heavy, compliance-driven hiring.', 'Vertical depth is harder for horizontal competitors to replicate quickly.'],
    potentialCustomer: 'Talent teams in finance, transportation, and other credential-heavy regulated industries.',
    problem: 'Each regulated vertical has its own credentialing rules that horizontal recruiting tools handle poorly or not at all.',
    product: 'A configurable credentialing and screening engine with vertical-specific rule sets for finance, transportation, and similar industries.',
    businessModel: 'Vertical-specific pricing tiers, sold by a specialized sales motion per industry.',
    mvp: ['Configurable credential rule engine', 'First vertical pack beyond healthcare', 'Vertical-specific compliance reporting'],
    upside: ['Reuses the credentialing engine across verticals', 'Higher willingness to pay in regulated segments'],
    challenges: ['Each new vertical requires fresh regulatory research', 'Smaller addressable market per individual vertical'],
    assumptions: [
      { id: 'a1', text: 'The credentialing engine generalizes across verticals with modest rework.', importance: 'High', status: 'Needs Research' },
      { id: 'a2', text: 'Each target vertical has similar willingness to pay as healthcare.', importance: 'Medium', status: 'Unknown' }
    ],
    unknowns: ['Actual engineering cost to add a new vertical', 'Whether other verticals value credentialing as highly as healthcare does']
  },

  'mkt-international': {
    nodeId: 'mkt-international',
    name: 'Cross-Border Screening Compliance',
    thesis: 'Expand the product internationally by building localized screening compliance for employers hiring across multiple countries.',
    whyExists: ['Employment screening regulation varies significantly by country.', 'A large expansion surface exists once the core product is proven.'],
    potentialCustomer: 'Multinational employers coordinating hiring compliance across several countries.',
    problem: 'Screening rules, required checks, and data handling requirements differ by country, forcing manual localization today.',
    product: 'A compliance configuration layer that applies the correct screening rules automatically based on hiring location.',
    businessModel: 'Enterprise pricing tiered by number of countries covered.',
    mvp: ['Rule configuration per country', 'Localized screening workflows', 'Cross-border compliance reporting'],
    upside: ['Large expansion surface for an already-proven core product', 'Sticky once embedded in multinational compliance processes'],
    challenges: ['Substantial localization and regulatory research burden', 'Not a viable pre-product-market-fit starting point'],
    assumptions: [
      { id: 'a1', text: 'Core product achieves domestic product-market fit first.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a2', text: 'Regulatory research cost per country is manageable at scale.', importance: 'High', status: 'Unknown' }
    ],
    unknowns: ['True cost to localize per country', 'Demand concentration across specific target countries']
  },

  'biz-usage': {
    nodeId: 'biz-usage',
    name: 'Usage-Based Screening Pricing',
    thesis: 'Price the product on candidates screened rather than seats, so revenue scales naturally with each customer’s hiring volume.',
    whyExists: ['Per-seat pricing penalizes exactly the hiring surges that make the product most valuable.', 'Usage pricing aligns cost with the moment customers get the most value.'],
    potentialCustomer: 'Any target segment, applied as a pricing model rather than a customer choice.',
    problem: 'Seat-based pricing creates a mismatch: customers pay the same whether they’re hiring for two roles or two hundred.',
    product: 'The same core screening product, metered and billed by candidates screened or requisitions processed.',
    businessModel: 'Usage-based billing, likely with a base platform fee plus consumption pricing.',
    mvp: ['Usage metering infrastructure', 'Transparent usage dashboard for customers', 'Billing tied to screening volume'],
    upside: ['Easier to start with a small pilot and grow', 'Revenue naturally tracks customer hiring cycles'],
    challenges: ['Less predictable revenue than flat subscription pricing', 'Customers may be wary of unpredictable bills'],
    assumptions: [
      { id: 'a1', text: 'Customers prefer usage pricing over predictable flat fees.', importance: 'High', status: 'Mixed' },
      { id: 'a2', text: 'Usage-based revenue is stable enough to plan around at scale.', importance: 'Medium', status: 'Unknown' }
    ],
    unknowns: ['Customer preference between usage and flat pricing', 'Revenue predictability once at meaningful scale']
  },

  'biz-marketplace': {
    nodeId: 'biz-marketplace',
    name: 'Placement-Based Marketplace',
    thesis: 'Charge only when a screened candidate is actually hired, removing the upfront budget objection entirely.',
    whyExists: ['A success-based fee removes the main objection to trying a new vendor.', 'Revenue directly tracks the outcome customers actually care about.'],
    potentialCustomer: 'Budget-constrained employers or agencies hesitant to commit to upfront software spend.',
    problem: 'Buyers hesitate to commit budget to unproven recruiting software before seeing results.',
    product: 'The same screening product, offered with no upfront cost and a fee triggered only on a completed hire.',
    businessModel: 'Success fee per completed placement, similar to contingency recruiting economics.',
    mvp: ['Free-to-start onboarding', 'Placement tracking and attribution', 'Success-fee billing on confirmed hires'],
    upside: ['Zero upfront cost dramatically lowers the barrier to trying the product', 'Revenue is directly tied to delivered outcomes'],
    challenges: ['Longer, lumpier path to predictable revenue', 'Requires trust in the product before any revenue closes'],
    assumptions: [
      { id: 'a1', text: 'Enough trial customers convert to a paid placement to sustain the model.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a2', text: 'Placement attribution can be tracked reliably and disputes avoided.', importance: 'High', status: 'Unknown' }
    ],
    unknowns: ['Trial-to-placement conversion rate', 'Operational cost of attributing and collecting success fees']
  },

  'dist-marketplace': {
    nodeId: 'dist-marketplace',
    name: 'ATS App-Store Distribution',
    thesis: 'Distribute primarily through ATS platform marketplaces rather than building a direct sales team from day one.',
    whyExists: ['Every major ATS runs a marketplace actively seeking screening integrations.', 'This gives access to a warm, pre-qualified buyer base without direct sales infrastructure.'],
    potentialCustomer: 'Any customer already using a major ATS with an active app marketplace.',
    problem: 'Building direct sales and demand generation from scratch is slow and capital-intensive for an early-stage product.',
    product: 'The core screening product, packaged as a listed integration inside one or more ATS marketplaces.',
    businessModel: 'Standard subscription or usage pricing, with a revenue share paid to the marketplace platform.',
    mvp: ['Marketplace-compliant integration', 'Self-serve install and onboarding flow', 'In-marketplace listing and support'],
    upside: ['Lower customer acquisition cost than direct sales', 'Buyers arrive pre-qualified and already using a compatible system'],
    challenges: ['Product roadmap becomes partly dependent on the platform’s priorities', 'Revenue share reduces margin on every deal'],
    assumptions: [
      { id: 'a1', text: 'Marketplace listings generate meaningful, not just token, deal flow.', importance: 'Critical', status: 'Needs Research' },
      { id: 'a2', text: 'Revenue share economics remain sustainable at scale.', importance: 'Medium', status: 'Unknown' }
    ],
    unknowns: ['Actual lead volume marketplace listings tend to generate', 'Long-term stability of platform partnership terms']
  },

  'dist-agency': {
    nodeId: 'dist-agency',
    name: 'Agency-Led Channel Strategy',
    thesis: 'Sell through recruiting and staffing agencies as a channel, turning them into distribution partners rather than competitors.',
    whyExists: ['Agencies already have relationships with exactly the employers this product targets.', 'A channel motion can reach enterprise logos faster than direct enterprise sales.'],
    potentialCustomer: 'Recruiting and staffing agencies willing to resell or co-sell the product to their employer clients.',
    problem: 'Direct enterprise sales cycles are slow, and this product has no existing relationships with target employers.',
    product: 'The core screening product, packaged with partner tooling, co-branding, and revenue-share terms for agency resale.',
    businessModel: 'Partner revenue share or referral fee model, structured around agency-led deals.',
    mvp: ['Partner onboarding and enablement materials', 'Co-branded product experience', 'Referral and revenue-share tracking'],
    upside: ['Faster path to enterprise logos than cold direct sales', 'Leverages relationships that already exist'],
    challenges: ['Channel conflict risk if the product also sells direct', 'Less control over how the product is positioned to end customers'],
    assumptions: [
      { id: 'a1', text: 'Agencies see enough incentive to actively champion the product.', importance: 'Critical', status: 'Unvalidated' },
      { id: 'a2', text: 'Channel and direct sales motions can coexist without conflict.', importance: 'Medium', status: 'Unknown' }
    ],
    unknowns: ['Agency willingness to prioritize a new partner product', 'Actual channel conflict once direct sales also exists']
  },

  'pos-category': {
    nodeId: 'pos-category',
    name: 'Category-Defining Positioning',
    thesis: 'Position the product as the creator of a new category — "credential intelligence" — rather than competing inside the existing recruiting-software category.',
    whyExists: ['Avoids direct feature-for-feature comparison with entrenched incumbents.', 'A defined category gives room to lead a conversation instead of joining a crowded one.'],
    potentialCustomer: 'Early-adopter buyers receptive to new frameworks, typically at forward-leaning organizations.',
    problem: 'Competing inside an existing, crowded category forces constant feature comparison against well-funded incumbents.',
    product: 'The same core product, but marketed, named, and framed around a newly defined category rather than existing recruiting-tool terms.',
    businessModel: 'Standard subscription pricing, with go-to-market investment weighted toward category education.',
    mvp: ['Category-defining messaging and positioning', 'Content and thought leadership establishing the frame', 'Product experience that visibly matches the new category claim'],
    upside: ['Higher ceiling if the category framing takes hold in the market', 'Differentiated from every competitor still speaking the old category’s language'],
    challenges: ['Requires sustained investment in market education', 'Slower initial traction than a familiar, easy-to-pitch category'],
    assumptions: [
      { id: 'a1', text: 'The market is receptive to a new category framing rather than familiar comparisons.', importance: 'High', status: 'Unknown' },
      { id: 'a2', text: 'Enough budget exists to sustain a category-education go-to-market motion.', importance: 'Critical', status: 'Unvalidated' }
    ],
    unknowns: ['How long category education takes to produce pipeline', 'Whether buyers evaluate the product on old-category terms regardless']
  },

  'pos-compliance': {
    nodeId: 'pos-compliance',
    name: 'Risk-Reduction Positioning',
    thesis: 'Lead every sales and marketing conversation with risk reduction and defensibility rather than efficiency or speed.',
    whyExists: ['Efficiency claims are easy for competitors to match.', 'Risk reduction speaks to a budget line most recruiting tools ignore entirely.'],
    potentialCustomer: 'Risk-averse buyers — often legal, compliance, or HR leadership — at regulated or exposure-sensitive employers.',
    problem: 'Most recruiting-tool marketing competes on speed and efficiency, a message that is easy to match and doesn’t address legal exposure.',
    product: 'The same core screening product, positioned and packaged around auditability and defensibility rather than speed.',
    businessModel: 'Standard subscription pricing, sold against risk/compliance budget rather than recruiting-tools budget.',
    mvp: ['Audit trail and explainability features foregrounded in the product', 'Compliance-oriented messaging and sales materials', 'Reference case studies framed around risk reduction'],
    upside: ['Differentiates from efficiency-only competitor messaging', 'Speaks to a budget line most competitors ignore'],
    challenges: ['Requires credible proof points, not just positioning claims', 'Longer sales cycle involving legal and compliance stakeholders'],
    assumptions: [
      { id: 'a1', text: 'Risk-reduction framing resonates more than efficiency framing with target buyers.', importance: 'High', status: 'Unknown' },
      { id: 'a2', text: 'Legal and compliance stakeholders can be reached through standard go-to-market channels.', importance: 'Medium', status: 'Needs Research' }
    ],
    unknowns: ['Whether risk framing actually shortens or lengthens the sales cycle', 'Which buying persona ultimately controls budget for this framing']
  }
};

export function getRouteDetail(nodeId: string): RouteDetailData | undefined {
  if (ROUTE_DETAILS[nodeId]) return ROUTE_DETAILS[nodeId];
  return getCritique(nodeId)?.routeDetail;
}
