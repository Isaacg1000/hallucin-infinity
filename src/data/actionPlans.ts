import { ActionPlanData } from '../types';
import { getRouteDetail } from './routeDetails';

export const ACTION_PLANS: Record<string, ActionPlanData> = {
  'cust-healthcare-ats': {
    nodeId: 'cust-healthcare-ats',
    routeName: 'Healthcare Credential Intelligence',
    hypothesis:
      'Healthcare recruiting teams will pay for software that reduces credential-verification time during candidate screening.',
    targetCustomerRole: 'Director of Talent Acquisition',
    targetCustomerOrg: 'Large healthcare system',
    mvp: ['Candidate intake', 'Credential extraction', 'Verification workflow', 'Recruiter qualification summary'],
    weeks: [
      { week: 'Week 1', title: 'Interview 10 healthcare recruiters', detail: 'Understand today’s credentialing workflow, time spent, and where it breaks down.' },
      { week: 'Week 2', title: 'Prototype workflow', detail: 'Build a clickable prototype of the intake → extraction → verification → summary flow.' },
      { week: 'Week 3', title: 'Test prototype with 5 users', detail: 'Walk 5 recruiters through the prototype against a real requisition and gather reactions.' },
      { week: 'Week 4', title: 'Measure willingness to pilot/pay', detail: 'Present pricing and a pilot structure to gauge real commitment, not just interest.' }
    ],
    successCriteria: [
      '7/10 identify credential verification as meaningful pain',
      '5/10 agree to test',
      '2+ agree to a paid or structured pilot'
    ],
    failureCriteria: [
      'Existing ATS solves the problem',
      'Credential access is technically infeasible',
      'Pain is too infrequent',
      'No buyer expresses willingness to pilot'
    ]
  }
};

/** Deterministic fallback so any route can generate a 30-day test plan,
 * built from that route's own MVP scope and target customer. */
export function getActionPlan(nodeId: string): ActionPlanData | undefined {
  if (ACTION_PLANS[nodeId]) return ACTION_PLANS[nodeId];
  const detail = getRouteDetail(nodeId);
  if (!detail) return undefined;

  return {
    nodeId,
    routeName: detail.name,
    hypothesis: detail.thesis,
    targetCustomerRole: detail.potentialCustomer.split(' at ')[0] ?? detail.potentialCustomer,
    targetCustomerOrg: detail.potentialCustomer.split(' at ')[1] ?? '',
    mvp: detail.mvp,
    weeks: [
      { week: 'Week 1', title: `Interview 10 prospective customers`, detail: `Talk to ${detail.potentialCustomer.toLowerCase()} to understand today’s workflow and where it breaks down.` },
      { week: 'Week 2', title: 'Prototype the core workflow', detail: `Build a clickable prototype covering: ${detail.mvp.join(', ')}.` },
      { week: 'Week 3', title: 'Test prototype with 5 users', detail: 'Walk 5 prospective users through the prototype against a real scenario and gather reactions.' },
      { week: 'Week 4', title: 'Measure willingness to pilot/pay', detail: 'Present a pilot structure to gauge real commitment, not just interest.' }
    ],
    successCriteria: [
      '7/10 identify the core problem as meaningful pain',
      '5/10 agree to test the prototype',
      '2+ agree to a paid or structured pilot'
    ],
    failureCriteria: [
      'An existing solution already solves this sufficiently',
      'The core assumption proves technically infeasible',
      'The pain is too infrequent to justify new software',
      'No buyer expresses willingness to pilot'
    ]
  };
}
