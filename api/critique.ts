// Vercel serverless function (Node.js runtime) — the Critic.
//
// Per the "Dreamer and Critic" model this product is built around: the
// Dreamer (api/explore.ts) generates wide, deliberately divergent routes.
// The Critic's job is the opposite — take ONE route and stress-test it
// against real-world constraints (market size, differentiation, capital,
// competitive intensity, speed to MVP) and produce a grounded evidence-for/
// evidence-against case, tagged so nothing reads as more certain than it
// actually is. This is deliberately a separate call from Explore: divergent
// generation and critical evaluation are different jobs and conflating them
// in one prompt biases the Dreamer step toward caution.

import { Type } from '@google/genai';
import { createGenAIClient } from './_lib/genai.js';

interface ContextAnswers {
  goals: string[];
  audience: string;
  priorities: string[];
  constraints: string;
  decided: string;
}

interface RouteInput {
  id: string;
  title: string;
  subtitle?: string;
  reasoning?: string;
  bullets?: string[];
  categoryTitle?: string;
  categoryQuestion?: string;
}

interface CritiqueRequestBody {
  ideaText: string;
  contextAnswers?: ContextAnswers | null;
  route: RouteInput;
}

type Importance = 'Critical' | 'High' | 'Medium';
type AssumptionStatus = 'Unvalidated' | 'Needs Research' | 'Supported' | 'Mixed' | 'Unknown';
type RatingLevel = 'Very High' | 'High' | 'Medium' | 'Low';
type Relevance = 'High' | 'Medium' | 'Low';
type ValidationVerdict = 'Promising' | 'Worth Testing' | 'Weak Signal' | 'Not Yet';

interface GeneratedCritique {
  routeDetail: {
    thesis: string;
    whyExists: string[];
    potentialCustomer: string;
    problem: string;
    product: string;
    businessModel: string;
    mvp: string[];
    upside: string[];
    challenges: string[];
    assumptions: { text: string; importance: Importance; status: AssumptionStatus }[];
    unknowns: string[];
  };
  comparison: Record<
    'marketPotential' | 'differentiation' | 'speedToMvp' | 'capitalRequired' | 'competitiveIntensity' | 'evidenceStrength',
    { level: RatingLevel; why: string }
  >;
  validation: {
    assessmentLabel: string;
    evidenceFor: { claim: string; evidence: string; source: string; relevance: Relevance; date: string }[];
    evidenceAgainst: { claim: string; evidence: string; source: string; relevance: Relevance; date: string }[];
    finalAssessment: ValidationVerdict;
    finalExplanation: string;
  };
}

const RATING_LEVELS = ['Very High', 'High', 'Medium', 'Low'];
const IMPORTANCE_LEVELS = ['Critical', 'High', 'Medium'];
const ASSUMPTION_STATUSES = ['Unvalidated', 'Needs Research', 'Supported', 'Mixed', 'Unknown'];
const RELEVANCE_LEVELS = ['High', 'Medium', 'Low'];
const VERDICTS = ['Promising', 'Worth Testing', 'Weak Signal', 'Not Yet'];

// Gemini's structured-output schema (a subset of OpenAPI 3.0) forces the
// response to be valid JSON matching this shape — same role Claude's
// forced tool_use played, but simpler since it's just JSON. Cardinality
// (e.g. 2-4 assumptions) is reinforced in the prompt text since
// responseSchema's array bounds aren't reliably enforced by the API.
const EVIDENCE_ITEM_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    claim: { type: Type.STRING, description: 'One specific claim, stated plainly' },
    evidence: { type: Type.STRING, description: '1-2 sentences of reasoning or context supporting/undermining the claim' },
    source: {
      type: Type.STRING,
      description:
        'Where this comes from. If you cannot cite a specific, real, verifiable source, use exactly ' +
        '"Model reasoning — not independently verified". NEVER invent a specific study name, company name, ' +
        'statistic, or publication you cannot verify is real — fabricated citations are worse than none.'
    },
    relevance: { type: Type.STRING, enum: RELEVANCE_LEVELS },
    date: { type: Type.STRING, description: 'Approximate date/period if genuinely known, otherwise "—"' }
  },
  required: ['claim', 'evidence', 'source', 'relevance', 'date']
};

const RATING_SCHEMA = {
  type: Type.OBJECT,
  properties: { level: { type: Type.STRING, enum: RATING_LEVELS }, why: { type: Type.STRING } },
  required: ['level', 'why']
};

const ROUTE_DETAIL_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    thesis: { type: Type.STRING, description: 'One or two sentences: the core bet this route is making' },
    whyExists: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-4 concrete reasons this route is worth considering, specific to this idea'
    },
    potentialCustomer: { type: Type.STRING, description: 'Who specifically would buy/use this, in one phrase' },
    problem: { type: Type.STRING, description: 'The specific problem this route addresses, 1-2 sentences' },
    product: { type: Type.STRING, description: 'What gets built, described concretely, 1-2 sentences' },
    businessModel: { type: Type.STRING, description: 'How this makes money, 1 sentence' },
    mvp: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-5 concrete scope items for a minimum viable version'
    },
    upside: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2-4 specific reasons this could work well' },
    challenges: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-4 specific, real obstacles — not generic startup risk'
    },
    assumptions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: 'One assumption that must hold true for this route to work' },
          importance: { type: Type.STRING, enum: IMPORTANCE_LEVELS },
          status: { type: Type.STRING, enum: ASSUMPTION_STATUSES }
        },
        required: ['text', 'importance', 'status']
      },
      description: '2-4 assumptions'
    },
    unknowns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '2-4 specific open questions that would need answering'
    }
  },
  required: [
    'thesis',
    'whyExists',
    'potentialCustomer',
    'problem',
    'product',
    'businessModel',
    'mvp',
    'upside',
    'challenges',
    'assumptions',
    'unknowns'
  ]
};

const COMPARISON_SCHEMA = {
  type: Type.OBJECT,
  description:
    'Rate this route on each dimension relative to plausible alternative directions for this idea, ' +
    'not in the abstract. For capitalRequired and competitiveIntensity, Low is favorable; for the ' +
    'other four dimensions, higher is favorable.',
  properties: {
    marketPotential: RATING_SCHEMA,
    differentiation: RATING_SCHEMA,
    speedToMvp: RATING_SCHEMA,
    capitalRequired: RATING_SCHEMA,
    competitiveIntensity: RATING_SCHEMA,
    evidenceStrength: RATING_SCHEMA
  },
  required: ['marketPotential', 'differentiation', 'speedToMvp', 'capitalRequired', 'competitiveIntensity', 'evidenceStrength']
};

const VALIDATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    assessmentLabel: { type: Type.STRING, description: 'Short label, e.g. "Promising — Key Unknowns Remain"' },
    evidenceFor: { type: Type.ARRAY, items: EVIDENCE_ITEM_SCHEMA, description: '2-3 items' },
    evidenceAgainst: { type: Type.ARRAY, items: EVIDENCE_ITEM_SCHEMA, description: '2-3 items' },
    finalAssessment: { type: Type.STRING, enum: VERDICTS },
    finalExplanation: { type: Type.STRING, description: '1-3 sentences: the honest bottom line, including what would change the verdict' }
  },
  required: ['assessmentLabel', 'evidenceFor', 'evidenceAgainst', 'finalAssessment', 'finalExplanation']
};

const CRITIQUE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    routeDetail: ROUTE_DETAIL_SCHEMA,
    comparison: COMPARISON_SCHEMA,
    validation: VALIDATION_SCHEMA
  },
  required: ['routeDetail', 'comparison', 'validation']
};

function buildPrompt(ideaText: string, contextAnswers: ContextAnswers | null | undefined, route: RouteInput): string {
  const lines = [
    `The overall idea being explored: "${ideaText}"`,
    route.categoryTitle ? `This route sits under the direction: "${route.categoryTitle}"${route.categoryQuestion ? ` (${route.categoryQuestion})` : ''}` : '',
    `The specific route to critique: "${route.title}"${route.subtitle ? ` — ${route.subtitle}` : ''}`,
    route.reasoning ? `Initial reasoning for this route: ${route.reasoning}` : '',
    route.bullets?.length ? `Initial notes: ${route.bullets.join('; ')}` : ''
  ].filter(Boolean);

  if (contextAnswers) {
    if (contextAnswers.goals?.length) lines.push(`What they're hoping to accomplish: ${contextAnswers.goals.join(', ')}`);
    if (contextAnswers.audience) lines.push(`Who they're currently thinking about serving: ${contextAnswers.audience}`);
    if (contextAnswers.priorities?.length) lines.push(`What matters most to them: ${contextAnswers.priorities.join(', ')}`);
    if (contextAnswers.constraints) lines.push(`Constraints: ${contextAnswers.constraints}`);
  }

  lines.push(
    '',
    'You are the Critic, not the Dreamer. Your job is to stress-test this one route against real-world ' +
      'constraints, not to sell it. Be honest and specific — include genuine tradeoffs and real reasons this ' +
      'could fail, not just supportive framing. Ground every rating in the "why" field with reasoning specific ' +
      'to this route, not generic startup commentary. For evidence, only cite a specific real source (a named ' +
      'study, report, or well-established public fact) if you are actually confident it is real and accurate — ' +
      'otherwise say plainly that this is model reasoning, not a verified source. Do not invent statistics, ' +
      'company names, or studies.'
  );

  return lines.join('\n');
}

export async function POST(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const clientResult = createGenAIClient();
  if ('error' in clientResult) {
    return new Response(JSON.stringify({ error: clientResult.error }), { status: 500 });
  }

  let body: CritiqueRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const ideaText = (body.ideaText ?? '').trim();
  const route = body.route;
  if (!ideaText || !route?.id || !route?.title) {
    return new Response(JSON.stringify({ error: 'ideaText and route (with id and title) are required' }), { status: 400 });
  }
  if (ideaText.length > 2000) {
    return new Response(JSON.stringify({ error: 'ideaText is too long' }), { status: 400 });
  }

  const ai = clientResult.client;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildPrompt(ideaText, body.contextAnswers, route),
      config: {
        responseMimeType: 'application/json',
        responseSchema: CRITIQUE_SCHEMA
      }
    });

    const text = response.text;
    if (!text) {
      return new Response(JSON.stringify({ error: 'Model did not return a structured critique' }), { status: 502 });
    }

    let result: GeneratedCritique;
    try {
      result = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: 'Model returned invalid JSON' }), { status: 502 });
    }
    if (!result?.routeDetail || !result?.comparison || !result?.validation) {
      return new Response(JSON.stringify({ error: 'Model returned an incomplete critique' }), { status: 502 });
    }

    const assumptions = result.routeDetail.assumptions.map((a, i) => ({ id: `${route.id}-a${i}`, ...a }));

    const routeDetail = {
      nodeId: route.id,
      name: route.title,
      ...result.routeDetail,
      assumptions
    };

    const validation = {
      nodeId: route.id,
      assessmentLabel: result.validation.assessmentLabel,
      evidenceFor: result.validation.evidenceFor.map((e, i) => ({ id: `${route.id}-ef${i}`, ...e })),
      evidenceAgainst: result.validation.evidenceAgainst.map((e, i) => ({ id: `${route.id}-ea${i}`, ...e })),
      assumptionLedger: assumptions,
      unknowns: result.routeDetail.unknowns,
      finalAssessment: result.validation.finalAssessment,
      finalExplanation: result.validation.finalExplanation
    };

    return new Response(
      JSON.stringify({ routeDetail, comparison: result.comparison, validation }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error calling Gemini';
    return new Response(JSON.stringify({ error: message }), { status: 502 });
  }
}
