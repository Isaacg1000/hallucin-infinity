import React from 'react';
import { EpistemicTag } from '../ui/EpistemicTag';

interface ExecutiveRecommendationProps {
  statement: string;
  paragraphs: string[];
  confidence: number;
  evidence: string;
  ask: string;
}

export function ExecutiveRecommendation({
  statement,
  paragraphs,
  confidence,
  evidence,
  ask
}: ExecutiveRecommendationProps) {
  return (
    <div className="border border-ink bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-ink px-6 py-3">
        <div className="flex items-center gap-2.5">
          <EpistemicTag kind="Decision" className="!border-white !bg-transparent !text-white" />
          <span className="text-2xs font-medium uppercase tracking-label text-[#A6ACB5]">
            Executive Recommendation
          </span>
        </div>
        <span className="font-mono text-2xs tabular text-[#A6ACB5]">
          Confidence {confidence}% · Evidence {evidence}
        </span>
      </div>

      <div className="px-6 py-6">
        <p className="max-w-4xl text-[19px] font-semibold leading-snug tracking-[-0.015em] text-ink">
          {statement}
        </p>
        <div className="mt-4 max-w-3xl space-y-3">
          {paragraphs.map((p) =>
          <p key={p.slice(0, 24)} className="text-[13px] leading-relaxed text-ink-soft">
              {p}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-line bg-raised px-6 py-4">
        <p className="text-2xs font-medium uppercase tracking-label text-muted">Ask of leadership</p>
        <p className="mt-1.5 text-[13px] text-ink">{ask}</p>
      </div>
    </div>);

}