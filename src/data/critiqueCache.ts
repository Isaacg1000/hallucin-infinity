import { CritiqueResult } from '../lib/critiqueClient';

/** In-memory cache of Critic results, keyed by route (node) id. Mutable
 * module-level store, same pattern as data/nodes.ts's NODES — a seam that
 * routeDetails.ts/comparisons.ts/validation.ts read from so real, live
 * critique data transparently replaces (or supplements) the static demo
 * data without every consumer needing to know where a route came from.
 * Resets on reload, same as the rest of this prototype's state. */
const CRITIQUE_CACHE = new Map<string, CritiqueResult>();

const listeners = new Set<() => void>();

export function getCritique(nodeId: string): CritiqueResult | undefined {
  return CRITIQUE_CACHE.get(nodeId);
}

export function hasCritique(nodeId: string): boolean {
  return CRITIQUE_CACHE.has(nodeId);
}

export function setCritique(nodeId: string, result: CritiqueResult): void {
  CRITIQUE_CACHE.set(nodeId, result);
  listeners.forEach((fn) => fn());
}

/** Lets components (via useCritique) re-render when a critique lands,
 * even if it was triggered elsewhere (e.g. an eager fetch on save). */
export function subscribeToCritiqueCache(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function resetCritiqueCache(): void {
  CRITIQUE_CACHE.clear();
  listeners.forEach((fn) => fn());
}
