import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

// V1 has no Header — fund-switching, cross-portfolio search, and
// notifications were all Portfolio-side concerns (Header previously
// showed "Meridian Capital — Fund IV" and searched across companies,
// decisions, experiments). None of that applies to the frozen
// Explore -> Compare -> Validate flow, so the shell is just the sidebar
// and the page content.
export function AppShell() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-canvas">
      <Sidebar />
      <main className="min-h-0 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
