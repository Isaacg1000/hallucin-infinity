import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ArrowLeftIcon } from 'lucide-react';
import { ProgressSteps } from '../components/context/ProgressSteps';
import { ContextQuestion, PillGroup } from '../components/context/ContextQuestion';
import { PrioritySelector } from '../components/context/PrioritySelector';
import { Input, Textarea } from '../components/ui/Input';
import { useExploration } from '../state/ExplorationContext';

const GOALS = ['Find a new market', 'Find a better product', 'Differentiate', 'Increase revenue', 'Reduce risk', 'Explore broadly', 'Other'] as const;
const PRIORITIES = ['Revenue potential', 'Speed to market', 'Differentiation', 'Low cost', 'Defensibility', 'Market size', 'Ease of execution'] as const;

export function Context() {
  const navigate = useNavigate();
  const { ideaText, setContextAnswers } = useExploration();

  const [goals, setGoals] = useState<string[]>([]);
  const [audience, setAudience] = useState('');
  const [priorities, setPriorities] = useState<string[]>([]);
  const [constraints, setConstraints] = useState('');
  const [decided, setDecided] = useState('');

  function toggleGoal(label: string) {
    setGoals((prev) => (prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label]));
  }

  function submit() {
    setContextAnswers({ goals, audience, priorities, constraints, decided });
    navigate('/map');
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-narrow px-6 py-14 pb-28">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="mb-8 inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-ink">
          <ArrowLeftIcon className="h-3.5 w-3.5" strokeWidth={1.75} />
          Back
        </button>

        <ProgressSteps current={1} />

        <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.015em] text-ink">
          Give us some context.
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">A little context helps us find more relevant paths.</p>

        <div className="mt-3 rounded-lg border border-line bg-raised px-4 py-3">
          <p className="text-2xs font-medium uppercase tracking-label text-muted-soft">Your idea</p>
          <p className="mt-1 text-[13px] leading-relaxed text-ink-soft">{ideaText}</p>
        </div>

        <div className="mt-4">
          <ContextQuestion index={1} question="What are you hoping to accomplish?">
            <PillGroup options={GOALS} selected={goals} onToggle={toggleGoal} />
          </ContextQuestion>

          <ContextQuestion index={2} question="Who are you currently thinking about serving?">
            <Input
              type="text"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="Mid-sized businesses hiring 100+ employees annually."
            />
            <button
              type="button"
              onClick={() => setAudience("I'm not sure yet")}
              className="mt-2 text-xs text-muted transition-colors hover:text-accent">
              I'm not sure yet
            </button>
          </ContextQuestion>

          <ContextQuestion index={3} question="What matters most?" hint="Choose up to three.">
            <PrioritySelector options={PRIORITIES} selected={priorities} onChange={setPriorities} max={3} />
          </ContextQuestion>

          <ContextQuestion index={4} question="What constraints should we know about?">
            <Textarea
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              placeholder="MVP must launch within four months. B2B only. Budget under $250K."
            />
          </ContextQuestion>

          <ContextQuestion index={5} question="What have you already decided?">
            <Textarea
              value={decided}
              onChange={(e) => setDecided(e.target.value)}
              placeholder="AI definitely needs to be part of the product."
            />
          </ContextQuestion>
        </div>

        <div className="sticky bottom-0 -mx-6 mt-8 flex justify-end border-t border-line bg-canvas/95 px-6 py-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={submit}
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-trace px-4 text-[13px] font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] transition-all hover:brightness-110">
            Map My Idea
            <ArrowRightIcon className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
