import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, BookmarkIcon, SparklesIcon, CompassIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { RouteCard } from '../components/route/RouteCard';
import { EmptyState } from '../components/ui/EmptyState';
import { EXPLORATIONS } from '../data/explorations';
import { useExploration } from '../state/ExplorationContext';
import { useToast } from '../components/ui/Toast';
import { getNode } from '../data/nodes';

export function Explorations() {
  const navigate = useNavigate();
  const { setIdeaText, savedRouteIds, toggleSaved } = useExploration();
  const { showToast } = useToast();

  const saved = Array.from(savedRouteIds).filter((id) => !!getNode(id));

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-medium px-6 py-10 pb-16">
        <PageHeader
          eyebrow="Strategic Exploration"
          title="Explore"
          subtitle="Every idea you've mapped, and every route worth holding onto."
        />

        <section className="mt-9">
          <h2 className="text-2xs font-medium uppercase tracking-label text-muted">Recent explorations</h2>
          <div className="mt-3 space-y-3">
            {EXPLORATIONS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => {
                  setIdeaText(e.ideaText);
                  navigate('/map');
                }}
                className="group flex w-full items-start justify-between gap-4 rounded-lg border border-line bg-surface p-4 text-left transition-colors hover:border-line-strong hover:bg-raised">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CompassIcon className="h-3.5 w-3.5 shrink-0 text-muted-soft" strokeWidth={1.75} />
                    <span className="text-2xs font-medium uppercase tracking-label text-muted-soft">
                      {e.category}
                    </span>
                    <span className="text-2xs text-muted-soft">· {e.createdAt}</span>
                  </div>
                  <p className="mt-1.5 truncate text-[14px] text-ink-soft">{e.ideaText}</p>
                  <div className="mt-2.5 flex items-center gap-3 text-2xs text-muted">
                    <span>{e.possibilitiesExplored} possibilities explored</span>
                    <span className="inline-flex items-center gap-1">
                      <BookmarkIcon className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {e.savedCount} saved
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <SparklesIcon className="h-2.5 w-2.5" strokeWidth={1.75} />
                      {e.promisingCount} promising
                    </span>
                  </div>
                </div>
                <ArrowRightIcon
                  className="mt-1 h-4 w-4 shrink-0 text-muted-soft opacity-0 transition-opacity group-hover:opacity-100"
                  strokeWidth={1.75}
                />
              </button>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xs font-medium uppercase tracking-label text-muted">Saved routes</h2>
          {saved.length === 0 ? (
            <div className="mt-3">
              <EmptyState
                icon={BookmarkIcon}
                title="Nothing saved yet"
                description="Save a route from the Exploration Map or a Route Detail page to find it here."
              />
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {saved.map((id) => (
                <RouteCard
                  key={id}
                  nodeId={id}
                  onClick={() => navigate(`/route/${id}`)}
                  actions={
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaved(id);
                        showToast('Removed from Saved Routes');
                      }}
                      aria-label="Remove from saved"
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-muted-soft hover:bg-sunken hover:text-ink">
                      <XIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </button>
                  }
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
