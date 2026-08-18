import React from 'react';

interface MeterProps {
  value: number;
  max?: number;
  tone?: 'accent' | 'ink' | 'positive' | 'caution' | 'critical' | 'muted';
  className?: string;
  height?: string;
}

const TONES = {
  accent: 'bg-accent',
  ink: 'bg-ink-soft',
  positive: 'bg-positive',
  caution: 'bg-caution',
  critical: 'bg-critical',
  muted: 'bg-muted-soft'
};

export function Meter({ value, max = 100, tone = 'ink', className = '', height = 'h-1' }: MeterProps) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return (
    <span className={`block ${height} w-full bg-line ${className}`} aria-hidden="true">
      <span className={`block h-full ${TONES[tone]}`} style={{ width: `${pct}%` }} />
    </span>);

}

export function scoreTone(score: number) {
  if (score >= 85) return 'accent' as const;
  if (score >= 70) return 'ink' as const;
  return 'muted' as const;
}

export function ScoreCell({ score, width = 'w-10' }: {score: number;width?: string;}) {
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`font-mono text-base tabular font-semibold ${
        score >= 85 ? 'text-accent' : score >= 70 ? 'text-ink' : 'text-muted'}`
        }>
        
        {score}
      </span>
      <Meter value={score} tone={scoreTone(score)} className={width} />
    </span>);

}

export function Ticks({ value, count = 5 }: {value: number;count?: number;}) {
  const filled = Math.round(value / 100 * count);
  return (
    <span className="inline-flex items-center gap-[2px]" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) =>
      <span key={i} className={`block h-2.5 w-[3px] ${i < filled ? 'bg-ink-soft' : 'bg-line'}`} />
      )}
    </span>);

}