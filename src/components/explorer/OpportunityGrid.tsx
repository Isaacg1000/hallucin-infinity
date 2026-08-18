import React from 'react';
import { ArrowUpIcon, AlertTriangleIcon } from 'lucide-react';
import { Opportunity } from '../../types';
import { StatusPill } from '../ui/StatusPill';
import { Meter, scoreTone } from '../ui/Meter';

const COMPLEXITY_LEVEL: Record<string, number> = { Low: 1, Medium: 2, High: 3 };
const EVIDENCE_LEVEL: Record<string, number> = { Strong: 3, Moderate: 2, Limited: 1 };

const COLUMNS: {key: string;label: string;align?: string;sortable?: boolean;width?: string;}[] = [
{ key: 'title', label: 'Opportunity', sortable: true, width: 'w-[26%]' },
{ key: 'category', label: 'Category', width: 'w-[11%]' },
{ key: 'score', label: 'Score', sortable: true, align: 'text-right', width: 'w-[9%]' },
{ key: 'ebitda', label: 'EBITDA Impact', sortable: true, align: 'text-right', width: 'w-[12%]' },
{ key: 'confidence', label: 'Confidence', sortable: true, align: 'text-right', width: 'w-[10%]' },
{ key: 'evidence', label: 'Evidence', width: 'w-[10%]' },
{ key: 'complexity', label: 'Complexity', width: 'w-[9%]' },
{ key: 'speed', label: 'Time to Impact', sortable: true, align: 'text-right', width: 'w-[8%]' },
{ key: 'status', label: 'Status', width: 'w-[8%]' }];


interface OpportunityGridProps {
  rows: Opportunity[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpen: (id: string) => void;
  sort: string;
  onSort: (key: string) => void;
}

function EvidenceDots({ strength }: {strength: string;}) {
  const level = EVIDENCE_LEVEL[strength] ?? 0;
  const tone =
  level === 3 ? 'bg-positive' : level === 2 ? 'bg-ink-soft' : 'bg-caution';
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex items-center gap-[3px]" aria-hidden="true">
        {[0, 1, 2].map((i) =>
        <span key={i} className={`block h-1 w-1 ${i < level ? tone : 'bg-line-strong'}`} />
        )}
      </span>
      <span className="text-xs text-ink-soft">{strength}</span>
    </span>);

}

function ComplexityBars({ level }: {level: string;}) {
  const n = COMPLEXITY_LEVEL[level] ?? 0;
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="flex items-end gap-[2px]" aria-hidden="true">
        {[3, 5, 7].map((h, i) =>
        <span
          key={h}
          className={`block w-[3px] ${i < n ? n === 3 ? 'bg-caution' : 'bg-ink-soft' : 'bg-line-strong'}`}
          style={{ height: `${h}px` }} />

        )}
      </span>
      <span className="text-xs text-ink-soft">{level}</span>
    </span>);

}

export function OpportunityGrid({
  rows,
  selectedId,
  onSelect,
  onOpen,
  sort,
  onSort
}: OpportunityGridProps) {
  const maxEbitda = Math.max(...rows.map((r) => r.ebitda), 1);

  return (
    <table className="w-full min-w-[1080px] table-fixed border-collapse">
      <thead className="sticky top-0 z-10">
        <tr className="bg-raised">
          {COLUMNS.map((c) =>
          <th
            key={c.key}
            scope="col"
            className={`${c.width} border-b border-line px-3 py-1.5 text-left text-2xs font-medium uppercase tracking-label text-muted ${c.align ?? ''}`}>
            
              {c.sortable ?
            <button
              type="button"
              onClick={() => onSort(c.key)}
              className={`inline-flex items-center gap-1 transition-colors hover:text-ink ${
              sort === c.key ? 'text-ink' : ''}`
              }>
              
                  {c.label}
                  {sort === c.key && <ArrowUpIcon className="h-2.5 w-2.5 rotate-180" strokeWidth={2.5} />}
                </button> :

            c.label
            }
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map((o) => {
          const selected = o.id === selectedId;
          return (
            <tr
              key={o.id}
              data-row-id={o.id}
              tabIndex={0}
              aria-selected={selected}
              onClick={() => onSelect(o.id)}
              onDoubleClick={() => onOpen(o.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onOpen(o.id);
                if (e.key === ' ') {
                  e.preventDefault();
                  onSelect(o.id);
                }
              }}
              className={`group cursor-pointer border-b border-line/80 transition-colors duration-75 focus:outline-none ${
              selected ? 'bg-accent-soft' : 'hover:bg-sunken focus:bg-sunken'}`
              }>
              
              <td className="relative px-3 py-2">
                <span
                  className={`absolute inset-y-0 left-0 w-[2px] ${selected ? 'bg-accent' : 'bg-transparent'}`} />
                
                <div className="flex items-center gap-2">
                  <span className="truncate text-base font-medium text-ink">{o.title}</span>
                  {o.evidenceCount.contradicting >= 4 &&
                  <AlertTriangleIcon
                    className="h-3 w-3 shrink-0 text-caution"
                    strokeWidth={2}
                    aria-label="Material contradicting evidence" />

                  }
                </div>
                <span className="mt-0.5 block truncate text-2xs text-muted">
                  {o.evidenceCount.supporting} supporting · {o.evidenceCount.contradicting} contradicting ·{' '}
                  {o.assumptionCount.unresolved} unresolved
                </span>
              </td>

              <td className="px-3 py-2 text-xs text-muted">{o.category}</td>

              <td className="px-3 py-2">
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`font-mono text-base font-semibold tabular ${
                    o.score >= 85 ? 'text-accent' : o.score >= 70 ? 'text-ink' : 'text-muted'}`
                    }>
                    
                    {o.score}
                  </span>
                  <Meter value={o.score} tone={scoreTone(o.score)} className="w-12" height="h-[2px]" />
                </div>
              </td>

              <td className="px-3 py-2">
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-base tabular font-medium text-ink">
                    +${o.ebitda.toFixed(1)}M
                  </span>
                  <Meter
                    value={o.ebitda}
                    max={maxEbitda}
                    tone="accent"
                    className="w-14"
                    height="h-[2px]" />
                  
                </div>
              </td>

              <td className="px-3 py-2 text-right">
                <span
                  className={`font-mono text-base tabular ${
                  o.confidence >= 80 ? 'text-ink' : o.confidence >= 65 ? 'text-caution' : 'text-critical'}`
                  }>
                  
                  {o.confidence}%
                </span>
              </td>

              <td className="px-3 py-2">
                <EvidenceDots strength={o.evidence} />
              </td>

              <td className="px-3 py-2">
                <ComplexityBars level={o.complexity} />
              </td>

              <td className="px-3 py-2 text-right font-mono text-xs tabular text-muted">
                {o.timeToImpact}
              </td>

              <td className="px-3 py-2">
                <StatusPill label={o.status} />
              </td>
            </tr>);

        })}
      </tbody>
    </table>);

}