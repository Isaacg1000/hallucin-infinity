import React from 'react';
import { StatusBadge } from '../ui/StatusBadge';

/** Deliberately un-boxed in the ordinary sense — a dotted rule, not a card,
 * so "we don't know this yet" reads as a considered position the research
 * took, not a hole where data was supposed to be. */
export function UnknownCard({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 border-t border-dotted border-line-strong py-3.5 first:border-t-0">
      <StatusBadge status="unknown" className="mt-0.5 shrink-0" />
      <p className="text-sm leading-relaxed text-ink-soft">{text}</p>
    </div>
  );
}
