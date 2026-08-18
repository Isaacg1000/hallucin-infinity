import { getNode } from '../data/nodes';
import { getRouteDetail } from '../data/routeDetails';
import { setCritique, clearCritique } from '../data/critiqueCache';
import { critiqueRoute, RouteCritiqueInput } from './critiqueClient';
import { ContextAnswers } from '../types';

/** Dedupes concurrent critique requests for the same route across every
 * caller (RouteDetail page, Validate page, Compare page, the eager
 * on-save trigger) — no framework dependency here on purpose, so
 * ExplorationContext (state) can trigger a critique without importing
 * anything that imports it back (the useCritique hooks do that side). */
const inflight = new Map<string, Promise<void>>();

function buildRouteInput(nodeId: string): RouteCritiqueInput | null {
  const node = getNode(nodeId);
  if (!node) return null;
  const parent = node.parentId ? getNode(node.parentId) : undefined;
  return {
    id: node.id,
    title: node.title,
    subtitle: node.subtitle,
    reasoning: node.reasoning,
    bullets: node.bullets,
    categoryTitle: parent?.title,
    categoryQuestion: parent?.question
  };
}

export function isCritiquing(nodeId: string): boolean {
  return inflight.has(nodeId);
}

/** Kicks off (or joins an existing) critique request for a route that
 * doesn't already have real data. Resolves once the result — or a
 * rejection — is settled; the cache itself is the source of truth for
 * whether it succeeded. */
export function runCritique(nodeId: string, ideaText: string, contextAnswers: ContextAnswers | null): Promise<void> {
  if (getRouteDetail(nodeId)) return Promise.resolve();
  const existing = inflight.get(nodeId);
  if (existing) return existing;

  const routeInput = buildRouteInput(nodeId);
  if (!routeInput) return Promise.resolve();

  const promise = critiqueRoute(ideaText, contextAnswers, routeInput)
    .then((result) => {
      setCritique(nodeId, result);
    })
    .finally(() => {
      inflight.delete(nodeId);
    });

  inflight.set(nodeId, promise);
  return promise;
}

/** Fire-and-forget variant for background warms (e.g. saving a route)
 * where there's no UI in the moment to surface an error to. */
export function ensureCritique(nodeId: string, ideaText: string, contextAnswers: ContextAnswers | null): void {
  runCritique(nodeId, ideaText, contextAnswers).catch(() => {
    // Swallowed intentionally — a page that later needs this route's data
    // will call runCritique again via useCritique and can surface the error.
  });
}

/** Drops a live-generated route's cached result and re-runs the Critic
 * against it — "regenerate this route" on RouteDetail. A no-op for demo
 * routes, since those never live in the critique cache to begin with. */
export function regenerateCritique(
  nodeId: string,
  ideaText: string,
  contextAnswers: ContextAnswers | null
): Promise<void> {
  clearCritique(nodeId);
  return runCritique(nodeId, ideaText, contextAnswers);
}
