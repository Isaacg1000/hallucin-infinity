import React, { useState } from 'react';
import { ChevronDownIcon, CircleDotIcon } from 'lucide-react';
import { uncertainties } from '../../data/decision';
import { StatusPill } from '../ui/StatusPill';
import { Meter } from '../ui/Meter';

export function UncertaintyPanel({ baseEbitda }: {baseEbitda: number;}) {
  const [open, setOpen] = useState<string | null>(uncertainties[0].id);

  return (
    <ul className="divide-y divide-line">
      {uncertainties.map((u) => {
        const expanded = open === u.id;
        const swing = Number(u.swing.replace(/[$M]/g, ''));
        return (
          <li key={u.id} className={u.decisionRelevant ? '' : 'bg-raised/60'}>
            <button
              type="button"
              onClick={() => setOpen(expanded ? null : u.id)}
              aria-expanded={expanded}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-sunken/60">
              
              <CircleDotIcon
                className={`h-3.5 w-3.5 shrink-0 ${
                u.decisionRelevant ? 'text-caution' : 'text-muted-soft'}`
                }
                strokeWidth={2} />
              
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-base font-medium text-ink">{u.label}</span>
                  {u.decisionRelevant ?
                  <StatusPill label="Decision-relevant" tone="caution" /> :

                  <StatusPill label="Not gating" tone="quiet" />
                  }
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-3">
                <span className="hidden w-24 md:block">
                  <Meter
                    value={swing}
                    max={baseEbitda}
                    tone={u.decisionRelevant ? 'caution' : 'muted'}
                    height="h-[3px]" />
                  
                </span>
                <span className="font-mono text-xs tabular text-critical">{u.swing} swing</span>
                <ChevronDownIcon
                  className={`h-3.5 w-3.5 text-muted-soft transition-transform ${expanded ? 'rotate-180' : ''}`}
                  strokeWidth={2} />
                
              </span>
            </button>
            {expanded &&
            <div className="border-t border-line bg-raised px-3 py-2.5 pl-9">
                <p className="text-xs leading-relaxed text-ink-soft">{u.detail}</p>
                <p className="mt-2 text-2xs text-muted">
                  <span className="font-medium uppercase tracking-label text-muted-soft">
                    Resolved by ·{' '}
                  </span>
                  {u.resolvedBy}
                </p>
              </div>
            }
          </li>);

      })}
    </ul>);

}