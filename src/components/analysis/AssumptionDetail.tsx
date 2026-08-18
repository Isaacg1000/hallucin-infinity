import React from 'react';
import { CheckIcon, AlertTriangleIcon, FlaskConicalIcon, TrendingDownIcon } from 'lucide-react';
import { Assumption } from '../../types';
import { StatusPill } from '../ui/StatusPill';
import { Label } from '../ui/Section';
import { Meter } from '../ui/Meter';

interface AssumptionDetailProps {
  assumption: Assumption;
  baseScore: number;
  baseEbitda: number;
}

export function AssumptionDetail({ assumption: a, baseScore, baseEbitda }: AssumptionDetailProps) {
  return (
    <div className="divide-y divide-line">
      <div className="grid grid-cols-3 divide-x divide-line">
        {[
        ['Confidence', a.confidence],
        ['Impact if wrong', a.impactIfWrong],
        ['Coverage', a.coverage]].
        map(([k, v]) =>
        <div key={k} className="px-3 py-2.5">
            <Label>{k}</Label>
            <p className="mt-1 text-base font-medium text-ink">{v}</p>
          </div>
        )}
      </div>

      <div className="px-4 py-3">
        <Label>Why it matters</Label>
        <p className="mt-2 text-xs leading-relaxed text-ink-soft">{a.why}</p>
      </div>

      <div className="px-4 py-3">
        <Label>Evidence supporting it</Label>
        <ul className="mt-2 space-y-2">
          {a.supportedBy.length ?
          a.supportedBy.map((s) =>
          <li key={s} className="flex gap-2">
                <CheckIcon className="mt-0.5 h-3 w-3 shrink-0 text-positive" strokeWidth={2.5} />
                <span className="text-xs leading-relaxed text-ink-soft">{s}</span>
              </li>
          ) :

          <li className="text-xs text-muted">No direct supporting evidence.</li>
          }
        </ul>
      </div>

      <div className="bg-critical-soft/40 px-4 py-3">
        <Label>Evidence against it</Label>
        <ul className="mt-2 space-y-2">
          {a.challengedBy.length ?
          a.challengedBy.map((s) =>
          <li key={s} className="flex gap-2">
                <AlertTriangleIcon className="mt-0.5 h-3 w-3 shrink-0 text-critical" strokeWidth={2} />
                <span className="text-xs leading-relaxed text-ink-soft">{s}</span>
              </li>
          ) :

          <li className="text-xs text-muted">No contradicting evidence found.</li>
          }
        </ul>
      </div>

      <div className="px-4 py-3">
        <Label>How to validate it</Label>
        <ol className="mt-2 space-y-2">
          {a.validation.map((v, i) =>
          <li key={v} className="flex gap-2">
              <span className="mt-px font-mono text-2xs tabular text-muted-soft">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="text-xs leading-relaxed text-ink-soft">{v}</span>
            </li>
          )}
        </ol>
      </div>

      <div className="px-4 py-3">
        <Label>Effect if this assumption is false</Label>
        <div className="mt-2.5 grid grid-cols-2 gap-3">
          <div className="border border-line p-2.5">
            <p className="text-2xs uppercase tracking-label text-muted-soft">Overall score</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-lg font-semibold tabular text-critical">
                {a.scoreIfFalse}
              </span>
              <span className="font-mono text-2xs tabular text-muted line-through">{baseScore}</span>
            </div>
            <Meter value={a.scoreIfFalse} tone="critical" className="mt-2" />
          </div>
          <div className="border border-line p-2.5">
            <p className="text-2xs uppercase tracking-label text-muted-soft">EBITDA impact</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-lg font-semibold tabular text-critical">
                +${a.ebitdaIfFalse.toFixed(1)}M
              </span>
              <span className="font-mono text-2xs tabular text-muted line-through">
                ${baseEbitda.toFixed(1)}M
              </span>
            </div>
            <Meter value={a.ebitdaIfFalse} max={baseEbitda} tone="critical" className="mt-2" />
          </div>
        </div>
        <p className="mt-2.5 inline-flex items-center gap-1.5 text-2xs text-muted">
          <TrendingDownIcon className="h-3 w-3 text-critical" strokeWidth={2} />
          {((baseEbitda - a.ebitdaIfFalse) / baseEbitda * 100).toFixed(0)}% of the modelled opportunity
          depends on this holding.
        </p>
      </div>

      <div className="flex items-center justify-between px-4 py-3">
        <StatusPill label={a.status} />
        <span className="inline-flex items-center gap-1.5 text-2xs text-muted">
          <FlaskConicalIcon className="h-3 w-3" strokeWidth={1.75} />
          Validated by the 45-day sprint
        </span>
      </div>
    </div>);

}