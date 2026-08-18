import React, { useMemo, useState } from 'react';
import { LayoutGridIcon, ListIcon, ChevronDownIcon } from 'lucide-react';
import { OpportunityCard } from '../components/opportunities/OpportunityCard';
import { OpportunityTable } from '../components/opportunities/OpportunityTable';
import { PossibilityFunnel, FunnelStage } from '../components/ui/PossibilityFunnel';
import { opportunities as baseOpportunities } from '../data/opportunities';
import { useExploration } from '../state/ExplorationContext';
import { Category } from '../types';

const FUNNEL: FunnelStage[] = [
  {
    id: 'explored',
    label: 'Explored',
    count: 342,
    explanation:
      'Every hypothesis generated across all eight strategic categories — pricing, procurement, product, sales, operations, AI, working capital, and M&A — before any of them were tested against reality.'
  },
  {
    id: 'eliminated',
    label: 'Eliminated',
    count: 218,
    explanation:
      'Ruled out immediately against the deal thesis and stated constraints — CapEx limits, headcount, timeline — before any evidence-gathering began. Cheap to discard, so discarded early.'
  },
  {
    id: 'evidence',
    label: 'Evidence-backed',
    count: 67,
    explanation:
      'Survived elimination and had supporting or contradicting evidence actually gathered: internal data, benchmarks, prior portfolio outcomes, and management interviews.'
  },
  {
    id: 'ranked',
    label: 'Ranked',
    count: 12,
    explanation:
      'Scored and ordered by risk-adjusted EBITDA impact once the evidence was in — this is the set worth a human reading closely.'
  },
  {
    id: 'strongest',
    label: 'Strongest',
    count: 3,
    tone: 'strong',
    explanation:
      'The routes worth taking to the investment committee right now — highest confidence, strongest evidence, most differentiated from what a competitor would also find.'
  }
];

const FILTERS: (Category | 'All')[] = [
'All',
'Revenue Growth',
'Pricing',
'Operations',
'AI / Automation',
'Procurement',
'Product',
'M&A',
'Working Capital'];


const SORTS = [
{ id: 'score', label: 'Overall Score' },
{ id: 'ebitda', label: 'EBITDA Impact' },
{ id: 'confidence', label: 'Confidence' },
{ id: 'speed', label: 'Speed' },
{ id: 'risk', label: 'Risk' }] as
const;

type SortId = (typeof SORTS)[number]['id'];

const SPEED_RANK: Record<string, number> = {
  '3–6 months': 1,
  '4–8 months': 2,
  '6–9 months': 3,
  '6–12 months': 4,
  '9–12 months': 5,
  '9–15 months': 6,
  '9–18 months': 7,
  '18–24 months': 8
};

const RISK_RANK: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

export function OpportunityExplorer() {
  const { trackedOpportunities } = useExploration();
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [sort, setSort] = useState<SortId>('score');
  const [view, setView] = useState<'grid' | 'table'>('grid');

  // Static NorthPeak baseline plus anything actually validated and tracked
  // through the Explore flow — not a separate list, the real one.
  const opportunities = useMemo(
    () => [...baseOpportunities, ...trackedOpportunities],
    [trackedOpportunities]
  );

  const rows = useMemo(() => {
    const filtered =
    filter === 'All' ? [...opportunities] : opportunities.filter((o) => o.category === filter);
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'ebitda':
          return b.ebitda - a.ebitda;
        case 'confidence':
          return b.confidence - a.confidence;
        case 'speed':
          return (SPEED_RANK[a.timeToImpact] ?? 9) - (SPEED_RANK[b.timeToImpact] ?? 9);
        case 'risk':
          return RISK_RANK[a.complexity] - RISK_RANK[b.complexity];
        default:
          return b.score - a.score;
      }
    });
  }, [filter, sort, opportunities]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: opportunities.length };
    opportunities.forEach((o) => {
      map[o.category] = (map[o.category] ?? 0) + 1;
    });
    return map;
  }, [opportunities]);

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <header className="border-b border-line pb-8">
        <p className="text-2xs font-medium uppercase tracking-label text-muted">
          NorthPeak Industrial · Analysis of Jul 22, 2026
        </p>

        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted">
          We searched the possibility space across eight strategic categories, challenged each hypothesis
          against the deal thesis, and gathered evidence for what survived. Three routes now stand out as the
          strongest candidates.
        </p>

        <PossibilityFunnel stages={FUNNEL} className="mt-7" />

        <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-soft">
          {FILTERS.filter((f) => f !== 'All').map((f, i, arr) => (
            <React.Fragment key={f}>
              <span>{f}</span>
              {i < arr.length - 1 && <span className="text-line-strong">·</span>}
            </React.Fragment>
          ))}
        </div>
      </header>

      <div className="sticky top-0 z-20 -mx-8 mt-6 border-b border-line bg-canvas/95 px-8 py-3 backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) =>
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`inline-flex h-8 items-center gap-1.5 border px-2.5 text-xs transition-colors ${
              filter === f ?
              'border-ink bg-ink text-white' :
              'border-line bg-surface text-muted hover:border-line-strong hover:text-ink'}`
              }>
              
                {f}
                <span className={`font-mono text-2xs tabular ${filter === f ? 'text-white/60' : 'text-muted-soft'}`}>
                  {counts[f] ?? 0}
                </span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <label className="relative">
              <span className="sr-only">Sort by</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortId)}
                className="h-8 appearance-none rounded-md border border-line bg-surface pl-2.5 pr-8 text-xs text-ink hover:border-line-strong focus:border-accent">
                
                {SORTS.map((s) =>
                <option key={s.id} value={s.id}>
                    Sort: {s.label}
                  </option>
                )}
              </select>
              <ChevronDownIcon
                className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
                strokeWidth={1.75} />
              
            </label>
            <div className="flex items-center border border-line bg-surface">
              {([['grid', LayoutGridIcon], ['table', ListIcon]] as const).map(([v, Icon]) =>
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                aria-label={`${v} view`}
                aria-pressed={view === v}
                className={`flex h-8 w-9 items-center justify-center transition-colors ${
                view === v ? 'bg-raised text-ink' : 'text-muted hover:text-ink'}`
                }>
                
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {rows.length === 0 ?
      <p className="mt-10 border border-dashed border-line-strong bg-surface px-6 py-16 text-center text-sm text-muted">
          No surviving opportunities in this category. 26 hypotheses were generated and eliminated.
        </p> :
      view === 'grid' ?
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {rows.map((o) =>
        <OpportunityCard key={o.id} opportunity={o} />
        )}
        </div> :

      <div className="mt-5 border border-line bg-surface">
          <OpportunityTable rows={rows} />
        </div>
      }
    </div>);

}