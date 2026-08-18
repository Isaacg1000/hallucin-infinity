import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { MATERIALS } from '../../data/materials';

interface ContextDrawerProps {
  open: boolean;
  onClose: () => void;
  fund: string;
  company: string;
}

/** What the current work is actually running against, made visible
 * rather than assumed — real values only: the selected fund/company
 * (from the Header's own state), the real uploaded-materials count and
 * list, and the two governance settings that already exist as real
 * toggles on the Settings page (kept in sync with their defaults there,
 * not independently invented). Nothing here claims a live backend
 * permission system that doesn't exist.
 *
 * Fixed (viewport-relative) rather than the shared SidePanel's absolute
 * positioning — this is triggered from the Header, which isn't a
 * full-height positioning ancestor. */
export function ContextDrawer({ open, onClose, fund, company }: ContextDrawerProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-ink/20"
          />
          <motion.aside
            role="dialog"
            aria-label="Context"
            initial={{ x: 24, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 24, opacity: 0 }}
            transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
            className="fixed inset-y-0 right-0 z-50 flex w-[400px] flex-col border-l border-line bg-surface shadow-panel">
            <header className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3">
              <div className="min-w-0">
                <p className="mb-1 truncate text-2xs font-medium uppercase tracking-label text-muted">
                  Applied to this work
                </p>
                <h2 className="truncate text-md font-semibold tracking-[-0.01em] text-ink">Context</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="flex h-6 w-6 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:bg-sunken hover:text-ink">
                <XIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <dl className="space-y-4">
                <div>
                  <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Fund</dt>
                  <dd className="mt-1 text-sm text-ink">{fund}</dd>
                </div>
                <div>
                  <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Portfolio company</dt>
                  <dd className="mt-1 text-sm text-ink">{company}</dd>
                </div>
              </dl>

              <div className="mt-6 border-t border-line pt-4">
                <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">
                  {MATERIALS.length} uploaded documents
                </p>
                <ul className="mt-2.5 space-y-2">
                  {MATERIALS.map((m) => (
                    <li key={m.name} className="flex items-center gap-2.5 text-xs">
                      <m.icon className="h-3.5 w-3.5 shrink-0 text-muted-soft" strokeWidth={1.75} />
                      <span className="min-w-0 flex-1 truncate text-ink-soft">{m.name}</span>
                      <span className="shrink-0 text-muted-soft">{m.kind}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 space-y-3 border-t border-line pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-soft">Firm memory enabled</span>
                  <span className="text-xs font-medium text-positive">On</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-ink-soft">External research</span>
                  <span className="text-xs font-medium text-muted">Not enabled</span>
                </div>
                <p className="text-2xs leading-relaxed text-muted-soft">
                  Set in Settings → Analytical Standards. This is a prototype — external research is not actually
                  performed regardless of this setting.
                </p>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
