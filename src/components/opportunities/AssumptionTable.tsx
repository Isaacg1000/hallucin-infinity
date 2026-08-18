import React from 'react';
import { Assumption } from '../../types';
import { StatusPill } from '../ui/StatusPill';

const CONFIDENCE_TONE: Record<string, string> = {
  High: 'text-ink',
  Medium: 'text-caution',
  Low: 'text-critical'
};

const IMPACT_TONE: Record<string, string> = {
  Critical: 'text-critical',
  High: 'text-caution',
  Medium: 'text-muted'
};

export function AssumptionTable({ assumptions }: {assumptions: Assumption[];}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted">
              Assumption
            </th>
            <th scope="col" className="px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted">
              Confidence
            </th>
            <th scope="col" className="px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted">
              Impact if Wrong
            </th>
            <th scope="col" className="px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {assumptions.map((a) =>
          <tr key={a.id} className="border-b border-line align-top last:border-b-0 hover:bg-raised">
              <td className="max-w-md px-4 py-3">
                <span className="block text-[13px] font-medium text-ink">{a.assumption}</span>
                <span className="mt-1 block text-xs leading-relaxed text-muted">{a.note}</span>
              </td>
              <td className={`px-4 py-3 text-[13px] ${CONFIDENCE_TONE[a.confidence]}`}>{a.confidence}</td>
              <td className={`px-4 py-3 text-[13px] ${IMPACT_TONE[a.impactIfWrong]}`}>{a.impactIfWrong}</td>
              <td className="px-4 py-3">
                <StatusPill label={a.status} />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>);

}