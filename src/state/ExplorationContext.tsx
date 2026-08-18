import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ContextAnswers, Opportunity } from '../types';
import { IDEA_TEXT } from '../data/nodes';
import { buildOpportunityFromRoute } from '../data/trackOpportunity';
import { ensureCritique } from '../lib/critiqueRunner';
import { resetCritiqueCache } from '../data/critiqueCache';

// A page reload previously wiped every trace of what a user had done —
// idea text, saved routes, dismissed routes, tracked opportunities all
// reset to defaults. This persists just that state to localStorage, so a
// refresh (or reopening the tab) doesn't lose it. It does not persist the
// generated exploration tree itself (that's regenerated from ideaText on
// the Map page), so saved/dismissed ids from a live-generated tree may
// not resolve to real nodes after a reload — same honest fallback that
// `RouteCard`/`Saved` already apply by filtering out unknown ids.
const STORAGE_KEY = 'hallucinate:exploration:v1';

interface PersistedExplorationState {
  ideaText: string;
  contextAnswers: ContextAnswers | null;
  savedRouteIds: string[];
  dismissedRouteIds: string[];
  trackedOpportunities: Opportunity[];
}

function loadPersisted(): Partial<PersistedExplorationState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

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

  /** True when the current exploration tree is the static demo fallback
   * because live generation failed — drives the persistent banner in
   * AppShell (not just a toast that disappears). */
  isDemoData: boolean;
  setIsDemoData: (v: boolean) => void;
}

const ExplorationCtx = createContext<ExplorationState | null>(null);

const DEFAULT_REVEALED = new Set<string>(['root']);
const DEFAULT_SAVED = new Set<string>(['cust-healthcare-ats', 'prod-workflow']);
const DEFAULT_PROMISING = new Set<string>(['cust-healthcare-ats', 'cust-staffing-reengagement', 'prob-speed']);

export function ExplorationProvider({ children }: { children: React.ReactNode }) {
  const persisted = useMemo(loadPersisted, []);
  const [ideaText, setIdeaText] = useState(persisted.ideaText ?? IDEA_TEXT);
  const [contextAnswers, setContextAnswers] = useState<ContextAnswers | null>(persisted.contextAnswers ?? null);
  const [everExpandedIds, setEverExpandedIds] = useState<Set<string>>(DEFAULT_REVEALED);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [savedRouteIds, setSavedRouteIds] = useState<Set<string>>(
    new Set(persisted.savedRouteIds ?? Array.from(DEFAULT_SAVED))
  );
  const [dismissedRouteIds, setDismissedRouteIds] = useState<Set<string>>(new Set(persisted.dismissedRouteIds ?? []));
  const [isDemoData, setIsDemoData] = useState(false);

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

  const [trackedOpportunities, setTrackedOpportunities] = useState<Opportunity[]>(persisted.trackedOpportunities ?? []);

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

  useEffect(() => {
    const toPersist: PersistedExplorationState = {
      ideaText,
      contextAnswers,
      savedRouteIds: Array.from(savedRouteIds),
      dismissedRouteIds: Array.from(dismissedRouteIds),
      trackedOpportunities
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toPersist));
    } catch {
      // Storage full or unavailable (e.g. private browsing) — state
      // simply won't survive a reload; nothing else depends on it.
    }
  }, [ideaText, contextAnswers, savedRouteIds, dismissedRouteIds, trackedOpportunities]);

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
      resetForNewExploration,
      isDemoData,
      setIsDemoData
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
      resetForNewExploration,
      isDemoData
    ]
  );

  return <ExplorationCtx.Provider value={value}>{children}</ExplorationCtx.Provider>;
}

export function useExploration() {
  const ctx = useContext(ExplorationCtx);
  if (!ctx) throw new Error('useExploration must be used within an ExplorationProvider');
  return ctx;
}
