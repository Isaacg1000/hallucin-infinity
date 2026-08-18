import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, DownloadIcon, BookmarkIcon, CompassIcon, TargetIcon } from 'lucide-react';
import { getActionPlan } from '../data/actionPlans';
import { getNode } from '../data/nodes';
import { downloadPlan } from '../data/exportPlan';
import { RouteBreadcrumb } from '../components/route/RouteBreadcrumb';
import { ActionPlanBody } from '../components/plan/ActionPlanBody';
import { GeneratingState } from '../components/ui/GeneratingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { useExploration } from '../state/ExplorationContext';
import { useToast } from '../components/ui/Toast';
import { useCritique } from '../lib/useCritique';

export function ActionPlan() {
  const { nodeId = '' } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isSaved, toggleSaved, isTracked, trackOpportunity } = useExploration();
  const node = getNode(nodeId);
  const { ready, loading, error } = useCritique(nodeId);

  if (!node) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={CompassIcon}
          title="Route not found"
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
        <GeneratingState messages={[`Building a test plan for ${node.title}...`]} />
      </div>
    );
  }

  const plan = getActionPlan(nodeId);

  if (!plan) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={CompassIcon}
          title={error ? "Couldn't build a test plan" : 'Route not found'}
          description={error ?? undefined}
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
  const tracked = isTracked(nodeId);

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="mx-auto max-w-narrow px-6 pb-24 pt-10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
            <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Back
          </button>

          <RouteBreadcrumb nodeId={nodeId} />

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.015em] text-ink">Test This Route</h1>
          <p className="mt-1.5 text-[15px] font-medium text-ink-soft">{plan.routeName}</p>

          <div className="mt-8">
            <ActionPlanBody plan={plan} />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center justify-between border-t border-line bg-surface px-6 py-3.5">
        <button
          type="button"
          onClick={() => navigate('/map')}
          className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          Return to Map
        </button>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              downloadPlan(plan);
              showToast('Test plan exported', 'success');
            }}>
            <DownloadIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            Export Plan
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              if (!saved) toggleSaved(nodeId);
              showToast('Exploration saved', 'success');
            }}>
            <BookmarkIcon className="h-3.5 w-3.5" strokeWidth={1.75} fill={saved ? 'currentColor' : 'none'} />
            Save Exploration
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              if (tracked) {
                navigate('/opportunities');
                return;
              }
              const built = trackOpportunity(nodeId);
              if (built) {
                showToast(`${built.title} is now a tracked opportunity`, 'success');
                navigate('/opportunities');
              } else {
                showToast("Couldn't track this route yet — validation data is incomplete");
              }
            }}>
            <TargetIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
            {tracked ? 'View in Opportunities' : 'Track as Opportunity'}
          </Button>
        </div>
      </div>
    </div>
  );
}
