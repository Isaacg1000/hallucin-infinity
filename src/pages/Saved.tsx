import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookmarkIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { RouteCard } from '../components/route/RouteCard';
import { EmptyState } from '../components/ui/EmptyState';
import { useExploration } from '../state/ExplorationContext';
import { useToast } from '../components/ui/Toast';
import { ROUTE_DETAILS } from '../data/routeDetails';

export function Saved() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { savedRouteIds, toggleSaved } = useExploration();

  const saved = Array.from(savedRouteIds).filter((id) => ROUTE_DETAILS[id]);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-medium px-6 py-10">
        <PageHeader eyebrow="Strategic Exploration" title="Saved Routes" subtitle="The paths worth holding onto while you keep exploring." />

        {saved.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={BookmarkIcon}
              title="Nothing saved yet"
              description="Save a route from the Exploration Map or a Route Detail page to find it here."
            />
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
      </div>
    </div>
  );
}
