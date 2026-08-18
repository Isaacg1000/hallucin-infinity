import React from 'react';

interface TabsProps<T extends string> {
  tabs: readonly T[];
  active: T;
  onChange: (tab: T) => void;
  counts?: Partial<Record<T, string | number>>;
  className?: string;
}

export function Tabs<T extends string>({ tabs, active, onChange, counts, className = '' }: TabsProps<T>) {
  return (
    <div role="tablist" className={`flex items-stretch gap-0 ${className}`}>
      {tabs.map((t) => {
        const isActive = t === active;
        return (
          <button
            key={t}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(t)}
            className={`relative inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2 text-sm transition-colors duration-100 ${
            isActive ? 'font-medium text-ink' : 'text-muted hover:text-ink'}`
            }>
            
            {t}
            {counts?.[t] !== undefined &&
            <span
              className={`font-mono text-2xs tabular ${isActive ? 'text-accent' : 'text-muted-soft'}`}>
              
                {counts[t]}
              </span>
            }
            <span
              className={`absolute inset-x-0 -bottom-px h-[2px] ${isActive ? 'bg-accent' : 'bg-transparent'}`} />
            
          </button>);

      })}
    </div>);

}

interface SegmentedProps<T extends string> {
  options: readonly {value: T;label: string;count?: number;}[];
  value: T;
  onChange: (value: T) => void;
  size?: 'xs' | 'sm';
}

export function Segmented<T extends string>({ options, value, onChange, size = 'sm' }: SegmentedProps<T>) {
  return (
    <div className="inline-flex items-stretch divide-x divide-line border border-line bg-surface">
      {options.map((o) =>
      <button
        key={o.value}
        type="button"
        aria-pressed={value === o.value}
        onClick={() => onChange(o.value)}
        className={`inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 transition-colors duration-100 ${
        size === 'xs' ? 'h-6 text-2xs' : 'h-7 text-xs'} ${

        value === o.value ?
        'bg-ink text-white' :
        'text-muted hover:bg-sunken hover:text-ink'}`
        }>
        
          {o.label}
          {o.count !== undefined &&
        <span className={`font-mono tabular ${value === o.value ? 'text-white/60' : 'text-muted-soft'}`}>
              {o.count}
            </span>
        }
        </button>
      )}
    </div>);

}