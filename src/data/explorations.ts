import { ExplorationSummary } from '../types';
import { IDEA_TEXT } from './nodes';

export const CURRENT_EXPLORATION_ID = 'exp-recruiting';

export const EXPLORATIONS: ExplorationSummary[] = [
  {
    id: CURRENT_EXPLORATION_ID,
    ideaText: IDEA_TEXT,
    category: 'New Product',
    createdAt: 'Today',
    possibilitiesExplored: 36,
    savedCount: 7,
    promisingCount: 3
  },
  {
    id: 'exp-pricing',
    ideaText: 'We want to move our core product from flat annual licenses to usage-based pricing.',
    category: 'Business Model',
    createdAt: '4 days ago',
    possibilitiesExplored: 22,
    savedCount: 4,
    promisingCount: 2
  },
  {
    id: 'exp-expansion',
    ideaText: 'We’re considering expanding our logistics platform into the European market.',
    category: 'New Market',
    createdAt: '2 weeks ago',
    possibilitiesExplored: 41,
    savedCount: 9,
    promisingCount: 1
  },
  {
    id: 'exp-retention',
    ideaText: 'Churn is increasing among mid-market accounts and we want to understand why before building anything new.',
    category: 'Growth Strategy',
    createdAt: '3 weeks ago',
    possibilitiesExplored: 18,
    savedCount: 3,
    promisingCount: 3
  }
];

export function getExploration(id: string): ExplorationSummary | undefined {
  return EXPLORATIONS.find((e) => e.id === id);
}
