import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon, LoaderIcon } from 'lucide-react';
import { AnalysisStage } from '../../data/analysis';

interface AnalysisProgressProps {
  stages: AnalysisStage[];
  activeIndex: number;
}

export function AnalysisProgress({ stages, activeIndex }: AnalysisProgressProps) {
  return (
    <ol className="border border-[#262A30]">
      {stages.map((s, i) => {
        const state = i < activeIndex ? 'complete' : i === activeIndex ? 'active' : 'pending';
        return (
          <li
            key={s.id}
            className={`flex items-start gap-4 border-b border-[#262A30] px-6 py-4 last:border-b-0 transition-colors duration-300 ${
            state === 'active' ? 'bg-[#1A1D22]' : ''}`
            }>
            
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center">
              {state === 'complete' ?
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent">
                  <CheckIcon className="h-3 w-3 text-white" strokeWidth={2.5} />
                </span> :
              state === 'active' ?
              <LoaderIcon className="h-4 w-4 animate-spin text-accent-line" strokeWidth={1.75} /> :

              <span className="h-2 w-2 rounded-full border border-[#3A3E45]" />
              }
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3
                  className={`text-[14px] font-medium ${
                  state === 'pending' ? 'text-[#6E747E]' : 'text-white'}`
                  }>
                  
                  {s.label}
                </h3>
                <span
                  className={`font-mono text-xs tabular ${
                  state === 'complete' ?
                  'text-accent-line' :
                  state === 'active' ?
                  'text-white' :
                  'text-[#5C626B]'}`
                  }>
                  
                  {state === 'complete' ? s.metric : state === 'active' ? 'In progress' : 'Pending'}
                </span>
              </div>
              <p className="mt-1 text-xs leading-relaxed text-[#7C838C]">{s.detail}</p>

              {state === 'active' &&
              <div className="mt-3 h-[2px] w-full overflow-hidden bg-[#262A30]">
                  <motion.div
                  className="h-full w-1/3 bg-accent"
                  animate={{ x: ['-100%', '300%'] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }} />
                
                </div>
              }
            </div>
          </li>);

      })}
    </ol>);

}