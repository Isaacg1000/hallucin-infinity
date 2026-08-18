import React from 'react';
import { RoadmapItem, roadmapMilestones } from '../../data/blueprint';

const WORKSTREAM_COLOR: Record<RoadmapItem['workstream'], string> = {
  Commercial: 'bg-accent',
  Operational: 'bg-ink-soft',
  'AI / Automation': 'bg-[#9FB9B2]'
};

export function RoadmapChart({ items }: {items: RoadmapItem[];}) {
  const marks = [0, 25, 50, 75, 100];

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[820px]">
        <div className="flex">
          <div className="w-56 shrink-0" />
          <div className="relative flex-1 border-b border-line pb-1.5">
            <div className="flex justify-between">
              {marks.map((m) =>
              <span key={m} className="font-mono text-2xs tabular text-muted">
                  Day {m}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-1">
          {items.map((item) =>
          <div key={item.name} className="group flex items-center border-b border-line/70 last:border-b-0">
              <div className="w-56 shrink-0 py-2.5 pr-4">
                <span className="block truncate text-[13px] text-ink">{item.name}</span>
                <span className="block text-2xs text-muted">{item.owner}</span>
              </div>
              <div className="relative h-11 flex-1">
                {marks.map((m) =>
              <span
                key={m}
                className="absolute inset-y-0 w-px bg-line/80"
                style={{ left: `${m}%` }}
                aria-hidden="true" />

              )}
                <div
                className={`absolute top-1/2 h-[18px] -translate-y-1/2 ${WORKSTREAM_COLOR[item.workstream]} transition-opacity group-hover:opacity-90`}
                style={{ left: `${item.start}%`, width: `${item.end - item.start}%` }}
                title={`${item.name}: Day ${item.start}–${item.end}`}>
                
                  <span className="sr-only">
                    Day {item.start} to {item.end}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex">
          <div className="w-56 shrink-0 text-2xs font-medium uppercase tracking-label text-muted">
            Milestones
          </div>
          <div className="relative h-14 flex-1">
            {roadmapMilestones.map((m) =>
            <div
              key={m.day}
              className="absolute top-0 max-w-[150px] -translate-x-1/2 text-center"
              style={{ left: `${Math.min(Math.max(m.day, 6), 94)}%` }}>
              
                <span className="mx-auto mb-1.5 block h-2 w-2 rotate-45 border border-ink bg-surface" />
                <span className="block text-2xs leading-tight text-muted">{m.label}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-line pt-3">
          {(Object.keys(WORKSTREAM_COLOR) as RoadmapItem['workstream'][]).map((w) =>
          <span key={w} className="inline-flex items-center gap-2 text-xs text-muted">
              <span className={`h-2 w-4 ${WORKSTREAM_COLOR[w]}`} />
              {w}
            </span>
          )}
        </div>
      </div>
    </div>);

}