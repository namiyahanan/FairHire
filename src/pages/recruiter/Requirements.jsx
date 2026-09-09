import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Toast from '../../components/common/Toast';
import {
  getCompanyRequirements,
  saveCompanyRequirements,
  freezeCompanyRequirements,
  unfreezeCompanyRequirements,
  getDefaultRoundsForCount,
  ROUND_PRESETS
} from '../../services/requirementsStore';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Building2,
  Users,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  FileCheck,
  Check,
  Edit3,
  Calendar,
  Clock,
  ArrowRight,
  Plus,
  Trash2,
  ExternalLink,
  Info
} from 'lucide-react';

const ROUND_COUNT_OPTIONS = [
  { count: 1, label: '1 Round', subtitle: 'Fast-Track / Direct' },
  { count: 2, label: '2 Rounds', subtitle: 'Standard Tech Screen' },
  { count: 3, label: '3 Rounds', subtitle: 'Comprehensive (Recommended)' },
  { count: 4, label: '4 Rounds', subtitle: 'In-Depth Engineering' },
  { count: 5, label: '5 Rounds', subtitle: 'Multi-Stage Enterprise' },
  { count: 6, label: '6 Rounds', subtitle: 'Full Executive / Bar-Raiser' }
];

const Requirements = () => {
  const [requirements, setRequirements] = useState(() => getCompanyRequirements());
  const [formData, setFormData] = useState(() => getCompanyRequirements());
  const [isFrozen, setIsFrozen] = useState(() => requirements.isFrozen);
  const [toastMessage, setToastMessage] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const handleUpdate = (e) => {
      const updated = e.detail || getCompanyRequirements();
      setRequirements(updated);
      setFormData(updated);
      setIsFrozen(updated.isFrozen);
    };

    window.addEventListener('fairhire_recruiter_requirements_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fairhire_recruiter_requirements_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Handle general text/select changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // When HR clicks a round number box (1, 2, 3, 4, 5, 6)
  const handleRoundCountSelect = (newCount) => {
    const currentRounds = [...(formData.rounds || [])];
    let updatedRounds = [];

    if (newCount > currentRounds.length) {
      // Add more rounds using smart defaults
      const defaults = getDefaultRoundsForCount(newCount);
      updatedRounds = defaults.map((def, idx) => {
        return currentRounds[idx] || def;
      });
    } else {
      // Keep existing up to newCount
      updatedRounds = currentRounds.slice(0, newCount);
    }

    setFormData(prev => ({
      ...prev,
      numRounds: newCount,
      rounds: updatedRounds
    }));
  };

  // Update a specific round's name or description
  const handleRoundFieldChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...(prev.rounds || [])];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          [field]: value
        };
      }
      return { ...prev, rounds: updated };
    });
  };

  // Apply a preset suggestion to a specific round
  const handleApplyPreset = (index, preset) => {
    setFormData(prev => {
      const updated = [...(prev.rounds || [])];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          name: preset.name,
          description: preset.description
        };
      }
      return { ...prev, rounds: updated };
    });
  };

  // Validate form
  const validate = () => {
    const errs = {};
    if (!formData.companyName?.trim()) errs.companyName = 'Company name is required';
    if (!formData.hrName?.trim()) errs.hrName = 'HR representative name is required';
    if (!formData.hrEmail?.trim()) errs.hrEmail = 'Work email is required';

    // Validate rounds
    const roundsList = formData.rounds || [];
    if (roundsList.length === 0) {
      errs.rounds = 'At least 1 interview round must be configured';
    } else {
      roundsList.forEach((r, idx) => {
        if (!r.name?.trim()) {
          errs[`round_${idx}`] = `Round ${idx + 1} name is required`;
        }
      });
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save changes without freezing
  const handleSaveDraft = () => {
    if (!validate()) return;
    const saved = saveCompanyRequirements(formData, false);
    setRequirements(saved);
    setToastMessage('Company requirements saved as draft successfully!');
  };

  // Freeze requirements (same as candidate profile)
  const handleFreezeRequirements = () => {
    if (!validate()) return;
    const frozen = freezeCompanyRequirements(formData);
    setRequirements(frozen);
    setIsFrozen(true);
    setToastMessage('Company requirements and hiring rounds frozen & cryptographically sealed!');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Unfreeze profile to allow editing immediately without dialog blocker
  const handleUnfreezeProfile = () => {
    const unfrozen = unfreezeCompanyRequirements();
    setRequirements(unfrozen);
    setFormData(unfrozen);
    setIsFrozen(false);
    setToastMessage('✓ Requirements unlocked for editing! You can now modify company details and interview rounds.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Copy EEOC verification token
  const copyToken = () => {
    navigator.clipboard?.writeText(requirements.verificationToken || 'FH-EEOC-HR-8842');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2200);
  };

  // =========================================================================
  // ================= FROZEN PROFILE & REQUIREMENTS VIEW ====================
  // =========================================================================
  if (isFrozen) {
    return (
      <DashboardLayout>
        {toastMessage && (
          <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        )}

        {/* Page Header */}
        <PageHeader
          title="Company Requirements & Hiring Standards"
          subtitle="Your enterprise hiring process and profile parameters are frozen and verified under the EEOC 80% Rule for standardized candidate screening."
          actions={
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleUnfreezeProfile}
                className="px-4 py-2.5 rounded-xl text-xs font-black border border-teal-500/50 bg-teal-50 hover:bg-teal-100 text-teal-900 transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95"
                title="Unlock requirements to edit profile details or modify rounds"
              >
                <Unlock className="w-4 h-4 text-teal-700" />
                <span>Unfreeze Profile (Edit Details)</span>
              </button>

              <Link
                to="/recruiter/jobs/create"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-teal-400" />
                <span>Post New Job Opening</span>
              </Link>
            </div>
          }
        />

        <div className="space-y-6 max-w-6xl mx-auto pb-12">

          {/* 2. Company Profile Details Dossier */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-navy-900 text-white font-black text-lg flex items-center justify-center shadow-md">
                  {requirements.companyName?.charAt(0) || 'F'}
                </div>
                <div>
                  <h3 className="text-lg font-black text-navy-900">{requirements.companyName}</h3>
                  <p className="text-xs text-slate-500 font-medium">{requirements.industry} • {requirements.companySize}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleUnfreezeProfile}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer w-fit"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                <span>Edit Profile Details</span>
              </button>
            </div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Talent Acquisition Lead</span>
                <p className="text-xs font-bold text-navy-900">{requirements.hrName}</p>
                <p className="text-[11px] text-slate-500">{requirements.designation || 'Head of Talent'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Hiring Contact</span>
                <p className="text-xs font-bold text-navy-900">{requirements.hrEmail}</p>
                <p className="text-[11px] text-slate-500">{requirements.phone || '+1 (555) 349-8821'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workplace Model</span>
                <p className="text-xs font-bold text-navy-900">{requirements.workModel || 'Hybrid / Remote Friendly'}</p>
                <p className="text-[11px] text-slate-500">{requirements.headquarters || 'San Francisco, CA'}</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Compliance Benchmark</span>
                <div className="flex items-center gap-1.5 text-xs font-bold text-teal-700">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>EEOC 80% Rule Enforced</span>
                </div>
                <p className="text-[11px] text-slate-500">Passing Threshold: {requirements.minPassingThreshold || 75}%</p>
              </div>
            </div>

            {/* Hiring Mission */}
            <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>Equal Opportunity & Blind Evaluation Mandate</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {requirements.hiringMission}
              </p>
            </div>
          </div>

          {/* 3. Configured Hiring Process / Rounds Answers (Read-Only) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-navy-900">
                    Configured Hiring Process ({requirements.numRounds} Rounds)
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800">
                    Active Pipeline
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  These rounds are displayed to candidates in the Candidate Portal for interview preparation.
                </p>
              </div>

              <button
                type="button"
                onClick={handleUnfreezeProfile}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer w-fit"
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600" />
                <span>Change in Rounds / Modify</span>
              </button>
            </div>

            {/* Rounds Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(requirements.rounds || []).map((round, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-400 hover:shadow-md transition-all space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200 font-mono">
                        Stage {round.round || idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        Round {idx + 1} of {requirements.numRounds}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      {round.name}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {round.description || 'Comprehensive evaluation of candidate capabilities and domain alignment.'}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1 text-teal-700 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                      Candidate Visible
                    </span>
                    <span>Evaluation Active</span>
                  </div>
                </div>
              ))}
            </div>

          {/* Candidate Portal Sync Callout */}
          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200/80 flex items-start gap-3 text-xs text-indigo-900">
            <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Candidate Portal Synchronization Active:</strong>
              <p className="text-indigo-800 text-[11px] mt-0.5 leading-relaxed">
                Candidates viewing jobs from <strong>{requirements.companyName}</strong> will automatically see these {requirements.numRounds} rounds in their interview preparation roadmap and stage milestones. Any modifications made here will dynamically update the candidate portal.
              </p>
            </div>
          </div>

          {/* Bottom Action: Prominent Unfreeze / Edit Details Banner */}
          <div className="bg-gradient-to-r from-navy-900 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
                <Unlock className="w-3.5 h-3.5 text-teal-400" />
                <span>One-Click Unfreeze Available</span>
              </div>
              <h3 className="text-lg font-black text-white">Need to Modify Company Details or Hiring Rounds?</h3>
              <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                Click unfreeze to switch to edit mode. You can edit company parameters, adjust the number of evaluation rounds (1–6), update round descriptions, and re-freeze at any time.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleUnfreezeProfile}
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-xs font-black transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Unlock className="w-4 h-4 text-navy-950" />
                <span>Unfreeze Profile & Edit Details</span>
              </button>
            </div>
          </div>
        </div>
        </div>
      </DashboardLayout>
    );
  }

  // =========================================================================
  // ================= EDIT MODE / REQUIREMENTS QUESTIONNAIRE =================
  // =========================================================================
  return (
    <DashboardLayout>
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage('')} />
      )}

      {/* Page Header */}
      <PageHeader
        title="Configure Company Requirements & Hiring Rounds"
        subtitle="Set up your company profile, specify the exact number of interview rounds, and customize round details. Freeze when ready to lock your standards."
        actions={
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all shadow-xs cursor-pointer"
            >
              Save Draft
            </button>

            <Button
              type="button"
              variant="gradient"
              size="sm"
              icon={Lock}
              onClick={handleFreezeRequirements}
              className="shadow-md cursor-pointer"
            >
              Save & Freeze Requirements
            </Button>
          </div>
        }
      />

      <div className="space-y-8 max-w-5xl mx-auto pb-16">
        {/* Unfrozen Warning Notice */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-amber-950">Editing Mode Active (Requirements Unfrozen)</p>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              You can modify company profile details and configure your interview rounds below. When finished, click <strong>"Save & Freeze Requirements"</strong> to seal your hiring configuration under the EEOC blind evaluation standard.
            </p>
          </div>
        </div>

        {/* ================= SECTION 1: COMPANY PROFILE DETAILS ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-navy-900 text-white flex items-center justify-center font-bold text-xs">
              1
            </div>
            <div>
              <h3 className="text-base font-extrabold text-navy-900">Company & Recruiter Profile Details</h3>
              <p className="text-xs text-slate-500">Basic organization information displayed on job listings and candidate portals.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company / Organization Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              placeholder="e.g. Acme Technologies"
              required
              error={errors.companyName}
            />

            <Input
              label="Talent Acquisition / HR Representative"
              name="hrName"
              value={formData.hrName}
              onChange={handleInputChange}
              placeholder="e.g. Elena Rostova"
              required
              error={errors.hrName}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input
              label="Official Work Email"
              name="hrEmail"
              type="email"
              value={formData.hrEmail}
              onChange={handleInputChange}
              placeholder="e.g. elena.rostova@fairhire.io"
              required
              error={errors.hrEmail}
            />

            <Input
              label="Contact Phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Company Headcount Scale
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleInputChange}
                className="rounded-xl text-xs font-semibold bg-white border border-slate-300 px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-800"
              >
                <option value="1-50 Seed/Startup">1 - 50 employees (Early Stage)</option>
                <option value="51-200 Growth">51 - 200 employees (Growth Stage)</option>
                <option value="201-1000 Mid-Market">201 - 1000 employees (Mid-Market)</option>
                <option value="1000+ Global Corp">1000+ employees (Global Enterprise)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Primary Industry / Domain
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleInputChange}
                className="rounded-xl text-xs font-semibold bg-white border border-slate-300 px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-800"
              >
                <option value="Software & Cloud Engineering">Software & Cloud Engineering</option>
                <option value="FinTech & Banking Infrastructure">FinTech & Banking Infrastructure</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="HealthTech & Life Sciences">HealthTech & Life Sciences</option>
                <option value="E-Commerce & Digital Products">E-Commerce & Digital Products</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Workplace Setup
              </label>
              <select
                name="workModel"
                value={formData.workModel}
                onChange={handleInputChange}
                className="rounded-xl text-xs font-semibold bg-white border border-slate-300 px-3.5 py-2.5 outline-none focus:border-teal-500 text-slate-800"
              >
                <option value="Hybrid / Remote Friendly">Hybrid / Remote Friendly</option>
                <option value="100% Fully Remote">100% Fully Remote</option>
                <option value="On-Site Office">On-Site Office</option>
              </select>
            </div>

            <Input
              label="Headquarters / Office Location"
              name="headquarters"
              value={formData.headquarters}
              onChange={handleInputChange}
              placeholder="e.g. San Francisco, CA / Bengaluru"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Company Equal Opportunity & Merit Hiring Statement
            </label>
            <textarea
              name="hiringMission"
              rows={2}
              value={formData.hiringMission}
              onChange={handleInputChange}
              className="rounded-xl text-xs bg-white border border-slate-300 p-3 outline-none focus:border-teal-500 text-slate-800"
              placeholder="Describe your diversity, fairness, or merit principles..."
            />
          </div>
        </div>

        {/* ================= SECTION 2: HIRING ROUNDS QUESTIONNAIRE ================= */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
              2
            </div>
            <div>
              <h3 className="text-base font-extrabold text-navy-900">Hiring Rounds Configuration</h3>
              <p className="text-xs text-slate-500">Specify how many rounds will be conducted and define each stage.</p>
            </div>
          </div>

          {/* PRIMARY QUESTION WITH INTERACTIVE BOXES 1, 2, 3, 4, 5, 6 */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-sm font-extrabold text-navy-900">
                How many rounds will be conducted in your company? <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs font-semibold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                Selected: {formData.numRounds} {formData.numRounds === 1 ? 'Round' : 'Rounds'}
              </span>
            </div>

            {/* NEAT ATTRACTIVE NUMBER BOXES */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {ROUND_COUNT_OPTIONS.map((opt) => {
                const isSelected = formData.numRounds === opt.count;
                return (
                  <button
                    key={opt.count}
                    type="button"
                    onClick={() => handleRoundCountSelect(opt.count)}
                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group ${
                      isSelected
                        ? 'bg-gradient-to-b from-teal-50 to-white border-teal-500 ring-4 ring-teal-500/20 shadow-lg scale-102'
                        : 'bg-slate-50/70 border-slate-200 hover:border-teal-300 hover:bg-white'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-teal-500 text-white flex items-center justify-center">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                    <span className={`text-2xl font-black font-mono transition-colors ${
                      isSelected ? 'text-teal-600' : 'text-slate-700 group-hover:text-navy-900'
                    }`}>
                      {opt.count}
                    </span>
                    <span className={`text-xs font-bold mt-1 ${
                      isSelected ? 'text-navy-900' : 'text-slate-600'
                    }`}>
                      {opt.count === 1 ? '1 Round' : `${opt.count} Rounds`}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">
                      {opt.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DYNAMIC ROUNDS INPUTS ("WHAT ARE THE ROUNDS?") */}
          <div className="pt-4 space-y-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-extrabold text-navy-900">
                  What are the rounds? (Define each stage)
                </h4>
                <p className="text-xs text-slate-500">
                  Type custom round titles or click quick suggestion chips below to auto-populate.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400">
                {formData.rounds?.length || 0} stages configured
              </span>
            </div>

            {errors.rounds && (
              <p className="text-xs text-rose-600 font-bold">{errors.rounds}</p>
            )}

            {/* Round Input Cards */}
            <div className="space-y-4">
              {(formData.rounds || []).map((round, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all space-y-3.5 relative"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-xl bg-teal-600 text-white font-black text-xs flex items-center justify-center font-mono shadow-xs">
                        R{idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                        Round {idx + 1} of {formData.numRounds}
                      </span>
                    </div>

                    {/* Quick presets pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">
                        Preset Suggestions:
                      </span>
                      {ROUND_PRESETS.slice(0, 4).map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleApplyPreset(idx, preset)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-700 hover:bg-teal-50/50 transition-all cursor-pointer"
                        >
                          + {preset.name.split(' ')[0]} {preset.name.split(' ')[1] || ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                        Round Name / Title <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={round.name || ''}
                        onChange={(e) => handleRoundFieldChange(idx, 'name', e.target.value)}
                        placeholder={`e.g. Round ${idx + 1}: Technical Live Coding`}
                        className={`w-full rounded-xl text-xs font-semibold bg-white border p-2.5 outline-none transition-all ${
                          errors[`round_${idx}`]
                            ? 'border-rose-400 focus:border-rose-500'
                            : 'border-slate-300 focus:border-teal-500'
                        }`}
                      />
                      {errors[`round_${idx}`] && (
                        <p className="text-[10px] text-rose-500 font-semibold mt-1">{errors[`round_${idx}`]}</p>
                      )}
                    </div>

                    <div className="sm:col-span-7">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                        Evaluation Focus & Candidate Preparation Details
                      </label>
                      <input
                        type="text"
                        value={round.description || ''}
                        onChange={(e) => handleRoundFieldChange(idx, 'description', e.target.value)}
                        placeholder="e.g. Evaluates core DSA, clean code, and time complexity under guided interview scenarios"
                        className="w-full rounded-xl text-xs font-normal bg-white border border-slate-300 p-2.5 outline-none focus:border-teal-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: COMPLIANCE & FREEZE ACTION ================= */}
        <div className="bg-gradient-to-r from-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Standardized EEOC Blind Evaluation</span>
            </div>
            <h3 className="text-lg font-black text-white">Ready to Freeze Requirements?</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Once frozen, these {formData.numRounds} rounds and company profile parameters will lock as your verified standard. All candidate workflows will automatically adopt this pipeline. You can unfreeze anytime to adjust parameters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-700 bg-navy-800/80 hover:bg-navy-800 text-white text-xs font-bold transition-all cursor-pointer"
            >
              Save as Draft
            </button>

            <Button
              type="button"
              variant="gradient"
              size="md"
              icon={Lock}
              onClick={handleFreezeRequirements}
              className="w-full sm:w-auto whitespace-nowrap shadow-lg cursor-pointer"
            >
              Freeze & Seal Requirements
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Requirements;
