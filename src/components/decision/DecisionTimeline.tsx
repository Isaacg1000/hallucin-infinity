import React from 'react';
import { CheckIcon } from 'lucide-react';
import { TimelineEvent } from '../../data/decision';

export function DecisionTimeline({ events }: {events: TimelineEvent[];}) {
  return (
    <ol className="relative">
      {events.map((e, i) => {
        const last = i === events.length - 1;
        return (
          <li key={e.id} className="relative flex gap-3 pb-3.5 last:pb-0">
            {!last &&
            <span
              className={`absolute left-[7px] top-4 h-full w-px ${
              e.state === 'complete' ? 'bg-accent-line' : 'bg-line'}`
              }
              aria-hidden="true" />

            }
            <span
              className={`relative z-10 mt-0.5 flex h-[15px] w-[15px] shrink-0 items-center justify-center border ${
              e.state === 'complete' ?
              'border-accent bg-accent text-white' :
              e.state === 'current' ?
              'border-ink bg-surface' :
              'border-line bg-surface'}`
              }>
              
              {e.state === 'complete' ?
              <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} /> :

              <span className={`h-1 w-1 ${e.state === 'current' ? 'bg-ink' : 'bg-line-strong'}`} />
              }
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span
                  className={`text-xs font-medium ${e.state === 'upcoming' ? 'text-muted' : 'text-ink'}`}>
                  
                  {e.label}
                </span>
                <span className="shrink-0 font-mono text-2xs tabular text-muted-soft">{e.date}</span>
              </div>
              {e.detail && <p className="mt-0.5 text-2xs leading-relaxed text-muted">{e.detail}</p>}
            </div>
          </li>);

      })}
    </ol>);

}