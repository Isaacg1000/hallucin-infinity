// Vercel serverless function (Node.js runtime) — the Dreamer.
//
// Takes a user's real idea + context answers and asks Gemini to generate a
// genuine strategic exploration tree: 5-7 category directions, each with a
// few concrete routes. This replaces src/data/nodes.ts's static mock tree
// for a live exploration. No framework dependency beyond @google/genai —
// runs server-side, so the API key never reaches the browser.
//
// Local dev: `vercel dev` (this route is not served by `yarn dev`/Vite).

import { Type } from '@google/genai';
import { createGenAIClient } from './_lib/genai.js';

interface ContextAnswers {
  goals: string[];
  audience: string;
  priorities: string[];
  constraints: string;
  decided: string;
}

interface ExploreRequestBody {
  ideaText: string;
  contextAnswers?: ContextAnswers | null;
}

// Mirrors src/types.ts's MapNode shape, minus the fields the backend
// computes (id, parentId, kind, childIds).
interface GeneratedRoute {
  id: string;
  title: string;
  subtitle: string;
  reasoning: string;
  bullets: string[];
}

interface GeneratedCategory {
  id: string;
  title: string;
  question: string;
  routes: GeneratedRoute[];
}

interface GeneratedTree {
  categories: GeneratedCategory[];
}

// Gemini's structured-output schema (a subset of OpenAPI 3.0) forces the
// response to be valid JSON matching this shape — same role Claude's
// forced tool_use played, but simpler since it's just JSON, not a
// simulated function call. Cardinality (5-7 categories, 2-4 routes each)
// is reinforced in the prompt text since responseSchema's array bounds
// aren't reliably enforced by the API.
const ROUTE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'kebab-case slug unique within this response' },
    title: { type: Type.STRING, description: 'Short, specific route name (2-6 words)' },
    subtitle: { type: Type.STRING, description: 'One-line descriptor, under 8 words' },
    reasoning: {
      type: Type.STRING,
      description: '1-3 sentences on why this route is worth considering, specific to the idea and context — not generic advice'
    },
    bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: '3-4 concrete, specific supporting or tension points — mix upside and real tradeoffs, not just positives'
    }
  },
  required: ['id', 'title', 'subtitle', 'reasoning', 'bullets']
};

const CATEGORY_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'kebab-case slug unique within this response, e.g. "cat-customer"' },
    title: { type: Type.STRING, description: 'Short category name, e.g. "Customer" or "Business Model"' },
    question: { type: Type.STRING, description: 'The guiding question this category poses, e.g. "Who else could this serve?"' },
    routes: { type: Type.ARRAY, items: ROUTE_SCHEMA, description: '2-4 concrete, genuinely divergent routes' }
  },
  required: ['id', 'title', 'question', 'routes']
};

const TREE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    categories: { type: Type.ARRAY, items: CATEGORY_SCHEMA, description: '5-7 category directions branching off the idea' }
  },
  required: ['categories']
};

function buildPrompt(ideaText: string, contextAnswers?: ContextAnswers | null): string {
  const lines = [`The idea: "${ideaText}"`];

  if (contextAnswers) {
    if (contextAnswers.goals?.length) lines.push(`What they're hoping to accomplish: ${contextAnswers.goals.join(', ')}`);
    if (contextAnswers.audience) lines.push(`Who they're currently thinking about serving: ${contextAnswers.audience}`);
    if (contextAnswers.priorities?.length) lines.push(`What matters most to them: ${contextAnswers.priorities.join(', ')}`);
    if (contextAnswers.constraints) lines.push(`Constraints: ${contextAnswers.constraints}`);
    if (contextAnswers.decided) lines.push(`Already decided: ${contextAnswers.decided}`);
  }

  lines.push(
    '',
    'Map the possibility space around this idea. Generate 5-7 category directions ' +
      '(e.g. Customer, Problem, Product, Market, Business Model, Distribution, Positioning — ' +
      'adapt these to whatever dimensions actually matter for this specific idea), each posing ' +
      'a genuine "what else could this be?" question. Under each category, generate 2-4 concrete, ' +
      'meaningfully different routes — not restatements of the same idea with different wording. ' +
      'Actively push for at least one or two non-obvious routes per exploration, not just the ' +
      'default framing. Every route needs real reasoning specific to this idea (not generic startup ' +
      'advice) and bullets that include genuine tradeoffs, not just upside.'
  );

  return lines.join('\n');
}

function slugify(input: string, fallback: string): string {
  const slug = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return slug || fallback;
}

/** Converts the model's category/route tree into the flat Record<string, MapNode>
 * shape the frontend's data/nodes.ts expects, with a fixed 'root' node on top. */
function toMapNodeTree(tree: GeneratedTree, ideaText: string) {
  const nodes: Record<string, unknown> = {
    root: {
      id: 'root',
      kind: 'root',
      parentId: null,
      title: ideaText.length > 60 ? `${ideaText.slice(0, 57)}...` : ideaText,
      subtitle: 'Your idea',
      childIds: [] as string[]
    }
  };

  const usedIds = new Set(['root']);
  function uniqueId(raw: string, fallback: string): string {
    let id = slugify(raw, fallback);
    let n = 2;
    while (usedIds.has(id)) {
      id = `${slugify(raw, fallback)}-${n++}`;
    }
    usedIds.add(id);
    return id;
  }

  const rootChildIds: string[] = [];

  tree.categories.forEach((cat, ci) => {
    const catId = uniqueId(cat.id || cat.title, `cat-${ci}`);
    rootChildIds.push(catId);

    const routeIds: string[] = [];
    cat.routes.forEach((route, ri) => {
      const routeId = uniqueId(route.id || route.title, `${catId}-route-${ri}`);
      routeIds.push(routeId);
      nodes[routeId] = {
        id: routeId,
        kind: 'route',
        parentId: catId,
        title: route.title,
        subtitle: route.subtitle,
        reasoning: route.reasoning,
        bullets: route.bullets,
        childIds: [],
        isLeafRoute: true
      };
    });

    nodes[catId] = {
      id: catId,
      kind: 'category',
      parentId: 'root',
      title: cat.title,
      question: cat.question,
      childIds: routeIds
    };
  });

  (nodes.root as { childIds: string[] }).childIds = rootChildIds;
  return nodes;
}

export async function POST(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const clientResult = createGenAIClient();
  if ('error' in clientResult) {
    return new Response(JSON.stringify({ error: clientResult.error }), { status: 500 });
  }

  let body: ExploreRequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const ideaText = (body.ideaText ?? '').trim();
  if (!ideaText) {
    return new Response(JSON.stringify({ error: 'ideaText is required' }), { status: 400 });
  }
  if (ideaText.length > 2000) {
    return new Response(JSON.stringify({ error: 'ideaText is too long' }), { status: 400 });
  }

  const ai = clientResult.client;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: buildPrompt(ideaText, body.contextAnswers),
      config: {
        responseMimeType: 'application/json',
        responseSchema: TREE_SCHEMA
      }
    });

    const text = response.text;
    if (!text) {
      return new Response(JSON.stringify({ error: 'Model did not return a structured tree' }), { status: 502 });
    }

    let tree: GeneratedTree;
    try {
      tree = JSON.parse(text);
    } catch {
      return new Response(JSON.stringify({ error: 'Model returned invalid JSON' }), { status: 502 });
    }
    if (!tree?.categories?.length) {
      return new Response(JSON.stringify({ error: 'Model returned an empty tree' }), { status: 502 });
    }

    const nodes = toMapNodeTree(tree, ideaText);

    return new Response(JSON.stringify({ nodes }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error calling Gemini';
    return new Response(JSON.stringify({ error: message }), { status: 502 });
  }
}
