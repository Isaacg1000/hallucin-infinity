# Hallucin∞

A strategic exploration tool. Start from one open-ended business idea; it maps
out the possibility space around it, challenges each direction against
evidence, and narrows down to the routes actually worth pursuing.

The core bet: **the value isn't "AI gives you an answer," it's "AI helps you
see the decision landscape"** — the paths you hadn't considered, not just a
recommendation for the one you walked in with.

> This is still a prototype. **Explore and the Critic now both call a real
> model** (see [Live generation](#live-generation) below) — the strategic
> routes you get back, and the route spec / comparison / validation data
> for any route you save, are generated from your actual idea, not the
> static NorthPeak demo. See [Status](#status) below.

## V1 scope

V1 is deliberately reduced to three features, enough to answer one question:
*can this help a user discover a route they hadn't seriously considered,
understand the tradeoffs, and decide whether it's worth pursuing?*

**1. Explore** — enter an idea, answer a few context questions (goal, target
customer, constraints, what matters most), and get a visual map of 5–7
strategic routes branching off it. Click a node to go deeper, see why a
route exists, save it, or dismiss it.

**2. Compare** — pick 2–3 saved routes and compare them side by side across
market potential, differentiation, speed to MVP, capital required,
competitive intensity, and evidence strength. Rank what matters most to you
and see which route is best aligned with those priorities — not "the best
route," since that depends entirely on what you're optimizing for.

**3. Validate** — pick one route and see a grounded case for and against it:
the thesis, supporting evidence, contradicting evidence, the assumptions it
depends on, what's still unknown, and a recommended next test. Every claim
is tagged as one of four things — **Hypothesis**, **Evidence**, **Inference**,
or **Unknown** — so nothing reads as more certain than it actually is.

Explore (the **Dreamer**) is deliberately wide and divergent generation; a
second model call, the **Critic** (`api/critique.ts`), stress-tests one route
at a time against real-world constraints and produces the route spec,
comparison scorecard, and validation case that Route Detail, Compare, and
Validate all read from. It runs lazily the first time a route needs data
(opening its detail page, comparing it, validating it) and eagerly in the
background the moment a route is saved from the map, so by the time you
reach Compare or Validate it's often already there.

**V1 flow:** Home → idea → context → Exploration Map → save routes → Compare
→ Validate one.

Portfolio Companies, Decisions, Experiments, Institutional Intelligence,
reporting, and everything else are future phases. Their code still exists in
this repo — it's just not routed or linked from V1's navigation (see
[Project structure](#project-structure)).

## Live generation

Submitting an idea on Home → Context calls `api/explore.ts` (the Dreamer), a
Vercel serverless function (Node.js runtime — not Edge, since the Anthropic
SDK's dependency tree touches `node:fs`/`node:path`) that sends your idea and
context answers to Claude and gets back a real 5–7 direction,
several-routes-per-direction exploration tree — not the static NorthPeak
mock. Opening a route's detail page, comparing it, or validating it calls
`api/critique.ts` (the Critic) for that specific route the first time it's
needed, and again in the background as soon as it's saved. The frontend
never sees an API key; it only talks to these two backend routes.

Setup:

```bash
cp .env.example .env       # then fill in ANTHROPIC_API_KEY
vercel dev                 # serves Vite, api/explore.ts, and api/critique.ts locally
```

`yarn dev` alone will not serve `/api/explore` or `/api/critique` (Vite
doesn't run Vercel functions), so Explore falls back to the static demo tree
with a toast explaining why if you use `yarn dev` without `vercel dev`, or
if the API key isn't set, or a request fails for any reason. Route Detail /
Compare / Validate show a plain error state instead of silently falling
back, since there's no sensible static substitute for a critique of your
specific route.

On Vercel, set `ANTHROPIC_API_KEY` as a project environment variable
(Project Settings → Environment Variables) — never commit it.

## Status

This is still a demo-quality product, not production-ready:

- **Explore and the Critic are both real model calls now.** Every route in
  a live-generated exploration gets its own Critic-generated route spec,
  comparison scorecard, and validation case — Compare, Validate, Saved, and
  Explorations all work end-to-end for a real idea, not just the static
  NorthPeak demo tree (an AI recruiting platform idea, explored on behalf of
  a fictional PE portfolio company, "NorthPeak Industrial", still used as
  the guided-demo content and as an offline fallback). Portfolio-side data
  (Portfolio Companies, Decisions, Experiments, etc.) is still fully mocked
  and unrouted — see [Future phases](#future-phases-not-in-v1).
- **Critique evidence is honestly labeled, not fabricated.** The Critic is
  instructed to only cite a source it's actually confident is real, and to
  otherwise say plainly that a claim is model reasoning rather than
  inventing a study, statistic, or publication — consistent with the
  four-part trust model the rest of the app uses.
- **No persistence.** All state (the generated tree, saved routes, the
  Critic result cache, exploration history) lives in memory for the session
  and resets on reload.
- **No real security or data-handling guarantees exist yet.** The app says
  so explicitly in its own UI (see the notice on the New Exploration file
  upload) — do not upload real confidential material to any deployment of
  this prototype.

## Tech stack

- [Vite](https://vitejs.dev/) + React 18 + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) — see `tailwind.config.js` for the
  design token system (color, type, spacing, radius, shadow, motion)
- [React Router v6](https://reactrouter.com/)
- [@xyflow/react](https://reactflow.dev/) (React Flow) for the Exploration
  Map canvas, with a custom curved-edge type and a brand gradient trace
- [Framer Motion](https://www.framer.com/motion/) for the small,
  purposeful animation that exists (loading states, panel transitions,
  reduced-motion respected throughout)

## Getting started

```bash
yarn install
yarn dev        # start the dev server
yarn build      # production build
yarn lint       # eslint
```

There is no test suite configured (`yarn lint`/`yarn build`/`npx tsc --noEmit`
are the checks that exist).

## Project structure

```
src/
  pages/            Route-level screens (Home, Context, ExplorationMap,
                     RouteDetail, Compare, Validate, Explorations, Saved —
                     the eight V1-routed pages. Everything else in this
                     folder — Overview, PortfolioCompanies, Decisions,
                     Experiments, Intelligence, etc. — exists but is not
                     routed in App.tsx; future phases.)
  components/
    map/             Exploration Map canvas, nodes, custom edges, spotlight
    validate/        Evidence cards, citation drawer, assumption ledger
    compare/         Comparison grid, priority ranking
    ui/              Shared primitives (Button, Modal, StatusBadge, the
                      four-state epistemic tags, HallucinInfinityLoader)
    layout/           Sidebar, AppShell
  data/              nodes.ts (the exploration tree — demo by default, or
                     the live Dreamer output once one's been generated),
                     routeDetails.ts / validation.ts / comparisons.ts (demo
                     data first, then the Critic cache via
                     critiqueCache.ts), plus the not-yet-routed
                     Portfolio-side datasets
  lib/               exploreClient.ts / critiqueClient.ts (typed fetch
                     wrappers for the two backend routes), critiqueRunner.ts
                     (dedupes/caches in-flight Critic calls), useCritique.ts
                     (the hook pages use to trigger + read critique state)
  state/             ExplorationContext — the one piece of shared state
                     (current idea, saved/dismissed routes, tracked
                     opportunities)
  types/             Domain types for both the V1 flow and the deferred
                     Portfolio-side features
api/
  explore.ts         The Dreamer — generates the exploration tree
  critique.ts        The Critic — stress-tests one route at a time
```

## Design system notes

- Restrained neutral palette with emerald as the one brand accent — used
  for active/selected/discovery states, not decoration. `tailwind.config.js`
  documents the token reasoning inline.
- Four-part trust model (`StatusBadge`) used everywhere a claim is shown, so
  a hypothesis never visually reads as settled evidence.
- The infinity mark, the brand gradient (`bg-trace`), and the possibility-
  narrowing visual are the three things meant to be recognizably
  Hallucin∞'s — reused deliberately rather than adding more one-off motifs.

## Future phases (not in V1)

Portfolio Companies · Portfolio Intelligence · Decisions · Experiments ·
Institutional Intelligence · Reporting · billing · permissions ·
integrations · enterprise admin · collaboration · mobile.
