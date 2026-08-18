import React from 'react';

interface SectionProps {
  title?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  id?: string;
}

export function Section({
  title,
  meta,
  actions,
  children,
  className = '',
  bodyClassName = 'p-4',
  id
}: SectionProps) {
  return (
    <section id={id} className={`border border-line bg-surface ${className}`}>
      {(title || actions) &&
      <header className="flex h-9 items-center justify-between gap-3 border-b border-line bg-raised px-3">
          <div className="flex min-w-0 items-center gap-2.5">
            {title &&
          <h2 className="whitespace-nowrap text-2xs font-semibold uppercase tracking-label text-ink-soft">
                {title}
              </h2>
          }
            {meta && <span className="truncate text-2xs text-muted">{meta}</span>}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-1.5">{actions}</div>}
        </header>
      }
      <div className={bodyClassName}>{children}</div>
    </section>);

}

export function Label({ children, className = '' }: {children: React.ReactNode;className?: string;}) {
  return (
    <span className={`text-2xs font-medium uppercase tracking-label text-muted-soft ${className}`}>
      {children}
    </span>);

}

export function Stat({
  label,
  value,
  tone = 'ink',
  sub





}: {label: string;value: string;tone?: 'ink' | 'accent' | 'positive' | 'critical' | 'muted';sub?: string;}) {
  const tones = {
    ink: 'text-ink',
    accent: 'text-accent',
    positive: 'text-positive',
    critical: 'text-critical',
    muted: 'text-muted'
  };
  return (
    <div className="min-w-0">
      <Label>{label}</Label>
      <p className={`mt-1 font-mono text-lg tabular font-semibold ${tones[tone]}`}>{value}</p>
      {sub && <p className="mt-0.5 truncate text-2xs text-muted">{sub}</p>}
    </div>);

}