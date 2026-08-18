import React from 'react';

export type EpistemicKind =
'Hypothesis' |
'Evidence' |
'Assumption' |
'Inference' |
'Decision' |
'Outcome';

// Kept in sync with StatusBadge's four trust-model classes: Hypothesis and
// Evidence share exactly the same tokens as StatusBadge's `hypothesis` and
// `evidence` states (previously Evidence here rode the neutral `accent`
// tokens, a leftover from when `accent` used to be the brand blue — the two
// components disagreed about what "evidence" should look like).
const STYLES: Record<EpistemicKind, string> = {
  Hypothesis: 'border-hypothesis-line text-hypothesis bg-hypothesis-soft',
  Evidence: 'border-positive-line text-positive bg-positive-soft',
  Assumption: 'border-caution-line text-caution bg-caution-soft',
  Inference: 'border-line-strong text-ink-soft bg-raised',
  Decision: 'border-ink text-ink bg-white',
  Outcome: 'border-positive-line text-positive bg-positive-soft'
};

export function EpistemicTag({ kind, className = '' }: {kind: EpistemicKind;className?: string;}) {
  return (
    <span
      className={`inline-flex items-center border px-1.5 py-[2px] text-2xs font-medium uppercase tracking-label ${STYLES[kind]} ${className}`}
      title={`Claim type: ${kind}`}>
      
      {kind}
    </span>);

}