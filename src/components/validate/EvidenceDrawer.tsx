import React from 'react';
import { SidePanel } from '../ui/SidePanel';
import { StatusBadge } from '../ui/StatusBadge';
import { SourceBadge } from '../ui/SourceBadge';
import { EvidenceItem } from '../../types';

interface EvidenceDrawerProps {
  item: EvidenceItem | null;
  index: number | null;
  contradicts: boolean;
  onClose: () => void;
}

/** Opened by clicking a numbered citation — the answer to "where did this
 * come from," one click away, everywhere evidence is cited. */
export function EvidenceDrawer({ item, index, contradicts, onClose }: EvidenceDrawerProps) {
  return (
    <SidePanel
      open={!!item}
      onClose={onClose}
      overlay
      eyebrow={index !== null ? `Citation [${index}]` : ''}
      title={contradicts ? 'Contradicting evidence' : 'Supporting evidence'}
      width="w-[420px]">
      {item && (
        <div className="p-5">
          <StatusBadge status="evidence" />
          <h3 className="mt-3 text-[15px] font-medium leading-snug text-ink">{item.claim}</h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{item.evidence}</p>
          <dl className="mt-6 space-y-3 border-t border-line pt-4">
            <div className="flex items-center justify-between">
              <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Source</dt>
              <dd>
                <SourceBadge source={item.source} />
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Relevance</dt>
              <dd className="text-xs text-ink-soft">{item.relevance}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Date</dt>
              <dd className="text-xs text-ink-soft">{item.date}</dd>
            </div>
          </dl>
        </div>
      )}
    </SidePanel>
  );
}
