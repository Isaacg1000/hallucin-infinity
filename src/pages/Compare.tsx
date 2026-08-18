import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { XIcon, PlusIcon } from 'lucide-react';
import { ComparisonGrid } from '../components/compare/ComparisonGrid';
import { PriorityRanking } from '../components/compare/PriorityRanking';
import { GeneratingState } from '../components/ui/GeneratingState';
import { getComparison, DIMENSION_LABELS, DIMENSION_ORDER, LOWER_IS_BETTER, levelScore } from '../data/comparisons';
import { getRouteDetail, ROUTE_DETAILS } from '../data/routeDetails';
import { getNode } from '../data/nodes';
import { useExploration } from '../state/ExplorationContext';
import { useCritiqueMany } from '../lib/useCritique';
import { ComparisonDimensionKey, ComparisonDimensions } from '../types';

const DEFAULT_COMPARE = ['cust-healthcare-ats', 'cust-enterprise-resume', 'cust-staffing-reengagement'];
const PRIORITY_OPTIONS = Object.values(DIMENSION_LABELS);
const LABEL_TO_KEY = Object.fromEntries(Object.entries(DIMENSION_LABELS).map(([k, v]) => [v, k as ComparisonDimensionKey]));

export function Compare() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { savedRouteIds } = useExploration();

  const [routeIds, setRouteIds] = useState<string[]>(() => {
    const withId = params.get('with');
    const saved = Array.from(savedRouteIds).filter((id) => !!getNode(id));
    if (withId && getNode(withId)) {
      const base = (saved.length >= 2 ? saved : DEFAULT_COMPARE).filter((id) => id !== withId);
      return [withId, ...base].slice(0, 4);
    }
    if (saved.length >= 2) return saved.slice(0, 4);
    return DEFAULT_COMPARE;
  });

  const [priorities, setPriorities] = useState<string[]>(['Differentiation', 'Speed to MVP', 'Market Potential']);

  const comparisons = useMemo(
    () => Object.fromEntries(routeIds.map((id) => [id, getComparison(id)])),
    [routeIds]
  );

  const strongestId = useMemo(() => {
    if (priorities.length === 0 || routeIds.length === 0) return null;
    const weights = priorities.map((_, i) => priorities.length - i);
    let best: { id: string; score: number } | null = null;
    for (const id of routeIds) {
      let score = 0;
      priorities.forEach((label, i) => {
        const key = LABEL_TO_KEY[label];
        if (!key) return;
        let s = levelScore(comparisons[id][key].level);
        if (LOWER_IS_BETTER[key]) s = 5 - s;
        score += s * weights[i];
      });
      if (!best || score > best.score) best = { id, score };
    }
    return best?.id ?? null;
  }, [routeIds, priorities, comparisons]);

  // Among the dimensions actually being compared, find where the strongest
  // route is furthest ahead of the field (its clearest win) and furthest
  // behind (what it gives up) — real per-dimension data already on each
  // route, not a fabricated trade-off narrative.
  const tradeOff = useMemo(() => {
    if (!strongestId || routeIds.length < 2) return null;
    const others = routeIds.filter((id) => id !== strongestId);

    type Margin = { key: ComparisonDimensionKey; margin: number };
    let win: Margin | undefined;
    let sacrifice: Margin | undefined;

    for (const key of DIMENSION_ORDER) {
      const favor = (dims: ComparisonDimensions) => {
        const s = levelScore(dims[key].level);
        return LOWER_IS_BETTER[key] ? 5 - s : s;
      };
      const mine = favor(comparisons[strongestId]);
      const bestOfRest = Math.max(...others.map((id) => favor(comparisons[id])));
      const margin = mine - bestOfRest;
      if (!win || margin > win.margin) win = { key, margin };
      if (!sacrifice || margin < sacrifice.margin) sacrifice = { key, margin };
    }

    if (!win || !sacrifice || win.margin <= 0) return null;
    return {
      win: { key: win.key, why: comparisons[strongestId][win.key].why },
      sacrifice:
        sacrifice.margin < 0 ? { key: sacrifice.key, why: comparisons[strongestId][sacrifice.key].why } : null
    };
  }, [strongestId, routeIds, comparisons]);

  const availableToAdd = useMemo(() => {
    const ids = new Set([...Object.keys(ROUTE_DETAILS), ...Array.from(savedRouteIds)]);
    return Array.from(ids).filter((id) => !!getNode(id) && !routeIds.includes(id));
  }, [savedRouteIds, routeIds]);

  function removeRoute(id: string) {
    if (routeIds.length <= 2) return;
    setRouteIds((prev) => prev.filter((r) => r !== id));
  }

  const { ready, loading, error } = useCritiqueMany(routeIds);

  if (!ready && loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <GeneratingState messages={[`Comparing ${routeIds.length} paths...`, 'Stress-testing each one...']} />
      </div>
    );
  }

  if (!ready && error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="max-w-sm text-center text-sm text-muted">{error}</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-medium px-6 py-10 pb-20">
        <h1 className="text-3xl font-semibold leading-tight tracking-[-0.015em] text-ink">Compare Paths</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">Different priorities can lead to different answers.</p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {routeIds.map((id) => {
            const detail = getRouteDetail(id);
            return (
              <span
                key={id}
                className="inline-flex items-center gap-2 rounded-full border border-line bg-raised py-1.5 pl-3 pr-2 text-xs text-ink-soft">
                {detail?.name ?? id}
                {routeIds.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeRoute(id)}
                    aria-label={`Remove ${detail?.name}`}
                    className="flex h-4 w-4 items-center justify-center rounded-full text-muted-soft hover:bg-line hover:text-ink">
                    <XIcon className="h-2.5 w-2.5" strokeWidth={2.25} />
                  </button>
                )}
              </span>
            );
          })}
          {routeIds.length < 4 && availableToAdd.length > 0 && (
            <div className="relative">
              <select
                aria-label="Add a route to compare"
                value=""
                onChange={(e) => {
                  if (e.target.value) setRouteIds((prev) => [...prev, e.target.value].slice(0, 4));
                }}
                className="appearance-none rounded-full border border-dashed border-line-strong bg-transparent py-1.5 pl-7 pr-3 text-xs text-muted-soft hover:border-accent hover:text-accent focus:border-accent focus:text-accent">
                <option value="">Add route</option>
                {availableToAdd.map((id) => (
                  <option key={id} value={id}>
                    {getRouteDetail(id)?.name ?? getNode(id)?.title ?? id}
                  </option>
                ))}
              </select>
              <PlusIcon className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-soft" strokeWidth={2} />
            </div>
          )}
        </div>

        <div className="mt-10 rounded-lg border border-line bg-raised p-4">
          <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Rank what matters most</p>
          <div className="mt-2.5">
            <PriorityRanking options={PRIORITY_OPTIONS} selected={priorities} onChange={setPriorities} max={3} />
          </div>
          {priorities.length > 0 && (
            <div className="mt-4 border-t border-line pt-3.5">
              <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">You said these matter most</p>
              <ol className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                {priorities.map((p, i) => (
                  <li key={p} className="flex items-baseline gap-1.5 text-[13px] text-ink-soft">
                    <span className="font-mono text-2xs text-muted-soft">{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        <div className="mt-8">
          <ComparisonGrid routeIds={routeIds} comparisons={comparisons} strongestId={strongestId} />
        </div>

        <div className="mt-8 rounded-lg border border-accent-line bg-accent-soft/40 px-4 py-3.5">
          {strongestId ? (
            <>
              <p className="text-sm text-ink-soft">
                <span className="font-medium text-ink">{getRouteDetail(strongestId)?.name}</span> is best aligned
                with your stated priorities right now.
              </p>
              {tradeOff && (
                <dl className="mt-3 space-y-2 border-t border-accent-line/60 pt-3">
                  <div>
                    <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">
                      Wins on {DIMENSION_LABELS[tradeOff.win.key]}
                    </dt>
                    <dd className="mt-1 text-xs leading-relaxed text-ink-soft">{tradeOff.win.why}</dd>
                  </div>
                  {tradeOff.sacrifice && (
                    <div>
                      <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">
                        Sacrifices on {DIMENSION_LABELS[tradeOff.sacrifice.key]}
                      </dt>
                      <dd className="mt-1 text-xs leading-relaxed text-ink-soft">{tradeOff.sacrifice.why}</dd>
                    </div>
                  )}
                </dl>
              )}
            </>
          ) : (
            <p className="text-sm text-ink-soft">Rank what matters most above to see which route is best aligned.</p>
          )}
          <p className="mt-3 text-xs text-muted">
            This reflects the priorities you ranked above — it isn't a prediction of success. Change the ranking
            and this answer would change too.
          </p>
        </div>

        <div className="mt-8 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="inline-flex h-9 items-center rounded-md border border-line-strong bg-surface px-3.5 text-[13px] text-ink transition-colors hover:bg-raised">
            Back to Map
          </button>
          {strongestId && (
            <button
              type="button"
              onClick={() => navigate(`/validate/${strongestId}`)}
              className="inline-flex h-9 items-center rounded-md bg-ink px-3.5 text-[13px] font-medium text-white transition-colors hover:bg-[#22252A]">
              Validate {getRouteDetail(strongestId)?.name}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
