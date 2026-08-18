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
//
// Same runtime constraints as explore.ts: NOT Edge (the Anthropic SDK's
// dependency tree touches node:fs/node:path).

import Anthropic from '@anthropic-ai/sdk';

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

const EVIDENCE_ITEM_SCHEMA = {
  type: 'object',
  properties: {
    claim: { type: 'string', description: 'One specific claim, stated plainly' },
    evidence: { type: 'string', description: '1-2 sentences of reasoning or context supporting/undermining the claim' },
    source: {
      type: 'string',
      description:
        'Where this comes from. If you cannot cite a specific, real, verifiable source, use exactly ' +
        '"Model reasoning — not independently verified". NEVER invent a specific study name, company name, ' +
        'statistic, or publication you cannot verify is real — fabricated citations are worse than none.'
    },
    relevance: { type: 'string', enum: RELEVANCE_LEVELS },
    date: { type: 'string', description: 'Approximate date/period if genuinely known, otherwise "—"' }
  },
  required: ['claim', 'evidence', 'source', 'relevance', 'date']
};

const CRITIQUE_TOOL = {
  name: 'submit_critique',
  description:
    'Submit a grounded, stress-tested evaluation of one strategic route: a full route spec, a ' +
    'comparison scorecard across six dimensions, and a validation case with evidence for and against.',
  input_schema: {
    type: 'object' as const,
    properties: {
      routeDetail: {
        type: 'object',
        properties: {
          thesis: { type: 'string', description: 'One or two sentences: the core bet this route is making' },
          whyExists: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: { type: 'string' },
            description: 'Concrete reasons this route is worth considering, specific to this idea'
          },
          potentialCustomer: { type: 'string', description: 'Who specifically would buy/use this, in one phrase' },
          problem: { type: 'string', description: 'The specific problem this route addresses, 1-2 sentences' },
          product: { type: 'string', description: 'What gets built, described concretely, 1-2 sentences' },
          businessModel: { type: 'string', description: 'How this makes money, 1 sentence' },
          mvp: {
            type: 'array',
            minItems: 3,
            maxItems: 5,
            items: { type: 'string' },
            description: 'Concrete scope items for a minimum viable version'
          },
          upside: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: { type: 'string' },
            description: 'Specific reasons this could work well'
          },
          challenges: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: { type: 'string' },
            description: 'Specific, real obstacles — not generic startup risk'
          },
          assumptions: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: {
              type: 'object',
              properties: {
                text: { type: 'string', description: 'One assumption that must hold true for this route to work' },
                importance: { type: 'string', enum: IMPORTANCE_LEVELS },
                status: { type: 'string', enum: ASSUMPTION_STATUSES }
              },
              required: ['text', 'importance', 'status']
            }
          },
          unknowns: {
            type: 'array',
            minItems: 2,
            maxItems: 4,
            items: { type: 'string' },
            description: 'Specific open questions that would need answering'
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
      },
      comparison: {
        type: 'object',
        description:
          'Rate this route on each dimension relative to plausible alternative directions for this idea, ' +
          'not in the abstract. For capitalRequired and competitiveIntensity, Low is favorable; for the ' +
          'other four dimensions, higher is favorable.',
        properties: {
          marketPotential: {
            type: 'object',
            properties: { level: { type: 'string', enum: RATING_LEVELS }, why: { type: 'string' } },
            required: ['level', 'why']
          },
          differentiation: {
            type: 'object',
            properties: { level: { type: 'string', enum: RATING_LEVELS }, why: { type: 'string' } },
            required: ['level', 'why']
          },
          speedToMvp: {
            type: 'object',
            properties: { level: { type: 'string', enum: RATING_LEVELS }, why: { type: 'string' } },
            required: ['level', 'why']
          },
          capitalRequired: {
            type: 'object',
            properties: { level: { type: 'string', enum: RATING_LEVELS }, why: { type: 'string' } },
            required: ['level', 'why']
          },
          competitiveIntensity: {
            type: 'object',
            properties: { level: { type: 'string', enum: RATING_LEVELS }, why: { type: 'string' } },
            required: ['level', 'why']
          },
          evidenceStrength: {
            type: 'object',
            properties: { level: { type: 'string', enum: RATING_LEVELS }, why: { type: 'string' } },
            required: ['level', 'why']
          }
        },
        required: [
          'marketPotential',
          'differentiation',
          'speedToMvp',
          'capitalRequired',
          'competitiveIntensity',
          'evidenceStrength'
        ]
      },
      validation: {
        type: 'object',
        properties: {
          assessmentLabel: { type: 'string', description: 'Short label, e.g. "Promising — Key Unknowns Remain"' },
          evidenceFor: { type: 'array', minItems: 2, maxItems: 3, items: EVIDENCE_ITEM_SCHEMA },
          evidenceAgainst: { type: 'array', minItems: 2, maxItems: 3, items: EVIDENCE_ITEM_SCHEMA },
          finalAssessment: { type: 'string', enum: VERDICTS },
          finalExplanation: { type: 'string', description: '1-3 sentences: the honest bottom line, including what would change the verdict' }
        },
        required: ['assessmentLabel', 'evidenceFor', 'evidenceAgainst', 'finalAssessment', 'finalExplanation']
      }
    },
    required: ['routeDetail', 'comparison', 'validation']
  }
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

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured on the server' }), { status: 500 });
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

  const anthropic = new Anthropic({ apiKey });

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 3072,
      tools: [CRITIQUE_TOOL],
      tool_choice: { type: 'tool', name: CRITIQUE_TOOL.name },
      messages: [{ role: 'user', content: buildPrompt(ideaText, body.contextAnswers, route) }]
    });

    const toolUse = message.content.find((block) => block.type === 'tool_use');
    if (!toolUse || toolUse.type !== 'tool_use') {
      return new Response(JSON.stringify({ error: 'Model did not return a structured critique' }), { status: 502 });
    }

    const result = toolUse.input as GeneratedCritique;
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
    const message = err instanceof Error ? err.message : 'Unknown error calling Claude';
    return new Response(JSON.stringify({ error: message }), { status: 502 });
  }
}
