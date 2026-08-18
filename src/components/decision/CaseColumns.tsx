import React from 'react';
import { PlusIcon, MinusIcon } from 'lucide-react';

interface CaseItem {
  id: string;
  claim: string;
  detail: string;
  strength: string;
}

interface CaseColumnsProps {
  caseFor: CaseItem[];
  caseAgainst: CaseItem[];
}

function Column({
  items,
  variant



}: {items: CaseItem[];variant: 'for' | 'against';}) {
  const isFor = variant === 'for';
  const Icon = isFor ? PlusIcon : MinusIcon;
  return (
    <div className="flex min-w-0 flex-col">
      <div
        className={`flex h-9 items-center justify-between border-b px-3 ${
        isFor ?
        'border-positive-line bg-positive-soft' :
        'border-critical-line bg-critical-soft'}`
        }>
        
        <h3
          className={`text-2xs font-semibold uppercase tracking-label ${
          isFor ? 'text-positive' : 'text-critical'}`
          }>
          
          {isFor ? 'Case for' : 'Case against'}
        </h3>
        <span className="font-mono text-2xs tabular text-muted">{items.length}</span>
      </div>
      <ul className="divide-y divide-line">
        {items.map((c) =>
        <li key={c.id} className="flex gap-2.5 px-3 py-2.5">
            <span
            className={`mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center border ${
            isFor ? 'border-positive-line text-positive' : 'border-critical-line text-critical'}`
            }>
            
              <Icon className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <div className="min-w-0">
              <p className="text-base font-medium leading-snug text-ink">{c.claim}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{c.detail}</p>
              <p className="mt-1.5 text-2xs uppercase tracking-label text-muted-soft">{c.strength}</p>
            </div>
          </li>
        )}
      </ul>
    </div>);

}

export function CaseColumns({ caseFor, caseAgainst }: CaseColumnsProps) {
  return (
    <div className="grid grid-cols-1 divide-y divide-line border border-line bg-surface lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      <Column items={caseFor} variant="for" />
      <Column items={caseAgainst} variant="against" />
    </div>);

}