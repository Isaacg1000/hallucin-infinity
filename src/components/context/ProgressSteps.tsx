import React from 'react';
import { CheckIcon } from 'lucide-react';

const STEPS = ['Idea', 'Context', 'Explore'] as const;

export function ProgressSteps({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2" aria-label="Progress">
      {STEPS.map((label, i) => {
        const state = i < current ? 'done' : i === current ? 'current' : 'upcoming';
        return (
          <React.Fragment key={label}>
            {i > 0 && <span className={`h-px w-8 ${state === 'upcoming' ? 'bg-line' : 'bg-accent-line'}`} />}
            <span className="flex items-center gap-1.5">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full text-2xs font-medium ${
                  state === 'done'
                    ? 'bg-accent text-white'
                    : state === 'current'
                      ? 'border-2 border-accent text-accent'
                      : 'border border-line-strong text-muted-soft'
                }`}>
                {state === 'done' ? <CheckIcon className="h-3 w-3" strokeWidth={2.5} /> : i + 1}
              </span>
              <span className={`text-xs ${state === 'upcoming' ? 'text-muted-soft' : 'font-medium text-ink-soft'}`}>{label}</span>
            </span>
          </React.Fragment>
        );
      })}
    </div>
  );
}
