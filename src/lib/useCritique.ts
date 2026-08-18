import { useEffect, useState } from 'react';
import { getRouteDetail } from '../data/routeDetails';
import { subscribeToCritiqueCache } from '../data/critiqueCache';
import { runCritique } from './critiqueRunner';
import { CritiqueApiError } from './critiqueClient';
import { useExploration } from '../state/ExplorationContext';

export interface CritiqueState {
  /** True once real route data (demo-authored or Critic-generated) exists. */
  ready: boolean;
  loading: boolean;
  error: string | null;
}

/** Lazily triggers a Critic call for a single route the first time it's
 * needed (RouteDetail, Validate) and re-renders once it lands. Demo routes
 * and already-critiqued routes resolve instantly with no request. */
export function useCritique(nodeId: string | undefined): CritiqueState {
  const { ideaText, contextAnswers } = useExploration();
  const [, bump] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => subscribeToCritiqueCache(() => bump((n) => n + 1)), []);

  useEffect(() => {
    if (!nodeId) return;
    setError(null);
    runCritique(nodeId, ideaText, contextAnswers).catch((err) => {
      setError(err instanceof CritiqueApiError ? err.message : 'Could not generate a critique for this route.');
      bump((n) => n + 1);
    });
  }, [nodeId, ideaText, contextAnswers]);

  const ready = !!(nodeId && getRouteDetail(nodeId));
  // Not derived from the inflight map: that's only populated once the
  // effect above actually fires, which is a render behind this return.
  // Treating "not ready and no error yet" as loading avoids a one-render
  // flash of the not-found/error state before the fetch has even started.
  const loading = !!(nodeId && !ready && !error);

  return { ready, loading, error };
}

/** Same idea for Compare, where several routes need to be ready at once. */
export function useCritiqueMany(nodeIds: string[]): { ready: boolean; loading: boolean; error: string | null } {
  const { ideaText, contextAnswers } = useExploration();
  const [, bump] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const key = nodeIds.join(',');

  useEffect(() => subscribeToCritiqueCache(() => bump((n) => n + 1)), []);

  useEffect(() => {
    setError(null);
    nodeIds.forEach((id) => {
      runCritique(id, ideaText, contextAnswers).catch((err) => {
        setError(err instanceof CritiqueApiError ? err.message : 'Could not generate a critique for one of these routes.');
        bump((n) => n + 1);
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ideaText, contextAnswers]);

  const ready = nodeIds.length > 0 && nodeIds.every((id) => !!getRouteDetail(id));
  const loading = nodeIds.length > 0 && !ready && !error;

  return { ready, loading, error };
}
