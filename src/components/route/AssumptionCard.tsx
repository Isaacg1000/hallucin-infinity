import React from 'react';
import { AssumptionItem } from '../../types';
import { StatusPill } from '../ui/StatusPill';

const IMPORTANCE_STYLE: Record<AssumptionItem['importance'], string> = {
  Critical: 'text-critical',
  High: 'text-caution',
  Medium: 'text-muted'
};

/** A ledger row, not a card — three aligned columns (claim, importance,
 * status) so a reader can scan down each column independently rather than
 * re-parsing a paragraph per assumption. */
export function AssumptionCard({ assumption }: { assumption: AssumptionItem }) {
  return (
    <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-t border-line py-3.5 first:border-t-0">
      <p className="min-w-0 text-sm leading-relaxed text-ink-soft">{assumption.text}</p>
      <p
        className={`whitespace-nowrap text-2xs font-medium uppercase tracking-label ${IMPORTANCE_STYLE[assumption.importance]}`}>
        {assumption.importance}
      </p>
      <StatusPill label={assumption.status} className="shrink-0" />
    </div>
  );
}
