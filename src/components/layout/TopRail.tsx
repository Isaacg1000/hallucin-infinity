import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SearchIcon, ChevronRightIcon, BellIcon, ClockIcon } from 'lucide-react';
import { company } from '../../data/company';
import { opportunityById } from '../../data/opportunities';

function useCrumbs() {
  const { pathname } = useLocation();
  const crumbs: {label: string;to?: string;}[] = [
  { label: company.fund.replace('Meridian Capital · ', '') },
  { label: company.name, to: '/' }];


  if (pathname.startsWith('/analysis')) {
    const id = pathname.split('/')[2];
    crumbs.push({ label: 'Opportunities', to: '/' });
    crumbs.push({ label: opportunityById(id).title });
  } else if (pathname.startsWith('/decision')) {
    crumbs.push({ label: 'Decisions', to: '/decision' });
    crumbs.push({ label: 'Pricing Validation Sprint' });
  } else {
    crumbs.push({ label: 'Opportunities' });
  }
  return crumbs;
}

export function TopRail() {
  const crumbs = useCrumbs();

  return (
    <div className="flex h-10 shrink-0 items-center gap-3 border-b border-line bg-surface px-3">
      <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5">
        {crumbs.map((c, i) =>
        <React.Fragment key={c.label}>
            {i > 0 && <ChevronRightIcon className="h-3 w-3 shrink-0 text-muted-soft" strokeWidth={2} />}
            {c.to ?
          <Link
            to={c.to}
            className="truncate text-xs text-muted transition-colors hover:text-ink">
            
                {c.label}
              </Link> :

          <span
            className={`truncate text-xs ${i === crumbs.length - 1 ? 'font-medium text-ink' : 'text-muted'}`}>
            
                {c.label}
              </span>
          }
          </React.Fragment>
        )}
      </nav>

      <div className="ml-4 hidden min-w-0 flex-1 md:block">
        <div className="relative w-full max-w-md">
          <SearchIcon
            className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-soft"
            strokeWidth={1.75} />
          
          <input
            type="search"
            aria-label="Search opportunities, evidence, assumptions"
            placeholder="Search opportunities, evidence, assumptions…"
            className="h-7 w-full border border-line bg-raised pl-7 pr-12 text-xs text-ink placeholder:text-muted-soft focus:border-line-strong focus:bg-surface focus:outline-none" />
          
          <span className="pointer-events-none absolute right-1.5 top-1/2 hidden -translate-y-1/2 border border-line bg-surface px-1 font-mono text-2xs text-muted-soft lg:block">
            ⌘K
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <span className="hidden items-center gap-1.5 font-mono text-2xs tabular text-muted lg:inline-flex">
          <ClockIcon className="h-3 w-3" strokeWidth={1.75} />
          Analysis run {company.analysisRun}
        </span>
        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-7 w-7 items-center justify-center border border-line text-muted transition-colors hover:bg-sunken hover:text-ink">
          
          <BellIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="absolute right-1 top-1 h-1 w-1 bg-accent" />
        </button>
      </div>
    </div>);

}