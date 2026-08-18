import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CompassIcon, BookmarkIcon, LifeBuoyIcon } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Modal } from '../ui/Modal';

interface NavItem {
  label: string;
  to: string;
  icon: typeof HomeIcon;
  end?: boolean;
}

// V1 nav — just the three-feature flow: start on Home, browse past
// explorations, revisit saved routes. Portfolio-side navigation (Overview,
// Companies, Opportunities, Decisions, Experiments, Intelligence) is a
// future phase and intentionally not here.
const EXPLORE: NavItem[] = [
  { label: 'Home', to: '/', icon: HomeIcon, end: true },
  { label: 'Explore', to: '/explorations', icon: CompassIcon },
  { label: 'Saved', to: '/saved', icon: BookmarkIcon }
];

function itemClass(isActive: boolean) {
  return [
    'group flex items-center gap-2.5 rounded-md py-[7px] pl-3 pr-2 text-[13px] transition-colors duration-150',
    isActive ? 'bg-accent-soft text-ink font-medium' : 'text-muted hover:bg-raised hover:text-ink'
  ].join(' ');
}

function NavGroup({ items }: { items: NavItem[] }) {
  return (
    <ul className="space-y-0.5">
      {items.map((item) => (
        <li key={item.to}>
          <NavLink to={item.to} end={item.end} className={({ isActive }) => itemClass(isActive)}>
            {({ isActive }) => (
              <>
                <item.icon
                  className={`h-4 w-4 shrink-0 ${isActive ? 'text-accent' : 'text-muted-soft group-hover:text-muted'}`}
                  strokeWidth={1.75}
                />
                <span className="flex-1 truncate">{item.label}</span>
              </>
            )}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}

export function Sidebar() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <aside className="relative flex h-full w-[208px] shrink-0 flex-col overflow-hidden border-r border-line bg-surface">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-emerald-400/30 blur-[80px]"
      />

      <div className="relative flex h-14 items-center border-b border-line px-4">
        <Logo />
      </div>

      <nav className="relative flex-1 overflow-y-auto px-2.5 py-4" aria-label="Primary">
        <NavGroup items={EXPLORE} />
      </nav>

      <div className="border-t border-line px-2.5 py-3">
        <button
          type="button"
          onClick={() => setHelpOpen(true)}
          className="flex w-full items-center gap-2.5 rounded-md py-[7px] pl-3 pr-2 text-left text-[13px] text-muted transition-colors hover:bg-raised hover:text-ink">
          <LifeBuoyIcon className="h-4 w-4 shrink-0 text-muted-soft" strokeWidth={1.75} />
          Help
        </button>

        <div className="mt-2 flex items-center gap-2.5 rounded-md px-3 py-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line-strong bg-raised font-mono text-[11px] font-medium text-ink-soft">
            WD
          </span>
          <span className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] text-ink">Walker Dudum</span>
            <span className="block truncate text-2xs text-muted-soft">Strategy</span>
          </span>
        </div>
      </div>

      <Modal open={helpOpen} onClose={() => setHelpOpen(false)} title="How Hallucin∞ works">
        <p className="text-sm leading-relaxed text-ink-soft">
          Start from one question. Hallucin∞ maps the possibility space around it, challenges the paths it finds,
          gathers evidence, and narrows toward the routes worth investigating.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          <span className="font-medium text-ink">Explore</span> holds every exploration you've run.{' '}
          <span className="font-medium text-ink">Saved</span> holds the routes worth holding onto while you keep
          exploring. From there: compare a few saved routes against each other, then validate the one that matters
          most before deciding whether it's worth pursuing.
        </p>
      </Modal>
    </aside>
  );
}
