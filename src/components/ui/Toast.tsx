import React, { createContext, useCallback, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, InfoIcon } from 'lucide-react';
import { HallucinInfinityLoader } from './HallucinInfinityLoader';

interface ToastItem {
  id: number;
  message: string;
  tone: 'default' | 'success' | 'processing';
}

interface ToastContextValue {
  showToast: (message: string, tone?: ToastItem['tone']) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let idCounter = 0;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, tone: ToastItem['tone'] = 'default') => {
    const id = ++idCounter;
    setToasts((prev) => {
      // Collapse back-to-back duplicates (e.g. exploring several nodes in
      // quick succession) instead of stacking identical toasts.
      const withoutDuplicate = prev.filter((t) => t.message !== message);
      return [...withoutDuplicate, { id, message, tone }];
    });
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2600);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
              className="pointer-events-auto flex items-center gap-2 rounded-lg border border-line-strong bg-ink px-3.5 py-2.5 text-white shadow-pop">
              {t.tone === 'success' ? (
                <CheckIcon className="h-3.5 w-3.5 shrink-0 text-emerald-400" strokeWidth={2.5} />
              ) : t.tone === 'processing' ? (
                <HallucinInfinityLoader size="sm" className="shrink-0" />
              ) : (
                <InfoIcon className="h-3.5 w-3.5 shrink-0 text-white/60" strokeWidth={2} />
              )}
              <span className="text-[13px] leading-snug">{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
