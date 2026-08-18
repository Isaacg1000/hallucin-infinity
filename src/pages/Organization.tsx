import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';

const MEMBERS = [
['Marcus Ellery', 'Operating Partner', 'Fund III, Fund IV', 'Admin', 'Active'],
['Priya Raghunathan', 'VP, Portfolio Value Creation', 'Fund IV', 'Admin', 'Active'],
['Julia Okafor', 'Director, Portfolio Operations', 'Fund IV', 'Editor', 'Active'],
['Samuel Adeyemi', 'Director, Healthcare Vertical', 'Fund III', 'Editor', 'Active'],
['Dana Whitfield', 'CEO, NorthPeak Industrial', 'NorthPeak only', 'Company', 'Active'],
['Rahul Menon', 'CFO, NorthPeak Industrial', 'NorthPeak only', 'Company', 'Active'],
['Erin Castellanos', 'VP Sales, NorthPeak Industrial', 'NorthPeak only', 'Viewer', 'Invited']];


export function Organization() {
  return (
    <div className="mx-auto max-w-wide px-8 py-8">
      <PageHeader
        eyebrow="Meridian Capital"
        title="Organization"
        subtitle="Who has access to the decision workspace, and what each role can see across funds and portfolio companies."
        actions={<Button variant="primary">Invite member</Button>} />
      

      <div className="mt-6 flex flex-col gap-6">
        <Panel title="Members" bodyClassName="">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-line">
                  {['Name', 'Title', 'Access scope', 'Role', 'Status'].map((h) =>
                  <th
                    key={h}
                    scope="col"
                    className="px-4 py-2.5 text-2xs font-medium uppercase tracking-label text-muted">
                    
                      {h}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {MEMBERS.map((m) =>
                <tr key={m[0]} className="border-b border-line last:border-b-0 hover:bg-raised">
                    <td className="px-4 py-3 text-[13px] font-medium text-ink">{m[0]}</td>
                    <td className="px-4 py-3 text-[13px] text-muted">{m[1]}</td>
                    <td className="px-4 py-3 text-[13px] text-ink-soft">{m[2]}</td>
                    <td className="px-4 py-3 text-[13px] text-ink-soft">{m[3]}</td>
                    <td className="px-4 py-3">
                      <StatusPill label={m[4]} tone={m[4] === 'Active' ? 'positive' : 'quiet'} />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Data & Governance" bodyClassName="p-5">
          <dl className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
            ['Data residency', 'US-East · single tenant', 'Portfolio company data is isolated per company.'],
            ['Retention', '7 years', 'Decisions and evidence are retained for audit and memory.'],
            ['Audit log', 'Enabled', 'Every decision action is attributed and timestamped.']].
            map(([k, v, note]) =>
            <div key={k}>
                <dt className="text-2xs uppercase tracking-label text-muted">{k}</dt>
                <dd className="mt-2 text-[15px] font-medium text-ink">{v}</dd>
                <p className="mt-1 text-xs leading-relaxed text-muted">{note}</p>
              </div>
            )}
          </dl>
        </Panel>
      </div>
    </div>);

}