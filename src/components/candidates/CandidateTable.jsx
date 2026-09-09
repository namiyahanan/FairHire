import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { formatScore, formatDate, getScoreBadgeColor } from '../../utils/formatters';
import { Sparkles, ArrowUpRight } from 'lucide-react';

const CandidateTable = ({ candidates = [], onSelectCandidate = null }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3.5 px-4">Candidate ID / Name</th>
              <th className="py-3.5 px-4">Target Position</th>
              <th className="py-3.5 px-4">AI Score</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Applied Date</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {candidates.length > 0 ? (
              candidates.map((cand) => (
                <tr key={cand.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div>
                      <span className="font-extrabold text-navy-900 text-sm block">
                        {cand.name}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {cand.id}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{cand.jobTitle}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg border ${getScoreBadgeColor(cand.aiScore)}`}>
                      <Sparkles className="w-3 h-3 text-teal-600" />
                      {formatScore(cand.aiScore)} / 10
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={
                        cand.status === 'Offered' || cand.status === 'Hired' ? 'success' :
                        cand.status === 'Rejected' ? 'error' :
                        cand.status === 'Shortlisted' ? 'teal' : 'default'
                      }
                      size="sm"
                    >
                      {cand.status}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(cand.appliedDate)}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {onSelectCandidate ? (
                      <button
                        onClick={() => onSelectCandidate(cand)}
                        className="text-teal-600 hover:text-navy-900 font-bold inline-flex items-center gap-1"
                      >
                        Details <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        to={`/recruiter/candidates/${cand.id}`}
                        className="text-teal-600 hover:text-navy-900 font-bold inline-flex items-center gap-1"
                      >
                        Details <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400">
                  No candidates match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateTable;
