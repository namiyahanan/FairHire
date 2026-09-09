import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Input from '../../components/common/Input';
import Checkbox from '../../components/common/Checkbox';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useCandidates } from '../../hooks/useCandidates';
import { DEGREE_OPTIONS } from '../../utils/constants';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  Send,
  Sparkles,
  ShieldCheck,
  Check,
  User,
  GraduationCap,
  Briefcase,
  Target,
  FileCheck,
  ChevronRight,
  Star,
  Award,
  Lock,
  Unlock,
  Cpu,
  BarChart3,
  TrendingUp,
  Clock,
  Layers,
  ExternalLink,
  Code2,
  Compass,
  AlertCircle,
  Calendar
} from 'lucide-react';

const STEPS = [
  { id: 'personal', stepNum: 1, name: 'Personal Information', desc: 'Contact & location details', icon: User },
  { id: 'education', stepNum: 2, name: 'Educational Background', desc: 'Degree, college & graduation', icon: GraduationCap },
  { id: 'experience', stepNum: 3, name: 'Experience & Skills', desc: 'Tech stack & career summary', icon: Briefcase },
  { id: 'target', stepNum: 4, name: 'Target Role Preferences', desc: 'Desired position & work setup', icon: Target },
  { id: 'resume', stepNum: 5, name: 'Resume Upload', desc: 'Verified PDF or document', icon: FileText },
  { id: 'consent', stepNum: 6, name: 'Data Privacy & Consent', desc: 'AI screening & compliance', icon: ShieldCheck },
  { id: 'review', stepNum: 7, name: 'Review & Submit', desc: 'Final dossier confirmation', icon: FileCheck }
];

const CandidateProfileWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { applyCandidate, loading: applyLoading } = useCandidates();

  const [currentStep, setCurrentStep] = useState(0);
  
  // Persistent freeze state - once completed, stays frozen across page reloads & visits
  const [isFrozen, setIsFrozen] = useState(() => {
    return localStorage.getItem('fairhire_profile_frozen') === 'true';
  });

  // Copied token notification state
  const [copiedToken, setCopiedToken] = useState(false);

  // Initialize with saved frozen data, authenticated user info, or sensible defaults
  const [formData, setFormData] = useState(() => {
    try {
      const saved = localStorage.getItem('fairhire_frozen_profile_data');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    const details = user?.profile?.details || {};
    return {
      fullName: user?.name || 'Alex Morgan',
      email: user?.email || 'alex.morgan@gmail.com',
      mobile: user?.profile?.mobile || '+91 9876543210',
      location: user?.profile?.location || 'Mumbai, India',
      degree: details.degree || "Bachelor's Degree",
      institution: details.institution || 'IIT Bombay',
      fieldOfStudy: details.fieldOfStudy || 'Computer Science & Engineering',
      graduationYear: details.graduationYear || '2025',
      experienceYears: details.yearsOfExperience || (user?.profile?.experienceType === 'fresher' ? '0 (Fresher)' : '3 years'),
      currentTitle: details.currentTitle || (user?.profile?.experienceType === 'fresher' ? 'Student / Fresher' : 'Frontend Engineer'),
      currentCompany: details.currentCompany || (user?.profile?.experienceType === 'fresher' ? 'None (Fresher)' : 'TechCorp'),
      skills: details.primarySkills || 'React, JavaScript, Node.js, Tailwind CSS',
      summary: 'Passionate software engineer focused on building clean, performant, and scalable web applications.',
      targetRole: details.targetRole || 'Full Stack Software Engineer',
      preferredLocation: 'Remote / Hybrid',
      expectedSalary: details.expectedCtc || '$110,000 / yr',
      resumeFileName: 'Alex_Morgan_Resume.pdf',
      consentDataProcessing: true,
      consentAiScreening: true
    };
  });

  // Sync state if other tabs or events update profile
  useEffect(() => {
    const handleProfileUpdate = () => {
      setIsFrozen(localStorage.getItem('fairhire_profile_frozen') === 'true');
      try {
        const saved = localStorage.getItem('fairhire_frozen_profile_data');
        if (saved) setFormData(JSON.parse(saved));
      } catch (e) {}
    };

    window.addEventListener('fairhire_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('fairhire_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Check if a step has fields filled to display completed checkmark badge
  const isStepFilled = (stepIndex) => {
    switch (stepIndex) {
      case 0:
        return Boolean(formData.fullName?.trim() && formData.email?.trim());
      case 1:
        return Boolean(formData.institution?.trim() || formData.degree?.trim());
      case 2:
        return Boolean(formData.skills?.trim() || formData.currentTitle?.trim());
      case 3:
        return Boolean(formData.targetRole?.trim() || formData.preferredLocation?.trim());
      case 4:
        return Boolean(formData.resumeFileName?.trim());
      case 5:
        return Boolean(formData.consentDataProcessing && formData.consentAiScreening);
      case 6:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  const handleSimulateResumeUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, resumeFileName: file.name }));
    } else {
      setFormData(prev => ({
        ...prev,
        resumeFileName: `${(formData.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf`
      }));
    }
  };

  const handleSubmitProfile = async () => {
    const payload = {
      ...formData,
      skills: typeof formData.skills === 'string'
        ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
        : formData.skills
    };

    // 1. Permanently freeze the profile in localStorage
    localStorage.setItem('fairhire_profile_frozen', 'true');
    localStorage.setItem('fairhire_frozen_profile_data', JSON.stringify(formData));

    // 2. Dispatch event for sidebar and other components to reflect frozen rating state
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fairhire_profile_updated', {
        detail: { isFrozen: true, formData }
      }));
    }

    setIsFrozen(true);
    // Profile is verified & frozen. Candidate enters pipeline only when they apply for a live job position.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUnfreezeProfile = () => {
    localStorage.setItem('fairhire_profile_frozen', 'false');
    setIsFrozen(false);
    setCurrentStep(0);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fairhire_profile_updated', {
        detail: { isFrozen: false }
      }));
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const copyBlindToken = () => {
    navigator.clipboard?.writeText('FH-8492-EEOC');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2500);
  };

  // =========================================================================
  // ================= FROZEN PROFILE RATING & DOSSIER VIEW ===================
  // =========================================================================
  if (isFrozen) {
    return (
      <DashboardLayout>
        {/* Page Header */}
        <PageHeader
          title="Candidate Profile Rating & Verified Dossier"
          subtitle="Your profile is frozen and cryptographically sealed for EEOC Blind Screening. Telemetry is active across FairHire matching models."
          actions={
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handleUnfreezeProfile}
                className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Unlock profile to edit details (Demo Mode)"
              >
                <Unlock className="w-3.5 h-3.5 text-amber-500" />
                <span>Unfreeze Profile (Edit)</span>
              </button>

              <Link
                to="/candidate"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-navy-900 hover:bg-navy-800 text-white transition-all flex items-center gap-1.5 shadow-xs"
              >
                <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                <span>Explore Matched Jobs</span>
              </Link>
            </div>
          }
        />

        <div className="space-y-6 max-w-6xl mx-auto pb-12">

          {/* 2. Hero Profile Rating Scorecard */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              
              {/* Left Column: Big Circular Rating Badge */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-gradient-to-b from-navy-950 to-navy-900 text-white relative shadow-xl border border-navy-800">
                <div className="absolute top-3 right-3 text-teal-400">
                  <Sparkles className="w-5 h-5 opacity-75" />
                </div>

                <span className="text-[11px] uppercase tracking-widest font-bold text-teal-300 mb-2">
                  FairHire Profile Rating
                </span>

                {/* Main Numerical Rating Indicator */}
                <div className="relative my-2 flex items-baseline justify-center">
                  <span className="text-6xl sm:text-7xl font-black tracking-tight text-white drop-shadow-sm">
                    9.4
                  </span>
                  <span className="text-2xl font-bold text-teal-400 ml-1">/ 10</span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40 text-xs font-extrabold mb-3">
                  <Award className="w-3.5 h-3.5 text-teal-400" />
                  Tier-1 Exceptional Candidate
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
                  Scores in the <strong className="text-white">top 4%</strong> of 1,280+ benchmarked full stack applicants based on technical depth and foundational rigor.
                </p>

                <div className="mt-4 pt-4 border-t border-navy-800/80 w-full flex items-center justify-between text-[11px] text-slate-300">
                  <span>Match Confidence:</span>
                  <strong className="text-emerald-400 font-bold">98.2% High</strong>
                </div>
              </div>

              {/* Right Column: Multi-Metric Impact Snapshot */}
              <div className="lg:col-span-8 space-y-4">
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-black text-navy-900 tracking-tight">
                      Contextual AI Telemetry & Merit Index
                    </h3>
                    <p className="text-xs text-slate-500">
                      Calculated across 5 audited objective dimensions without demographic data leakage.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                    Live Scorecard
                  </span>
                </div>

                {/* 3 High-Impact Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Role Semantic Alignment
                    </span>
                    <div className="flex items-baseline gap-1 my-1">
                      <strong className="text-2xl font-black text-navy-900">96%</strong>
                      <span className="text-xs text-emerald-600 font-bold">↑ High</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Matches {formData.targetRole || 'Full Stack Engineer'} criteria
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      EEOC Anti-Bias Score
                    </span>
                    <div className="flex items-baseline gap-1 my-1">
                      <strong className="text-2xl font-black text-navy-900">100%</strong>
                      <span className="text-xs text-teal-600 font-bold">Zero Drift</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      4/5ths Adverse Rule passed perfectly
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Assessed Engineering Tier
                    </span>
                    <div className="flex items-baseline gap-1 my-1">
                      <strong className="text-2xl font-black text-navy-900">Level 4</strong>
                      <span className="text-xs text-sky-600 font-bold">Mid-Senior</span>
                    </div>
                    <span className="text-[11px] text-slate-500">
                      Architecture & component scale ready
                    </span>
                  </div>
                </div>

                {/* AI Executive Assessment Callout */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-teal-50/80 to-sky-50/80 border border-teal-200/70 text-xs text-slate-700 leading-relaxed flex items-start gap-3">
                  <Cpu className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-navy-900 font-bold block mb-0.5">
                      FairHire AI Rationale:
                    </strong>
                    <span>
                      Applicant demonstrates robust proficiency in modern JavaScript/TypeScript paradigms, modular React component design, and core algorithmic problem solving. Educational background at <strong>{formData.institution || 'Accredited Institution'}</strong> provides high foundational rigor for production-grade engineering roles.
                    </span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3. Dimensional Competency Rating Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-teal-600 block">
                  Detailed Rubric Scoring
                </span>
                <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
                  5-Dimensional Profile Competency Matrix
                </h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                Audited against FairHire Core Engineering Rubrics
              </span>
            </div>

            <div className="space-y-4">
              
              {/* Dimension 1: Technical Stack Mastery */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 transition-all hover:border-teal-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">
                        Technical Stack Proficiency & Modern Tooling
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Evaluated against React, JavaScript, Node.js, and API architecture
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Grade A+
                    </span>
                    <span className="text-sm font-black text-navy-900">9.6 / 10</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full" style={{ width: '96%' }} />
                </div>

                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] font-bold text-slate-400 mr-1">Verified Skills:</span>
                  {(typeof formData.skills === 'string' ? formData.skills.split(',') : (formData.skills || ['React', 'JavaScript'])).map((skill, sIdx) => (
                    <span key={sIdx} className="px-2 py-0.5 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
                      {typeof skill === 'string' ? skill.trim() : skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Dimension 2: Educational Rigor */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 transition-all hover:border-teal-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">
                        Educational Rigor & Computer Science Foundation
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {formData.institution || 'IIT Bombay'} • {formData.degree} ({formData.fieldOfStudy || 'CS'})
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Grade A+
                    </span>
                    <span className="text-sm font-black text-navy-900">9.2 / 10</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-gradient-to-r from-sky-500 to-teal-500 rounded-full" style={{ width: '92%' }} />
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Demonstrates verified theoretical grounding in Data Structures & Algorithms, Systems Programming, and Object-Oriented Software Design.
                </p>
              </div>

              {/* Dimension 3: System Architecture & Scalability */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 transition-all hover:border-teal-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">
                        System Architecture & Scalable Component Design
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Modular design, client-server integration, state management, and performance
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Grade A
                    </span>
                    <span className="text-sm font-black text-navy-900">9.0 / 10</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: '90%' }} />
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Exhibits clear mental models for breaking complex UX requirements into decoupled, testable components with minimal rendering overhead.
                </p>
              </div>

              {/* Dimension 4: EEOC Blind Anti-Bias Compliance */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 transition-all hover:border-teal-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">
                        EEOC Blind Screening & Adverse Impact Compliance
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Demographic markers completely decoupled from technical scoring
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800">
                      Perfect Parity
                    </span>
                    <span className="text-sm font-black text-navy-900">10.0 / 10</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: '100%' }} />
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  All evaluations proceed via anonymized token <strong>#FH-8492-EEOC</strong>. Hiring teams cannot view gender, ethnicity, or age during the screening and assessment phases.
                </p>
              </div>

              {/* Dimension 5: Portfolio & Resume Completeness */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200 transition-all hover:border-teal-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      5
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy-900">
                        Dossier Verification & Vectorized Resume Completeness
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Verified document: {formData.resumeFileName || 'Candidate_Resume.pdf'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      Grade A
                    </span>
                    <span className="text-sm font-black text-navy-900">9.5 / 10</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2.5">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" style={{ width: '95%' }} />
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Document fully vectorized. Semantic keywords and experience timeline confirmed with zero conflicting discrepancies.
                </p>
              </div>

            </div>
          </div>

          {/* 4. Target Role Suitability Matrix & Key Strengths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Role Suitability Scores */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-navy-900">
                    Role Suitability Breakdown
                  </h4>
                  <p className="text-xs text-slate-500">
                    Calculated against live FairHire open engineering tracks
                  </p>
                </div>
                <Compass className="w-5 h-5 text-teal-500" />
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-teal-50/60 border border-teal-200/80 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-bold text-navy-900 block">
                      Full Stack Software Engineer
                    </strong>
                    <span className="text-[10px] text-teal-700 font-semibold">
                      ★ Recommended Highest Fit
                    </span>
                  </div>
                  <span className="text-sm font-black text-teal-700 bg-white px-2.5 py-1 rounded-xl border border-teal-200 shadow-2xs">
                    96% Match
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-bold text-navy-900 block">
                      Frontend Engineer (React / Next.js)
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      High UI & State architecture match
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    94% Match
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-bold text-navy-900 block">
                      Backend Engineer (Node / APIs)
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      Solid REST & Database fundamentals
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    89% Match
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <strong className="text-xs font-bold text-navy-900 block">
                      DevOps & Cloud Infrastructure
                    </strong>
                    <span className="text-[10px] text-slate-500">
                      Basic CI/CD & Deployment coverage
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-700 bg-white px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                    81% Match
                  </span>
                </div>
              </div>
            </div>

            {/* Right: AI Strengths & Verification Badges */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-navy-900">
                      Key AI Strengths & Badges
                    </h4>
                    <p className="text-xs text-slate-500">
                      Demonstrated competencies extracted from verified submission
                    </p>
                  </div>
                  <Sparkles className="w-5 h-5 text-amber-500" />
                </div>

                <div className="grid grid-cols-2 gap-2.5 mt-4">
                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs">
                    <span className="font-bold text-emerald-900 block">Modern React Fluency</span>
                    <span className="text-[10px] text-emerald-700">Hooks, Context & Performance</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-xs">
                    <span className="font-bold text-sky-900 block">System Architecture</span>
                    <span className="text-[10px] text-sky-700">Clean modular component hierarchy</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 text-xs">
                    <span className="font-bold text-purple-900 block">Foundational Rigor</span>
                    <span className="text-[10px] text-purple-700">CS algorithms & problem solving</span>
                  </div>

                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs">
                    <span className="font-bold text-amber-900 block">EEOC Blind Verified</span>
                    <span className="text-[10px] text-amber-700">Zero demographic bias exposure</span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  💡 <strong>Next Step Recommendation:</strong> Visit the <Link to="/candidate" className="text-teal-600 font-bold hover:underline">Software Engineering Preparation Guide</Link> on your dashboard to review live technical interview questions for your 4 target rounds.
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Verification Authority:</span>
                <span className="font-bold text-navy-900">FairHire Audit Engine v2.4</span>
              </div>
            </div>

          </div>

          {/* 5. Frozen Verified Dossier (Read-Only) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] uppercase font-bold tracking-wider text-slate-400 block">
                  Archived Submission
                </span>
                <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
                  Frozen Candidate Credentials Dossier
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Read-Only Record
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              
              {/* Applicant Info */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant Details</span>
                <strong className="text-navy-900 font-bold text-sm block">{formData.fullName}</strong>
                <p className="text-slate-600">{formData.email}</p>
                <p className="text-slate-500">{formData.mobile}</p>
                <p className="text-slate-500">{formData.location}</p>
              </div>

              {/* Education */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Education Credentials</span>
                <strong className="text-navy-900 font-bold text-sm block">{formData.degree}</strong>
                <p className="text-slate-600">{formData.institution}</p>
                <p className="text-slate-500">{formData.fieldOfStudy}</p>
                <p className="text-slate-500">Graduation: {formData.graduationYear}</p>
              </div>

              {/* Experience */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience & Stack</span>
                <strong className="text-navy-900 font-bold text-sm block">{formData.currentTitle}</strong>
                <p className="text-slate-600">{formData.currentCompany} • {formData.experienceYears}</p>
                <p className="text-teal-700 font-semibold truncate mt-1">
                  {formData.skills}
                </p>
              </div>

              {/* Target & Resume */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Role & Resume</span>
                <strong className="text-navy-900 font-bold text-sm block">{formData.targetRole}</strong>
                <p className="text-slate-600">{formData.preferredLocation} • {formData.expectedSalary}</p>
                <div className="flex items-center gap-1 text-emerald-700 font-semibold mt-1 truncate">
                  <FileText className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{formData.resumeFileName}</span>
                </div>
              </div>

            </div>
          </div>

          {/* 6. Quick Action Navigation Bar */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 border border-teal-200">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-navy-900">
                  Ready to Advance in Pipeline?
                </h5>
                <p className="text-xs text-slate-500">
                  Track your live application status or book an approved interview slot.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <Link
                to="/candidate/status"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <span>Application Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              
              <Link
                to="/candidate/interview"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Interview Booking</span>
              </Link>

              <button
                type="button"
                onClick={handleUnfreezeProfile}
                className="flex-1 sm:flex-none px-3.5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <Unlock className="w-3 h-3 text-amber-500" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

        </div>
      </DashboardLayout>
    );
  }

  // =========================================================================
  // ================= MAIN EDITABLE VERTICAL WIZARD LAYOUT ==================
  // =========================================================================
  return (
    <DashboardLayout>
      <PageHeader
        title="Candidate Profile Wizard"
        subtitle="Complete your profile step by step. Once submitted, your profile will freeze for verified EEOC Blind Screening."
      />

      {/* Two-Column Vertical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Left Column: Vertical Stepper Navigation */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-5 shadow-sm sticky top-24">
          <div className="mb-4 pb-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Wizard Progression
            </h4>
            <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>

          <nav className="space-y-2">
            {STEPS.map((step, idx) => {
              const isCurrent = idx === currentStep;
              const isDone = isStepFilled(idx);
              const Icon = step.icon;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setCurrentStep(idx)}
                  className={`w-full text-left p-3 rounded-2xl transition-all flex items-center justify-between gap-3 group ${
                    isCurrent
                      ? 'bg-navy-900 text-white shadow-md ring-2 ring-navy-800'
                      : isDone
                      ? 'bg-emerald-50/70 text-slate-800 hover:bg-emerald-100/70 border border-emerald-200/80'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold transition-colors ${
                        isCurrent
                          ? 'bg-teal-400 text-navy-900'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isDone && !isCurrent ? <Check className="w-4 h-4 stroke-[3]" /> : <Icon className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-navy-900'}`}>
                        {step.stepNum}. {step.name}
                      </p>
                      <p className={`text-[10px] truncate ${isCurrent ? 'text-slate-300' : 'text-slate-500'}`}>
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {isDone && !isCurrent ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                        Completed
                      </span>
                    ) : isCurrent ? (
                      <ChevronRight className="w-4 h-4 text-teal-400" />
                    ) : (
                      <span className="text-[10px] font-medium text-slate-400">
                        Optional
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </nav>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-teal-500 shrink-0 mt-0.5" />
              <span>You can click any step in this vertical list at any time to jump directly to it.</span>
            </div>
          </div>
        </aside>

        {/* Right Column: Active Step Card */}
        <main className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 md:p-10 shadow-lg min-h-[500px] flex flex-col justify-between">
          
          <div>
            {/* STEP 1: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">Step 1 of 7</span>
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">Personal Information</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Enter your contact and primary location details.</p>
                  </div>
                  {isStepFilled(0) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Alex Morgan"
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. alex.morgan@gmail.com"
                  />
                  <Input
                    label="Mobile Phone Number"
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                  />
                  <Input
                    label="Current City / Location (Optional)"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Mumbai, India or Remote"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: Educational Background */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">Step 2 of 7</span>
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">Educational Background</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Add your university, college, and degree details.</p>
                  </div>
                  {isStepFilled(1) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Highest Degree Earned
                    </label>
                    <select
                      name="degree"
                      value={formData.degree}
                      onChange={handleChange}
                      className="rounded-xl text-xs font-semibold bg-white border border-slate-300 px-3.5 py-3 outline-none focus:border-teal-500 text-slate-800"
                    >
                      <option value="Bachelor's Degree">Bachelor's Degree (B.Tech / B.E. / B.S.)</option>
                      <option value="Master's Degree">Master's Degree (M.Tech / M.S. / MCA)</option>
                      <option value="Ph.D. / Doctorate">Ph.D. / Doctorate</option>
                      <option value="Diploma / Associate">Diploma / Associate Degree</option>
                      <option value="High School">High School</option>
                    </select>
                  </div>

                  <Input
                    label="Institution / University Name (Optional)"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    placeholder="e.g. IIT Bombay / Stanford University"
                  />

                  <Input
                    label="Field of Study / Major (Optional)"
                    name="fieldOfStudy"
                    value={formData.fieldOfStudy}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science & Engineering"
                  />

                  <Input
                    label="Graduation Year (Optional)"
                    name="graduationYear"
                    value={formData.graduationYear}
                    onChange={handleChange}
                    placeholder="e.g. 2024 or 2025"
                  />
                </div>
              </div>
            )}

            {/* STEP 3: Professional Experience & Skills */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">Step 3 of 7</span>
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">Experience & Technical Stack</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Outline your engineering experience, tools, and profile summary.</p>
                  </div>
                  {isStepFilled(2) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Total Years of Experience (Optional)"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    placeholder="e.g. 0 (Fresher) or 3 years"
                  />

                  <Input
                    label="Current / Recent Title (Optional)"
                    name="currentTitle"
                    value={formData.currentTitle}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Developer or Student"
                  />

                  <Input
                    label="Current / Recent Company (Optional)"
                    name="currentCompany"
                    value={formData.currentCompany}
                    onChange={handleChange}
                    placeholder="e.g. TechCorp or None"
                  />

                  <Input
                    label="Primary Technical Stack (Comma Separated)"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. React, JavaScript, Node.js, Python, SQL"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Executive Summary / Bio (Optional)
                  </label>
                  <textarea
                    name="summary"
                    rows={3}
                    value={formData.summary}
                    onChange={handleChange}
                    placeholder="Briefly describe your career background, notable engineering projects, and architectural strengths..."
                    className="w-full rounded-xl text-sm p-3.5 bg-white border border-slate-300 focus:border-teal-500 outline-none text-slate-800"
                  />
                  <span className="text-[11px] text-slate-400">
                    Optional summary for recruiters to understand your engineering passions.
                  </span>
                </div>
              </div>
            )}

            {/* STEP 4: Target Role Preferences */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">Step 4 of 7</span>
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">Target Role Preferences</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Specify your target job role, work preferences, and salary expectations.</p>
                  </div>
                  {isStepFilled(3) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Target Position Title (Optional)"
                    name="targetRole"
                    value={formData.targetRole}
                    onChange={handleChange}
                    placeholder="e.g. Senior Full Stack Engineer / Frontend Lead"
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Preferred Work Setup
                    </label>
                    <select
                      name="preferredLocation"
                      value={formData.preferredLocation}
                      onChange={handleChange}
                      className="rounded-xl text-xs font-semibold bg-white border border-slate-300 px-3.5 py-3 outline-none focus:border-teal-500 text-slate-800"
                    >
                      <option value="Remote / Hybrid">Remote / Hybrid</option>
                      <option value="Remote Only">Remote Only</option>
                      <option value="Onsite / In-Office">Onsite / In-Office</option>
                    </select>
                  </div>

                  <Input
                    label="Expected Compensation / Salary (Optional)"
                    name="expectedSalary"
                    value={formData.expectedSalary}
                    onChange={handleChange}
                    placeholder="e.g. $110,000 / yr or ₹18 LPA"
                  />
                </div>
              </div>
            )}

            {/* STEP 5: Resume Upload */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">Step 5 of 7</span>
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">Resume Document Attachment</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Attach your verified resume file for semantic contextual matching.</p>
                  </div>
                  {isStepFilled(4) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                    </span>
                  )}
                </div>

                <div className="p-8 border-2 border-dashed border-slate-300 rounded-3xl text-center bg-slate-50/80 flex flex-col items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-600 flex items-center justify-center shadow-xs">
                    <FileText className="w-7 h-7" />
                  </div>

                  <div>
                    {formData.resumeFileName ? (
                      <div className="space-y-1">
                        <span className="text-xs uppercase font-bold text-emerald-600 tracking-wider">File Attached:</span>
                        <h4 className="text-base font-bold text-navy-900">{formData.resumeFileName}</h4>
                        <p className="text-xs text-emerald-600 font-semibold">✓ Ready for semantic ingestion</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-navy-900">Upload your Resume (PDF or DOCX)</h4>
                        <p className="text-xs text-slate-500">Attach your CV or use sample resume for testing.</p>
                      </div>
                    )}
                  </div>

                  <label className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-xs transition-all flex items-center gap-2">
                    <Upload className="w-4 h-4 text-teal-600" />
                    <span>{formData.resumeFileName ? 'Change Resume File' : 'Browse & Upload File'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleSimulateResumeUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, resumeFileName: `${(prev.fullName || 'Candidate').replace(/\s+/g, '_')}_Resume.pdf` }))}
                    className="text-xs text-teal-600 hover:underline font-semibold"
                  >
                    Click to attach verified candidate sample resume
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: Data Privacy & Consent */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">Step 6 of 7</span>
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">Data Privacy & Consent</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Authorizations required for transparent pipeline matching.</p>
                  </div>
                  {isStepFilled(5) && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" /> Completed
                    </span>
                  )}
                </div>

                <div className="space-y-4 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <Checkbox
                    name="consentDataProcessing"
                    checked={formData.consentDataProcessing}
                    onChange={handleChange}
                    label="I authorize FairHire to process my resume, experience history, and skill telemetry for contextual role matching."
                  />
                  <Checkbox
                    name="consentAiScreening"
                    checked={formData.consentAiScreening}
                    onChange={handleChange}
                    label="I agree to semantic AI match scoring and objective rubric evaluations with complete human-in-the-loop oversight."
                  />
                </div>

                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200/80 text-xs text-teal-900 leading-relaxed">
                  <strong>EEOC & 80% Parity Protection:</strong> FairHire guarantees that demographic markers are decoupled from semantic scoring, ensuring that your application is evaluated solely on demonstrable project merit and skills.
                </div>
              </div>
            )}

            {/* STEP 7: Review & Final Submit */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 block">Step 7 of 7</span>
                    <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">Review & Final Submission</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Confirm your profile summary. Once submitted, your profile will freeze and generate your Profile Rating.</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Ready to Freeze & Submit
                  </span>
                </div>

                {/* Structured Dossier Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/90 p-5 rounded-2xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Applicant</span>
                    <strong className="text-navy-900 font-bold text-sm block">{formData.fullName}</strong>
                    <p className="text-slate-600">{formData.email} • {formData.mobile}</p>
                    <p className="text-slate-500">{formData.location}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Education</span>
                    <strong className="text-navy-900 font-bold text-sm block">{formData.degree}</strong>
                    <p className="text-slate-600">{formData.institution} ({formData.graduationYear})</p>
                    <p className="text-slate-500">{formData.fieldOfStudy}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience & Skills</span>
                    <strong className="text-navy-900 font-bold text-sm block">{formData.currentTitle} ({formData.experienceYears})</strong>
                    <p className="text-slate-600">{formData.currentCompany}</p>
                    <p className="text-teal-700 font-semibold truncate mt-0.5">{formData.skills}</p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Target Role & Resume</span>
                    <strong className="text-navy-900 font-bold text-sm block">{formData.targetRole}</strong>
                    <p className="text-slate-600">{formData.preferredLocation} • {formData.expectedSalary}</p>
                    <p className="text-emerald-700 font-semibold truncate mt-0.5">📄 {formData.resumeFileName}</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
                  <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold">Profile Freezing & Rating Generation</h5>
                    <p className="text-amber-800 mt-0.5">
                      Upon submission, your profile will be locked into FairHire's EEOC Blind Screening engine. You will receive an instant <strong>Profile Rating Score</strong> and verified candidate dossier.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Action Buttons */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={prevStep}
              disabled={currentStep === 0}
              icon={ArrowLeft}
            >
              Previous Step
            </Button>

            {currentStep < STEPS.length - 1 ? (
              <Button
                type="button"
                variant="gradient"
                size="md"
                onClick={nextStep}
                className="shadow-sm cursor-pointer"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                type="button"
                variant="gradient"
                size="lg"
                onClick={handleSubmitProfile}
                isLoading={applyLoading}
                icon={Lock}
                className="shadow-md cursor-pointer hover:shadow-teal-500/25 transition-all"
              >
                Submit, Freeze Profile & View Rating
              </Button>
            )}
          </div>

        </main>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfileWizard;
