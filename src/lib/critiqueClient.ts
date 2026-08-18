import { ComparisonDimensions, ContextAnswers, RouteDetailData, ValidationData } from '../types';

export class CritiqueApiError extends Error {}

export interface RouteCritiqueInput {
  id: string;
  title: string;
  subtitle?: string;
  reasoning?: string;
  bullets?: string[];
  categoryTitle?: string;
  categoryQuestion?: string;
}

export interface CritiqueResult {
  routeDetail: RouteDetailData;
  comparison: ComparisonDimensions;
  validation: ValidationData;
}

/** Calls the real backend (api/critique.ts) — the Critic. Stress-tests a
 * single Dreamer-generated route and returns a grounded route detail,
 * comparison scorecard, and validation case for it. Never touches an API
 * key; that lives only on the server, same pattern as exploreClient.ts. */
export async function critiqueRoute(
  ideaText: string,
  contextAnswers: ContextAnswers | null,
  route: RouteCritiqueInput
): Promise<CritiqueResult> {
  const res = await fetch('/api/critique', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ideaText, contextAnswers, route })
  });

  if (!res.ok) {
    let message = `Critique request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.error) message = body.error;
    } catch {
      // response body wasn't JSON — keep the generic message
    }
    throw new CritiqueApiError(message);
  }

  const data = await res.json();
  if (!data?.routeDetail || !data?.comparison || !data?.validation) {
    throw new CritiqueApiError('Critique response was missing required fields');
  }
  return data as CritiqueResult;
}
