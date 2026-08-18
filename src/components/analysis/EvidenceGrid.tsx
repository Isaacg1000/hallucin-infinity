import React, { useMemo, useState } from 'react';
import { CheckCircle2Icon, AlertTriangleIcon, ExternalLinkIcon } from 'lucide-react';
import { EvidenceItem } from '../../types';
import { Segmented } from '../ui/Tabs';
import { Select } from '../ui/Select';

const LEVEL_RANK: Record<string, number> = { Low: 1, Medium: 2, High: 3 };

function LevelTicks({ level, tone }: {level: string;tone: string;}) {
  const n = LEVEL_RANK[level] ?? 0;
  return (
    <span className="inline-flex items-center gap-1" title={level}>
      <span className="flex items-center gap-[2px]" aria-hidden="true">
        {[0, 1, 2].map((i) =>
        <span key={i} className={`block h-1.5 w-[3px] ${i < n ? tone : 'bg-line-strong'}`} />
        )}
      </span>
      <span className="text-2xs text-muted">{level}</span>
    </span>);

}

export function EvidenceGrid({ evidence }: {evidence: EvidenceItem[];}) {
  const [filter, setFilter] = useState<'all' | 'supports' | 'contradicts'>('all');
  const [type, setType] = useState('any');
  const [reliability, setReliability] = useState('any');

  const supporting = evidence.filter((e) => e.direction === 'supports').length;
  const contradicting = evidence.length - supporting;

  const rows = useMemo(() => {
    let list = evidence;
    if (filter !== 'all') list = list.filter((e) => e.direction === filter);
    if (type !== 'any') list = list.filter((e) => e.type === type);
    if (reliability !== 'any')
    list = list.filter((e) => LEVEL_RANK[e.reliability] >= LEVEL_RANK[reliability]);
    return list;
  }, [evidence, filter, type, reliability]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-line bg-raised px-4 py-2">
        <Segmented
          options={[
          { value: 'all', label: 'All', count: evidence.length },
          { value: 'supports', label: 'Supporting', count: supporting },
          { value: 'contradicts', label: 'Contradicting', count: contradicting }]
          }
          value={filter}
          onChange={(v) => setFilter(v as 'all' | 'supports' | 'contradicts')} />
        
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 text-2xs text-muted">
            <span className="h-1.5 w-1.5 bg-positive" />
            {supporting} supporting
          </span>
          <span className="inline-flex items-center gap-1.5 text-2xs text-muted">
            <span className="h-1.5 w-1.5 bg-critical" />
            {contradicting} contradicting
          </span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <Select
            label="Type"
            value={type}
            onChange={setType}
            options={[
            { value: 'any', label: 'Any' },
            { value: 'Internal Data', label: 'Internal data' },
            { value: 'Research', label: 'Research' },
            { value: 'Benchmark', label: 'Benchmark' },
            { value: 'Interview', label: 'Interview' },
            { value: 'Market', label: 'Market' }]
            } />
          
          <Select
            label="Reliability"
            value={reliability}
            onChange={setReliability}
            options={[
            { value: 'any', label: 'Any' },
            { value: 'High', label: 'High' },
            { value: 'Medium', label: 'Medium+' }]
            } />
          
          <span className="font-mono text-2xs tabular text-muted">{rows.length} shown</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line md:grid-cols-2 2xl:grid-cols-3">
        {rows.map((e) => {
          const contra = e.direction === 'contradicts';
          return (
            <article
              key={e.id}
              className={`group relative bg-surface p-3 transition-colors hover:bg-raised ${
              contra ? 'border-l-2 border-critical' : 'border-l-2 border-positive'}`
              }>
              
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-base font-medium leading-snug text-ink">{e.source}</h4>
                  <p className="mt-0.5 text-2xs text-muted">
                    {e.publisher} · {e.date} · {e.type}
                  </p>
                </div>
                <ExternalLinkIcon
                  className="h-3 w-3 shrink-0 text-muted-soft opacity-0 transition-opacity group-hover:opacity-100"
                  strokeWidth={1.75} />
                
              </div>

              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{e.finding}</p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-2">
                <span
                  className={`inline-flex items-center gap-1 text-2xs font-medium uppercase tracking-label ${
                  contra ? 'text-critical' : 'text-positive'}`
                  }>
                  
                  {contra ?
                  <AlertTriangleIcon className="h-3 w-3" strokeWidth={2} /> :

                  <CheckCircle2Icon className="h-3 w-3" strokeWidth={2} />
                  }
                  {contra ? 'Contradicts' : 'Supports'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <span className="text-2xs uppercase tracking-label text-muted-soft">Rel</span>
                    <LevelTicks level={e.relevance} tone="bg-ink-soft" />
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-2xs uppercase tracking-label text-muted-soft">Conf</span>
                    <LevelTicks level={e.reliability} tone={contra ? 'bg-critical' : 'bg-positive'} />
                  </span>
                </div>
              </div>
            </article>);

        })}
      </div>
    </div>);

}