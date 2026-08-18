import React from 'react';
import { Outlet } from 'react-router-dom';
import { AlertTriangleIcon } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useExploration } from '../../state/ExplorationContext';

// V1 has no Header — fund-switching, cross-portfolio search, and
// notifications were all Portfolio-side concerns (Header previously
// showed "Meridian Capital — Fund IV" and searched across companies,
// decisions, experiments). None of that applies to the frozen
// Explore -> Compare -> Validate flow, so the shell is just the sidebar
// and the page content.
export function AppShell() {
  const { isDemoData } = useExploration();

  return (
    <div className="flex h-full w-full overflow-hidden bg-canvas">
      <Sidebar />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {isDemoData && (
          <div className="flex shrink-0 items-center gap-2 border-b border-caution-line bg-caution-soft px-4 py-2 text-xs text-caution">
            <AlertTriangleIcon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
            Showing demo routes — live generation was unavailable for this exploration.
          </div>
        )}
        <div className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
