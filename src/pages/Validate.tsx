import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, BookmarkIcon, CompassIcon } from 'lucide-react';
import { getValidation } from '../data/validation';
import { getRouteDetail } from '../data/routeDetails';
import { EvidenceItem } from '../types';
import { RouteBreadcrumb } from '../components/route/RouteBreadcrumb';
import { ValidationSummary } from '../components/validate/ValidationSummary';
import { ValidationSection } from '../components/validate/ValidationSection';
import { EvidenceCard } from '../components/validate/EvidenceCard';
import { EvidenceDrawer } from '../components/validate/EvidenceDrawer';
import { AssumptionCard } from '../components/route/AssumptionCard';
import { UnknownCard } from '../components/route/UnknownCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { GeneratingState } from '../components/ui/GeneratingState';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { ShareButton } from '../components/ui/ShareButton';
import { useExploration } from '../state/ExplorationContext';
import { useToast } from '../components/ui/Toast';

export function Validate() {
  const { nodeId = '' } = useParams();
  const navigate = useNavigate();
  const { isSaved, toggleSaved } = useExploration();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [openCitation, setOpenCitation] = useState<{ item: EvidenceItem; index: number; contradicts: boolean } | null>(
    null
  );

  useEffect(() => {
    setLoading(true);
    const id = window.setTimeout(() => setLoading(false), 2500);
    return () => window.clearTimeout(id);
  }, [nodeId]);

  const detail = getRouteDetail(nodeId);
  const validation = getValidation(nodeId);

  if (!detail || !validation) {
    return (
      <div className="flex h-full items-center justify-center">
        <EmptyState
          icon={CompassIcon}
          title="Route not found"
          action={
            <Button variant="primary" onClick={() => navigate('/map')}>
              Return to Map
            </Button>
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <GeneratingState
          messages={[
            `Challenging assumptions behind ${detail.name}...`,
            'Looking for evidence...',
            'Weighing what we found...'
          ]}
        />
      </div>
    );
  }

  const assumptionCount = validation.assumptionLedger.length;

  return (
    <div className="relative h-full overflow-y-auto bg-canvas">
      <div className="mx-auto max-w-narrow px-6 py-10 pb-16">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          Back
        </button>

        <RouteBreadcrumb nodeId={nodeId} />

        <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.015em] text-ink">Validate This Route</h1>
        <p className="mt-1.5 text-lg font-medium text-ink-soft">{detail.name}</p>

        {/* HYPOTHESIS — the claim under review. Surfacing this explicitly is
           what makes all four trust-model classes visible on this screen. */}
        <div className="mt-7 border-l-2 border-hypothesis-line py-0.5 pl-4">
          <StatusBadge status="hypothesis" />
          <p className="mt-2.5 text-lg font-medium italic leading-relaxed text-ink">"{detail.thesis}"</p>
        </div>

        {/* How the evidence gathering actually moved the needle — not a
           score, a plain account of what was found and what it added up to. */}
        <p className="mt-6 text-sm leading-relaxed text-muted">
          This route entered validation as an unvalidated hypothesis. We gathered{' '}
          <span className="font-medium text-ink-soft">{validation.evidenceFor.length} supporting</span> and{' '}
          <span className="font-medium text-ink-soft">{validation.evidenceAgainst.length} contradicting</span>{' '}
          evidence items, and tested {assumptionCount} assumption{assumptionCount === 1 ? '' : 's'} the route
          depends on.
        </p>

        <div className="mt-4">
          <ValidationSummary label={validation.assessmentLabel} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-8 md:grid-cols-2 md:divide-x md:divide-line">
          <ValidationSection title="Supporting Evidence" count={validation.evidenceFor.length}>
            <div>
              {validation.evidenceFor.map((e, i) => (
                <EvidenceCard
                  key={e.id}
                  item={e}
                  index={i + 1}
                  onOpen={() => setOpenCitation({ item: e, index: i + 1, contradicts: false })}
                />
              ))}
            </div>
          </ValidationSection>
          <ValidationSection title="Contradicting Evidence" count={validation.evidenceAgainst.length}>
            <div>
              {validation.evidenceAgainst.map((e, i) => {
                const index = validation.evidenceFor.length + i + 1;
                return (
                  <EvidenceCard
                    key={e.id}
                    item={e}
                    index={index}
                    onOpen={() => setOpenCitation({ item: e, index, contradicts: true })}
                  />
                );
              })}
            </div>
          </ValidationSection>
        </div>

        <div className="mt-10">
          <ValidationSection
            title="Assumption Ledger"
            count={validation.assumptionLedger.length}
            description="What this route depends on being true. Status reflects how solid each one currently looks — not a prediction.">
            <div>
              {validation.assumptionLedger.map((a) => (
                <AssumptionCard key={a.id} assumption={a} />
              ))}
            </div>
          </ValidationSection>
        </div>

        <div className="mt-10">
          <ValidationSection
            title="What We Still Don't Know"
            count={validation.unknowns.length}
            description="Not gaps the research missed — the specific questions worth answering next.">
            <div>
              {validation.unknowns.map((u) => (
                <UnknownCard key={u} text={u} />
              ))}
            </div>
          </ValidationSection>
        </div>

        <div className="mt-10">
          <ValidationSummary label={validation.finalAssessment} explanation={validation.finalExplanation} size="large" />
        </div>

        <div className="mt-8 flex items-center justify-end gap-2">
          <ShareButton label={detail.name} />
          <Button variant="secondary" onClick={() => navigate('/compare')}>
            Compare Routes
          </Button>
          <Button variant="secondary" onClick={() => navigate('/map')}>
            Keep Exploring
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              const wasSaved = isSaved(nodeId);
              toggleSaved(nodeId);
              showToast(wasSaved ? 'Removed from Saved' : 'Saved to Saved Routes', 'success');
            }}>
            <BookmarkIcon className="h-3.5 w-3.5" strokeWidth={1.75} fill={isSaved(nodeId) ? 'currentColor' : 'none'} />
            {isSaved(nodeId) ? 'Saved' : 'Save Route'}
          </Button>
        </div>
      </div>

      <EvidenceDrawer
        item={openCitation?.item ?? null}
        index={openCitation?.index ?? null}
        contradicts={openCitation?.contradicts ?? false}
        onClose={() => setOpenCitation(null)}
      />
    </div>
  );
}
