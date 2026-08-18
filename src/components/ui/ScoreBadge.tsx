import React from 'react';

interface ScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showTrack?: boolean;
}

function tone(score: number) {
  if (score >= 85) return { text: 'text-accent', bar: 'bg-accent', border: 'border-accent-line' };
  if (score >= 70) return { text: 'text-ink', bar: 'bg-ink-soft', border: 'border-line-strong' };
  return { text: 'text-muted', bar: 'bg-muted-soft', border: 'border-line' };
}

export function ScoreBadge({ score, size = 'md', showTrack = true }: ScoreBadgeProps) {
  const t = tone(score);
  const textSize = size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-sm' : 'text-xl';

  return (
    <div className="inline-flex flex-col items-end gap-1.5" aria-label={`Overall score ${score} out of 100`}>
      <div className="flex items-baseline gap-1">
        <span className={`font-mono font-semibold tabular ${textSize} ${t.text}`}>{score}</span>
        <span className="text-2xs text-muted-soft font-mono">/100</span>
      </div>
      {showTrack &&
      <div className={`h-[3px] bg-line ${size === 'lg' ? 'w-24' : 'w-14'}`}>
          <div className={`h-full ${t.bar}`} style={{ width: `${score}%` }} />
        </div>
      }
    </div>);

}