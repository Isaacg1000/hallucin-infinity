import React from 'react';
import { Assessment } from '../../data/assessment';

const STYLES: Record<Assessment, string> = {
  Leading: 'border-emerald-500 text-emerald-700 bg-mint-100',
  Promising: 'border-accent-line text-accent bg-accent-soft',
  'Needs Evidence': 'border-caution-line text-caution bg-caution-soft',
  Mixed: 'border-caution-line text-caution bg-caution-soft',
  Weak: 'border-line-strong text-muted bg-sunken'
};

export function AssessmentBadge({ label, size = 'sm' }: { label: Assessment; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full border font-medium uppercase tracking-label ${
        size === 'md' ? 'h-6 px-2.5 text-xs' : 'h-5 px-2 text-2xs'
      } ${STYLES[label]}`}>
      {label}
    </span>
  );
}
