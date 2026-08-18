import React from 'react';
import { ExternalLinkIcon, CheckCircle2Icon, AlertTriangleIcon } from 'lucide-react';
import { EvidenceSource } from '../../types';

export function EvidenceCard({ source }: {source: EvidenceSource;}) {
  const contradicts = source.direction === 'contradicts';
  const Icon = contradicts ? AlertTriangleIcon : CheckCircle2Icon;

  return (
    <article
      className={`group border p-4 transition-colors ${
      contradicts ?
      'border-critical-line bg-critical-soft/50 hover:border-critical' :
      'border-line bg-surface hover:border-line-strong'}`
      }>
      
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="text-[13px] font-semibold leading-snug text-ink">{source.title}</h4>
          <p className="mt-1 text-xs text-muted">
            {source.publisher} · {source.date} · {source.type}
          </p>
        </div>
        <ExternalLinkIcon
          className="h-3.5 w-3.5 shrink-0 text-muted-soft opacity-0 transition-opacity group-hover:opacity-100"
          strokeWidth={1.75} />
        
      </div>

      <p className="mt-3 text-xs leading-relaxed text-ink-soft">{source.summary}</p>

      <div className="mt-3.5 flex items-center justify-between border-t border-line/70 pt-3">
        <span
          className={`inline-flex items-center gap-1.5 text-2xs font-medium uppercase tracking-label ${
          contradicts ? 'text-critical' : 'text-accent'}`
          }>
          
          <Icon className="h-3 w-3" strokeWidth={2} />
          {contradicts ? 'Weakens opportunity' : 'Supports opportunity'}
        </span>
        <span className="font-mono text-2xs uppercase tracking-label text-muted">
          {source.relevance} relevance
        </span>
      </div>
    </article>);

}