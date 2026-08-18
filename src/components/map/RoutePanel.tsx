import React from 'react';
import { ArrowRightIcon, FlaskConicalIcon, Layers3Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidePanel } from '../ui/SidePanel';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';
import { MapNode } from '../../types';
import { getRouteDetail } from '../../data/routeDetails';
import { getValidation } from '../../data/validation';

interface RoutePanelProps {
  node: MapNode | null;
  hasChildren: boolean;
  onClose: () => void;
  onPrimary: (id: string) => void;
  onValidate: (id: string) => void;
}

/** Route Spotlight's right rail. When a node has a full authored route
 * record, shows the spec structure (thesis / why / key assumption /
 * evidence status / primary unknown / potential impact) built from real
 * data. Category nodes and leaf routes without a full record fall back
 * to the lighter reasoning/bullets treatment rather than inventing
 * fields that don't exist for them. */
export function RoutePanel({ node, hasChildren, onClose, onPrimary, onValidate }: RoutePanelProps) {
  const navigate = useNavigate();
  const detail = node ? getRouteDetail(node.id) : undefined;
  const validation = node ? getValidation(node.id) : undefined;

  return (
    <SidePanel
      open={!!node}
      onClose={onClose}
      eyebrow={node ? node.title.toUpperCase() : ''}
      title={node ? (detail ? detail.name : `Why ${node.title}?`) : ''}
      width="w-[420px]"
      footer={
        node && (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              className="flex-1 justify-center"
              onClick={() => {
                onPrimary(node.id);
                onClose();
              }}>
              {hasChildren ? 'Explore deeper' : 'Open Full Route'}
              <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={2} />
            </Button>
            {!hasChildren && (
              <>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onClose();
                    navigate(`/compare?with=${encodeURIComponent(node.id)}`);
                  }}>
                  <Layers3Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Compare
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    onValidate(node.id);
                    onClose();
                  }}>
                  <FlaskConicalIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Validate
                </Button>
              </>
            )}
          </div>
        )
      }>
      {node && (
        <div className="p-5">
          {detail ? (
            <>
              <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Route Thesis</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{detail.thesis}</p>

              {detail.whyExists.length > 0 && (
                <div className="mt-5">
                  <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Why this route exists</p>
                  <ul className="mt-2.5 space-y-2">
                    {detail.whyExists.slice(0, 3).map((w) => (
                      <li key={w} className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-soft" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <dl className="mt-6 space-y-4 border-t border-line pt-5">
                {detail.assumptions[0] && (
                  <div>
                    <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Key assumption</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{detail.assumptions[0].text}</dd>
                  </div>
                )}
                <div>
                  <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Evidence status</dt>
                  <dd className="mt-1.5">
                    {validation ? (
                      <span className="text-sm text-ink-soft">
                        {validation.evidenceFor.length} supporting · {validation.evidenceAgainst.length} contradicting
                      </span>
                    ) : (
                      <span className="text-sm text-ink-soft">Not yet validated</span>
                    )}
                  </dd>
                </div>
                {detail.unknowns[0] && (
                  <div>
                    <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Primary unknown</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{detail.unknowns[0]}</dd>
                  </div>
                )}
                {detail.upside[0] && (
                  <div>
                    <dt className="text-2xs font-medium uppercase tracking-label text-muted-soft">Potential impact</dt>
                    <dd className="mt-1.5 text-sm leading-relaxed text-ink-soft">{detail.upside[0]}</dd>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <StatusBadge status="hypothesis" size="md" />
              </div>
            </>
          ) : (
            <>
              {node.reasoning && (
                <>
                  <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Reasoning</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{node.reasoning}</p>
                </>
              )}

              {node.bullets && node.bullets.length > 0 && (
                <div className="mt-6">
                  <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">
                    What makes this interesting
                  </p>
                  <ul className="mt-2.5 space-y-2">
                    {node.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm leading-relaxed text-ink-soft">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-soft" />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-6 rounded-lg border border-line bg-raised p-3.5">
                <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Status</p>
                <div className="mt-2">
                  <StatusBadge status="hypothesis" size="md" />
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-muted">This route has not been validated yet.</p>
              </div>
            </>
          )}
        </div>
      )}
    </SidePanel>
  );
}
