import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { ChevronDownIcon } from 'lucide-react';
import { MapNodeData } from './mapTypes';

const LENS_TONE: Record<'positive' | 'caution' | 'neutral', string> = {
  positive: 'text-emerald-700 bg-mint-100',
  caution: 'text-caution bg-caution-soft',
  neutral: 'text-muted-soft bg-sunken'
};

export function CategoryNode({ data }: NodeProps<Node<MapNodeData>>) {
  const { node, isExpanded, isDimmed, lensBadge, onToggleCategory, onFeedback } = data;

  return (
    <div
      className={`nodrag nopan group w-[204px] rounded-lg border bg-transparent px-3.5 py-3 transition-[opacity,border-color,background-color] duration-200 motion-safe:animate-grow-in ${
        isDimmed ? 'opacity-30' : ''
      } ${isExpanded ? 'border-line-strong bg-raised/60' : 'border-line/70 hover:border-line-strong hover:bg-raised/60'}`}>
      <Handle type="target" position={Position.Top} className="!opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      <button type="button" onClick={() => onToggleCategory(node.id)} className="block w-full text-left">
        <div className="flex items-center justify-between gap-2">
          <p className="text-2xs font-semibold uppercase tracking-label text-ink-soft">{node.title}</p>
          <ChevronDownIcon
            className={`h-3.5 w-3.5 shrink-0 text-muted-soft transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            strokeWidth={2}
          />
        </div>
        {node.question && <p className="mt-1.5 text-xs italic leading-snug text-muted">"{node.question}"</p>}
        <p className="mt-2 text-2xs text-muted-soft">
          {node.childIds.length} route{node.childIds.length === 1 ? '' : 's'}
        </p>
        {lensBadge && (
          <span
            className={`mt-1.5 inline-flex items-center rounded-full px-1.5 py-[1px] text-2xs font-medium ${LENS_TONE[lensBadge.tone]}`}>
            {lensBadge.text}
          </span>
        )}
      </button>
      {isExpanded && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFeedback(node.id);
          }}
          className="mt-2 max-h-0 overflow-hidden border-t border-line pt-0 text-2xs text-muted-soft opacity-0 transition-all duration-150 hover:text-ink-soft group-hover:max-h-8 group-hover:pt-2 group-hover:opacity-100">
          These aren't useful
        </button>
      )}
    </div>
  );
}
