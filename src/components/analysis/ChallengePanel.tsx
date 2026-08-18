import React from 'react';
import { SwordsIcon, RotateCcwIcon, CheckIcon, EyeIcon } from 'lucide-react';
import { Challenge } from '../../types';
import { Button } from '../ui/Button';
import { StatusPill } from '../ui/StatusPill';
import { Label } from '../ui/Section';
import { Meter } from '../ui/Meter';

interface ChallengePanelProps {
  challenges: Challenge[];
  active: string[];
  onToggle: (id: string) => void;
  onReset: () => void;
  baseScore: number;
  baseEbitda: number;
  score: number;
  ebitda: number;
}

export function ChallengePanel({
  challenges,
  active,
  onToggle,
  onReset,
  baseScore,
  baseEbitda,
  score,
  ebitda
}: ChallengePanelProps) {
  const stressed = active.length > 0;

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 border-b border-line bg-critical-soft/50 px-4 py-3">
        <p className="inline-flex items-center gap-1.5 text-2xs font-semibold uppercase tracking-label text-critical">
          <SwordsIcon className="h-3 w-3" strokeWidth={2} />
          Challenge mode
        </p>
        <h3 className="mt-1.5 text-md font-semibold leading-snug text-ink">
          What would have to be true for this recommendation to be wrong?
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-soft">
          Select the counterarguments you find credible. The score and EBITDA estimate re-compute against
          that stressed view.
        </p>
      </div>

      <div className="grid shrink-0 grid-cols-2 divide-x divide-line border-b border-line">
        <div className="px-4 py-3">
          <Label>Overall score</Label>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-mono text-2xl font-semibold tabular ${
              stressed ? 'text-critical' : 'text-accent'}`
              }>
              
              {score}
            </span>
            {stressed &&
            <span className="font-mono text-xs tabular text-critical">{score - baseScore}</span>
            }
          </div>
          <Meter
            value={score}
            tone={stressed ? 'critical' : 'accent'}
            className="mt-2"
            height="h-[3px]" />
          
        </div>
        <div className="px-4 py-3">
          <Label>EBITDA impact</Label>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={`font-mono text-2xl font-semibold tabular ${
              stressed ? 'text-critical' : 'text-ink'}`
              }>
              
              +${ebitda.toFixed(1)}M
            </span>
            {stressed &&
            <span className="font-mono text-xs tabular text-critical">
                {(ebitda - baseEbitda).toFixed(1)}
              </span>
            }
          </div>
          <Meter
            value={ebitda}
            max={baseEbitda}
            tone={stressed ? 'critical' : 'accent'}
            className="mt-2"
            height="h-[3px]" />
          
        </div>
      </div>

      <ul className="min-h-0 flex-1 divide-y divide-line overflow-y-auto">
        {challenges.map((c) => {
          const on = active.includes(c.id);
          return (
            <li key={c.id} className={on ? 'bg-critical-soft/40' : ''}>
              <button
                type="button"
                onClick={() => onToggle(c.id)}
                aria-pressed={on}
                className="w-full px-4 py-3 text-left transition-colors hover:bg-sunken/60">
                
                <div className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
                    on ? 'border-critical bg-critical text-white' : 'border-line-strong bg-surface'}`
                    }>
                    
                    {on && <CheckIcon className="h-2.5 w-2.5" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-medium leading-snug text-ink">{c.claim}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted">{c.detail}</span>

                    <span className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                      <StatusPill label={`${c.likelihood} likelihood`} tone="quiet" />
                      <span className="font-mono text-2xs tabular text-critical">
                        score {c.scoreDelta}
                      </span>
                      <span className="font-mono text-2xs tabular text-critical">
                        EBITDA {c.ebitdaDelta.toFixed(1)}M
                      </span>
                    </span>

                    <span className="mt-2 flex items-start gap-1.5 border-t border-line pt-2 text-2xs leading-relaxed text-muted">
                      <EyeIcon className="mt-px h-3 w-3 shrink-0" strokeWidth={1.75} />
                      <span>
                        <span className="font-medium text-ink-soft">Tell: </span>
                        {c.tell}
                      </span>
                    </span>
                  </span>
                </div>
              </button>
            </li>);

        })}
      </ul>

      <div className="shrink-0 border-t border-line bg-raised p-3">
        <p className="mb-2 text-2xs leading-relaxed text-muted">
          {stressed ?
          `${active.length} of ${challenges.length} counterarguments applied. The stressed view is shown in the header until cleared.` :
          'No counterarguments applied. The base case is shown.'}
        </p>
        <Button size="sm" className="w-full" onClick={onReset} disabled={!stressed}>
          <RotateCcwIcon className="h-3 w-3" strokeWidth={1.75} />
          Reset to base case
        </Button>
      </div>
    </div>);

}