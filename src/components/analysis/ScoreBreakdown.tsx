import React, { useState } from 'react';
import { ScoreComponent } from '../../types';

const WEIGHTS = [0.3, 0.22, 0.18, 0.16, 0.14];
const MEDIANS = [71, 68, 64, 72, 66];

interface ScoreBreakdownProps {
  score: number;
  components: ScoreComponent[];
  stressedScore?: number | null;
}

export function ScoreBreakdown({ score, components, stressedScore }: ScoreBreakdownProps) {
  const [hover, setHover] = useState<string | null>(null);
  const stressed = stressedScore != null && stressedScore !== score;

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch">
      <div className="flex shrink-0 flex-col justify-between border-r-0 border-line pr-0 lg:w-[132px] lg:border-r lg:pr-4">
        <div>
          <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Composite</p>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-mono text-3xl font-semibold tabular tracking-[-0.02em] ${
              stressed ? 'text-critical' : 'text-accent'}`
              }>
              
              {stressed ? stressedScore : score}
            </span>
            {stressed &&
            <span className="font-mono text-xs tabular text-critical">
                {stressedScore! - score}
              </span>
            }
          </div>
          <p className="mt-1 font-mono text-2xs tabular text-muted">
            portfolio median 68 · top decile 88
          </p>
        </div>

        <div className="mt-4 flex h-2.5 w-full overflow-hidden border border-line">
          {components.map((c, i) =>
          <span
            key={c.label}
            onMouseEnter={() => setHover(c.label)}
            onMouseLeave={() => setHover(null)}
            title={`${c.label} · weight ${(WEIGHTS[i] * 100).toFixed(0)}%`}
            className={`block h-full border-r border-white/70 last:border-r-0 transition-opacity ${
            hover && hover !== c.label ? 'opacity-30' : ''} ${
            c.value >= 85 ? 'bg-accent' : c.value >= 70 ? 'bg-[#5B7FC7]' : 'bg-[#A9B7D4]'}`}
            style={{ width: `${WEIGHTS[i] * 100}%` }} />

          )}
        </div>
        <p className="mt-1.5 text-2xs leading-tight text-muted-soft">
          Segment width is dimension weight; fill is dimension score.
        </p>
      </div>

      <ul className="min-w-0 flex-1 space-y-2.5">
        {components.map((c, i) => {
          const median = MEDIANS[i];
          const active = hover === c.label;
          return (
            <li
              key={c.label}
              onMouseEnter={() => setHover(c.label)}
              onMouseLeave={() => setHover(null)}
              className={`group grid grid-cols-[168px_minmax(0,1fr)_46px] items-center gap-3 transition-opacity ${
              hover && !active ? 'opacity-60' : ''}`
              }>
              
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-ink">{c.label}</p>
                <p className="truncate text-2xs text-muted">{c.note}</p>
              </div>

              <div className="relative h-4">
                <div className="absolute inset-x-0 top-1/2 h-[6px] -translate-y-1/2 bg-line" />
                <div
                  className={`absolute left-0 top-1/2 h-[6px] -translate-y-1/2 ${
                  c.value >= 85 ? 'bg-accent' : c.value >= 70 ? 'bg-[#5B7FC7]' : 'bg-[#A9B7D4]'}`
                  }
                  style={{ width: `${c.value}%` }} />
                
                <div
                  className="absolute top-1/2 h-3 w-px -translate-y-1/2 bg-ink"
                  style={{ left: `${median}%` }}
                  title={`Portfolio median ${median}`} />
                
                {[25, 50, 75].map((t) =>
                <div
                  key={t}
                  className="absolute top-1/2 h-[6px] w-px -translate-y-1/2 bg-white/70"
                  style={{ left: `${t}%` }} />

                )}
              </div>

              <div className="text-right">
                <span
                  className={`font-mono text-base tabular font-semibold ${
                  c.value >= 85 ? 'text-accent' : c.value >= 70 ? 'text-ink' : 'text-muted'}`
                  }>
                  
                  {c.value}
                </span>
                <span
                  className={`ml-1 font-mono text-2xs tabular ${
                  c.value - median >= 0 ? 'text-positive' : 'text-critical'}`
                  }>
                  
                  {c.value - median >= 0 ? '+' : ''}
                  {c.value - median}
                </span>
              </div>
            </li>);

        })}
      </ul>
    </div>);

}