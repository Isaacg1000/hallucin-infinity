import React, { useEffect, useState } from 'react';
import { CheckIcon, SearchIcon, AlertTriangleIcon, XIcon } from 'lucide-react';
import { HallucinInfinityLoader } from './HallucinInfinityLoader';

export interface ActivityItem {
  kind: 'finding' | 'evidence' | 'contradiction' | 'rejected';
  text: string;
}

interface HallucinInfinityProcessProps {
  /** Ordered stage labels, e.g. "Understanding context", "Challenging
   * assumptions". Advances one at a time on a fixed interval. */
  stages: string[];
  /** Generic activity chips revealed progressively alongside the stages —
   * illustrative of the KIND of work happening (same convention as the
   * existing cycling-message loaders elsewhere), never a specific
   * fabricated fact about a real company. */
  activity?: ActivityItem[];
  /** ms per stage. Total run time is roughly stages.length * stepMs. */
  stepMs?: number;
  className?: string;
}

const ACTIVITY_META: Record<ActivityItem['kind'], { label: string; icon: typeof SearchIcon; className: string }> = {
  finding: { label: 'Finding', icon: SearchIcon, className: 'text-accent bg-accent-soft' },
  evidence: { label: 'Evidence', icon: CheckIcon, className: 'text-positive bg-positive-soft' },
  contradiction: { label: 'Contradiction', icon: AlertTriangleIcon, className: 'text-caution bg-caution-soft' },
  rejected: { label: 'Rejected route', icon: XIcon, className: 'text-muted bg-sunken' }
};

/** The "a team of analysts is actively examining the problem" moment —
 * not a spinner. Pairs the infinity mark with a staged checklist and a
 * quiet activity feed that fills in as stages complete. */
export function HallucinInfinityProcess({ stages, activity = [], stepMs = 650, className = '' }: HallucinInfinityProcessProps) {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    if (stages.length <= 1) return;
    const id = window.setInterval(() => {
      setStageIndex((i) => Math.min(i + 1, stages.length - 1));
    }, stepMs);
    return () => window.clearInterval(id);
  }, [stages.length, stepMs]);

  // Reveal activity items in step with stage progress, not all at once.
  const visibleActivity = activity.slice(0, Math.ceil((stageIndex + 1) * (activity.length / stages.length)));

  return (
    <div className={`flex items-start gap-10 ${className}`}>
      <div className="flex flex-col items-center gap-6">
        <HallucinInfinityLoader size="lg" />
        <ol className="flex flex-col gap-2.5" aria-live="polite">
          {stages.map((stage, i) => {
            const state = i < stageIndex ? 'done' : i === stageIndex ? 'current' : 'pending';
            return (
              <li key={stage} className="flex items-center gap-2.5 text-xs">
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    state === 'done'
                      ? 'border-emerald-500 bg-emerald-500 text-white'
                      : state === 'current'
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-line-strong text-transparent'
                  }`}>
                  {state === 'done' && <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} />}
                  {state === 'current' && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />}
                </span>
                <span
                  className={
                    state === 'pending' ? 'text-muted-soft' : state === 'current' ? 'font-medium text-ink' : 'text-muted'
                  }>
                  {stage}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {activity.length > 0 && (
        <div className="min-w-0 flex-1 border-l border-line pl-8">
          <p className="mb-3 text-2xs font-medium uppercase tracking-label text-muted-soft">Activity</p>
          <ul className="flex flex-col gap-2">
            {visibleActivity.map((item, i) => {
              const meta = ACTIVITY_META[item.kind];
              return (
                <li
                  key={i}
                  className="flex items-start gap-2 text-xs text-ink-soft motion-safe:animate-grow-in"
                  style={{ animationDelay: `${i * 40}ms` }}>
                  <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${meta.className}`}>
                    <meta.icon className="h-2.5 w-2.5" strokeWidth={2.25} />
                  </span>
                  <span className="leading-snug">{item.text}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
