import { MapNode } from '../../types';

export interface MapNodeData extends Record<string, unknown> {
  node: MapNode;
  hasChildren: boolean;
  isExpanded: boolean;
  isSaved: boolean;
  isPromising: boolean;
  isDismissed: boolean;
  /** A route is spotlighted elsewhere in the tree and this node isn't on
   * its path from root — fade it out. */
  isDimmed: boolean;
  /** What the active Evidence Lens has to say about this node, if
   * anything — null in Possibilities view, or on category nodes, or on
   * routes the lens has nothing to report for. */
  lensBadge: { text: string; tone: 'positive' | 'caution' | 'neutral' } | null;
  onPrimary: (id: string) => void;
  onWhyThis: (id: string) => void;
  onToggleSave: (id: string) => void;
  onDismiss: (id: string) => void;
  onToggleCategory: (id: string) => void;
  onFeedback: (id: string) => void;
}
