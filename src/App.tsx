import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { ExplorationProvider } from './state/ExplorationContext';
import { ToastProvider } from './components/ui/Toast';

// V1 — frozen around three features: Explore, Compare, Validate.
// Portfolio Companies, Decisions, Experiments, Institutional Intelligence,
// Reporting, Settings, and Organization are future phases. Their pages
// still exist on disk (not deleted, same pattern as the pre-existing
// unrouted Analysis.tsx/DecisionWorkspace.tsx/Explorer.tsx) — just not
// routed or linked from anywhere in V1.
import { Home } from './pages/Home';
import { Context } from './pages/Context';
import { ExplorationMap } from './pages/ExplorationMap';
import { RouteDetail } from './pages/RouteDetail';
import { Compare } from './pages/Compare';
import { Validate } from './pages/Validate';
import { Explorations } from './pages/Explorations';
import { Saved } from './pages/Saved';

export function App() {
  return (
    <ExplorationProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Home />} />
              <Route path="/context" element={<Context />} />
              <Route path="/map" element={<ExplorationMap />} />
              <Route path="/route/:nodeId" element={<RouteDetail />} />
              <Route path="/compare" element={<Compare />} />
              <Route path="/validate/:nodeId" element={<Validate />} />
              <Route path="/explorations" element={<Explorations />} />
              <Route path="/saved" element={<Saved />} />

              <Route path="*" element={<Home />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </ExplorationProvider>
  );
}
