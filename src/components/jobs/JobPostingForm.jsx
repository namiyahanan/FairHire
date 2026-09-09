import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Select from '../common/Select';
import Button from '../common/Button';
import { useJobs } from '../../hooks/useJobs';
import { PREPARATION_GUIDE_ROLES } from '../../data/preparationGuideData';
import { getCompanyRequirements, getCompanyRounds } from '../../services/requirementsStore';
import { EXPERIENCE_LEVELS, DEGREE_OPTIONS } from '../../utils/constants';
import {
  Sparkles,
  Send,
  Building2,
  DollarSign,
  MapPin,
  Check,
  Briefcase,
  Layers,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';

const JobPostingForm = ({ onSubmitSuccess }) => {
  const { createJob } = useJobs();
  const companyReqs = getCompanyRequirements();

  // Selected role from the 7 options
  const [selectedRoleId, setSelectedRoleId] = useState('role-frontend');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => {
    const initialRole = PREPARATION_GUIDE_ROLES[0];
    return {
      title: initialRole.title,
      targetRole: initialRole.title,
      department: initialRole.trackId === 'WEB' ? 'Software Engineering' : initialRole.trackId === 'DATA' ? 'Data & Cloud Infrastructure' : 'AI & Advanced Systems',
      company: companyReqs.companyName || 'FairHire Enterprise',
      trackId: initialRole.trackId || 'WEB',
      trackBadge: initialRole.trackBadge || 'Web & App Dev',
      location: initialRole.location || 'Remote / Hybrid',
      experience: '3+ years',
      degree: "Bachelor's Degree",
      minMatchThreshold: 75,
      salary: initialRole.salary || '₹22 - 32 LPA ($125k)',
      description: initialRole.description || '',
      skills: (initialRole.tags || []).join(', '),
      screeningCriteria: initialRole.screeningCriteria || '',
      interviewRounds: initialRole.interviewRounds || getCompanyRounds()
    };
  });

  // When HR clicks any of the 7 core roles
  const handleSelectRole = (role) => {
    setSelectedRoleId(role.id);
    setFormData(prev => ({
      ...prev,
      title: role.title,
      targetRole: role.title,
      department: role.trackId === 'WEB' ? 'Software Engineering' : role.trackId === 'DATA' ? 'Data & Cloud Infrastructure' : 'AI & Advanced Systems',
      trackId: role.trackId,
      trackBadge: role.trackBadge,
      salary: role.salary,
      location: role.location,
      description: role.description,
      skills: (role.tags || []).join(', '),
      screeningCriteria: role.screeningCriteria,
      interviewRounds: role.interviewRounds || getCompanyRounds()
    }));
    if (errors.title) setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = 'Job title is required';
    if (!formData.company?.trim()) newErrors.company = 'Company name is required';
    if (!formData.description?.trim()) newErrors.description = 'Job description is required';
    if (!formData.skills?.trim()) newErrors.skills = 'Skills are required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const skillsArray = typeof formData.skills === 'string'
      ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
      : formData.skills;

    const res = await createJob({
      ...formData,
      skills: skillsArray
    });
    setSubmitting(false);

    if (res.success) {
      if (onSubmitSuccess) onSubmitSuccess(res.data);
    } else {
      setErrors({ form: res.message || 'Failed to post job opening' });
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= 1. ASK THE SEVEN ROLES QUESTION ================= */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base sm:text-lg font-black text-navy-900 flex items-center gap-2">
              <span>Which role do you want to hire for?</span>
              <span className="text-rose-500">*</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select one of the 7 core engineering roles to auto-populate verified technical requirements and interview rounds.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 shrink-0">
            7 Verified Engineering Tracks
          </span>
        </div>

        {/* 7 ROLE SELECTION BOXES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {PREPARATION_GUIDE_ROLES.map((role) => {
            const isSelected = selectedRoleId === role.id;
            return (
              <div
                key={role.id}
                onClick={() => handleSelectRole(role)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-gradient-to-br from-teal-50/90 to-white border-teal-500 ring-2 ring-teal-500/30 shadow-md scale-101'
                    : 'bg-slate-50/60 border-slate-200 hover:border-teal-300 hover:bg-white hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}

                <div className="space-y-1.5 pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{role.icon || '💼'}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {role.trackBadge || 'Engineering'}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-navy-900 text-sm leading-tight mt-1">
                    {role.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                    {role.description}
                  </p>
                </div>

                <div className="pt-2.5 mt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span>{role.salary?.split('(')[0] || 'Competitive'}</span>
                  <span className="text-teal-700 font-bold">{role.interviewRounds?.length || 3} Stages</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 2. CUSTOMIZABLE JOB SPECIFICATIONS ================= */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-extrabold text-navy-900">Job Opening Specifications</h3>
            <p className="text-xs text-slate-500">Auto-filled from verified {formData.title} standards. You can customize compensation, location, and criteria.</p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Auto-Syncs with Candidate Portal
          </span>
        </div>

        {errors.form && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-bold">
            {errors.form}
          </div>
        )}

        {/* Title & Company */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Position Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Frontend Engineer"
            required
            error={errors.title}
          />

          <Input
            label="Hiring Organization / Company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="e.g. FairHire Enterprise"
            required
            error={errors.company}
          />
        </div>

        {/* Department, Salary, Location */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. Software Engineering"
          />

          <Input
            label="Salary Range / CTC"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            placeholder="e.g. ₹25 - 38 LPA ($135k)"
          />

          <Input
            label="Location / Work Model"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Remote / Bengaluru / Hybrid"
          />
        </div>

        {/* Experience, Degree, Match Threshold */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Minimum Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            options={EXPERIENCE_LEVELS}
          />

          <Select
            label="Required Degree"
            name="degree"
            value={formData.degree}
            onChange={handleChange}
            options={DEGREE_OPTIONS}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Min Semantic Match Threshold ({formData.minMatchThreshold}%)
            </label>
            <input
              type="range"
              min="50"
              max="95"
              step="5"
              name="minMatchThreshold"
              value={formData.minMatchThreshold}
              onChange={handleChange}
              className="accent-teal-600 mt-2 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">
              Candidates scoring above {formData.minMatchThreshold}% will be highlighted as high-fit.
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Role Overview & Core Responsibilities <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            className="rounded-xl text-xs bg-white border border-slate-300 p-3 outline-none focus:border-teal-500 text-slate-800"
            placeholder="Describe the role responsibilities and team objectives..."
            required
          />
          {errors.description && (
            <p className="text-[10px] text-rose-500 font-semibold">{errors.description}</p>
          )}
        </div>

        {/* Required Technical Skills */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
            Required Technical Skills & Competencies (Comma separated) <span className="text-rose-500">*</span>
          </label>
          <textarea
            name="skills"
            rows={2}
            value={formData.skills}
            onChange={handleChange}
            className="rounded-xl text-xs bg-white border border-slate-300 p-3 outline-none focus:border-teal-500 text-slate-800"
            placeholder="e.g. React 18, TypeScript, JavaScript, CSS3, Tailwind"
            required
          />
          {errors.skills && (
            <p className="text-[10px] text-rose-500 font-semibold">{errors.skills}</p>
          )}
        </div>

        {/* Configured Interview Stages Callout */}
        <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-700">
            <span className="font-bold text-navy-900 block mb-0.5">
              Candidate Portal Synchronized ({formData.interviewRounds?.length || 3} Interview Rounds Attached)
            </span>
            <span>
              Once posted, this position will immediately appear in the Candidate Portal. Prospective applicants will be able to review these exact interview rounds, view role preparation guides, and apply via contextual semantic matching.
            </span>
          </div>
        </div>

        {/* Submit Button (Only "Post Job") */}
        <div className="pt-2 flex items-center justify-end">
          <Button
            type="submit"
            variant="gradient"
            size="lg"
            icon={Send}
            disabled={submitting}
            className="w-full sm:w-auto px-8 shadow-md cursor-pointer"
          >
            {submitting ? 'Posting Position...' : 'Post Job'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default JobPostingForm;
