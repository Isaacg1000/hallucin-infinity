import React from 'react';
import { ComparisonDimensionKey, ComparisonDimensions, RatingLevel } from '../../types';
import { DIMENSION_LABELS, DIMENSION_ORDER, levelScore } from '../../data/comparisons';
import { getRouteDetail } from '../../data/routeDetails';

const LEVEL_TONE: Record<RatingLevel, string> = {
  Low: 'bg-muted-soft',
  Medium: 'bg-caution',
  High: 'bg-accent',
  'Very High': 'bg-positive'
};

function RatingCell({ rating }: { rating: { level: RatingLevel; why: string } }) {
  const filled = levelScore(rating.level);
  return (
    <div className="min-w-0 px-1">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-[3px]" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} className={`block h-2.5 w-[5px] rounded-sm ${i < filled ? LEVEL_TONE[rating.level] : 'bg-line'}`} />
          ))}
        </div>
        <span className="text-xs font-medium text-ink-soft">{rating.level}</span>
      </div>
      <p className="mt-1.5 text-2xs leading-snug text-muted">{rating.why}</p>
    </div>
  );
}

interface ComparisonGridProps {
  routeIds: string[];
  comparisons: Record<string, ComparisonDimensions>;
  strongestId?: string | null;
}

export function ComparisonGrid({ routeIds, comparisons, strongestId }: ComparisonGridProps) {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[640px]">
        <div
          className="grid gap-4 border-b border-line pb-3"
          style={{ gridTemplateColumns: `160px repeat(${routeIds.length}, minmax(0,1fr))` }}>
          <div />
          {routeIds.map((id) => {
            const detail = getRouteDetail(id);
            return (
              <div key={id} className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-ink">{detail?.name ?? id}</p>
                {strongestId === id && (
                  <span className="mt-1 inline-flex items-center rounded-full border border-accent-line bg-accent-soft px-2 py-0.5 text-2xs font-medium text-accent">
                    Currently strongest
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {DIMENSION_ORDER.map((key: ComparisonDimensionKey) => (
          <div
            key={key}
            className="grid items-start gap-4 border-b border-line py-3.5 last:border-b-0"
            style={{ gridTemplateColumns: `160px repeat(${routeIds.length}, minmax(0,1fr))` }}>
            <p className="pt-1 text-xs font-medium text-muted">{DIMENSION_LABELS[key]}</p>
            {routeIds.map((id) => (
              <RatingCell key={id} rating={comparisons[id][key]} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
