export default {content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        canvas: '#F7F8FA',
        surface: '#FFFFFF',
        raised: '#FBFBFC',
        sunken: '#EEF0F3',
        line: '#E3E5E9',
        'line-strong': '#CACDD4',
        ink: '#181B22',
        'ink-soft': '#3B404B',
        muted: '#6C7178',
        'muted-soft': '#989CA3',
        // Neutral, ink-based — the generic "interactive" color for links,
        // selected filters, progress fills. Emerald (below) is reserved for
        // exploration, discovery, and positive-validation moments so the two
        // don't compete for brand ownership.
        accent: '#20242C',
        'accent-hover': '#0F1116',
        'accent-soft': '#EEEFF1',
        'accent-line': '#D4D7DC',
        positive: '#1B7A4B',
        'positive-soft': '#EDF6F1',
        'positive-line': '#BFDFCD',
        caution: '#8A5A00',
        'caution-soft': '#FBF3E4',
        'caution-line': '#E8D6AE',
        critical: '#A6291F',
        'critical-soft': '#FBEEEC',
        'critical-line': '#EDCCC6',
        // Hypothesis is one of the four trust-model states (see StatusBadge)
        // but previously had no token — three components had each drifted to
        // a slightly different violet by hand. This is the canonical one.
        hypothesis: '#5B4FA0',
        'hypothesis-soft': '#F5F3FC',
        'hypothesis-line': '#D3CDEE',
        // Brand scale, built around the infinity mark. Overriding Tailwind's
        // default emerald-400/500/600/700 (rather than a new color name)
        // means every existing emerald-* usage across the app — glows,
        // dots, hover states — automatically becomes on-brand without a
        // file-by-file migration. aqua/mint are genuinely new: the cool
        // endpoint of the signature gradient and its palest tint.
        emerald: {
          400: '#1FCCA0',
          500: '#16B98B',
          600: '#119B75',
          700: '#087A5B',
        },
        aqua: {
          400: '#24D6AE',
        },
        mint: {
          100: '#E8FAF4',
          200: '#B8F4E3',
        },
      },
      backgroundImage: {
        // The ONE ownable Hallucin∞ gradient — deep emerald to aqua.
        // Reserved for: the infinity mark, a selected route's trace, active
        // processing, and the rare hero glow. Never a generic gradient
        // card. Everywhere this is used should trace back to this single
        // token, not a re-derived from/via/to trio that can drift.
        trace: 'linear-gradient(135deg, #087A5B 0%, #16B98B 55%, #24D6AE 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
        // Wordmark only — "Hallucinate" in the sidebar logo. Never used
        // for body copy or anything that needs to stay easily legible.
        script: ['"Caveat"', 'cursive'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '13px' }],
        xs: ['11px', { lineHeight: '15px' }],
        sm: ['12px', { lineHeight: '17px' }],
        base: ['13px', { lineHeight: '19px' }],
        md: ['14px', { lineHeight: '20px' }],
        // Emphasis size for editorial contexts (route theses, memo claims) —
        // sits between md and lg. Previously scattered as ad hoc text-[15px].
        15: ['15px', { lineHeight: '22px' }],
        lg: ['16px', { lineHeight: '22px' }],
        xl: ['19px', { lineHeight: '25px' }],
        '2xl': ['24px', { lineHeight: '29px' }],
        '3xl': ['32px', { lineHeight: '36px' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '4px',
        lg: '6px',
      },
      boxShadow: {
        // Resting elevation for hoverable cards (Panel, OpportunityCard,
        // PortfolioCompanyCard) — deliberately much quieter than `pop`,
        // which is for floating/overlay surfaces (menus, modals, toasts).
        card: '0 1px 2px rgba(24,27,34,0.05), 0 1px 1px rgba(24,27,34,0.04)',
        panel: '-8px 0 24px -16px rgba(24, 27, 34, 0.28)',
        pop: '0 10px 28px -10px rgba(24, 27, 34, 0.26), 0 1px 3px rgba(24,27,34,0.08)',
      },
      letterSpacing: {
        label: '0.07em',
      },
      maxWidth: {
        // Three page widths, not eleven arbitrary ones. `narrow` is for
        // single-column reading (Home, Context, Route Detail, Validate,
        // Action Plan); `medium` for comparison/list pages; `wide` for
        // multi-column dashboard-style pages.
        narrow: '760px',
        medium: '960px',
        wide: '1560px',
      },
      transitionDuration: {
        DEFAULT: '150ms',
        fast: '100ms',
        base: '150ms',
        slow: '260ms',
      },
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.2, 0, 0, 1)',
        exploratory: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        'infinity-flow': {
          to: { strokeDashoffset: '-296' },
        },
        'trace-draw': {
          to: { strokeDashoffset: '0' },
        },
        'grow-in': {
          from: { opacity: '0', transform: 'scale(0.94)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'infinity-flow': 'infinity-flow 2.6s linear infinite',
        'grow-in': 'grow-in 220ms cubic-bezier(0.2, 0, 0, 1) both',
      },
    },
  },
}
