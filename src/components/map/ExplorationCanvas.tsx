import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  useReactFlow,
  Node,
  Edge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { PlusIcon, MinusIcon, MaximizeIcon } from 'lucide-react';
import { NODES } from '../../data/nodes';
import { getRouteDetail } from '../../data/routeDetails';
import { getValidation } from '../../data/validation';
import { layoutTree, COL_WIDTH } from './layout';
import { IdeaNode } from './IdeaNode';
import { CategoryNode } from './CategoryNode';
import { RouteNode } from './RouteNode';
import { RoutePanel } from './RoutePanel';
import { FeedbackModal } from './FeedbackModal';
import { TraceEdge } from './TraceEdge';
import { MapNodeData } from './mapTypes';
import { MapNode } from '../../types';
import { useExploration } from '../../state/ExplorationContext';
import { useToast } from '../ui/Toast';

const NODE_TYPES = { idea: IdeaNode, category: CategoryNode, route: RouteNode };
const EDGE_TYPES = { trace: TraceEdge };

const NODE_WIDTH: Record<string, number> = { root: 240, category: 204, route: 224 };

export type MapLens = 'possibilities' | 'evidence' | 'assumptions' | 'contradictions';

const LENSES: { id: MapLens; label: string }[] = [
  { id: 'possibilities', label: 'Possibilities' },
  { id: 'evidence', label: 'Evidence' },
  { id: 'assumptions', label: 'Assumptions' },
  { id: 'contradictions', label: 'Contradictions' }
];

/** Every leaf-route id reachable under `nodeId` (inclusive if `nodeId`
 * itself is one) — used to roll a lens badge up onto category and
 * branching-route nodes from the leaf data that actually exists. */
function collectLeafRouteIds(nodeId: string): string[] {
  const node = NODES[nodeId];
  if (!node) return [];
  if (node.kind === 'route' && node.childIds.length === 0) return [nodeId];
  return node.childIds.flatMap(collectLeafRouteIds);
}

/** Four visual readings of the same map, not four screens. Every category
 * and route node gets a badge in every non-possibilities lens — a leaf
 * route shows its own data, a category or branching route shows a
 * rollup across the leaf routes underneath it, so switching lenses is
 * never a no-op just because you haven't drilled to a leaf yet. A node
 * with no validation/detail record underneath it yet gets an honest
 * "not validated" / "no assumptions logged" badge rather than nothing,
 * so the lens reads as "here's what's true so far," not as broken. */
function lensBadgeFor(lens: MapLens, node: MapNode): MapNodeData['lensBadge'] {
  if (lens === 'possibilities' || node.kind === 'root') return null;

  const isLeafRoute = node.kind === 'route' && node.childIds.length === 0;
  const leafIds = isLeafRoute ? [node.id] : collectLeafRouteIds(node.id);
  if (leafIds.length === 0) return null;

  if (lens === 'evidence') {
    const validated = leafIds.map(getValidation).filter((v): v is NonNullable<typeof v> => !!v);
    if (validated.length === 0) return { text: 'Not yet validated', tone: 'neutral' };
    const n = validated.reduce((sum, v) => sum + v.evidenceFor.length, 0);
    return { text: `${n} evidence item${n === 1 ? '' : 's'}`, tone: n > 0 ? 'positive' : 'neutral' };
  }

  if (lens === 'assumptions') {
    const details = leafIds.map(getRouteDetail).filter((d): d is NonNullable<typeof d> => !!d);
    const total = details.reduce((sum, d) => sum + d.assumptions.length, 0);
    if (details.length === 0 || total === 0) return { text: 'No assumptions logged', tone: 'neutral' };
    const unresolved = details.reduce(
      (sum, d) => sum + d.assumptions.filter((a) => a.status === 'Unvalidated' || a.status === 'Needs Research').length,
      0
    );
    return {
      text: `${total} assumption${total === 1 ? '' : 's'}${unresolved ? ` · ${unresolved} open` : ''}`,
      tone: unresolved > 0 ? 'caution' : 'neutral'
    };
  }

  // contradictions
  const validated = leafIds.map(getValidation).filter((v): v is NonNullable<typeof v> => !!v);
  if (validated.length === 0) return { text: 'Not yet validated', tone: 'neutral' };
  const n = validated.reduce((sum, v) => sum + v.evidenceAgainst.length, 0);
  if (n === 0) return { text: 'No contradictions found', tone: 'neutral' };
  return { text: `${n} contradicting`, tone: 'caution' };
}

/** Every node id from the root down to `id`, via parentId — the path a
 * spotlighted route's edges and nodes should stay highlighted along. */
function pathToRoot(id: string): Set<string> {
  const ids = new Set<string>();
  let cur: string | undefined = id;
  while (cur) {
    ids.add(cur);
    cur = NODES[cur]?.parentId ?? undefined;
  }
  return ids;
}

function CanvasControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <div className="absolute bottom-5 left-5 z-10 flex items-center gap-0.5 rounded-full bg-surface/80 p-1 backdrop-blur-sm">
      <button
        type="button"
        onClick={() => zoomIn({ duration: 150 })}
        aria-label="Zoom in"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-soft transition-colors hover:bg-sunken hover:text-ink-soft">
        <PlusIcon className="h-3 w-3" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => zoomOut({ duration: 150 })}
        aria-label="Zoom out"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-soft transition-colors hover:bg-sunken hover:text-ink-soft">
        <MinusIcon className="h-3 w-3" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => fitView({ duration: 300, padding: 0.25 })}
        aria-label="Center map"
        className="flex h-6 w-6 items-center justify-center rounded-full text-muted-soft transition-colors hover:bg-sunken hover:text-ink-soft">
        <MaximizeIcon className="h-3 w-3" strokeWidth={2} />
      </button>
    </div>
  );
}

/** Four readings of the same map, not four screens — switching lenses
 * never changes which nodes exist, only what's emphasized about them. */
function LensToggle({ lens, onChange }: { lens: MapLens; onChange: (l: MapLens) => void }) {
  return (
    <div className="absolute left-5 top-5 z-10 flex items-center gap-0.5 rounded-full border border-line bg-surface/90 p-1 backdrop-blur-sm">
      {LENSES.map((l) => (
        <button
          key={l.id}
          type="button"
          onClick={() => onChange(l.id)}
          aria-pressed={lens === l.id}
          className={`rounded-full px-2.5 py-1 text-2xs font-medium transition-colors ${
            lens === l.id ? 'bg-ink text-white' : 'text-muted hover:bg-sunken hover:text-ink'
          }`}>
          {l.label}
        </button>
      ))}
    </div>
  );
}

/** The user's original question, pinned above the canvas so it stays
 * visually connected to the map no matter how far they wander into it. */
function QuestionStrip() {
  const { ideaText } = useExploration();
  return (
    <div className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2">
      <div className="pointer-events-auto flex max-w-[520px] items-center gap-2 rounded-b-xl bg-ink px-4 py-2 shadow-[0_6px_18px_-6px_rgba(24,27,34,0.35)]">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden="true" />
        <p className="truncate text-xs leading-snug text-white/80">{ideaText}</p>
      </div>
    </div>
  );
}

function StatsStrip() {
  const { everExpandedIds, savedRouteIds, promisingRouteIds } = useExploration();
  const explored = useMemo(
    () => Object.values(NODES).filter((n) => n.kind === 'route' && n.parentId && everExpandedIds.has(n.parentId)).length,
    [everExpandedIds]
  );
  return (
    <div className="absolute bottom-5 right-5 z-10 flex items-center gap-2.5 text-2xs text-muted-soft">
      <span>{explored} explored</span>
      <span className="h-2.5 w-px bg-line" />
      <span>{savedRouteIds.size} saved</span>
      <span className="h-2.5 w-px bg-line" />
      <span>{promisingRouteIds.size} promising</span>
    </div>
  );
}

function CanvasInner() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const {
    everExpandedIds,
    collapsedIds,
    revealChildren,
    toggleCollapsed,
    savedRouteIds,
    toggleSaved,
    dismissedRouteIds,
    dismissRoute,
    promisingRouteIds
  } = useExploration();

  const [whyThisId, setWhyThisId] = useState<string | null>(null);
  const [feedbackCategoryId, setFeedbackCategoryId] = useState<string | null>(null);
  const [lens, setLens] = useState<MapLens>('possibilities');

  const handlePrimary = useCallback(
    (id: string) => {
      const node = NODES[id];
      if (node.childIds.length > 0) {
        showToast('Exploring this direction...', 'processing');
        window.setTimeout(() => revealChildren(id), 550);
      } else {
        navigate(`/route/${id}`);
      }
    },
    [navigate, revealChildren, showToast]
  );

  const handleToggleCategory = useCallback(
    (id: string) => {
      if (everExpandedIds.has(id)) {
        toggleCollapsed(id);
      } else {
        showToast('Exploring this direction...', 'processing');
        window.setTimeout(() => revealChildren(id), 550);
      }
    },
    [everExpandedIds, toggleCollapsed, revealChildren, showToast]
  );

  const handleToggleSave = useCallback(
    (id: string) => {
      toggleSaved(id);
      showToast(savedRouteIds.has(id) ? 'Removed from Saved Routes' : 'Saved to Saved Routes', 'success');
    },
    [toggleSaved, savedRouteIds, showToast]
  );

  const handleDismiss = useCallback(
    (id: string) => {
      dismissRoute(id);
      showToast(`Dismissed "${NODES[id].title}"`);
    },
    [dismissRoute, showToast]
  );

  // Spotlighting a route dims everything not on its path back to the root
  // question, and traces that path in the brand gradient — "I can see how
  // we got here," not just a highlighted box.
  const spotlightPath = useMemo(() => (whyThisId ? pathToRoot(whyThisId) : null), [whyThisId]);

  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const { nodes: laidOut, edges: laidOutEdges } = layoutTree(everExpandedIds, collapsedIds);

    const rfNodes: Node<MapNodeData>[] = laidOut.map(({ id, x, y }) => {
      const node = NODES[id];
      const width = NODE_WIDTH[node.kind === 'root' ? 'root' : node.kind] ?? COL_WIDTH - 30;
      const data: MapNodeData = {
        node,
        hasChildren: node.childIds.length > 0,
        isExpanded: everExpandedIds.has(id) && !collapsedIds.has(id),
        isSaved: savedRouteIds.has(id),
        isPromising: promisingRouteIds.has(id),
        isDismissed: dismissedRouteIds.has(id),
        isDimmed: !!spotlightPath && !spotlightPath.has(id),
        lensBadge: lensBadgeFor(lens, node),
        onPrimary: handlePrimary,
        onWhyThis: setWhyThisId,
        onToggleSave: handleToggleSave,
        onDismiss: handleDismiss,
        onToggleCategory: handleToggleCategory,
        onFeedback: setFeedbackCategoryId
      };
      return {
        id,
        type: node.kind === 'root' ? 'idea' : node.kind,
        position: { x: x - width / 2, y },
        data,
        draggable: false
        // Note: intentionally not setting `selectable: false` — React Flow
        // sets pointer-events:none on non-selectable nodes (it assumes an
        // unselectable node has no interaction), which would swallow every
        // click meant for our nodes' own buttons.
      };
    });

    const rfEdges: Edge[] = laidOutEdges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: 'trace',
      data: {
        traveled: e.traveled,
        highlighted: !!spotlightPath && spotlightPath.has(e.source) && spotlightPath.has(e.target),
        dimmed: !!spotlightPath && !(spotlightPath.has(e.source) && spotlightPath.has(e.target))
      }
    }));

    return { nodes: rfNodes, edges: rfEdges };
  }, [
    everExpandedIds,
    collapsedIds,
    savedRouteIds,
    promisingRouteIds,
    dismissedRouteIds,
    spotlightPath,
    lens,
    handlePrimary,
    handleToggleSave,
    handleDismiss,
    handleToggleCategory
  ]);

  const whyThisNode = whyThisId ? NODES[whyThisId] : null;
  const whyThisHasChildren = whyThisNode ? whyThisNode.childIds.length > 0 : false;
  const feedbackCategory = feedbackCategoryId ? NODES[feedbackCategoryId] : null;

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={NODE_TYPES}
        edgeTypes={EDGE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.3, maxZoom: 1 }}
        minZoom={0.35}
        maxZoom={1.5}
        nodesDraggable={false}
        nodesConnectable={false}
        proOptions={{ hideAttribution: true }}
        defaultEdgeOptions={{ type: 'trace' }}>
        <Background variant={BackgroundVariant.Dots} gap={26} size={1} color="#E3E5E9" />
      </ReactFlow>

      <LensToggle lens={lens} onChange={setLens} />
      <QuestionStrip />
      <StatsStrip />
      <CanvasControls />

      <RoutePanel
        node={whyThisNode}
        hasChildren={whyThisHasChildren}
        onClose={() => setWhyThisId(null)}
        onPrimary={handlePrimary}
        onValidate={(id) => navigate(`/validate/${id}`)}
      />

      <FeedbackModal
        open={!!feedbackCategory}
        onClose={() => setFeedbackCategoryId(null)}
        categoryLabel={feedbackCategory?.title}
        onRegenerate={() => showToast(`New angles generated for ${feedbackCategory?.title}.`)}
      />
    </div>
  );
}

export function ExplorationCanvas() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  );
}
