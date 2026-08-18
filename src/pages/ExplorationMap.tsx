import React, { useEffect, useRef, useState } from 'react';
import { HallucinInfinityProcess, ActivityItem } from '../components/ui/HallucinInfinityProcess';
import { ExplorationCanvas } from '../components/map/ExplorationCanvas';
import { useExploration } from '../state/ExplorationContext';
import { generateExplorationTree } from '../lib/exploreClient';
import { loadGeneratedTree, resetToDemoNodes } from '../data/nodes';
import { useToast } from '../components/ui/Toast';

const STAGES = [
  'Understanding context',
  'Exploring strategic directions',
  'Challenging assumptions',
  'Finding evidence',
  'Searching contradictions',
  'Evaluating impact',
  'Narrowing routes'
];

const ACTIVITY: ActivityItem[] = [
  { kind: 'finding', text: 'Mapped 7 strategic directions from the idea' },
  { kind: 'finding', text: 'Generated candidate routes within each direction' },
  { kind: 'rejected', text: 'Ruled out directions outside the stated constraints' },
  { kind: 'evidence', text: 'Checked surviving routes against available evidence' },
  { kind: 'contradiction', text: 'Flagged routes with meaningful contradicting evidence' },
  { kind: 'finding', text: 'Ranked routes by evidence strength and impact' },
  { kind: 'evidence', text: 'Narrowed to the routes worth investigating' }
];

// Floor so the loading state never feels like it flashed by, even when the
// real API call returns fast.
const MIN_LOADING_MS = STAGES.length * 650;

export function ExplorationMap() {
  const { ideaText, contextAnswers, resetForNewExploration } = useExploration();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const ranFor = useRef<string | null>(null);

  useEffect(() => {
    // Guard against React 18 StrictMode's double-invoke in dev, and against
    // re-running when unrelated state on this page changes.
    if (ranFor.current === ideaText) return;
    ranFor.current = ideaText;

    let cancelled = false;
    const startedAt = Date.now();
    setLoading(true);

    generateExplorationTree(ideaText, contextAnswers)
      .then((tree) => {
        if (cancelled) return;
        loadGeneratedTree(tree);
        resetForNewExploration();
      })
      .catch((err) => {
        if (cancelled) return;
        resetToDemoNodes();
        resetForNewExploration();
        const message = err instanceof Error ? err.message : 'Live generation failed';
        showToast(`Showing demo routes — live generation unavailable (${message})`);
      })
      .finally(() => {
        if (cancelled) return;
        const elapsed = Date.now() - startedAt;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        window.setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, remaining);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ideaText]);

  if (loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6">
        <p className="mb-8 max-w-md text-center text-sm leading-relaxed text-muted">"{ideaText}"</p>
        <HallucinInfinityProcess stages={STAGES} activity={ACTIVITY} stepMs={650} />
      </div>
    );
  }

  return <ExplorationCanvas />;
}
