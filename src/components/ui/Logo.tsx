import React from "react";

interface LogoProps {
  /** "full" renders the mark + wordmark + caption; "icon" renders just the mark. */
  variant?: "full" | "icon";
  size?: "sm" | "md";
  className?: string;
}

const MARK_SIZE = {
  sm: "h-6 w-6",
  md: "h-8 w-8",
};

const WORDMARK_SIZE = {
  sm: "text-[25px]",
  md: "text-[30px]",
};

// The lemniscate curve used everywhere else in the brand
// (HallucinInfinityLoader, the map's gradient route trace) — laid flat,
// same orientation and proportions in both places it appears in the
// logo now: inside the mark and, at a smaller size, nowhere else — the
// wordmark is spelled out in full instead of ending in this glyph.
const MARK_PATH = "M 14,25 C 14,10 30,10 41,25 C 52,40 68,40 68,25 C 68,10 52,10 41,25 C 30,40 14,40 14,25 Z";

export function LogoMark({ size = "sm", className = "" }: Pick<LogoProps, "size" | "className">) {
  return (
    <div className={`relative flex ${MARK_SIZE[size]} shrink-0 items-center justify-center ${className}`}>
      <svg viewBox="0 0 82 50" className="relative h-full w-auto overflow-visible" fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="markCoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#087A5B" />
            <stop offset="50%" stopColor="#16B98B" />
            <stop offset="100%" stopColor="#24D6AE" />
          </linearGradient>
        </defs>
        {/* A neon-glow treatment (bright blurred halo bleeding into
            darkness) only works on a dark backdrop — on the sidebar's
            light background it just washed out to a pale smudge. This
            gets its presence from real contrast instead: a saturated
            dark-emerald-to-aqua gradient core (the same trace gradient
            used elsewhere in the brand) with a soft grounding shadow and
            a light highlight for a touch of gloss — legible on its own,
            not dependent on a black box behind it. */}
        <path d={MARK_PATH} stroke="#0B4A38" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" className="opacity-25 blur-[2px]" />
        <path d={MARK_PATH} stroke="url(#markCoreGrad)" strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <path d={MARK_PATH} stroke="#B8F4E3" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="opacity-90" />
      </svg>
    </div>
  );
}

export function Logo({ variant = "full", size = "sm", className = "" }: LogoProps) {
  if (variant === "icon") return <LogoMark size={size} className={className} />;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <div className="leading-tight">
        <p className={`font-script font-bold leading-none tracking-[-0.01em] text-ink ${WORDMARK_SIZE[size]}`}>Hallucinate</p>
        <p className="mt-0.5 text-2xs uppercase tracking-label text-muted-soft">Decision Intelligence</p>
      </div>
    </div>
  );
}
