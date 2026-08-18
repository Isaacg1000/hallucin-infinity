import React from 'react';
import { Alternative } from '../../types';
import { StatusPill } from '../ui/StatusPill';
import { Meter, scoreTone } from '../ui/Meter';

interface AlternativesViewProps {
  alternatives: Alternative[];
  recommendedTitle: string;
  recommendedScore: number;
  recommendedEbitda: number;
}

export function AlternativesView({
  alternatives,
  recommendedTitle,
  recommendedScore,
  recommendedEbitda
}: AlternativesViewProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-raised">
          {['Approach', 'Score', 'Modelled EBITDA', 'Trade-off', 'Why it ranked below', 'Verdict'].map(
            (h) =>
            <th
              key={h}
              scope="col"
              className="border-b border-line px-4 py-2.5 text-left text-2xs font-medium uppercase tracking-label text-muted">
              
                {h}
              </th>

          )}
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-line bg-accent-soft">
          <td className="relative px-4 py-3">
            <span className="absolute inset-y-0 left-0 w-[2px] bg-accent" />
            <span className="text-base font-semibold text-ink">{recommendedTitle}</span>
            <span className="mt-0.5 block text-2xs uppercase tracking-label text-accent">
              Recommended
            </span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-semibold tabular text-accent">
                {recommendedScore}
              </span>
              <Meter value={recommendedScore} tone="accent" className="w-12" height="h-[2px]" />
            </div>
          </td>
          <td className="px-4 py-3 font-mono text-base tabular font-medium text-ink">
            +${recommendedEbitda.toFixed(1)}M
          </td>
          <td className="px-4 py-3 text-xs text-ink-soft">Bounded downside, resolves two assumptions</td>
          <td className="px-4 py-3 text-xs text-muted">—</td>
          <td className="px-4 py-3">
            <StatusPill label="Selected" tone="accent" />
          </td>
        </tr>

        {alternatives.map((a) =>
        <tr key={a.id} className="border-b border-line/80 transition-colors hover:bg-sunken">
            <td className="px-4 py-3 text-base text-ink">{a.title}</td>
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-base tabular text-muted">{a.score || '—'}</span>
                {a.score > 0 &&
              <Meter value={a.score} tone={scoreTone(a.score)} className="w-12" height="h-[2px]" />
              }
              </div>
            </td>
            <td className="px-4 py-3 font-mono text-base tabular text-muted">
              {a.ebitda ? `+$${a.ebitda.toFixed(1)}M` : '—'}
            </td>
            <td className="px-4 py-3 text-xs text-muted">{a.tradeoff}</td>
            <td className="max-w-md px-4 py-3 text-xs leading-relaxed text-ink-soft">{a.reason}</td>
            <td className="px-4 py-3">
              <StatusPill label={a.verdict} />
            </td>
          </tr>
        )}
      </tbody>
    </table>);

}