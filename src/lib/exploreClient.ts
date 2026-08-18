import { MapNode, ContextAnswers } from '../types';

export class ExploreApiError extends Error {}

/** Calls the real backend (api/explore.ts) to generate a strategic
 * exploration tree for the user's actual idea. Never touches an API key —
 * that lives only on the server. */
export async function generateExplorationTree(
  ideaText: string,
  contextAnswers: ContextAnswers | null
): Promise<Record<string, MapNode>> {
  const res = await fetch('/api/explore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ideaText, contextAnswers })
  });

  if (!res.ok) {
    let message = `Explore request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response body wasn't JSON — keep the generic message
    }
    throw new ExploreApiError(message);
  }

  const data = await res.json();
  if (!data?.nodes) {
    throw new ExploreApiError('Explore response was missing a node tree');
  }
  return data.nodes as Record<string, MapNode>;
}
