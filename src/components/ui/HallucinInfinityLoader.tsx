import React from 'react';

export type InfinityLoaderSize = 'sm' | 'md' | 'lg';

interface HallucinInfinityLoaderProps {
  size?: InfinityLoaderSize;
  /** Optional status text, e.g. "Challenging assumptions...". Renders next
   * to the mark at `sm`/`md` and beneath it at `lg`, matching how each size
   * is actually used (inline chip vs. full-screen moment). */
  label?: string;
  className?: string;
}

// The lemniscate both strokes (and the glow) trace, so everything moves
// along exactly the same curve as the infinity mark in the logo.
const PATH = 'M 14,25 C 14,10 30,10 41,25 C 52,40 68,40 68,25 C 68,10 52,10 41,25 C 30,40 14,40 14,25 Z';

const DIMENSIONS: Record<InfinityLoaderSize, { width: number; stroke: number }> = {
  sm: { width: 20, stroke: 5 },
  md: { width: 34, stroke: 4.5 },
  lg: { width: 60, stroke: 4 }
};

const TEXT_SIZE: Record<InfinityLoaderSize, string> = {
  sm: 'text-2xs',
  md: 'text-xs',
  lg: 'text-sm'
};

/**
 * The Hallucin∞ "thinking in possibilities" motif — a signature interaction,
 * not a generic spinner. A restrained emerald flow travels continuously
 * around the same infinity path as the brand mark, with a soft glow behind
 * it for depth rather than any rotation, glow-ring, or neon effect.
 *
 * Use it wherever the product is actively exploring, challenging,
 * searching, comparing, or building — never as a decorative loading icon
 * elsewhere (a plain disabled state or skeleton is fine for ordinary UI).
 */
export function HallucinInfinityLoader({ size = 'md', label, className = '' }: HallucinInfinityLoaderProps) {
  const { width, stroke } = DIMENSIONS[size];
  const height = width * (50 / 82);
  const stacked = size === 'lg';

  const mark = (
    <svg width={width} height={height} viewBox="0 0 82 50" fill="none" aria-hidden="true" className="shrink-0">
      {/* Soft glow — a blurred copy of the flowing arc for depth, not neon */}
      <path
        d={PATH}
        stroke="currentColor"
        strokeWidth={stroke + 3}
        strokeLinecap="round"
        strokeDasharray="34 262"
        className="text-emerald-400/40 blur-[3px] motion-safe:animate-infinity-flow"
      />
      {/* Static track */}
      <path d={PATH} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" className="text-emerald-900/10" />
      {/* The flow itself */}
      <path
        d={PATH}
        stroke="currentColor"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray="34 262"
        className="text-emerald-500 motion-safe:animate-infinity-flow"
      />
    </svg>
  );

  if (!label) return <div className={className}>{mark}</div>;

  return (
    <div
      className={`flex items-center ${stacked ? 'flex-col justify-center gap-4 text-center' : 'gap-2.5'} ${className}`}
      role="status"
      aria-live="polite">
      {mark}
      <span className={`${TEXT_SIZE[size]} leading-snug text-muted`}>{label}</span>
    </div>
  );
}
