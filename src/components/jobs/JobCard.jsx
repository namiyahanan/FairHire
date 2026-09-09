import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import { Briefcase, MapPin, Users, Award, ArrowRight, Sparkles, Building2, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

const JobCard = ({ job, onSelect = null, onDelete = null }) => {
  if (!job) return null;

  return (
    <div className={`bg-surface-card rounded-2xl border p-6 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between gap-5 relative group ${
      job.isHrUploaded ? 'border-purple-200 bg-gradient-to-b from-purple-50/20 to-white' : 'border-slate-200'
    }`}>
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-[11px] font-bold font-mono text-slate-400 uppercase tracking-wider">
                {job.id}
              </span>
              {job.isHrUploaded && (
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-purple-600" />
                  <span>HR Uploaded</span>
                </span>
              )}
            </div>
            <h3 className="text-lg font-extrabold text-navy-900 leading-tight">
              {job.title}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={job.status === 'Active' ? 'success' : 'default'} size="sm">
              {job.status}
            </Badge>
            {onDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Are you sure you want to delete "${job.title}" (${job.id})? This position will be removed from both HR and candidate portals.`)) {
                    onDelete(job.id);
                  }
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                title="Delete position"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-teal-600" />
            {job.company || 'Enterprise'}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-teal-600" />
            {job.location}
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-teal-600" />
            {job.experience}
          </span>
        </div>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>

        {/* Skill Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {(job.skills || job.tags)?.slice(0, 4).map((skill, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
            >
              {skill}
            </span>
          ))}
          {(job.skills || job.tags)?.length > 4 && (
            <span className="text-[10px] text-slate-400 font-semibold self-center">
              +{(job.skills || job.tags).length - 4} more
            </span>
          )}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-semibold text-navy-900">
          <Users className="w-4 h-4 text-teal-600" />
          <span>{job.applicantsCount || 0} Candidates</span>
        </div>

        {onSelect ? (
          <button
            onClick={() => onSelect(job)}
            className="text-xs font-bold text-teal-600 hover:text-navy-900 flex items-center gap-1 group cursor-pointer"
          >
            <span>View Applicants</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <Link
            to={`/recruiter/candidates?jobId=${job.id}`}
            className="text-xs font-bold text-teal-600 hover:text-navy-900 flex items-center gap-1 group cursor-pointer"
          >
            <span>Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    </div>
  );
};

export default JobCard;
