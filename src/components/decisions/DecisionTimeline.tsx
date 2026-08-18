import React from 'react';
import { CheckIcon } from 'lucide-react';
import { DecisionRecord } from '../../types';

export function DecisionTimeline({ timeline }: {timeline: DecisionRecord['timeline'];}) {
  return (
    <ol className="relative">
      {timeline.map((t, i) => {
        const last = i === timeline.length - 1;
        return (
          <li key={t.label} className="relative flex gap-4 pb-6 last:pb-0">
            {!last &&
            <span
              className={`absolute left-[9px] top-5 h-full w-px ${
              t.state === 'complete' ? 'bg-accent-line' : 'bg-line'}`
              }
              aria-hidden="true" />

            }
            <span
              className={`relative z-10 mt-0.5 flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-full border ${
              t.state === 'complete' ?
              'border-accent bg-accent text-white' :
              t.state === 'current' ?
              'border-ink bg-surface' :
              'border-line bg-surface'}`
              }>
              
              {t.state === 'complete' ?
              <CheckIcon className="h-3 w-3" strokeWidth={2.5} /> :

              <span
                className={`h-1.5 w-1.5 rounded-full ${t.state === 'current' ? 'bg-ink' : 'bg-line-strong'}`} />

              }
            </span>
            <div className="min-w-0 pt-px">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h4
                  className={`text-[13px] font-medium ${t.state === 'upcoming' ? 'text-muted' : 'text-ink'}`}>
                  
                  {t.label}
                </h4>
                <span className="font-mono text-2xs tabular text-muted-soft">{t.date}</span>
                {t.state === 'current' &&
                <span className="text-2xs font-medium uppercase tracking-label text-accent">
                    In progress
                  </span>
                }
              </div>
              {t.detail && <p className="mt-1 text-xs leading-relaxed text-muted">{t.detail}</p>}
            </div>
          </li>);

      })}
    </ol>);

}