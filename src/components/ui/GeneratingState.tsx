import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HallucinInfinityLoader } from './HallucinInfinityLoader';

interface GeneratingStateProps {
  /** Calm, non-technical status lines to cycle through, e.g. "Understanding your idea..." */
  messages: string[];
  className?: string;
}

export function GeneratingState({ messages, className = '' }: GeneratingStateProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (messages.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((i) => Math.min(i + 1, messages.length - 1));
    }, 1100);
    return () => window.clearInterval(id);
  }, [messages.length]);

  return (
    <div className={`flex flex-col items-center justify-center px-6 py-20 text-center ${className}`}>
      <div className="mb-5 flex items-center justify-center">
        <HallucinInfinityLoader size="lg" />
      </div>
      <div className="h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={messages[index]}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted">
            {messages[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
