import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Opportunity } from '../../types';
import { StatusPill } from '../ui/StatusPill';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';
import { EvidenceBadge } from '../ui/EvidenceBadge';

const IMPACT_WEIGHT: Record<string, string> = {
  'Very High': 'w-full bg-accent',
  High: 'w-3/4 bg-accent',
  Medium: 'w-1/2 bg-ink-soft',
  Low: 'w-1/4 bg-muted-soft'
};

export function OpportunityTable({ rows }: {rows: Opportunity[];}) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1040px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {[
            'Portfolio Company',
            'Opportunity',
            'Category',
            'Impact',
            'Confidence',
            'Evidence',
            'Est. EBITDA',
            'Status'].
            map((h) =>
            <th
              key={h}
              scope="col"
              className={`px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted ${
              h === 'Est. EBITDA' ? 'text-right' : ''}`
              }>
              
                {h}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((o) =>
          <tr
            key={o.id}
            onClick={() => navigate(`/opportunities/${o.id}`)}
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/opportunities/${o.id}`)}
            className="cursor-pointer border-b border-line transition-colors last:border-b-0 hover:bg-raised">
            
              <td className="px-4 py-3 text-[13px] text-ink-soft">{o.company}</td>
              <td className="px-4 py-3">
                <span className="block text-[13px] font-medium text-ink">{o.title}</span>
                <span className="mt-0.5 block max-w-md truncate text-xs text-muted">{o.summary}</span>
              </td>
              <td className="px-4 py-3 text-[13px] text-muted">{o.category}</td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="block h-[3px] w-12 bg-line">
                    <span className={`block h-full ${IMPACT_WEIGHT[o.impact]}`} />
                  </span>
                  <span className="text-xs text-ink-soft">{o.impact}</span>
                </div>
              </td>
              <td className="px-4 py-3">
                <ConfidenceBadge value={o.confidence} />
              </td>
              <td className="px-4 py-3">
                <EvidenceBadge strength={o.evidence} />
              </td>
              <td className="px-4 py-3 text-right font-mono text-[13px] tabular font-medium text-ink">
                {o.ebitda > 0 ? `+$${o.ebitda.toFixed(1)}M` : 'Not yet sized'}
              </td>
              <td className="px-4 py-3">
                <StatusPill label={o.status} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}