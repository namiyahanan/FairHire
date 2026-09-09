import React from 'react';
import CandidateCard from './CandidateCard';
import { PIPELINE_STAGES } from '../../utils/constants';

const PipelineBoard = ({ candidates = [], onUpdateStatus, onViewDetails }) => {
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
      {PIPELINE_STAGES.map((stage) => {
        const stageCandidates = candidates.filter(c => c.status === stage);

        const stageColors = {
          Applied: 'bg-slate-100 text-slate-700 border-slate-200',
          Screened: 'bg-sky-50 text-sky-800 border-sky-200',
          Shortlisted: 'bg-teal-50 text-teal-800 border-teal-200',
          'Interview Scheduled': 'bg-indigo-50 text-indigo-800 border-indigo-200',
          Interviewed: 'bg-purple-50 text-purple-800 border-purple-200',
          Offered: 'bg-amber-50 text-amber-800 border-amber-200',
          Hired: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          Rejected: 'bg-rose-50 text-rose-800 border-rose-200'
        };

        return (
          <div
            key={stage}
            className="w-72 shrink-0 bg-slate-100/70 border border-slate-200 rounded-2xl p-3 flex flex-col max-h-[75vh]"
          >
            {/* Stage Header */}
            <div className={`flex items-center justify-between px-3 py-2 rounded-xl border font-bold text-xs mb-3 ${stageColors[stage]}`}>
              <span className="uppercase tracking-wider font-extrabold">{stage}</span>
              <span className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center text-[10px] shadow-xs">
                {stageCandidates.length}
              </span>
            </div>

            {/* Candidates Column List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {stageCandidates.length > 0 ? (
                stageCandidates.map((cand) => (
                  <div key={cand.id} className="relative group">
                    <CandidateCard candidate={cand} onViewDetails={onViewDetails} />

                    {/* Quick Move Action Overlay Menu */}
                    <div className="mt-2 flex flex-wrap gap-1 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-bold text-slate-400 self-center px-1">Move:</span>
                      {PIPELINE_STAGES.filter(s => s !== stage).slice(0, 3).map((targetStage) => (
                        <button
                          key={targetStage}
                          onClick={() => onUpdateStatus(cand.id, targetStage)}
                          className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 hover:bg-teal-500 hover:text-white text-slate-700 rounded transition-colors"
                        >
                          → {targetStage}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-32 flex items-center justify-center border border-dashed border-slate-200 rounded-xl text-xs text-slate-400 italic">
                  No candidates in {stage}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;
