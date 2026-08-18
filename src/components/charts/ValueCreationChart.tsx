import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell } from
'recharts';

interface Datum {
  category: string;
  value: number;
  opportunities: number;
}

function ChartTooltip({ active, payload }: {active?: boolean;payload?: any[];}) {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload as Datum;
  return (
    <div className="border border-line bg-surface px-3 py-2 shadow-pop">
      <p className="text-[13px] font-medium text-ink">{d.category}</p>
      <p className="mt-1 font-mono text-xs tabular text-accent">${d.value.toFixed(1)}M EBITDA</p>
      <p className="font-mono text-xs tabular text-muted">{d.opportunities} opportunities</p>
    </div>);

}

export function ValueCreationChart({ data }: {data: Datum[];}) {
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }} barCategoryGap={18}>
          <CartesianGrid stroke="#E3E5E9" vertical={false} />
          <XAxis
            dataKey="category"
            tick={{ fill: '#71767F', fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: '#E3E5E9' }}
            interval={0}
            angle={-18}
            textAnchor="end"
            height={54} />
          
          <YAxis
            tick={{ fill: '#9AA0A8', fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}M`}
            width={60} />
          
          <Tooltip cursor={{ fill: '#EEF0F3' }} content={<ChartTooltip />} />
          <Bar dataKey="value" radius={[1, 1, 0, 0]} maxBarSize={44}>
            {data.map((d) =>
            <Cell key={d.category} fill={d.value === max ? '#0F5A4E' : '#9FB9B2'} />
            )}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>);

}