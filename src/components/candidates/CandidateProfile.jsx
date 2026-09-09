import React from 'react';
import { User, Mail, Phone, Briefcase, GraduationCap, FileText } from 'lucide-react';
import SkillMatch from './SkillMatch';

const CandidateProfile = ({ candidate }) => {
  if (!candidate) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col gap-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-navy-800 text-teal-300 font-extrabold text-xl flex items-center justify-center border border-teal-500/30 shadow-md">
            {candidate.name ? candidate.name.charAt(0) : 'C'}
          </div>
          <div>
            <h3 className="text-xl font-bold text-navy-900">{candidate.name}</h3>
            <p className="text-xs text-slate-500 font-medium">{candidate.jobTitle}</p>
            <span className="text-[10px] font-mono text-slate-400">ID: {candidate.id}</span>
          </div>
        </div>
      </div>

      {/* Contact & Education Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs">
        <div className="flex items-center gap-2.5 text-slate-700">
          <Mail className="w-4 h-4 text-teal-600 shrink-0" />
          <span className="truncate">{candidate.email}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700">
          <Phone className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{candidate.phone}</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700">
          <Briefcase className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Experience: {candidate.experienceYears} Years</span>
        </div>
        <div className="flex items-center gap-2.5 text-slate-700">
          <GraduationCap className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{candidate.education}</span>
        </div>
      </div>

      {/* Resume Overview */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-teal-600" />
          Executive Resume Summary
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/50 p-3.5 rounded-xl border border-slate-200">
          {candidate.resumeSummary}
        </p>
      </div>

      {/* Skill Breakdown */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3">
          Semantic Skill Analysis
        </h4>
        <SkillMatch matchedSkills={candidate.matchedSkills} missingSkills={candidate.missingSkills} />
      </div>
    </div>
  );
};

export default CandidateProfile;
