import { ActionPlanData } from '../types';

export function planToMarkdown(plan: ActionPlanData): string {
  const lines: string[] = [];
  lines.push(`# Test Plan — ${plan.routeName}`, '');
  lines.push('## Hypothesis', plan.hypothesis, '');
  lines.push('## Target Customer', `${plan.targetCustomerRole}${plan.targetCustomerOrg ? ` · ${plan.targetCustomerOrg}` : ''}`, '');
  lines.push('## MVP', ...plan.mvp.map((m) => `- ${m}`), '');
  lines.push('## 30-Day Test');
  plan.weeks.forEach((w) => lines.push(`- **${w.week}: ${w.title}** — ${w.detail}`));
  lines.push('');
  lines.push('## Success Criteria', ...plan.successCriteria.map((s) => `- ${s}`), '');
  lines.push('## Failure Criteria', ...plan.failureCriteria.map((f) => `- ${f}`), '');
  return lines.join('\n');
}

export function downloadPlan(plan: ActionPlanData) {
  const markdown = planToMarkdown(plan);
  const blob = new Blob([markdown], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${plan.routeName.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-test-plan.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
