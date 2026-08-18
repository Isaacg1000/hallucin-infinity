import React, { useMemo, useState } from 'react';
import { LayoutGridIcon, ListIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '../components/ui/PageHeader';
import { PortfolioCompanyCard } from '../components/portfolio/PortfolioCompanyCard';
import { StatusPill } from '../components/ui/StatusPill';
import { companies } from '../data/companies';

const FILTERS = ['All', 'Fund IV', 'Fund III', 'On Track', 'Watch', 'Off Track'];

export function PortfolioCompanies() {
  const [filter, setFilter] = useState('All');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  const rows = useMemo(() => {
    if (filter === 'All') return companies;
    if (filter.startsWith('Fund')) return companies.filter((c) => c.fund === filter);
    return companies.filter((c) => c.thesisStatus === filter);
  }, [filter]);

  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <PageHeader
        eyebrow="Meridian Capital · Fund IV"
        title="Portfolio Companies"
        subtitle="Every company in the portfolio, with the value-creation position of each hold." />
      

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) =>
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`h-8 border px-3 text-xs transition-colors ${
            filter === f ?
            'border-ink bg-ink text-white' :
            'border-line bg-surface text-muted hover:border-line-strong hover:text-ink'}`
            }>
            
              {f}
            </button>
          )}
        </div>
        <div className="flex items-center border border-line bg-surface">
          {([['grid', LayoutGridIcon], ['list', ListIcon]] as const).map(([v, Icon]) =>
          <button
            key={v}
            type="button"
            onClick={() => setView(v)}
            aria-label={`${v} view`}
            aria-pressed={view === v}
            className={`flex h-8 w-9 items-center justify-center transition-colors ${
            view === v ? 'bg-raised text-ink' : 'text-muted hover:text-ink'}`
            }>
            
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </button>
          )}
        </div>
      </div>

      {rows.length === 0 ?
      <p className="mt-10 border border-dashed border-line-strong bg-surface px-6 py-16 text-center text-sm text-muted">
          No companies match this filter.
        </p> :
      view === 'grid' ?
      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {rows.map((c) =>
        <PortfolioCompanyCard key={c.id} company={c} />
        )}
        </div> :

      <div className="mt-5 overflow-x-auto border border-line bg-surface">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-b border-line">
                {['Company', 'Industry', 'Revenue', 'EBITDA', 'Hold', 'Identified', 'Realized', 'Thesis'].map(
                (h) =>
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted">
                  
                      {h}
                    </th>

              )}
              </tr>
            </thead>
            <tbody>
              {rows.map((c) =>
            <tr
              key={c.id}
              onClick={() => navigate(`/companies/${c.id}`)}
              className="cursor-pointer border-b border-line last:border-b-0 hover:bg-raised">
              
                  <td className="px-4 py-3 text-[13px] font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-[13px] text-muted">{c.industry}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular text-ink-soft">{c.revenue}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular text-ink-soft">{c.ebitda}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular text-muted">{c.holdPeriod}</td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular text-ink">
                    ${c.identified.toFixed(1)}M
                  </td>
                  <td className="px-4 py-3 font-mono text-[13px] tabular text-positive">
                    ${c.realized.toFixed(1)}M
                  </td>
                  <td className="px-4 py-3">
                    <StatusPill label={c.thesisStatus} />
                  </td>
                </tr>
            )}
            </tbody>
          </table>
        </div>
      }
    </div>);

}