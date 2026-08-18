import React from 'react';

interface PriorityRankingProps {
  options: readonly string[];
  selected: string[];
  onChange: (next: string[]) => void;
  max?: number;
}

/** Rank-by-click priority picker for the Compare screen. Order of
 * selection is the rank — changing it recomputes the comparison. */
export function PriorityRanking({ options, selected, onChange, max = 3 }: PriorityRankingProps) {
  function toggle(label: string) {
    if (selected.includes(label)) {
      onChange(selected.filter((s) => s !== label));
    } else if (selected.length < max) {
      onChange([...selected, label]);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((label) => {
        const rank = selected.indexOf(label);
        const isActive = rank !== -1;
        const disabled = !isActive && selected.length >= max;
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            disabled={disabled}
            onClick={() => toggle(label)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
              isActive
                ? 'border-accent bg-accent-soft text-accent'
                : disabled
                  ? 'cursor-not-allowed border-line text-muted-soft opacity-50'
                  : 'border-line text-ink-soft hover:border-line-strong hover:bg-raised'
            }`}>
            {isActive && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-semibold text-white">
                {rank + 1}
              </span>
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
