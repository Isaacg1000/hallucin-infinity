import React from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  meta?: React.ReactNode;
}

export function PageHeader({ eyebrow, title, subtitle, actions, meta }: PageHeaderProps) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-6">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-2xs font-medium uppercase tracking-label text-muted">{eyebrow}</p>}
        <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-muted">{subtitle}</p>}
        {meta && <div className="mt-4">{meta}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </header>
  );
}
