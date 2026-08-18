import React, { useRef } from 'react';
import { ArrowRightIcon } from 'lucide-react';

interface IdeaInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
}

export function IdeaInput({ value, onChange, onSubmit, placeholder = 'What are you exploring?' }: IdeaInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function autoGrow() {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 220)}px`;
  }

  return (
    <div className="rounded-2xl border border-line-strong bg-surface p-3 shadow-pop transition-colors focus-within:border-emerald-400">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          autoGrow();
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder={placeholder}
        rows={2}
        className="block w-full resize-none bg-transparent px-2 pt-1 text-lg leading-relaxed text-ink placeholder:text-muted-soft focus:outline-none"
      />
      <div className="flex items-center justify-between px-2 pb-1 pt-2">
        <p className="hidden text-xs text-muted-soft sm:block">
          e.g. "We're considering building an AI recruiting platform that helps companies screen candidates more
          efficiently."
        </p>
        <button
          type="button"
          onClick={onSubmit}
          disabled={value.trim().length === 0}
          className="ml-auto inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-trace px-4 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40">
          Explore
          <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
