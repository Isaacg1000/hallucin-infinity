import React from 'react';
import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export interface TraceEdgeData extends Record<string, unknown> {
  /** On the root→leaf path of the currently spotlighted route. */
  highlighted?: boolean;
  /** A route was ever taken through this edge (pre-existing "traveled"
   * signal), independent of spotlight state. */
  traveled?: boolean;
  /** Some route is spotlighted, but not through this edge — fade out. */
  dimmed?: boolean;
}

/** The one custom edge Hallucin∞ uses everywhere on the map — curved
 * bezier paths, not right-angle smoothstep connectors, so the canvas
 * doesn't read as a generic flowchart tool. Highlighted edges (the path
 * to a spotlighted route) use the signature brand gradient; everything
 * else is a quiet neutral stroke. */
export function TraceEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [path] = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, curvature: 0.35 });
  const d = data as TraceEdgeData | undefined;

  const stroke = d?.highlighted ? `url(#hallucin-trace-${id})` : d?.traveled ? '#3FBE85' : '#E3E5E9';
  const strokeWidth = d?.highlighted ? 2 : d?.traveled ? 1.5 : 1;
  const opacity = d?.dimmed ? 0.28 : 1;

  return (
    <>
      {d?.highlighted && (
        <defs>
          <linearGradient id={`hallucin-trace-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#087A5B" />
            <stop offset="55%" stopColor="#16B98B" />
            <stop offset="100%" stopColor="#24D6AE" />
          </linearGradient>
        </defs>
      )}
      <BaseEdge
        id={id}
        path={path}
        style={{
          stroke,
          strokeWidth,
          opacity,
          transition: 'stroke 200ms ease-out, opacity 200ms ease-out'
        }}
        className="motion-safe:[stroke-dasharray:400] motion-safe:[stroke-dashoffset:400] motion-safe:animate-[trace-draw_380ms_cubic-bezier(0.2,0,0,1)_forwards]"
      />
    </>
  );
}
