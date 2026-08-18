import React from 'react';

type Tone = 'neutral' | 'accent' | 'caution' | 'critical' | 'positive' | 'quiet';

const TONES: Record<Tone, string> = {
  neutral: 'border-line-strong text-ink-soft bg-white',
  accent: 'border-accent-line text-accent bg-accent-soft',
  caution: 'border-caution-line text-caution bg-caution-soft',
  critical: 'border-critical-line text-critical bg-critical-soft',
  positive: 'border-positive-line text-positive bg-positive-soft',
  quiet: 'border-line text-muted bg-raised'
};

const AUTO: Record<string, Tone> = {
  // Strategic Exploration — assumption status
  Unvalidated: 'quiet',
  'Needs Research': 'caution',
  Supported: 'positive',
  Mixed: 'caution',
  Unknown: 'quiet',
  // Strategic Exploration — validation verdicts
  Promising: 'positive',
  'Worth Testing': 'accent',
  'Weak Signal': 'caution',
  'Not Yet': 'quiet',
  // Strategic Exploration — importance
  Critical: 'critical',
  High: 'caution',
  Medium: 'quiet',
  // Portfolio Value Creation — opportunity / initiative / decision status
  Validate: 'caution',
  'Must Validate': 'caution',
  Pilot: 'accent',
  Review: 'quiet',
  Approved: 'positive',
  Executing: 'accent',
  Realized: 'positive',
  Rejected: 'critical',
  Unverified: 'critical',
  Validated: 'positive',
  'On Track': 'positive',
  Watch: 'caution',
  'Off Track': 'critical',
  'Pending Approval': 'caution',
  Deferred: 'quiet',
  Complete: 'positive',
  Running: 'accent',
  Designing: 'quiet',
  Blocked: 'critical',
  Ahead: 'positive',
  Behind: 'critical',
  'Too Early': 'quiet',
  Identified: 'quiet',
  Validating: 'caution',
  'Ranked Lower': 'quiet'
};

interface StatusPillProps {
  label: string;
  tone?: Tone;
  className?: string;
}

export function StatusPill({ label, tone, className = '' }: StatusPillProps) {
  const resolved = tone ?? AUTO[label] ?? 'neutral';
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap border px-1.5 py-[2px] text-2xs font-medium uppercase tracking-label ${TONES[resolved]} ${className}`}>
      
      {label}
    </span>);

}