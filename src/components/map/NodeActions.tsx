import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, HelpCircleIcon, BookmarkIcon, MoreHorizontalIcon, GitForkIcon, Layers3Icon, XIcon } from 'lucide-react';
import { MapNode } from '../../types';
import { useToast } from '../ui/Toast';

interface NodeActionsProps {
  node: MapNode;
  hasChildren: boolean;
  isSaved: boolean;
  onPrimary: () => void;
  onWhyThis: () => void;
  onToggleSave: () => void;
  onDismiss: () => void;
}

export function NodeActions({ node, hasChildren, isSaved, onPrimary, onWhyThis, onToggleSave, onDismiss }: NodeActionsProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <div className="mt-2.5 flex items-center gap-1 border-t border-line pt-2.5">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrimary();
        }}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-2xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50">
        {hasChildren ? 'Explore' : 'Open Route'}
        <ArrowRightIcon className="h-2.5 w-2.5" strokeWidth={2.25} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onWhyThis();
        }}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-2xs font-medium text-muted transition-colors hover:bg-sunken hover:text-ink-soft">
        <HelpCircleIcon className="h-2.5 w-2.5" strokeWidth={2.25} />
        Why this?
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave();
        }}
        aria-pressed={isSaved}
        className={`ml-auto inline-flex h-5 w-5 items-center justify-center rounded-md transition-colors ${
          isSaved ? 'text-emerald-600' : 'text-muted hover:bg-sunken hover:text-ink-soft'
        }`}>
        <BookmarkIcon className="h-3 w-3" strokeWidth={2} fill={isSaved ? 'currentColor' : 'none'} />
      </button>
      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className="flex h-5 w-5 items-center justify-center rounded-md text-muted transition-colors hover:bg-sunken hover:text-ink-soft">
          <MoreHorizontalIcon className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-6 z-20 w-40 rounded-lg border border-line bg-surface py-1 shadow-pop"
            onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                showToast(`Forked "${node.title}" — edit the copy to explore a variation.`);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-ink-soft hover:bg-raised">
              <GitForkIcon className="h-3 w-3 text-muted-soft" strokeWidth={1.75} />
              Fork Route
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                navigate(`/compare?with=${encodeURIComponent(node.id)}`);
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-ink-soft hover:bg-raised">
              <Layers3Icon className="h-3 w-3 text-muted-soft" strokeWidth={1.75} />
              Compare Route
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onDismiss();
              }}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-critical hover:bg-critical-soft">
              <XIcon className="h-3 w-3" strokeWidth={1.75} />
              Dismiss Route
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
