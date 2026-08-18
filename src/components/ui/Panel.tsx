import React from 'react';

interface PanelProps {
  title?: string;
  eyebrow?: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  bodyClassName?: string;
  className?: string;
  id?: string;
}

export function Panel({
  title,
  eyebrow,
  description,
  actions,
  children,
  bodyClassName = 'p-5',
  className = '',
  id
}: PanelProps) {
  return (
    <section id={id} className={`border border-line bg-surface shadow-card ${className}`}>
      {(title || actions) &&
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-3.5">
          <div className="min-w-0">
            {eyebrow &&
          <p className="mb-1 text-2xs font-medium uppercase tracking-label text-muted">{eyebrow}</p>
          }
            {title && <h2 className="text-sm font-semibold text-ink">{title}</h2>}
            {description && <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted">{description}</p>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </header>
      }
      <div className={bodyClassName}>{children}</div>
    </section>);

}