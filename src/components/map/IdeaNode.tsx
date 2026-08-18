import React from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { MapNodeData } from './mapTypes';

export function IdeaNode({ data }: NodeProps<Node<MapNodeData>>) {
  const { node } = data;
  return (
    <div className="w-[240px] rounded-xl border border-[#2A2E36] bg-ink px-4 py-3.5 text-white shadow-pop">
      <Handle type="source" position={Position.Bottom} className="!opacity-0" />
      <div className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
        <p className="text-2xs font-medium uppercase tracking-label text-white/50">Your idea</p>
      </div>
      <h3 className="mt-1.5 text-[15px] font-semibold leading-snug tracking-[-0.01em]">{node.title}</h3>
    </div>
  );
}
