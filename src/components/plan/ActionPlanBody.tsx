import React from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { ActionPlanData } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';

export function ActionPlanBody({ plan }: { plan: ActionPlanData }) {
  return (
    <div>
      <section>
        <div className="flex items-center gap-2">
          <StatusBadge status="hypothesis" />
        </div>
        <p className="mt-2.5 text-lg font-medium leading-relaxed tracking-[-0.005em] text-ink">"{plan.hypothesis}"</p>
      </section>

      <section className="mt-8 border-t border-line pt-7">
        <h2 className="text-2xs font-semibold uppercase tracking-label text-muted-soft">Target Customer</h2>
        <p className="mt-2 text-sm text-ink-soft">
          <span className="font-medium text-ink">{plan.targetCustomerRole}</span>
          {plan.targetCustomerOrg && <span className="text-muted"> · {plan.targetCustomerOrg}</span>}
        </p>
      </section>

      <section className="mt-8 border-t border-line pt-7">
        <h2 className="text-2xs font-semibold uppercase tracking-label text-muted-soft">MVP</h2>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {plan.mvp.map((m) => (
            <span key={m} className="rounded-full border border-line bg-raised px-3 py-1.5 text-xs text-ink-soft">
              {m}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-8 border-t border-line pt-7">
        <h2 className="text-2xs font-semibold uppercase tracking-label text-muted-soft">30-Day Test</h2>
        <ol className="mt-4 space-y-0">
          {plan.weeks.map((w, i) => (
            <li key={w.week} className="relative flex gap-4 pb-6 last:pb-0">
              <div className="flex flex-col items-center">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-accent-line bg-accent-soft font-mono text-2xs font-semibold text-accent">
                  {i + 1}
                </span>
                {i < plan.weeks.length - 1 && <span className="mt-1 w-px flex-1 bg-line" />}
              </div>
              <div className="min-w-0 pb-1">
                <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">{w.week}</p>
                <p className="mt-0.5 text-[13px] font-semibold text-ink">{w.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{w.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-x-8 gap-y-8 border-t border-line pt-7 sm:grid-cols-2">
        <section>
          <h2 className="text-2xs font-semibold uppercase tracking-label text-muted-soft">Success Criteria</h2>
          <ul className="mt-2.5 space-y-2">
            {plan.successCriteria.map((s) => (
              <li key={s} className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                <CheckIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-positive" strokeWidth={2.25} />
                {s}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xs font-semibold uppercase tracking-label text-muted-soft">Failure Criteria</h2>
          <ul className="mt-2.5 space-y-2">
            {plan.failureCriteria.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                <XIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-critical" strokeWidth={2.25} />
                {f}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
