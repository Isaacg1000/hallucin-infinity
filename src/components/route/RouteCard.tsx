import React from 'react';
import { getNode, getBreadcrumb } from '../../data/nodes';
import { getRouteDetail } from '../../data/routeDetails';
import { StatusBadge } from '../ui/StatusBadge';

interface RouteCardProps {
  nodeId: string;
  onClick?: () => void;
  selected?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function RouteCard({ nodeId, onClick, selected, actions, className = '' }: RouteCardProps) {
  const node = getNode(nodeId);
  const detail = getRouteDetail(nodeId);
  if (!node || !detail) return null;

  const category = getBreadcrumb(nodeId).find((n) => n.kind === 'category');

  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {category && <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">{category.title}</p>}
          <h3 className="mt-1 text-[15px] font-semibold leading-snug text-ink">{detail.name}</h3>
        </div>
        {actions}
      </div>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted">{detail.thesis}</p>
      <div className="mt-3">
        <StatusBadge status="hypothesis" />
      </div>
    </>
  );

  if (!onClick) {
    return <div className={`rounded-lg border border-line bg-surface p-4 ${className}`}>{content}</div>;
  }

  // A plain <div> (not <button>) here — `actions` may render its own
  // interactive button, and buttons can't nest inside buttons.
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      className={`w-full cursor-pointer rounded-lg border p-4 text-left transition-colors ${
        selected ? 'border-accent bg-accent-soft/40' : 'border-line bg-surface hover:border-line-strong hover:bg-raised'
      } ${className}`}>
      {content}
    </div>
  );
}
