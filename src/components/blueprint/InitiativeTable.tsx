import React from 'react';
import { Initiative } from '../../types';
import { StatusPill } from '../ui/StatusPill';
import { ConfidenceBadge } from '../ui/ConfidenceBadge';

export function InitiativeTable({ initiatives }: {initiatives: Initiative[];}) {
  const total = initiatives.reduce((s, i) => s + i.impact, 0);

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            {['Initiative', 'Owner', 'Expected Impact', 'Confidence', 'Status', 'Timeline'].map((h) =>
            <th
              key={h}
              scope="col"
              className={`px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted ${
              h === 'Expected Impact' ? 'text-right' : ''}`
              }>
              
                {h}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {initiatives.map((i) =>
          <tr key={i.id} className="border-b border-line transition-colors hover:bg-raised">
              <td className="px-4 py-3 text-[13px] font-medium text-ink">{i.name}</td>
              <td className="px-4 py-3">
                <span className="block text-[13px] text-ink-soft">{i.owner}</span>
                <span className="block text-xs text-muted">{i.ownerRole}</span>
              </td>
              <td className="px-4 py-3 text-right font-mono text-[13px] tabular font-medium text-accent">
                +${i.impact.toFixed(1)}M
              </td>
              <td className="px-4 py-3">
                <ConfidenceBadge value={i.confidence} />
              </td>
              <td className="px-4 py-3">
                <StatusPill label={i.status} />
              </td>
              <td className="px-4 py-3 font-mono text-xs tabular text-muted">{i.timeline}</td>
            </tr>
          )}
          <tr className="bg-raised">
            <td className="px-4 py-3 text-2xs font-medium uppercase tracking-label text-muted" colSpan={2}>
              Workstream total
            </td>
            <td className="px-4 py-3 text-right font-mono text-[13px] tabular font-semibold text-ink">
              +${total.toFixed(1)}M
            </td>
            <td colSpan={3} />
          </tr>
        </tbody>
      </table>
    </div>);

}