import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XIcon,
  UploadCloudIcon,
  PlusIcon,
  InfinityIcon,
  CheckIcon,
  ShieldIcon } from
'lucide-react';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { companies } from '../../data/companies';
import { MATERIALS } from '../../data/materials';
import { useExploration } from '../../state/ExplorationContext';

const HORIZONS = ['100 Days', '12 Months', '24 Months', 'Hold Period'];

const CONSTRAINT_LIBRARY = [
'No large-scale ERP replacement',
'CapEx under $10M',
'No layoffs exceeding 5% of workforce',
'Payback period under 18 months',
'No changes to union agreements',
'Preserve current facility footprint'];


const SUGGESTED_MATERIALS = ['CIM', 'Financial statements', 'Management presentation', 'Customer data', 'Market reports', 'Operational reports'];

interface NewAnalysisModalProps {
  open: boolean;
  onClose: () => void;
  onBegin: () => void;
}

function Field({
  label,
  hint,
  required,
  children





}: {label: string;hint?: string;required?: boolean;children: React.ReactNode;}) {
  return (
    <div className="border-b border-line px-7 py-5">
      <div className="mb-2 flex items-baseline gap-2">
        <label className="text-[13px] font-semibold text-ink">{label}</label>
        {required && <span className="text-2xs uppercase tracking-label text-muted-soft">Required</span>}
      </div>
      {hint && <p className="mb-2.5 text-xs leading-relaxed text-muted">{hint}</p>}
      {children}
    </div>);

}

export function NewAnalysisModal({ open, onClose, onBegin }: NewAnalysisModalProps) {
  const { setIdeaText } = useExploration();
  const [company, setCompany] = useState('northpeak');
  const [question, setQuestion] = useState(
    'Where are the highest-impact opportunities to increase EBITDA at NorthPeak Industrial over the next 24 months?'
  );
  const [outcome, setOutcome] = useState('Identify $15M+ in realistic EBITDA improvement opportunities.');
  const [horizon, setHorizon] = useState('24 Months');
  const [constraints, setConstraints] = useState<string[]>(CONSTRAINT_LIBRARY.slice(0, 4));
  const [dragging, setDragging] = useState(false);
  const [dataHandlingOpen, setDataHandlingOpen] = useState(false);

  const toggleConstraint = (c: string) =>
  setConstraints((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  return (
    <>
    <AnimatePresence>
      {open &&
      <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-6">
          <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-ink/40"
          onClick={onClose} />
        
          <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="New exploration"
          initial={{ opacity: 0, y: 12, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.99 }}
          transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
          className="relative my-4 w-full max-w-3xl border border-line bg-surface shadow-pop">
          
            <header className="flex items-start justify-between gap-6 border-b border-line px-7 py-5">
              <div>
                <p className="mb-1.5 text-2xs font-medium uppercase tracking-label text-muted">
                  New Exploration
                </p>
                <h2 className="text-lg font-semibold tracking-[-0.01em] text-ink">
                  What strategic question are you trying to answer?
                </h2>
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:bg-raised hover:text-ink">
              
                <XIcon className="h-4 w-4" strokeWidth={1.75} />
              </button>
            </header>

            <div className="max-h-[calc(100vh-14rem)] overflow-y-auto">
              <Field label="Portfolio Company" required>
                <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-9 w-full rounded-md border border-line bg-surface px-2.5 text-[13px] text-ink focus:border-accent focus:outline-none">
                
                  {companies.map((c) =>
                <option key={c.id} value={c.id}>
                      {c.name} — {c.industry}
                    </option>
                )}
                </select>
              </Field>

              <Field
              label="Strategic Question"
              required
              hint="State the decision you need to make. We'll explore approaches, not answer conversationally.">
              
                <Textarea value={question} onChange={(e) => setQuestion(e.target.value)} />
              </Field>

              <Field label="Desired Outcome" required hint="What would make this analysis worth running?">
                <Textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} />
              </Field>

              <Field label="Time Horizon" required>
                <div className="flex flex-wrap gap-2">
                  {HORIZONS.map((h) =>
                <button
                  key={h}
                  type="button"
                  onClick={() => setHorizon(h)}
                  className={`h-8 border px-3 text-xs transition-colors ${
                  horizon === h ?
                  'border-ink bg-ink text-white' :
                  'border-line text-ink-soft hover:border-line-strong hover:bg-raised'}`
                  }>
                  
                      {h}
                    </button>
                )}
                </div>
              </Field>

              <Field
              label="Constraints"
              hint="Constraints eliminate hypotheses before they are ranked. Be explicit about what is off the table.">
              
                <div className="flex flex-wrap gap-2">
                  {CONSTRAINT_LIBRARY.map((c) => {
                  const active = constraints.includes(c);
                  return (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleConstraint(c)}
                      aria-pressed={active}
                      className={`inline-flex h-8 items-center gap-1.5 border px-2.5 text-xs transition-colors ${
                      active ?
                      'border-accent-line bg-accent-soft text-accent' :
                      'border-line text-muted hover:border-line-strong hover:bg-raised'}`
                      }>
                      
                        {active ?
                      <CheckIcon className="h-3 w-3" strokeWidth={2} /> :

                      <PlusIcon className="h-3 w-3" strokeWidth={2} />
                      }
                        {c}
                      </button>);

                })}
                </div>
              </Field>

              <Field label="Supporting Materials" hint="Uploaded material is treated as internal evidence and cited by source.">
                <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                }}
                className={`flex flex-col items-center justify-center border border-dashed px-4 py-7 text-center transition-colors ${
                dragging ? 'border-accent bg-accent-soft' : 'border-line-strong bg-raised'}`
                }>
                
                  <UploadCloudIcon className="mb-2 h-5 w-5 text-muted" strokeWidth={1.5} />
                  <p className="text-[13px] text-ink">
                    Drag files here, or{' '}
                    <span className="text-accent underline underline-offset-2">browse</span>
                  </p>
                  <p className="mt-1.5 text-xs text-muted">
                    {SUGGESTED_MATERIALS.join(' · ')}
                  </p>
                </div>

                <div className="mt-3 flex items-start gap-2.5 border border-caution-line bg-caution-soft px-3.5 py-3">
                  <ShieldIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-caution" strokeWidth={1.75} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-ink">Prototype data notice</p>
                    <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                      This is an early prototype. Do not upload confidential, regulated, or highly sensitive company
                      information. Uploaded materials may be processed to generate this analysis. Production
                      security, retention, and data-isolation controls are still being implemented.
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      For testing, use redacted or synthetic materials.
                    </p>
                    <button
                      type="button"
                      onClick={() => setDataHandlingOpen(true)}
                      className="mt-1.5 text-xs font-medium text-accent underline underline-offset-2 hover:text-accent-hover">
                      Data handling
                    </button>
                  </div>
                </div>

                <ul className="mt-3 divide-y divide-line border border-line">
                  {MATERIALS.map((m) =>
                <li key={m.name} className="flex items-center gap-3 bg-surface px-3 py-2.5">
                      <m.icon className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] text-ink">{m.name}</span>
                        <span className="block text-xs text-muted">
                          {m.kind} · {m.size}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs text-positive">
                        <CheckIcon className="h-3 w-3" strokeWidth={2} /> Indexed
                      </span>
                    </li>
                )}
                </ul>
              </Field>
            </div>

            <footer className="flex flex-wrap items-center justify-between gap-4 bg-raised px-7 py-5">
              <p className="max-w-md text-xs leading-relaxed text-muted">
                We'll explore the paths around this decision, challenge the assumptions behind them, and surface
                the routes worth investigating.
              </p>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setIdeaText(question);
                    onBegin();
                  }}
                  disabled={!question.trim()}
                  className="!bg-trace !border-transparent hover:!brightness-110">
                  Begin Exploration
                  <InfinityIcon className="h-4 w-6 -mx-0.5" strokeWidth={2.5} />
                </Button>
              </div>
            </footer>
          </motion.div>
        </div>
      }
    </AnimatePresence>

    <Modal open={dataHandlingOpen} onClose={() => setDataHandlingOpen(false)} title="Data handling" width="w-[480px]">
      <ol className="list-decimal space-y-3 pl-4 text-sm leading-relaxed text-ink-soft">
        <li>This is a prototype.</li>
        <li>Users should use redacted or synthetic materials.</li>
        <li>Production security and retention controls are under development.</li>
        <li>Specific claims will only be added once implemented and verified.</li>
      </ol>
    </Modal>
    </>);

}