import React from 'react';

interface ContextQuestionProps {
  index: number;
  question: string;
  hint?: string;
  children: React.ReactNode;
}

export function ContextQuestion({ index, question, hint, children }: ContextQuestionProps) {
  return (
    <div className="border-b border-line py-7 first:pt-0 last:border-b-0">
      <div className="flex items-baseline gap-2.5">
        <span className="font-mono text-xs text-muted-soft">{String(index).padStart(2, '0')}</span>
        <h2 className="text-[15px] font-medium text-ink">{question}</h2>
      </div>
      {hint && <p className="ml-[26px] mt-1 text-xs text-muted">{hint}</p>}
      <div className="ml-[26px] mt-3.5">{children}</div>
    </div>
  );
}

export function PillGroup({
  options,
  selected,
  onToggle
}: {
  options: readonly string[];
  selected: string[];
  onToggle: (label: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((label) => {
        const isActive = selected.includes(label);
        return (
          <button
            key={label}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(label)}
            className={`rounded-full border px-3.5 py-2 text-[13px] transition-colors ${
              isActive
                ? 'border-accent bg-accent-soft text-accent'
                : 'border-line text-ink-soft hover:border-line-strong hover:bg-raised'
            }`}>
            {label}
          </button>
        );
      })}
    </div>
  );
}
