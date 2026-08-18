import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Company } from '../../types';
import { StatusPill } from '../ui/StatusPill';

export function PortfolioCompanyCard({ company }: {company: Company;}) {
  const progress = company.identified > 0 ? company.realized / company.identified * 100 : 0;
  const executing = company.identified > 0 ? company.inExecution / company.identified * 100 : 0;
  const validated = company.identified > 0 ? company.validated / company.identified * 100 : 0;

  return (
    <Link
      to={`/companies/${company.id}`}
      className="group flex flex-col border border-line bg-surface p-5 transition-all duration-150 hover:border-line-strong hover:shadow-card">
      
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-ink">
            {company.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-muted">
            {company.industry} · {company.fund}
          </p>
        </div>
        <StatusPill label={company.thesisStatus} />
      </div>

      <dl className="mt-5 grid grid-cols-4 gap-3 border-y border-line py-3">
        {[
        ['Revenue', company.revenue],
        ['EBITDA', company.ebitda],
        ['Employees', company.employees],
        ['Hold', company.holdPeriod.replace('Month ', 'Mo ')]].
        map(([label, value]) =>
        <div key={label as string}>
            <dt className="text-2xs uppercase tracking-label text-muted-soft">{label}</dt>
            <dd className="mt-1 font-mono text-[13px] tabular text-ink">{value}</dd>
          </div>
        )}
      </dl>

      <div className="mt-4">
        <div className="flex items-baseline justify-between">
          <span className="text-2xs font-medium uppercase tracking-label text-muted">
            Value creation
          </span>
          <span className="font-mono text-xs tabular text-ink">
            ${company.realized.toFixed(1)}M realized
            <span className="text-muted-soft"> / ${company.identified.toFixed(1)}M</span>
          </span>
        </div>
        <div className="relative mt-2 h-1.5 w-full bg-line" aria-hidden="true">
          <div className="absolute inset-y-0 left-0 bg-accent-line" style={{ width: `${validated}%` }} />
          <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${executing}%` }} />
          <div className="absolute inset-y-0 left-0 bg-positive" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted">
          <span>{company.openOpportunities} open opportunities</span>
          <span className="inline-flex items-center gap-1 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100">
            Open workspace
            <ArrowRightIcon className="h-3 w-3" strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>);

}