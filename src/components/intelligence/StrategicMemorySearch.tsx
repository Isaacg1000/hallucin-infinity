import React, { useState } from 'react';
import { SearchIcon, ClockIcon, CornerDownLeftIcon } from 'lucide-react';
import { HallucinInfinityLoader } from '../ui/HallucinInfinityLoader';

interface StrategicMemorySearchProps {
  suggestions: string[];
  onSubmit: (query: string) => void;
  initialQuery?: string;
  loading?: boolean;
}

export function StrategicMemorySearch({
  suggestions,
  onSubmit,
  initialQuery = '',
  loading = false
}: StrategicMemorySearchProps) {
  const [value, setValue] = useState(initialQuery);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) onSubmit(value.trim());
        }}
        className="relative">
        
        <SearchIcon
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          strokeWidth={1.75} />
        
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Ask institutional intelligence"
          placeholder="Query the firm's decision history…"
          className="h-14 w-full border border-line-strong bg-surface pl-11 pr-32 text-[15px] text-ink placeholder:text-muted-soft focus:border-accent focus:outline-none" />
        
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="absolute right-2 top-1/2 inline-flex h-10 -translate-y-1/2 items-center gap-2 bg-ink px-4 text-[13px] font-medium text-white transition-colors hover:bg-[#22252A] disabled:opacity-40">
          
          {loading ? 'Searching…' : 'Search'}
          {loading ? (
            <HallucinInfinityLoader size="sm" />
          ) : (
            <CornerDownLeftIcon className="h-3.5 w-3.5" strokeWidth={2} />
          )}
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 text-2xs uppercase tracking-label text-muted-soft">
          <ClockIcon className="h-3 w-3" strokeWidth={1.75} />
          Frequently asked
        </span>
        {suggestions.map((s) =>
        <button
          key={s}
          type="button"
          onClick={() => {
            setValue(s);
            onSubmit(s);
          }}
          className="border border-line bg-surface px-2.5 py-1 text-xs text-muted transition-colors hover:border-line-strong hover:text-ink">
          
            {s}
          </button>
        )}
      </div>
    </div>);

}