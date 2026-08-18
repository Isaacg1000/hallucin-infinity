import React from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  onReturn?: () => void;
  retryLabel?: string;
  returnLabel?: string;
  className?: string;
}

export function ErrorState({
  title = "We couldn't explore this direction.",
  description = 'Something interrupted that request. Your map hasn’t lost any progress.',
  onRetry,
  onReturn,
  retryLabel = 'Try Again',
  returnLabel = 'Return to Map',
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center px-6 py-16 text-center ${className}`}>
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full border border-critical-line bg-critical-soft">
        <AlertCircleIcon className="h-5 w-5 text-critical" strokeWidth={1.75} />
      </div>
      <h3 className="text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-muted">{description}</p>
      <div className="mt-5 flex items-center gap-2">
        {onReturn && (
          <Button variant="secondary" onClick={onReturn}>
            {returnLabel}
          </Button>
        )}
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            {retryLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
