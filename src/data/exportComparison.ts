import { ComparisonDimensionKey, ComparisonDimensions } from '../types';
import { DIMENSION_LABELS, DIMENSION_ORDER } from './comparisons';
import { getRouteDetail } from './routeDetails';

interface ComparisonExportInput {
  routeIds: string[];
  comparisons: Record<string, ComparisonDimensions>;
  priorities: string[];
  strongestId: string | null;
}

function routeName(id: string): string {
  return getRouteDetail(id)?.name ?? id;
}

export function comparisonToMarkdown({ routeIds, comparisons, priorities, strongestId }: ComparisonExportInput): string {
  const lines: string[] = [];
  lines.push('# Route Comparison', '');

  if (priorities.length > 0) {
    lines.push('## Ranked Priorities', ...priorities.map((p, i) => `${i + 1}. ${p}`), '');
  }

  const header = ['Dimension', ...routeIds.map(routeName)];
  lines.push(`| ${header.join(' | ')} |`);
  lines.push(`| ${header.map(() => '---').join(' | ')} |`);
  DIMENSION_ORDER.forEach((key: ComparisonDimensionKey) => {
    const row = [DIMENSION_LABELS[key], ...routeIds.map((id) => comparisons[id][key].level)];
    lines.push(`| ${row.join(' | ')} |`);
  });
  lines.push('');

  lines.push('## Why');
  routeIds.forEach((id) => {
    lines.push(`### ${routeName(id)}`);
    DIMENSION_ORDER.forEach((key) => {
      lines.push(`- **${DIMENSION_LABELS[key]}** (${comparisons[id][key].level}): ${comparisons[id][key].why}`);
    });
    lines.push('');
  });

  if (strongestId) {
    lines.push('## Best Aligned With Stated Priorities', `${routeName(strongestId)}`, '');
  }

  return lines.join('\n');
}

export function downloadComparison(input: ComparisonExportInput) {
  const markdown = comparisonToMarkdown(input);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'route-comparison.md';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
