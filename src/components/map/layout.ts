import { NODES, ROOT_ID } from '../../data/nodes';

export const COL_WIDTH = 288;
export const ROW_HEIGHT = 224;

export interface LaidOutNode {
  id: string;
  x: number;
  y: number;
}

export interface LaidOutEdge {
  id: string;
  source: string;
  target: string;
  traveled: boolean;
}

/** Simple tidy-tree layout over the currently visible subset of the tree.
 * A node's children are visible once revealed and not toggled collapsed.
 * Deterministic and cheap — the tree here never exceeds a few dozen nodes. */
export function layoutTree(
  everExpanded: Set<string>,
  collapsed: Set<string>
): { nodes: LaidOutNode[]; edges: LaidOutEdge[] } {
  function visibleChildren(id: string): string[] {
    if (!everExpanded.has(id) || collapsed.has(id)) return [];
    return NODES[id].childIds;
  }

  const widthCache = new Map<string, number>();
  function widthOf(id: string): number {
    const cached = widthCache.get(id);
    if (cached !== undefined) return cached;
    const children = visibleChildren(id);
    const w = children.length === 0 ? 1 : children.reduce((sum, c) => sum + widthOf(c), 0);
    widthCache.set(id, w);
    return w;
  }

  const positions: Record<string, { x: number; y: number }> = {};
  const edges: LaidOutEdge[] = [];
  const order: string[] = [];

  function place(id: string, depth: number, leftUnit: number): number {
    const children = visibleChildren(id);
    const w = widthOf(id);

    if (children.length === 0) {
      positions[id] = { x: (leftUnit + w / 2) * COL_WIDTH, y: depth * ROW_HEIGHT };
      order.push(id);
      return w;
    }

    let cursor = leftUnit;
    const childCenters: number[] = [];
    for (const c of children) {
      const cw = widthOf(c);
      place(c, depth + 1, cursor);
      childCenters.push(cursor + cw / 2);
      edges.push({
        id: `${id}->${c}`,
        source: id,
        target: c,
        traveled: NODES[id].kind === 'route' && NODES[c].kind === 'route'
      });
      cursor += cw;
    }
    const center = (childCenters[0] + childCenters[childCenters.length - 1]) / 2;
    positions[id] = { x: center * COL_WIDTH, y: depth * ROW_HEIGHT };
    order.push(id);
    return w;
  }

  place(ROOT_ID, 0, 0);

  return {
    nodes: order.map((id) => ({ id, x: positions[id].x, y: positions[id].y })),
    edges
  };
}
