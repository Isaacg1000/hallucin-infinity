import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { Assumption } from '../../types';
import { StatusPill } from '../ui/StatusPill';

const CONF_TONE: Record<string, string> = {
  High: 'text-ink',
  Medium: 'text-caution',
  Low: 'text-critical'
};

const IMPACT_TONE: Record<string, string> = {
  Critical: 'text-critical',
  High: 'text-caution',
  Medium: 'text-muted'
};

interface AssumptionsTableProps {
  assumptions: Assumption[];
  activeId: string | null;
  onSelect: (id: string) => void;
}

export function AssumptionsTable({ assumptions, activeId, onSelect }: AssumptionsTableProps) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="bg-raised">
          {['Assumption', 'Confidence', 'Impact if Wrong', 'Evidence Coverage', 'Status', ''].map((h) =>
          <th
            key={h}
            scope="col"
            className="border-b border-line px-4 py-2.5 text-left text-2xs font-medium uppercase tracking-label text-muted">
            
              {h}
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {assumptions.map((a) =>
        <tr
          key={a.id}
          tabIndex={0}
          onClick={() => onSelect(a.id)}
          onKeyDown={(e) => e.key === 'Enter' && onSelect(a.id)}
          className={`group cursor-pointer border-b border-line/80 transition-colors duration-75 focus:outline-none ${
          activeId === a.id ? 'bg-accent-soft' : 'hover:bg-sunken focus:bg-sunken'}`
          }>
          
            <td className="relative px-4 py-3">
              <span
              className={`absolute inset-y-0 left-0 w-[2px] ${
              activeId === a.id ? 'bg-accent' : 'bg-transparent'}`
              } />
            
              <span className="text-base font-medium text-ink">{a.text}</span>
              <span className="mt-0.5 block text-2xs text-muted">
                {a.supportedBy.length} supporting · {a.challengedBy.length} challenging
              </span>
            </td>
            <td className={`px-4 py-3 text-xs ${CONF_TONE[a.confidence]}`}>{a.confidence}</td>
            <td className={`px-4 py-3 text-xs ${IMPACT_TONE[a.impactIfWrong]}`}>{a.impactIfWrong}</td>
            <td className="px-4 py-3">
              <StatusPill label={a.coverage} />
            </td>
            <td className="px-4 py-3">
              <StatusPill label={a.status} />
            </td>
            <td className="px-4 py-3 text-right">
              <ChevronRightIcon
              className="ml-auto h-3.5 w-3.5 text-muted-soft transition-transform group-hover:translate-x-0.5"
              strokeWidth={2} />
            
            </td>
          </tr>
        )}
      </tbody>
    </table>);

}