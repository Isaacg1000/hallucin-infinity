import { LightbulbIcon, CheckCircle2Icon, GitMergeIcon, HelpCircleIcon, LucideIcon } from 'lucide-react';
import { EpistemicStatus } from '../../types';

const CONFIG: Record<EpistemicStatus, { label: string; icon: LucideIcon; className: string }> = {
  hypothesis: {
    label: 'Hypothesis',
    icon: LightbulbIcon,
    className: 'border-dashed border-hypothesis-line text-hypothesis bg-hypothesis-soft'
  },
  evidence: {
    label: 'Evidence',
    icon: CheckCircle2Icon,
    className: 'border-solid border-positive-line text-positive bg-positive-soft'
  },
  inference: {
    label: 'Inference',
    icon: GitMergeIcon,
    className: 'border-solid border-accent-line text-accent bg-accent-soft'
  },
  unknown: {
    label: 'Unknown',
    icon: HelpCircleIcon,
    className: 'border-dotted border-line-strong text-muted bg-sunken'
  }
};

interface StatusBadgeProps {
  status: EpistemicStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export function StatusBadge({ status, size = 'sm', className = '' }: StatusBadgeProps) {
  const c = CONFIG[status];
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 font-medium uppercase tracking-label ${
        size === 'md' ? 'h-6 text-xs' : 'h-5 text-2xs'
      } ${c.className} ${className}`}
      title={`${c.label} — how claims are classified`}>
      <Icon className={size === 'md' ? 'h-3 w-3' : 'h-2.5 w-2.5'} strokeWidth={2.25} />
      {c.label}
    </span>
  );
}
