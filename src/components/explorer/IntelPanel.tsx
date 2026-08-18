import React from 'react';
import { motion } from 'framer-motion';
import {
  XIcon,
  ArrowRightIcon,
  GitCompareIcon,
  GavelIcon,
  CheckIcon,
  MousePointerClickIcon } from
'lucide-react';
import { Opportunity } from '../../types';
import { Button } from '../ui/Button';
import { StatusPill } from '../ui/StatusPill';
import { Meter, scoreTone } from '../ui/Meter';
import { Label } from '../ui/Section';

interface IntelPanelProps {
  opportunity: Opportunity | null;
  onClose: () => void;
  onOpen: (id: string) => void;
  onCompare: (id: string) => void;
  onAddToDecision: (id: string) => void;
  compared: boolean;
  inDecision: boolean;
}

export function EmptyIntelPanel() {
  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col items-center justify-center border-l border-line bg-raised px-8 text-center">
      <MousePointerClickIcon className="h-5 w-5 text-muted-soft" strokeWidth={1.5} />
      <p className="mt-3 text-sm text-ink-soft">Select an opportunity</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        The intelligence panel shows why an opportunity surfaced, what supports it, and what could make it
        wrong — before you commit to a full analysis.
      </p>
      <p className="mt-4 font-mono text-2xs text-muted-soft">
        ↑ ↓ navigate · ⏎ open analysis · esc close
      </p>
    </div>);

}

export function IntelPanel({
  opportunity,
  onClose,
  onOpen,
  onCompare,
  onAddToDecision,
  compared,
  inDecision
}: IntelPanelProps) {
  if (!opportunity) return <EmptyIntelPanel />;
  const o = opportunity;

  return (
    <motion.aside
      key={o.id}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.14, ease: [0.2, 0, 0, 1] }}
      aria-label={`Intelligence panel: ${o.title}`}
      className="flex h-full w-[360px] shrink-0 flex-col border-l border-line bg-surface">
      
      <header className="flex shrink-0 items-start justify-between gap-2 border-b border-line px-4 py-3">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-2">
            <Label>{o.category}</Label>
            <StatusPill label={o.status} />
          </div>
          <h2 className="text-md font-semibold leading-snug tracking-[-0.01em] text-ink">{o.title}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="flex h-6 w-6 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:bg-sunken hover:text-ink">
          
          <XIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-3 divide-x divide-line border-b border-line">
          {[
          { v: String(o.score), l: 'Overall Score', tone: 'text-accent' },
          { v: `+$${o.ebitda.toFixed(1)}M`, l: 'EBITDA', tone: 'text-ink' },
          { v: `${o.confidence}%`, l: 'Confidence', tone: 'text-ink' }].
          map((m) =>
          <div key={m.l} className="px-3 py-2.5">
              <p className={`font-mono text-xl font-semibold tabular ${m.tone}`}>{m.v}</p>
              <p className="mt-0.5 text-2xs uppercase tracking-label text-muted">{m.l}</p>
            </div>
          )}
        </div>

        <div className="border-b border-line px-4 py-3">
          <Label>Score composition</Label>
          <ul className="mt-2.5 space-y-2">
            {o.scoreComponents.map((c) =>
            <li key={c.label} className="flex items-center gap-3">
                <span className="w-[132px] shrink-0 truncate text-xs text-ink-soft">{c.label}</span>
                <Meter value={c.value} tone={scoreTone(c.value)} className="flex-1" height="h-[3px]" />
                <span className="w-6 shrink-0 text-right font-mono text-2xs tabular text-muted">
                  {c.value}
                </span>
              </li>
            )}
          </ul>
        </div>

        <div className="border-b border-line px-4 py-3">
          <Label>Why it surfaced</Label>
          <ul className="mt-2.5 space-y-2">
            {o.whySurfaced.map((w) =>
            <li key={w} className="flex gap-2">
                <span className="mt-[6px] h-1 w-1 shrink-0 bg-accent" />
                <span className="text-xs leading-relaxed text-ink-soft">{w}</span>
              </li>
            )}
          </ul>
        </div>

        <dl className="divide-y divide-line border-b border-line">
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-xs text-muted">Evidence</dt>
            <dd className="flex items-center gap-2 font-mono text-xs tabular">
              <span className="text-positive">{o.evidenceCount.supporting} supporting</span>
              <span className="text-muted-soft">/</span>
              <span className="text-critical">{o.evidenceCount.contradicting} contradicting</span>
            </dd>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-xs text-muted">Assumptions</dt>
            <dd className="flex items-center gap-2 font-mono text-xs tabular">
              <span className="text-ink">{o.assumptionCount.total} total</span>
              <span className="text-muted-soft">/</span>
              <span className="text-caution">{o.assumptionCount.unresolved} unresolved</span>
            </dd>
          </div>
          <div className="flex items-center justify-between px-4 py-2.5">
            <dt className="text-xs text-muted">Risks</dt>
            <dd className="font-mono text-xs tabular text-ink">{o.riskCount} material</dd>
          </div>
        </dl>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3">
          {[
          ['Time to impact', o.timeToImpact],
          ['Payback', o.payback],
          ['CapEx', o.capex],
          ['Complexity', o.complexity]].
          map(([k, v]) =>
          <div key={k}>
              <dt className="text-2xs uppercase tracking-label text-muted-soft">{k}</dt>
              <dd className="mt-0.5 font-mono text-xs tabular text-ink">{v}</dd>
            </div>
          )}
          <div className="col-span-2">
            <dt className="text-2xs uppercase tracking-label text-muted-soft">Proposed owner</dt>
            <dd className="mt-0.5 text-xs text-ink">{o.owner}</dd>
          </div>
        </dl>
      </div>

      <footer className="shrink-0 border-t border-line bg-raised p-3">
        <Button variant="primary" size="md" className="w-full" onClick={() => onOpen(o.id)}>
          Open Analysis
          <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={2} />
        </Button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => onCompare(o.id)}>
            {compared ?
            <CheckIcon className="h-3 w-3 text-accent" strokeWidth={2.5} /> :

            <GitCompareIcon className="h-3 w-3" strokeWidth={1.75} />
            }
            {compared ? 'In compare' : 'Compare'}
          </Button>
          <Button size="sm" onClick={() => onAddToDecision(o.id)}>
            {inDecision ?
            <CheckIcon className="h-3 w-3 text-accent" strokeWidth={2.5} /> :

            <GavelIcon className="h-3 w-3" strokeWidth={1.75} />
            }
            {inDecision ? 'Added' : 'Add to Decision'}
          </Button>
        </div>
      </footer>
    </motion.aside>);

}