import React, { useId, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export interface FunnelStage {
  id: string;
  label: string;
  count: number;
  explanation: string;
  /** 'strong' is reserved for the routes that actually survived — emerald.
   * Everything upstream of that is neutral: explored, eliminated, and
   * evidence-backed are all still just candidates, not wins. */
  tone?: 'neutral' | 'strong';
}

interface PossibilityFunnelProps {
  stages: FunnelStage[];
  className?: string;
}

// Logical coordinate space — scales via the SVG's own viewBox.
const VIEW_W = 1000;
const VIEW_H = 132;
const STRAND_MIN = 2;
const STRAND_MAX = 22;

/** How many visual strands to draw at a stage — an abstract impression of
 * scale, not a literal one-strand-per-possibility count (that would mean
 * hundreds of DOM nodes for "342 explored"). The final stage is the one
 * exception: when it's small enough to draw honestly 1:1, do that — those
 * three lines really are the three strongest routes, not decoration. */
function strandCountFor(count: number, isFinal: boolean, maxCount: number): number {
  if (isFinal && count <= STRAND_MAX) return Math.max(1, count);
  const ratio = Math.sqrt(count) / Math.sqrt(maxCount || 1);
  return Math.max(STRAND_MIN, Math.round(ratio * STRAND_MAX));
}

// Deterministic pseudo-jitter so strands fan out rather than overlapping
// in a single flat line — seeded from indices, not Math.random(), so the
// layout is stable across re-renders.
function jitter(seed: number, spread: number): number {
  return (Math.sin(seed * 12.9898) * 43758.5453 % 1) * spread;
}

export function PossibilityFunnel({ stages, className = '' }: PossibilityFunnelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const explanationId = useId();
  const gradientId = useId();

  const geometry = useMemo(() => {
    const n = stages.length;
    const maxCount = Math.max(...stages.map((s) => s.count));
    const slotX = stages.map((_, i) => (VIEW_W / (n - 1 || 1)) * i);
    const counts = stages.map((s, i) => strandCountFor(s.count, i === n - 1, maxCount));

    const strands: { d: string; strong: boolean; fadeOut: boolean }[] = [];

    for (let i = 0; i < n - 1; i++) {
      const fromN = counts[i];
      const toN = counts[i + 1];
      const survivors = Math.min(fromN, toN);
      const strong = stages[i + 1].tone === 'strong';

      for (let j = 0; j < fromN; j++) {
        const fromY = VIEW_H / 2 + (j - (fromN - 1) / 2) * (VIEW_H / Math.max(fromN, 6));
        const survives = j < survivors;
        const toJ = survives ? j : toN - 1;
        const toY = VIEW_H / 2 + (toJ - (toN - 1) / 2) * (VIEW_H / Math.max(toN, 6));
        const x1 = slotX[i];
        const x2 = slotX[i + 1];
        const midX = (x1 + x2) / 2;
        const jy = survives ? 0 : jitter(i * 31 + j, 10) - 5;
        strands.push({
          d: `M ${x1},${fromY} C ${midX},${fromY + jy} ${midX},${toY + jy} ${x2},${toY}`,
          strong: strong && survives,
          fadeOut: !survives
        });
      }
    }

    return { strands, slotX };
  }, [stages]);

  const selected = stages.find((s) => s.id === selectedId) ?? null;
  const transition = prefersReducedMotion ? { duration: 0 } : undefined;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="hidden w-full md:block" aria-hidden="true" preserveAspectRatio="none">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#087A5B" />
            <stop offset="55%" stopColor="#16B98B" />
            <stop offset="100%" stopColor="#24D6AE" />
          </linearGradient>
        </defs>
        {geometry.strands.map((s, i) => (
          <motion.path
            key={i}
            d={s.d}
            fill="none"
            stroke={s.strong ? `url(#${gradientId})` : '#CDD4D0'}
            strokeWidth={s.strong ? 2 : 1}
            strokeLinecap="round"
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ opacity: s.strong ? 0.95 : s.fadeOut ? 0.18 : 0.5, pathLength: 1 }}
            transition={transition ?? { duration: 0.7, delay: 0.05 + i * 0.006, ease: [0.2, 0, 0, 1] }}
          />
        ))}
      </svg>

      <div
        role="group"
        aria-label="Possibility funnel — click a stage for why the count changed"
        className="mt-3 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-5 md:gap-2">
        {stages.map((s) => {
          const isSelected = s.id === selectedId;
          const strong = s.tone === 'strong';
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={isSelected}
              aria-expanded={isSelected}
              aria-controls={explanationId}
              onClick={() => setSelectedId((prev) => (prev === s.id ? null : s.id))}
              className={`group rounded-md px-1 py-1.5 text-center transition-colors md:text-center ${
                isSelected ? 'bg-sunken' : 'hover:bg-sunken/60'
              }`}>
              <p
                className={`font-mono text-[26px] font-semibold leading-none tabular ${
                  strong ? 'text-emerald-600' : 'text-ink'
                }`}>
                {s.count}
              </p>
              <p className="mt-2 flex items-center justify-center gap-1 text-2xs font-medium uppercase tracking-label text-muted">
                {s.label}
                <span
                  className={`text-muted-soft transition-transform ${isSelected ? 'rotate-180' : ''}`}
                  aria-hidden="true">
                  ⌄
                </span>
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence initial={false}>
        {selected && (
          <motion.div
            id={explanationId}
            role="region"
            aria-live="polite"
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden">
            <div className="mt-4 border-t border-line pt-4">
              <p
                className={`text-2xs font-semibold uppercase tracking-label ${
                  selected.tone === 'strong' ? 'text-emerald-600' : 'text-muted-soft'
                }`}>
                {selected.label} · {selected.count}
              </p>
              <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-ink-soft">{selected.explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
