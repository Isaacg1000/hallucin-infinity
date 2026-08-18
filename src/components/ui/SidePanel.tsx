import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  width?: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
  overlay?: boolean;
}

export function SidePanel({
  open,
  onClose,
  title,
  eyebrow,
  width = 'w-[420px]',
  footer,
  children,
  overlay = false
}: SidePanelProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open &&
      <>
          {overlay &&
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={onClose}
          className="absolute inset-0 z-30 bg-ink/20" />

        }
          <motion.aside
          role="dialog"
          aria-label={title}
          initial={{ x: 24, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 24, opacity: 0 }}
          transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
          className={`absolute inset-y-0 right-0 z-40 flex ${width} flex-col border-l border-line bg-surface shadow-panel`}>
          
            <header className="flex shrink-0 items-start justify-between gap-3 border-b border-line px-4 py-3">
              <div className="min-w-0">
                {eyebrow &&
              <p className="mb-1 truncate text-2xs font-medium uppercase tracking-label text-muted">
                    {eyebrow}
                  </p>
              }
                <h2 className="truncate text-md font-semibold tracking-[-0.01em] text-ink">{title}</h2>
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close panel"
              className="flex h-6 w-6 shrink-0 items-center justify-center border border-line text-muted transition-colors hover:bg-sunken hover:text-ink">
              
                <XIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
              </button>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
            {footer && <div className="shrink-0 border-t border-line bg-raised p-3">{footer}</div>}
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}