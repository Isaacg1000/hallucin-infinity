import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { financialModel } from '../../data/analysis';
import { Section, Label } from '../ui/Section';

const AXIS = { fill: '#6E737B', fontSize: 10 };

function ChartTip({ active, payload, label }: {active?: boolean;payload?: any[];label?: string;}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-line bg-surface px-2 py-1.5 shadow-pop">
      <p className="text-2xs uppercase tracking-label text-muted">{label}</p>
      {payload.map((p) =>
      <p key={p.dataKey} className="font-mono text-xs tabular text-ink">
          <span className="text-muted">{p.dataKey}</span> ${Number(p.value).toFixed(1)}M
        </p>
      )}
    </div>);

}

export function FinancialModel() {
  const { bridge, scenarios, sensitivity, ramp } = financialModel;
  const maxSens = Math.max(...sensitivity.map((s) => s.high));

  return (
    <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
      <Section title="Capture bridge" meta="Repriceable revenue → realistic capture, $M">
        <ul className="space-y-2">
          {bridge.map((b) => {
            const isBase = b.kind === 'base';
            const width = isBase ? 100 : Math.min(Math.abs(b.value) / 40 * 100, 100);
            return (
              <li key={b.label} className="grid grid-cols-[150px_minmax(0,1fr)_64px] items-center gap-3">
                <span className="truncate text-xs text-ink-soft">{b.label}</span>
                <span className="block h-3 w-full bg-line/60">
                  <span
                    className={`block h-full ${
                    b.kind === 'deduct' ?
                    'bg-critical/70' :
                    b.kind === 'net' ?
                    'bg-accent' :
                    b.kind === 'gross' ?
                    'bg-[#5B7FC7]' :
                    'bg-ink-soft'}`
                    }
                    style={{ width: `${width}%` }} />
                  
                </span>
                <span
                  className={`text-right font-mono text-xs tabular ${
                  b.kind === 'deduct' ? 'text-critical' : b.kind === 'net' ? 'text-accent' : 'text-ink'}`
                  }>
                  
                  {b.value > 0 && b.kind !== 'base' ? '+' : ''}
                  {b.value.toFixed(1)}
                </span>
              </li>);

          })}
        </ul>
        <p className="mt-3 border-t border-line pt-2.5 text-2xs leading-relaxed text-muted">
          Gross dispersion of $38.8M is reduced by contracted revenue, the Midwest hold-flat decision, and
          expected exception leakage. The recommendation underwrites the net figure only.
        </p>
      </Section>

      <Section title="Capture ramp" meta="Cumulative EBITDA effect by month, $M">
        <div className="h-[196px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={ramp} margin={{ top: 6, right: 6, bottom: 0, left: -22 }}>
              <CartesianGrid stroke="#E3E5E9" vertical={false} />
              <XAxis dataKey="month" tick={AXIS} tickLine={false} axisLine={{ stroke: '#E3E5E9' }} />
              <YAxis tick={AXIS} tickLine={false} axisLine={false} width={44} />
              <Tooltip content={<ChartTip />} cursor={{ stroke: '#CACDD4' }} />
              <Area
                type="monotone"
                dataKey="upside"
                stroke="#6FCB9C"
                fill="#E7F7EF"
                strokeWidth={1} />

              <Area type="monotone" dataKey="base" stroke="#20242C" fill="#E7E8EB" strokeWidth={1.75} />
              <Area
                type="monotone"
                dataKey="downside"
                stroke="#A6291F"
                fill="#FBEEEC"
                strokeWidth={1} />
              
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 flex items-center gap-4 border-t border-line pt-2">
          {[
          ['Base', 'bg-accent'],
          ['Upside', 'bg-[#6FCB9C]'],
          ['Downside', 'bg-critical']].
          map(([l, c]) =>
          <span key={l} className="inline-flex items-center gap-1.5 text-2xs text-muted">
              <span className={`h-1.5 w-3 ${c}`} />
              {l}
            </span>
          )}
        </div>
      </Section>

      <Section title="Sensitivity" meta="Swing in modelled EBITDA by driver, $M">
        <ul className="space-y-3">
          {sensitivity.map((s) =>
          <li key={s.driver} className="grid grid-cols-[164px_minmax(0,1fr)] items-center gap-3">
              <span className="truncate text-xs text-ink-soft">{s.driver}</span>
              <div className="relative h-5">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-line" />
                <div
                className="absolute top-1/2 h-2.5 -translate-y-1/2 bg-accent-line"
                style={{
                  left: `${s.low / maxSens * 100}%`,
                  width: `${(s.high - s.low) / maxSens * 100}%`
                }} />
              
                <div
                className="absolute top-1/2 h-4 w-[2px] -translate-y-1/2 bg-accent"
                style={{ left: `${s.base / maxSens * 100}%` }}
                title={`Base $${s.base}M`} />
              
                <span
                className="absolute -top-0.5 font-mono text-2xs tabular text-muted"
                style={{ left: `${s.low / maxSens * 100}%`, transform: 'translateX(-100%)' }}>
                
                  {s.low.toFixed(1)}
                </span>
                <span
                className="absolute -top-0.5 pl-1 font-mono text-2xs tabular text-muted"
                style={{ left: `${s.high / maxSens * 100}%` }}>
                
                  {s.high.toFixed(1)}
                </span>
              </div>
            </li>
          )}
        </ul>
      </Section>

      <Section title="Scenarios" meta="Probability-weighted capture">
        <div className="grid grid-cols-3 divide-x divide-line border border-line">
          {scenarios.map((s) =>
          <div key={s.name} className="p-3">
              <Label>{s.name}</Label>
              <p
              className={`mt-1 font-mono text-xl font-semibold tabular ${
              s.name === 'Base' ? 'text-accent' : s.name === 'Downside' ? 'text-critical' : 'text-ink'}`
              }>
              
                +${s.capture.toFixed(1)}M
              </p>
              <p className="mt-1 font-mono text-2xs tabular text-muted">{s.probability}% probability</p>
              <p className="mt-1.5 text-2xs leading-relaxed text-muted">{s.note}</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline justify-between border-t border-line pt-2.5">
          <span className="text-xs text-muted">Probability-weighted expected capture</span>
          <span className="font-mono text-md font-semibold tabular text-ink">
            +$
            {scenarios.
            reduce((s, x) => s + x.capture * x.probability / 100, 0).
            toFixed(1)}
            M
          </span>
        </div>
      </Section>
    </div>);

}