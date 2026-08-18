import React from 'react';
import { EvidenceStrength } from '../../types';

const MAP: Record<EvidenceStrength, {dots: number;className: string;}> = {
  Strong: { dots: 3, className: 'text-accent' },
  Moderate: { dots: 2, className: 'text-ink-soft' },
  Limited: { dots: 1, className: 'text-caution' },
  Contested: { dots: 1, className: 'text-critical' }
};

export function EvidenceBadge({ strength }: {strength: EvidenceStrength;}) {
  const conf = MAP[strength];
  return (
    <span className="inline-flex items-center gap-1.5" title={`Evidence strength: ${strength}`}>
      <span className="flex items-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2].map((i) =>
        <span
          key={i}
          className={`block h-[5px] w-[5px] rounded-full ${
          i < conf.dots ? 'bg-current' : 'bg-line'} ${
          i < conf.dots ? conf.className : ''}`} />

        )}
      </span>
      <span className={`text-xs ${conf.className}`}>{strength}</span>
    </span>);

}