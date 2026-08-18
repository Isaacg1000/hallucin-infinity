import React from 'react';
import { XIcon } from 'lucide-react';
import { Select } from '../ui/Select';
import { Category } from '../../types';

export const CATEGORIES: (Category | 'All')[] = [
'All',
'Revenue',
'Pricing',
'Operations',
'AI / Automation',
'Procurement',
'Product',
'M&A',
'Working Capital'];


export interface Controls {
  category: Category | 'All';
  sort: string;
  confidence: string;
  evidence: string;
  impact: string;
  status: string;
}

export const DEFAULT_CONTROLS: Controls = {
  category: 'All',
  sort: 'score',
  confidence: 'any',
  evidence: 'any',
  impact: 'any',
  status: 'any'
};

interface FilterBarProps {
  controls: Controls;
  onChange: (next: Controls) => void;
  counts: Record<string, number>;
  resultCount: number;
}

export function FilterBar({ controls, onChange, counts, resultCount }: FilterBarProps) {
  const set = <K extends keyof Controls,>(key: K, value: Controls[K]) =>
  onChange({ ...controls, [key]: value });

  const dirty =
  controls.confidence !== 'any' ||
  controls.evidence !== 'any' ||
  controls.impact !== 'any' ||
  controls.status !== 'any' ||
  controls.category !== 'All';

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-line bg-raised px-4 py-2">
      <div className="flex items-center overflow-x-auto">
        {CATEGORIES.map((c) => {
          const active = controls.category === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={active}
              onClick={() => set('category', c)}
              className={`inline-flex h-6 items-center gap-1.5 whitespace-nowrap border-b-2 px-2.5 text-xs transition-colors duration-100 ${
              active ?
              'border-accent font-medium text-ink' :
              'border-transparent text-muted hover:text-ink'}`
              }>
              
              {c}
              <span className={`font-mono text-2xs tabular ${active ? 'text-accent' : 'text-muted-soft'}`}>
                {counts[c] ?? 0}
              </span>
            </button>);

        })}
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        <Select
          label="Sort"
          value={controls.sort}
          onChange={(v) => set('sort', v)}
          options={[
          { value: 'score', label: 'Score' },
          { value: 'ebitda', label: 'EBITDA impact' },
          { value: 'confidence', label: 'Confidence' },
          { value: 'speed', label: 'Time to impact' },
          { value: 'complexity', label: 'Complexity' }]
          } />
        
        <Select
          label="Conf"
          value={controls.confidence}
          onChange={(v) => set('confidence', v)}
          options={[
          { value: 'any', label: 'Any' },
          { value: '85', label: '≥ 85%' },
          { value: '75', label: '≥ 75%' },
          { value: '60', label: '≥ 60%' }]
          } />
        
        <Select
          label="Evidence"
          value={controls.evidence}
          onChange={(v) => set('evidence', v)}
          options={[
          { value: 'any', label: 'Any' },
          { value: 'Strong', label: 'Strong' },
          { value: 'Moderate', label: 'Moderate+' },
          { value: 'Limited', label: 'Limited' }]
          } />
        
        <Select
          label="Impact"
          value={controls.impact}
          onChange={(v) => set('impact', v)}
          options={[
          { value: 'any', label: 'Any' },
          { value: '5', label: '≥ $5M' },
          { value: '3', label: '≥ $3M' },
          { value: '1', label: '≥ $1M' }]
          } />
        
        <Select
          label="Status"
          value={controls.status}
          onChange={(v) => set('status', v)}
          options={[
          { value: 'any', label: 'Any' },
          { value: 'Validate', label: 'Validate' },
          { value: 'Pilot', label: 'Pilot' },
          { value: 'Review', label: 'Review' },
          { value: 'Monitor', label: 'Monitor' }]
          } />
        

        <span className="ml-1 font-mono text-2xs tabular text-muted">{resultCount} shown</span>

        {dirty &&
        <button
          type="button"
          onClick={() => onChange(DEFAULT_CONTROLS)}
          className="inline-flex h-6 items-center gap-1 border border-line bg-surface px-1.5 text-2xs text-muted transition-colors hover:border-line-strong hover:text-ink">
          
            <XIcon className="h-3 w-3" strokeWidth={2} />
            Clear
          </button>
        }
      </div>
    </div>);

}