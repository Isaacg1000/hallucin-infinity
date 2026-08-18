import React from 'react';
import { LinkIcon } from 'lucide-react';

interface SourceBadgeProps {
  source: string;
  className?: string;
}

export function SourceBadge({ source, className = '' }: SourceBadgeProps) {
  const isGap = source.toLowerCase().startsWith('gap identified') || source.toLowerCase().includes('no source');
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-2xs ${isGap ? 'text-muted-soft italic' : 'text-muted'} ${className}`}>
      {!isGap && <LinkIcon className="h-2.5 w-2.5 shrink-0" strokeWidth={2} />}
      {source}
    </span>
  );
}
