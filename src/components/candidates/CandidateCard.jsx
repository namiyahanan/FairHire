import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import SkillMatch from './SkillMatch';
import { formatDate, formatScore, getScoreBadgeColor } from '../../utils/formatters';
import { Sparkles, Calendar, ArrowRight, User } from 'lucide-react';

const CandidateCard = ({ candidate, onViewDetails = null }) => {
  if (!candidate) return null;

  return (
    <div className="bg-surface-card rounded-2xl border border-slate-200/80 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between gap-4">
      <div>
        {/* Card Top: Candidate ID / Name & AI Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {candidate.id}
              </span>
              <Badge variant="default" size="sm">
                {candidate.status}
              </Badge>
            </div>
            <h4 className="text-base font-extrabold text-navy-900 leading-tight">
              {candidate.name}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              {candidate.jobTitle}
            </p>
          </div>

          <div className={`px-3 py-1.5 rounded-xl border text-center font-bold ${getScoreBadgeColor(candidate.aiScore)}`}>
            <div className="flex items-center gap-1 text-xs">
              <Sparkles className="w-3 h-3 text-teal-600" />
              <span>{formatScore(candidate.aiScore)}</span>
            </div>
            <span className="text-[9px] uppercase font-semibold opacity-75">AI Score</span>
          </div>
        </div>

        {/* Resume Summary */}
        <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
          {candidate.resumeSummary}
        </p>

        {/* Skill Pills */}
        <div className="mb-2">
          <SkillMatch matchedSkills={candidate.matchedSkills?.slice(0, 3)} missingSkills={candidate.missingSkills?.slice(0, 1)} />
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 flex items-center gap-1 text-[11px]">
          <Calendar className="w-3.5 h-3.5" />
          Applied {formatDate(candidate.appliedDate)}
        </span>

        {onViewDetails ? (
          <button
            onClick={() => onViewDetails(candidate)}
            className="font-bold text-teal-600 hover:text-navy-900 flex items-center gap-1 group transition-colors"
          >
            <span>View Profile</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <Link
            to={`/recruiter/candidates/${candidate.id}`}
            className="font-bold text-teal-600 hover:text-navy-900 flex items-center gap-1 group transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default CandidateCard;
