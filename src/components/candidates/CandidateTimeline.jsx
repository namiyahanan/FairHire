import React from 'react';
import { formatDateTime } from '../../utils/formatters';
import { CheckCircle2, Clock } from 'lucide-react';

const CandidateTimeline = ({ timeline = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h4 className="text-sm font-bold uppercase tracking-wider text-navy-900 mb-4">
        Application Audit & Progress Timeline
      </h4>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {timeline.length > 0 ? (
          timeline.map((item, idx) => (
            <div key={idx} className="relative flex flex-col gap-1">
              <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center ring-4 ring-white shadow-xs">
                <CheckCircle2 className="w-3 h-3" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900">{item.status}</span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDateTime(item.timestamp)}
                </span>
              </div>
              {item.note && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                  {item.note}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic">No timeline events recorded.</p>
        )}
      </div>
    </div>
  );
};

export default CandidateTimeline;
