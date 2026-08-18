import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, Layers3Icon, FlaskConicalIcon, BookmarkIcon, CompassIcon, RefreshCwIcon } from 'lucide-react';
import { getRouteDetail, ROUTE_DETAILS } from '../data/routeDetails';
import { getNode } from '../data/nodes';
import { RouteBreadcrumb } from '../components/route/RouteBreadcrumb';
import { RouteDetailBody } from '../components/route/RouteDetailBody';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Button } from '../components/ui/Button';
import { ShareButton } from '../components/ui/ShareButton';
import { EmptyState } from '../components/ui/EmptyState';
import { GeneratingState } from '../components/ui/GeneratingState';
import { useExploration } from '../state/ExplorationContext';
import { useToast } from '../components/ui/Toast';
import { useCritique } from '../lib/useCritique';
import { regenerateCritique } from '../lib/critiqueRunner';

export function RouteDetail() {
  const { nodeId = '' } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isSaved, toggleSaved, ideaText, contextAnswers } = useExploration();
  const node = getNode(nodeId);
  const { ready, loading, error } = useCritique(nodeId);
  const detail = getRouteDetail(nodeId);
  // Demo routes are hand-authored, not Critic-generated — nothing to
  // regenerate, so the action only makes sense for a live route.
  const isRegeneratable = !ROUTE_DETAILS[nodeId];

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={CompassIcon}
          title="Route not found"
          description="This route may have come from a different exploration."
          action={
            <Button variant="primary" onClick={() => navigate('/map')}>
              Return to Map
            </Button>
          }
        />
      </div>
    );
  }

  if (!ready && loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <GeneratingState
          messages={[`Stress-testing ${node.title}...`, 'Weighing tradeoffs...', 'Building the full route spec...']}
        />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={CompassIcon}
          title={error ? "Couldn't generate this route's spec" : 'Route not found'}
          description={error ?? 'This route may have come from a different exploration.'}
          action={
            <Button variant="primary" onClick={() => navigate('/map')}>
              Return to Map
            </Button>
          }
        />
      </div>
    );
  }

  const saved = isSaved(nodeId);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-narrow px-6 pb-24 pt-10">
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
            <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Back to Map
          </button>

          <RouteBreadcrumb nodeId={nodeId} />

          <div className="mt-4 flex items-center gap-2">
            <StatusBadge status="hypothesis" size="md" />
            <span className="text-xs text-muted-soft">· Unvalidated</span>
          </div>

          <h1 className="mt-3 text-[28px] font-semibold leading-tight tracking-[-0.015em] text-ink">{detail.name}</h1>

          <RouteDetailBody detail={detail} />
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-line bg-surface px-6 py-3.5">
        <button
          type="button"
          onClick={() => navigate('/map')}
          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          Back to Map
        </button>
        <div className="flex items-center gap-2">
          <ShareButton label={detail.name} />
          {isRegeneratable && (
            <Button
              variant="secondary"
              onClick={() => {
                showToast('Regenerating this route...', 'success');
                regenerateCritique(nodeId, ideaText, contextAnswers).catch(() => {
                  showToast("Couldn't regenerate this route — try again");
                });
              }}>
              <RefreshCwIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              Regenerate
            </Button>
          )}
          <Button
            variant={saved ? 'primary' : 'secondary'}
            onClick={() => {
              toggleSaved(nodeId);
              showToast(saved ? 'Removed from Saved Routes' : 'Saved to Saved Routes', 'success');
            }}>
            <BookmarkIcon className="h-3.5 w-3.5" strokeWidth={1.75} fill={saved ? 'currentColor' : 'none'} />
            {saved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="secondary" onClick={() => navigate(`/compare?with=${encodeURIComponent(nodeId)}`)}>
            <Layers3Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Compare
          </Button>
          <Button variant="primary" onClick={() => navigate(`/validate/${nodeId}`)}>
            <FlaskConicalIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Validate Route
          </Button>
        </div>
      </div>
    </div>
  );
}
