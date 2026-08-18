import React, { useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const TOGGLES = [
{
  id: 'contradictions',
  label: 'Always surface contradicting evidence',
  detail: 'Recommendations cannot be published without their disconfirming evidence attached.',
  on: true,
  locked: true
},
{
  id: 'confidence',
  label: 'Require confidence and evidence strength on every claim',
  detail: 'Claims without a traceable source are labelled as inference, never as evidence.',
  on: true,
  locked: true
},
{
  id: 'threshold',
  label: 'Block scaling before an experiment threshold is met',
  detail: 'Initiatives cannot move to Executing until their validation gate passes.',
  on: true,
  locked: false
},
{
  id: 'memory',
  label: 'Apply institutional memory to new analyses',
  detail: 'Prior portfolio outcomes are used as prior evidence when ranking opportunities.',
  on: true,
  locked: false
},
{
  id: 'digest',
  label: 'Weekly portfolio intelligence digest',
  detail: 'Monday 07:00 ET summary of new opportunities, decisions and experiment readings.',
  on: false,
  locked: false
}];


export function Settings() {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(TOGGLES.map((t) => [t.id, t.on]))
  );

  return (
    <div className="mx-auto max-w-medium px-8 py-8">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        subtitle="Analytical standards, thresholds, and notification preferences for your workspace." />
      

      <div className="mt-6 flex flex-col gap-6">
        <Panel title="Analytical Standards" bodyClassName="">
          <ul className="divide-y divide-line">
            {TOGGLES.map((t) =>
            <li key={t.id} className="flex items-start justify-between gap-6 px-5 py-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{t.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{t.detail}</p>
                  {t.locked &&
                <p className="mt-1.5 text-2xs uppercase tracking-label text-muted-soft">
                      Enforced by firm policy
                    </p>
                }
                </div>
                <button
                type="button"
                role="switch"
                aria-checked={state[t.id]}
                aria-label={t.label}
                disabled={t.locked}
                onClick={() => setState((s) => ({ ...s, [t.id]: !s[t.id] }))}
                className={`relative mt-0.5 h-5 w-9 shrink-0 border transition-colors ${
                state[t.id] ? 'border-accent bg-accent' : 'border-line-strong bg-line'} ${
                t.locked ? 'opacity-50' : ''}`}>
                
                  <span
                  className={`absolute top-[2px] h-[14px] w-[14px] bg-white transition-all ${
                  state[t.id] ? 'left-[19px]' : 'left-[2px]'}`
                  } />
                
                </button>
              </li>
            )}
          </ul>
        </Panel>

        <Panel title="Profile" bodyClassName="p-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
            ['Name', 'Priya Raghunathan'],
            ['Title', 'VP, Portfolio Value Creation'],
            ['Email', 'p.raghunathan@meridiancap.com'],
            ['Default fund', 'Meridian Capital — Fund IV']].
            map(([label, value]) =>
            <label key={label} className="block">
                <span className="mb-1.5 block text-2xs uppercase tracking-label text-muted">{label}</span>
                <Input defaultValue={value} />
              </label>
            )}
          </div>
          <div className="mt-5 flex justify-end gap-2 border-t border-line pt-4">
            <Button variant="ghost">Cancel</Button>
            <Button variant="primary">Save changes</Button>
          </div>
        </Panel>
      </div>
    </div>);

}