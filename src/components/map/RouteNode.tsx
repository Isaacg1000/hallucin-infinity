import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { StatusBadge } from '../ui/StatusBadge';
import { NodeActions } from './NodeActions';
import { MapNodeData } from './mapTypes';

const LENS_TONE: Record<'positive' | 'caution' | 'neutral', string> = {
  positive: 'text-emerald-700 bg-mint-100',
  caution: 'text-caution bg-caution-soft',
  neutral: 'text-muted-soft bg-sunken'
};

export function RouteNode({ data }: NodeProps<Node<MapNodeData>>) {
  const { node, hasChildren, isSaved, isDismissed, isDimmed, lensBadge, onPrimary, onWhyThis, onToggleSave, onDismiss } =
    data;

  return (
    <div
      className={`nodrag nopan group w-[224px] rounded-lg border bg-surface px-3.5 py-3 transition-[opacity,border-color,box-shadow] duration-200 motion-safe:animate-grow-in ${
        isDimmed ? 'opacity-30' : ''
      } ${
        isDismissed
          ? 'border-line bg-raised opacity-55 shadow-none'
          : 'border-line shadow-[0_2px_8px_-2px_rgba(24,27,34,0.1)] hover:border-line-strong hover:shadow-[0_4px_14px_-2px_rgba(24,27,34,0.14)]'
      }`}>
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      {hasChildren && <Handle type="source" position={Position.Bottom} className="!opacity-0" />}

      <div className="flex items-start justify-between gap-2">
        <h4 className="text-[13px] font-semibold leading-snug text-ink">{node.title}</h4>
        {isSaved && !isDismissed && (
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" title="Saved" />
        )}
      </div>
      {node.subtitle && <p className="mt-1 text-xs italic leading-snug text-muted">"{node.subtitle}"</p>}

      <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
        {isDismissed ? (
          <span className="text-2xs font-medium uppercase tracking-label text-muted-soft">Dismissed</span>
        ) : (
          <StatusBadge status="hypothesis" />
        )}
        {!isDismissed && lensBadge && (
          <span
            className={`inline-flex items-center rounded-full px-1.5 py-[1px] text-2xs font-medium ${LENS_TONE[lensBadge.tone]}`}>
            {lensBadge.text}
          </span>
        )}
      </div>

      {!isDismissed && (
        <div className="max-h-0 overflow-hidden opacity-0 transition-all duration-150 group-hover:max-h-16 group-hover:opacity-100">
          <NodeActions
            node={node}
            hasChildren={hasChildren}
            isSaved={isSaved}
            onPrimary={() => onPrimary(node.id)}
            onWhyThis={() => onWhyThis(node.id)}
            onToggleSave={() => onToggleSave(node.id)}
            onDismiss={() => onDismiss(node.id)}
          />
        </div>
      )}
    </div>
  );
}
