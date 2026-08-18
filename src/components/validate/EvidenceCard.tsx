import React from 'react';
import { EvidenceItem } from '../../types';
import { SourceBadge } from '../ui/SourceBadge';
import { StatusBadge } from '../ui/StatusBadge';

/** Used for both supporting and contradicting evidence — intentionally
 * identical treatment either way, so neither side reads as weaker. A citation
 * in a research memo, not a dashboard tile: a rule between items, no box.
 * The [n] mark is a real citation, not decoration — click it (or the
 * card) to open the same item in the Evidence drawer. */
export function EvidenceCard({ item, index, onOpen }: { item: EvidenceItem; index?: number; onOpen?: () => void }) {
  return (
    <article className="border-t border-line py-5 first:border-t-0 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <h4 className="flex items-start gap-2 text-[15px] font-medium leading-snug text-ink">
          {index !== undefined && (
            <button
              type="button"
              onClick={onOpen}
              className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-accent underline-offset-2 hover:underline"
              aria-label={`Open citation ${index}`}>
              [{index}]
            </button>
          )}
          <span>{item.claim}</span>
        </h4>
        <StatusBadge status="evidence" className="mt-0.5 shrink-0" />
      </div>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-soft">{item.evidence}</p>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-xs text-muted">
        <SourceBadge source={item.source} />
        <span className="text-muted-soft">
          · {item.relevance} relevance · {item.date}
        </span>
      </p>
    </article>
  );
}
