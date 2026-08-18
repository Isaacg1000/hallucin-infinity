import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { ContextAnswers, Opportunity } from '../types';
import { IDEA_TEXT } from '../data/nodes';
import { buildOpportunityFromRoute } from '../data/trackOpportunity';
import { ensureCritique } from '../lib/critiqueRunner';
import { resetCritiqueCache } from '../data/critiqueCache';

interface ExplorationState {
  ideaText: string;
  setIdeaText: (text: string) => void;
  contextAnswers: ContextAnswers | null;
  setContextAnswers: (answers: ContextAnswers) => void;

  /** Nodes whose children have ever been revealed. Only grows — this is
   * what "possibilities explored" counts against, so collapsing a branch
   * doesn't erase the fact that you found it. */
  everExpandedIds: Set<string>;
  /** Nodes currently toggled shut (children hidden, but not forgotten). */
  collapsedIds: Set<string>;
  revealChildren: (id: string) => void;
  toggleCollapsed: (id: string) => void;
  isRevealed: (id: string) => boolean;
  isCollapsed: (id: string) => boolean;

  savedRouteIds: Set<string>;
  toggleSaved: (id: string) => void;
  isSaved: (id: string) => boolean;

  dismissedRouteIds: Set<string>;
  dismissRoute: (id: string) => void;

  promisingRouteIds: Set<string>;

  /** Routes that have actually become tracked opportunities — a real
   * object built from the route's own validation data, not just a
   * sentence claiming the relationship exists. Merge this with the
   * static NorthPeak opportunity list wherever opportunities are read. */
  trackedOpportunities: Opportunity[];
  isTracked: (routeId: string) => boolean;
  trackOpportunity: (routeId: string) => Opportunity | null;

  /** Clears saved/dismissed/expanded state left over from a previous tree
   * (demo or a prior generated exploration) so it doesn't reference node
   * ids that no longer exist once a new tree is loaded. */
  resetForNewExploration: () => void;
}

const ExplorationCtx = createContext<ExplorationState | null>(null);

const DEFAULT_REVEALED = new Set<string>(['root']);
const DEFAULT_SAVED = new Set<string>(['cust-healthcare-ats', 'prod-workflow']);
const DEFAULT_PROMISING = new Set<string>(['cust-healthcare-ats', 'cust-staffing-reengagement', 'prob-speed']);

export function ExplorationProvider({ children }: { children: React.ReactNode }) {
  const [ideaText, setIdeaText] = useState(IDEA_TEXT);
  const [contextAnswers, setContextAnswers] = useState<ContextAnswers | null>(null);
  const [everExpandedIds, setEverExpandedIds] = useState<Set<string>>(DEFAULT_REVEALED);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [savedRouteIds, setSavedRouteIds] = useState<Set<string>>(DEFAULT_SAVED);
  const [dismissedRouteIds, setDismissedRouteIds] = useState<Set<string>>(new Set());

  const revealChildren = useCallback((id: string) => {
    setEverExpandedIds((prev) => new Set(prev).add(id));
    setCollapsedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const toggleCollapsed = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const isRevealed = useCallback((id: string) => everExpandedIds.has(id), [everExpandedIds]);
  const isCollapsed = useCallback((id: string) => collapsedIds.has(id), [collapsedIds]);

  const toggleSaved = useCallback(
    (id: string) => {
      setSavedRouteIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
          // Warm the Critic cache in the background as soon as a route is
          // saved, so Compare/Validate have data ready regardless of
          // which page the user navigates to next.
          ensureCritique(id, ideaText, contextAnswers);
        }
        return next;
      });
    },
    [ideaText, contextAnswers]
  );

  const isSaved = useCallback((id: string) => savedRouteIds.has(id), [savedRouteIds]);

  const dismissRoute = useCallback((id: string) => {
    setDismissedRouteIds((prev) => new Set(prev).add(id));
  }, []);

  const resetForNewExploration = useCallback(() => {
    setEverExpandedIds(new Set(['root']));
    setCollapsedIds(new Set());
    setSavedRouteIds(new Set());
    setDismissedRouteIds(new Set());
    resetCritiqueCache();
  }, []);

  const [trackedOpportunities, setTrackedOpportunities] = useState<Opportunity[]>([]);

  const isTracked = useCallback(
    (routeId: string) => trackedOpportunities.some((o) => o.id === routeId),
    [trackedOpportunities]
  );

  const trackOpportunity = useCallback(
    (routeId: string) => {
      const existing = trackedOpportunities.find((o) => o.id === routeId);
      if (existing) return existing;
      const built = buildOpportunityFromRoute(routeId);
      if (built) setTrackedOpportunities((prev) => [...prev, built]);
      return built;
    },
    [trackedOpportunities]
  );

  const value = useMemo<ExplorationState>(
    () => ({
      ideaText,
      setIdeaText,
      contextAnswers,
      setContextAnswers,
      everExpandedIds,
      collapsedIds,
      revealChildren,
      toggleCollapsed,
      isRevealed,
      isCollapsed,
      savedRouteIds,
      toggleSaved,
      isSaved,
      dismissedRouteIds,
      dismissRoute,
      promisingRouteIds: DEFAULT_PROMISING,
      trackedOpportunities,
      isTracked,
      trackOpportunity,
      resetForNewExploration
    }),
    [
      ideaText,
      contextAnswers,
      everExpandedIds,
      collapsedIds,
      revealChildren,
      trackedOpportunities,
      isTracked,
      trackOpportunity,
      toggleCollapsed,
      isRevealed,
      isCollapsed,
      savedRouteIds,
      toggleSaved,
      isSaved,
      dismissedRouteIds,
      dismissRoute,
      resetForNewExploration
    ]
  );

  return <ExplorationCtx.Provider value={value}>{children}</ExplorationCtx.Provider>;
}

export function useExploration() {
  const ctx = useContext(ExplorationCtx);
  if (!ctx) throw new Error('useExploration must be used within an ExplorationProvider');
  return ctx;
}
