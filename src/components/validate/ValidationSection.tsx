import React from 'react';

interface ValidationSectionProps {
  title: string;
  count?: number;
  /** A short framing sentence under the header — used sparingly, where the
   * section's intent isn't self-evident from the title alone. */
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ValidationSection({ title, count, description, children, className = '' }: ValidationSectionProps) {
  return (
    <section className={className}>
      <div className="flex items-baseline gap-2">
        <h2 className="text-2xs font-semibold uppercase tracking-label text-muted-soft">{title}</h2>
        {count !== undefined && <span className="font-mono text-2xs tabular text-muted-soft">{count}</span>}
      </div>
      {description && <p className="mt-1.5 max-w-lg text-xs leading-relaxed text-muted">{description}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}
