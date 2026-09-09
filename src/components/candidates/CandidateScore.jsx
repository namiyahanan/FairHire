import React from 'react';
import { Sparkles, UserCheck, Info } from 'lucide-react';
import Badge from '../common/Badge';
import { formatScore } from '../../utils/formatters';

const CandidateScore = ({
  score = 8.8,
  rationale = '',
  status = 'Screened',
  onStatusChange = null,
  isRecruiterView = false
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* AI Assessment Box (Distinct Gradient/Card styling) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-navy-900 via-navy-800 to-teal-950 text-white p-6 shadow-xl border border-teal-500/30">
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-400 border border-teal-400/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
              AI Contextual Assessment
            </span>
          </div>
          <span className="text-[10px] uppercase font-semibold text-slate-400 bg-navy-950/80 px-2 py-0.5 rounded border border-slate-700">
            Advisory Metric
          </span>
        </div>

        <div className="flex items-baseline gap-3 mb-3">
          <span className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-white tracking-tight">
            {formatScore(score)}
          </span>
          <span className="text-base text-slate-400 font-semibold">/ 10 Match Index</span>
        </div>

        <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-700/60 text-xs text-slate-300 leading-relaxed mb-3">
          <p className="font-medium text-slate-200 mb-1 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-teal-400" />
            AI Rationale:
          </p>
          {rationale || 'Contextual semantic matching computed across technical proficiency, degree background, and past accomplishments.'}
        </div>

        <p className="text-[11px] text-teal-400/80 italic flex items-center gap-1">
          * AI metrics assist hiring teams by ranking semantic fit. Final hiring authority remains human.
        </p>
      </div>

      {/* Human Decision Box (Visually Distinct Clean White Card) */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="text-sm font-bold text-navy-900">Human Decision Status</h5>
            <p className="text-xs text-slate-500">Current candidate status in the hiring pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Badge
            variant={
              status === 'Offered' || status === 'Hired' ? 'success' :
              status === 'Rejected' ? 'error' :
              status === 'Shortlisted' || status === 'Interview Scheduled' ? 'teal' : 'default'
            }
            size="md"
          >
            {status}
          </Badge>

          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Automated Hiring Pipeline
          </span>
        </div>
      </div>
    </div>
  );
};

export default CandidateScore;
