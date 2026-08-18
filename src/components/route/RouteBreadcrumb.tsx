import React from 'react';
import { ChevronRightIcon } from 'lucide-react';
import { getBreadcrumb } from '../../data/nodes';

export function RouteBreadcrumb({ nodeId }: { nodeId: string }) {
  const trail = getBreadcrumb(nodeId).filter((n) => n.kind !== 'category');
  return (
    <nav aria-label="Route path" className="flex flex-wrap items-center gap-1.5">
      {trail.map((n, i) => (
        <React.Fragment key={n.id}>
          {i > 0 && <ChevronRightIcon className="h-3 w-3 shrink-0 text-muted-soft" strokeWidth={2} />}
          <span className={`text-xs ${i === trail.length - 1 ? 'font-medium text-ink-soft' : 'text-muted'}`}>
            {n.title}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
}
