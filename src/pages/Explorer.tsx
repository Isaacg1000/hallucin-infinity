import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XIcon, GitCompareIcon } from 'lucide-react';
import { ContextHeader } from '../components/explorer/ContextHeader';
import { Controls, DEFAULT_CONTROLS, FilterBar, CATEGORIES } from '../components/explorer/FilterBar';
import { OpportunityGrid } from '../components/explorer/OpportunityGrid';
import { IntelPanel } from '../components/explorer/IntelPanel';
import { Button } from '../components/ui/Button';
import { Meter, scoreTone } from '../components/ui/Meter';
import { opportunities } from '../data/opportunities';
import { useScreenInit } from '../useScreenInit.js';

const SPEED_RANK: Record<string, number> = {
  '3–6 mo': 1,
  '4–8 mo': 2,
  '6–9 mo': 3,
  '6–12 mo': 4,
  '9–12 mo': 5,
  '9–15 mo': 6,
  '9–18 mo': 7,
  '18–24 mo': 8
};
const COMPLEXITY_RANK: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
const EVIDENCE_RANK: Record<string, number> = { Limited: 1, Moderate: 2, Strong: 3 };

export function Explorer() {
  const navigate = useNavigate();
  const screenInit = useScreenInit() as {
    controls?: Partial<Controls>;
    selectedId?: string | null;
    compare?: string[];
  };
  const [controls, setControls] = useState<Controls>({
    ...DEFAULT_CONTROLS,
    ...(screenInit.controls ?? {})
  });
  const [selectedId, setSelectedId] = useState<string | null>(
    screenInit.selectedId !== undefined ? screenInit.selectedId : 'pricing-architecture'
  );
  const [compare, setCompare] = useState<string[]>(screenInit.compare ?? []);
  const [inDecision, setInDecision] = useState<string[]>(['pricing-architecture']);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: opportunities.length };
    CATEGORIES.forEach((c) => {
      if (c !== 'All') map[c] = opportunities.filter((o) => o.category === c).length;
    });
    return map;
  }, []);

  const rows = useMemo(() => {
    let list = [...opportunities];
    if (controls.category !== 'All') list = list.filter((o) => o.category === controls.category);
    if (controls.confidence !== 'any')
    list = list.filter((o) => o.confidence >= Number(controls.confidence));
    if (controls.evidence !== 'any')
    list = list.filter((o) => EVIDENCE_RANK[o.evidence] >= EVIDENCE_RANK[controls.evidence]);
    if (controls.impact !== 'any') list = list.filter((o) => o.ebitda >= Number(controls.impact));
    if (controls.status !== 'any') list = list.filter((o) => o.status === controls.status);

    return list.sort((a, b) => {
      switch (controls.sort) {
        case 'ebitda':
          return b.ebitda - a.ebitda;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'speed':
          return (SPEED_RANK[a.timeToImpact] ?? 9) - (SPEED_RANK[b.timeToImpact] ?? 9);
        case 'complexity':
          return COMPLEXITY_RANK[a.complexity] - COMPLEXITY_RANK[b.complexity];
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return b.score - a.score;
      }
    });
  }, [controls]);

  const selected = rows.find((o) => o.id === selectedId) ?? null;
  const compareRows = opportunities.filter((o) => compare.includes(o.id));

  const move = useCallback(
    (delta: number) => {
      if (!rows.length) return;
      const idx = rows.findIndex((o) => o.id === selectedId);
      const next = rows[Math.min(Math.max(idx + delta, 0), rows.length - 1)] ?? rows[0];
      setSelectedId(next.id);
      const el = document.querySelector<HTMLElement>(`[data-row-id="${next.id}"]`);
      el?.scrollIntoView({ block: 'nearest' });
    },
    [rows, selectedId]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')
      return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        move(1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        move(-1);
      } else if (e.key === 'Enter' && selectedId) {
        navigate(`/analysis/${selectedId}`);
      } else if (e.key === 'Escape') {
        setSelectedId(null);
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [move, selectedId, navigate]);

  const toggleCompare = (id: string) =>
  setCompare((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id].slice(-3));

  const toggleDecision = (id: string) =>
  setInDecision((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="flex h-full w-full flex-col">
      <ContextHeader opportunities={rows} />
      <FilterBar
        controls={controls}
        onChange={setControls}
        counts={counts}
        resultCount={rows.length} />
      

      <div className="flex min-h-0 flex-1">
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-auto bg-surface">
            {rows.length ?
            <OpportunityGrid
              rows={rows}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onOpen={(id) => navigate(`/analysis/${id}`)}
              sort={controls.sort}
              onSort={(key) => setControls({ ...controls, sort: key })} /> :


            <div className="flex h-full flex-col items-center justify-center gap-2 px-6 text-center">
                <p className="text-sm text-ink-soft">No opportunities match these controls</p>
                <p className="max-w-sm text-xs text-muted">
                  342 possibilities were explored and 218 eliminated against thesis constraints. Widen the
                  filters to see more of the surviving set.
                </p>
                <Button size="sm" className="mt-1" onClick={() => setControls(DEFAULT_CONTROLS)}>
                  Reset controls
                </Button>
              </div>
            }
          </div>

          {compareRows.length > 0 &&
          <div className="shrink-0 border-t border-line bg-surface">
              <div className="flex h-8 items-center justify-between border-b border-line bg-raised px-3">
                <span className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-label text-ink-soft">
                  <GitCompareIcon className="h-3 w-3" strokeWidth={1.75} />
                  Compare · {compareRows.length} of 3
                </span>
                <button
                type="button"
                onClick={() => setCompare([])}
                className="inline-flex items-center gap-1 text-2xs text-muted transition-colors hover:text-ink">
                
                  <XIcon className="h-3 w-3" strokeWidth={2} />
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-3 divide-x divide-line">
                {compareRows.map((o) =>
              <div key={o.id} className="px-3 py-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="truncate text-xs font-medium text-ink">{o.title}</span>
                      <button
                    type="button"
                    onClick={() => toggleCompare(o.id)}
                    aria-label={`Remove ${o.title} from compare`}
                    className="text-muted-soft transition-colors hover:text-ink">
                    
                        <XIcon className="h-3 w-3" strokeWidth={2} />
                      </button>
                    </div>
                    <div className="mt-2 grid grid-cols-4 gap-2">
                      {[
                  ['Score', String(o.score)],
                  ['EBITDA', `+$${o.ebitda.toFixed(1)}M`],
                  ['Conf', `${o.confidence}%`],
                  ['Time', o.timeToImpact]].
                  map(([k, v]) =>
                  <div key={k}>
                          <p className="text-2xs uppercase tracking-label text-muted-soft">{k}</p>
                          <p className="mt-0.5 font-mono text-xs tabular text-ink">{v}</p>
                        </div>
                  )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {o.scoreComponents.map((c) =>
                  <div key={c.label} className="flex items-center gap-2">
                          <span className="w-[104px] shrink-0 truncate text-2xs text-muted">
                            {c.label}
                          </span>
                          <Meter
                      value={c.value}
                      tone={scoreTone(c.value)}
                      className="flex-1"
                      height="h-[2px]" />
                    
                        </div>
                  )}
                    </div>
                  </div>
              )}
              </div>
            </div>
          }
        </div>

        <IntelPanel
          opportunity={selected}
          onClose={() => setSelectedId(null)}
          onOpen={(id) => navigate(`/analysis/${id}`)}
          onCompare={toggleCompare}
          onAddToDecision={toggleDecision}
          compared={selected ? compare.includes(selected.id) : false}
          inDecision={selected ? inDecision.includes(selected.id) : false} />
        
      </div>
    </div>);

}