import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

const REASONS = ['Too obvious', 'Too broad', 'Not relevant', 'Already considered', 'Other'] as const;

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onRegenerate: () => void;
  categoryLabel?: string;
}

export function FeedbackModal({ open, onClose, onRegenerate, categoryLabel }: FeedbackModalProps) {
  const [reason, setReason] = useState<string | null>(null);

  return (
    <Modal
      open={open}
      onClose={() => {
        setReason(null);
        onClose();
      }}
      title="These aren't useful"
      description={categoryLabel ? `What feels off about the ${categoryLabel.toLowerCase()} directions?` : 'What feels off?'}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => {
              setReason(null);
              onClose();
            }}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!reason}
            onClick={() => {
              onRegenerate();
              setReason(null);
              onClose();
            }}>
            Regenerate
          </Button>
        </div>
      }>
      <div className="flex flex-wrap gap-2">
        {REASONS.map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={reason === r}
            onClick={() => setReason(r)}
            className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
              reason === r ? 'border-accent bg-accent-soft text-accent' : 'border-line text-ink-soft hover:border-line-strong hover:bg-raised'
            }`}>
            {r}
          </button>
        ))}
      </div>
    </Modal>
  );
}
