import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const SkillMatch = ({ matchedSkills = [], missingSkills = [] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Matched Skills */}
      <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <h5 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
            Matched Skills ({matchedSkills.length})
          </h5>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {matchedSkills.length > 0 ? (
            matchedSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-100/80 text-emerald-800 border border-emerald-200"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-400 italic">No direct matched skills recorded.</span>
          )}
        </div>
      </div>

      {/* Missing Skills */}
      <div className="p-4 rounded-xl bg-rose-50/40 border border-rose-100">
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4 text-rose-500" />
          <h5 className="text-xs font-bold uppercase tracking-wider text-rose-900">
            Missing / Development Gaps ({missingSkills.length})
          </h5>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {missingSkills.length > 0 ? (
            missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-rose-100/80 text-rose-800 border border-rose-200"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-emerald-700 font-medium">✓ Perfect match - No skill gaps identified!</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillMatch;
