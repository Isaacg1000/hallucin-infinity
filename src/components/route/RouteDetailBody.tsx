import React from 'react';
import { RouteDetailData } from '../../types';
import { AssumptionCard } from './AssumptionCard';
import { UnknownCard } from './UnknownCard';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-line py-7 first:pt-0 last:border-b-0">
      <h2 className="text-2xs font-semibold uppercase tracking-label text-muted-soft">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-soft">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-soft" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function RouteDetailBody({ detail }: { detail: RouteDetailData }) {
  return (
    <div>
      <p className="text-lg font-medium leading-relaxed tracking-[-0.005em] text-ink">"{detail.thesis}"</p>

      <div className="mt-8">
        <Section title="Why this route exists">
          <BulletList items={detail.whyExists} />
        </Section>

        <Section title="Potential Customer">
          <p className="text-sm leading-relaxed text-ink-soft">{detail.potentialCustomer}</p>
        </Section>

        <Section title="Problem">
          <p className="text-sm leading-relaxed text-ink-soft">{detail.problem}</p>
        </Section>

        <Section title="Product">
          <p className="text-sm leading-relaxed text-ink-soft">{detail.product}</p>
        </Section>

        <Section title="Potential Business Model">
          <p className="text-sm leading-relaxed text-ink-soft">{detail.businessModel}</p>
        </Section>

        <Section title="Potential MVP">
          <div className="flex flex-wrap gap-2">
            {detail.mvp.map((m) => (
              <span key={m} className="rounded-full border border-line bg-raised px-3 py-1.5 text-xs text-ink-soft">
                {m}
              </span>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
          <Section title="Upside">
            <BulletList items={detail.upside} />
          </Section>
          <Section title="Challenges">
            <BulletList items={detail.challenges} />
          </Section>
        </div>

        <Section title="Critical Assumptions">
          <div>
            {detail.assumptions.map((a) => (
              <AssumptionCard key={a.id} assumption={a} />
            ))}
          </div>
        </Section>

        <Section title="Unknowns">
          <div className="space-y-2">
            {detail.unknowns.map((u) => (
              <UnknownCard key={u} text={u} />
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}
