import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, BellIcon, ChevronDownIcon, PlusIcon, CheckIcon, LayersIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useToast } from '../ui/Toast';
import { useExploration } from '../../state/ExplorationContext';
import { companies } from '../../data/companies';
import { opportunities } from '../../data/opportunities';
import { decisions } from '../../data/decisions';
import { experiments } from '../../data/experiments';
import { ContextDrawer } from './ContextDrawer';
import { Opportunity } from '../../types';

const FUNDS = [
{ id: 'f4', name: 'Meridian Capital — Fund IV', detail: '18 companies · $1.4B AUM' },
{ id: 'f3', name: 'Meridian Capital — Fund III', detail: '11 companies · $860M AUM' },
{ id: 'all', name: 'All Funds', detail: '41 companies · $2.6B AUM' }];


const NOTIFICATIONS = [
{
  id: 'n1',
  title: 'CFO feedback logged on Pricing Architecture Pilot',
  meta: 'NorthPeak Industrial · 2h ago',
  unread: true,
  to: '/decisions/pricing-pilot'
},
{
  id: 'n2',
  title: 'Contradictory evidence found for AI Demand Forecasting',
  meta: 'NorthPeak Industrial · 5h ago',
  unread: true,
  to: '/decisions/forecasting-evidence'
},
{
  id: 'n3',
  title: 'Service Deflection Pilot reading is below threshold',
  meta: 'Experiment · Day 34 of 45',
  unread: true,
  to: '/experiments'
},
{
  id: 'n4',
  title: 'Procurement Wave One approved by Operating Partner',
  meta: 'NorthPeak Industrial · Yesterday',
  unread: false,
  to: '/decisions/procurement-wave-one'
}];

/** First cross-entity name match, in priority order. Real navigation, not
 * a decorative box — deliberately simple rather than a full search results
 * surface, which is a larger feature than this input claims to be.
 * `allOpportunities` includes anything tracked live from Explore, so a
 * just-validated route is findable here too, not just the static list. */
function findSearchTarget(query: string, allOpportunities: Opportunity[]): string | null {
  const q = query.trim().toLowerCase();
  if (!q) return null;
  const company = companies.find((c) => c.name.toLowerCase().includes(q));
  if (company) return `/companies/${company.id}`;
  const opportunity = allOpportunities.find((o) => o.title.toLowerCase().includes(q));
  if (opportunity) return `/opportunities/${opportunity.id}`;
  const decision = decisions.find((d) => d.title.toLowerCase().includes(q));
  if (decision) return `/decisions/${decision.id}`;
  const experiment = experiments.find((e) => e.name.toLowerCase().includes(q));
  if (experiment) return '/experiments';
  return null;
}


interface HeaderProps {
  onNewAnalysis: () => void;
}

export function Header({ onNewAnalysis }: HeaderProps) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { trackedOpportunities } = useExploration();
  const [fund, setFund] = useState(FUNDS[0]);
  const [openMenu, setOpenMenu] = useState<'fund' | 'bell' | null>(null);
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [contextOpen, setContextOpen] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const unreadCount = notifications.filter((n) => n.unread).length;

  function openNotification(id: string, to: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    setOpenMenu(null);
    navigate(to);
  }

  function runSearch() {
    const target = findSearchTarget(query, [...opportunities, ...trackedOpportunities]);
    if (target) {
      navigate(target);
      setQuery('');
    } else if (query.trim()) {
      showToast(`No matches for "${query.trim()}"`);
    }
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenMenu(null);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <header
      ref={ref}
      className="relative z-30 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-surface px-4">
      
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpenMenu(openMenu === 'fund' ? null : 'fund')}
          aria-expanded={openMenu === 'fund'}
          className="flex h-9 items-center gap-2 border border-line px-3 text-[13px] text-ink transition-colors hover:border-line-strong hover:bg-raised">
          
          <span className="h-1.5 w-1.5 bg-accent" aria-hidden="true" />
          <span className="font-medium">{fund.name}</span>
          <ChevronDownIcon className="h-3.5 w-3.5 text-muted" strokeWidth={1.75} />
        </button>
        {openMenu === 'fund' &&
        <div className="absolute left-0 top-11 w-72 border border-line bg-surface shadow-pop">
            <p className="border-b border-line bg-raised px-3 py-1.5 text-2xs font-medium uppercase tracking-label text-muted-soft">
              Switch fund
            </p>
            {FUNDS.map((f) =>
          <button
            key={f.id}
            type="button"
            onClick={() => {
              setFund(f);
              setOpenMenu(null);
            }}
            className="flex w-full items-start justify-between gap-3 border-b border-line px-3 py-2.5 text-left last:border-b-0 hover:bg-raised">
            
                <span>
                  <span className="block text-[13px] text-ink">{f.name}</span>
                  <span className="block text-xs text-muted">{f.detail}</span>
                </span>
                {f.id === fund.id && <CheckIcon className="mt-1 h-3.5 w-3.5 text-accent" strokeWidth={2} />}
              </button>
          )}
          </div>
        }
      </div>

      <button
        type="button"
        onClick={() => setContextOpen(true)}
        className="flex h-9 items-center gap-1.5 border border-line px-2.5 text-xs text-muted-soft transition-colors hover:border-line-strong hover:text-ink">
        <LayersIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        Context
      </button>

      <div className="relative min-w-0 flex-1 max-w-xl">
        <SearchIcon
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-soft"
          strokeWidth={1.75} />
        
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') runSearch();
          }}
          placeholder="Search companies, opportunities, explorations, evidence…"
          aria-label="Search"
          className="h-9 w-full border border-line bg-raised pl-9 pr-16 text-[13px] text-ink placeholder:text-muted-soft focus:border-line-strong focus:bg-surface focus:outline-none" />

        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 border border-line bg-surface px-1.5 py-[1px] font-mono text-2xs text-muted-soft">
          ⌘K
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenMenu(openMenu === 'bell' ? null : 'bell')}
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center border border-line text-ink-soft transition-colors hover:border-line-strong hover:bg-raised">
            
            <BellIcon className="h-4 w-4" strokeWidth={1.75} />
            {unreadCount > 0 && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-critical" />}
          </button>
          {openMenu === 'bell' &&
          <div className="absolute right-0 top-11 w-[360px] border border-line bg-surface shadow-pop">
              <p className="border-b border-line px-3 py-2 text-2xs font-medium uppercase tracking-label text-muted">
                Notifications
              </p>
              {notifications.map((n) =>
            <button
              key={n.id}
              type="button"
              onClick={() => openNotification(n.id, n.to)}
              className="flex w-full gap-2.5 border-b border-line px-3 py-2.5 text-left last:border-b-0 hover:bg-raised">

                  <span
                className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${n.unread ? 'bg-accent' : 'bg-line-strong'}`} />

                  <span>
                    <span className={`block text-[13px] leading-snug ${n.unread ? 'text-ink' : 'text-ink-soft'}`}>{n.title}</span>
                    <span className="mt-0.5 block text-xs text-muted">{n.meta}</span>
                  </span>
                </button>
            )}
            </div>
          }
        </div>

        <Button variant="primary" onClick={onNewAnalysis}>
          <PlusIcon className="h-3.5 w-3.5" strokeWidth={2} />
          New Exploration
        </Button>
      </div>

      <ContextDrawer
        open={contextOpen}
        onClose={() => setContextOpen(false)}
        fund={fund.name}
        company="NorthPeak Industrial"
      />
    </header>);

}