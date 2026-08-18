import React from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface SelectProps {
  label: string;
  value: string;
  options: {value: string;label: string;}[];
  onChange: (value: string) => void;
}

export function Select({ label, value, options, onChange }: SelectProps) {
  return (
    <label className="relative inline-flex h-7 items-center border border-line bg-surface pl-2 pr-7 transition-colors hover:border-line-strong">
      <span className="mr-1.5 whitespace-nowrap text-2xs uppercase tracking-label text-muted-soft">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
        className="peer h-full cursor-pointer appearance-none bg-transparent pr-1 text-xs font-medium text-ink">

        {options.map((o) =>
        <option key={o.value} value={o.value}>
            {o.label}
          </option>
        )}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute right-2 h-3 w-3 text-muted"
        strokeWidth={2} />
      
    </label>);

}