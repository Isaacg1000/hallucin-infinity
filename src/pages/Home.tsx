import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ClockIcon, BookmarkIcon, TargetIcon, CompassIcon } from 'lucide-react';
import { IdeaInput } from '../components/home/IdeaInput';
import { useExploration } from '../state/ExplorationContext';
import { EXPLORATIONS } from '../data/explorations';

const CATEGORIES = [
  { label: 'New Product', prompt: EXPLORATIONS[0].ideaText },
  { label: 'New Market', prompt: EXPLORATIONS[2].ideaText },
  { label: 'Business Model', prompt: EXPLORATIONS[1].ideaText },
  { label: 'Growth Strategy', prompt: EXPLORATIONS[3].ideaText }
];

export function Home() {
  const navigate = useNavigate();
  const { setIdeaText, ideaText, treeIdeaText, isDemoData, savedRouteIds, trackedOpportunities, everExpandedIds } =
    useExploration();
  const [draft, setDraft] = useState('');

  function begin(text?: string) {
    const idea = (text ?? draft).trim();
    if (!idea) return;
    setIdeaText(idea);
    navigate('/context');
  }

  // A real, non-demo tree already exists for the current idea — the user
  // has an exploration in progress (from this session or a prior one,
  // restored from localStorage) that a fresh Home visit shouldn't bury.
  const hasInProgress = !!treeIdeaText && treeIdeaText === ideaText && !isDemoData;
  const stats = [
    { icon: CompassIcon, label: 'possibilities explored', value: Math.max(0, everExpandedIds.size - 1) },
    { icon: BookmarkIcon, label: 'routes saved', value: savedRouteIds.size },
    { icon: TargetIcon, label: 'opportunities tracked', value: trackedOpportunities.length }
  ];
  const hasAnyActivity = stats.some((s) => s.value > 0);

  return (
    <div className="relative h-full overflow-y-auto">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-16 h-[280px] w-[480px] -translate-x-1/2 rounded-full bg-emerald-400/15 blur-[100px]"
      />
      <div className="relative mx-auto flex min-h-full max-w-narrow flex-col items-center px-6 py-20">
        <p className="text-2xs font-medium uppercase tracking-label text-emerald-700">Strategic Exploration</p>
        <h1 className="mt-4 text-center text-4xl font-semibold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[44px]">
          Where could your idea go?
        </h1>
        <p className="mt-4 text-center text-base leading-relaxed text-muted">
          We map every path from your idea, challenge each one, and keep only what survives the evidence.
        </p>

        {hasAnyActivity && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs text-muted-soft">
                <s.icon className="h-3.5 w-3.5 text-muted-soft" strokeWidth={1.75} />
                <span className="font-mono font-semibold tabular text-ink-soft">{s.value}</span>
                {s.label}
              </div>
            ))}
          </div>
        )}

        {hasInProgress && (
          <button
            type="button"
            onClick={() => navigate('/map')}
            className="group mt-6 flex w-full max-w-md items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50">
            <ClockIcon className="h-4 w-4 shrink-0 text-emerald-700" strokeWidth={1.75} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium text-emerald-800">Continue exploring</span>
              <span className="block truncate text-[13px] text-emerald-700/80">{ideaText}</span>
            </span>
            <ArrowRightIcon
              className="h-3.5 w-3.5 shrink-0 text-emerald-700 opacity-0 transition-opacity group-hover:opacity-100"
              strokeWidth={1.75}
            />
          </button>
        )}

        <div className="mt-10 w-full">
          <IdeaInput value={draft} onChange={setDraft} onSubmit={() => begin()} />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => setDraft(c.prompt)}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted-soft transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800">
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-20 w-full">
          <p className="mb-3 text-2xs font-medium uppercase tracking-label text-muted-soft">Recent explorations</p>
          <div className="space-y-1.5">
            {EXPLORATIONS.map((e) => (
              <button
                key={e.id}
                type="button"
                onClick={() => begin(e.ideaText)}
                className="group flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left transition-colors hover:border-line hover:bg-raised">
                <ClockIcon className="h-3.5 w-3.5 shrink-0 text-muted-soft" strokeWidth={1.75} />
                <span className="min-w-0 flex-1 truncate text-[13px] text-muted-soft group-hover:text-ink-soft">
                  {e.ideaText}
                </span>
                <span className="shrink-0 text-2xs text-muted-soft">
                  {e.possibilitiesExplored} explored · {e.promisingCount} promising
                </span>
                <span className="shrink-0 text-2xs text-muted-soft">{e.createdAt}</span>
                <ArrowRightIcon
                  className="h-3.5 w-3.5 shrink-0 text-muted-soft opacity-0 transition-opacity group-hover:opacity-100"
                  strokeWidth={1.75}
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
