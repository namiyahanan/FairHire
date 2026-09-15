import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import {
  Sparkles,
  Info,
  Building2,
  MapPin,
  Clock,
  Star,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  X,
  GraduationCap,
  PlayCircle,
  Award,
  Layers,
  Database,
  Cpu,
  Globe,
  Terminal,
  Brain,
  Shield,
  Search,
  Check,
  Send,
  Upload,
  CheckSquare,
  Square,
  ListChecks,
  ExternalLink,
  HelpCircle,
  Compass
} from 'lucide-react';
import { getAppliedApplications, applyToJobStore } from '../../services/applicationStore';
import {
  getStoredJobs,
  incrementJobApplicantCount,
  TRACKS,
  GENERAL_PREPARATION_CHECKLIST,
  PREPARATION_GUIDE_ROLES
} from '../../services/jobStore';
import { getCompanyRounds } from '../../services/requirementsStore';
import { candidateApi } from '../../services/candidateApi';

// Top Companies
const TOP_COMPANIES = [
  {
    name: 'GE Healthcare',
    rating: 3.9,
    reviews: '955 reviews',
    logoText: 'GE',
    bgColor: 'bg-sky-600',
    roleCount: 3,
    industry: 'Healthcare & MedTech AI',
    location: 'Bengaluru / Hybrid',
    description: 'Pioneering global precision care and intelligent healthcare software solutions.',
    benefits: ['Comprehensive Medical Coverage', 'Flexible Remote Policy', 'Learning Stipend', '401k/PF Matching']
  },
  {
    name: 'Metropolis Health',
    rating: 3.9,
    reviews: '1.1K+ reviews',
    logoText: 'MH',
    bgColor: 'bg-emerald-600',
    roleCount: 2,
    industry: 'Diagnostics & TeleHealth',
    location: 'Mumbai / Hybrid',
    description: 'Leading diagnostic network driving automated patient pathology intelligence platforms.',
    benefits: ['Annual Wellness Allowance', 'Stock Options', 'Hybrid Work Model', 'Paid Parental Leave']
  },
  {
    name: 'Assa Abloy',
    rating: 3.6,
    reviews: '242 reviews',
    logoText: 'AA',
    bgColor: 'bg-slate-700',
    roleCount: 1,
    industry: 'IoT Access & CyberSecurity',
    location: 'Chennai / Onsite',
    description: 'The global leader in smart door openings, biometric security and trusted IoT credentials.',
    benefits: ['Certification Reimbursements', 'Annual Bonus', 'Onsite Gym & Cafeteria', 'Global Mobility']
  },
  {
    name: 'Stripe',
    rating: 4.4,
    reviews: '3.2K+ reviews',
    logoText: 'S',
    bgColor: 'bg-indigo-600',
    roleCount: 4,
    industry: 'FinTech & Global Payments',
    location: 'Remote / Global',
    description: 'Financial infrastructure building economic rails for the internet with high-scale APIs.',
    benefits: ['100% Remote Flexibility', 'Generous Equity Grants', 'Home Office Stipend', 'Wellness Fund']
  },
  {
    name: 'Atlassian',
    rating: 4.2,
    reviews: '2.8K+ reviews',
    logoText: 'AT',
    bgColor: 'bg-blue-600',
    roleCount: 3,
    industry: 'Dev Tools & Cloud Collaboration',
    location: 'Bengaluru / Remote',
    description: 'Makers of Jira, Confluence, and Trello empowering distributed engineering teams worldwide.',
    benefits: ['Work From Anywhere Policy', 'Mental Health Days', 'Education Fund', 'Top-tier Health Cover']
  },
  {
    name: 'Google Cloud',
    rating: 4.5,
    reviews: '5.4K+ reviews',
    logoText: 'G',
    bgColor: 'bg-rose-500',
    roleCount: 5,
    industry: 'Cloud Architecture & GenAI',
    location: 'Hyderabad / Bengaluru',
    description: 'Building planetary-scale cloud infrastructure, Kubernetes, and next-gen AI services.',
    benefits: ['Cutting-edge AI Compute Access', 'Gourmet Meals', 'Generous ESPP', 'Comprehensive Wellness']
  },
  {
    name: 'Microsoft',
    rating: 4.4,
    reviews: '6.1K+ reviews',
    logoText: 'MS',
    bgColor: 'bg-cyan-600',
    roleCount: 4,
    industry: 'Enterprise Software & Azure',
    location: 'Noida / Bengaluru / Remote',
    description: 'Empowering every person and organization on the planet to achieve more through software.',
    benefits: ['Azure Cloud Credits', 'Flexible Schedules', 'Tuition Assistance', 'Fitness Reimbursement']
  },
  {
    name: 'Adobe',
    rating: 4.3,
    reviews: '2.5K+ reviews',
    logoText: 'AD',
    bgColor: 'bg-red-600',
    roleCount: 3,
    industry: 'Creative Cloud & Document AI',
    location: 'Noida / Hybrid',
    description: 'Changing the world through digital experiences, creative tools, and web intelligence.',
    benefits: ['Creative Suite Subscription', 'Sabbatical Leave', 'Health Perks', 'Annual Bonus']
  }
];

const CandidateDashboard = () => {
  const { user } = useAuth();

  // Dynamic jobs list from persistent Job Store
  const [jobsList, setJobsList] = useState(() => getStoredJobs());

  // Active view mode: 'jobs' (Live Openings) | 'guide' (Complete Preparation Guide)
  const [activeMainTab, setActiveMainTab] = useState('jobs');

  // Track filter in Jobs view: 'ALL' | 'HR_UPLOADED' | 'WEB' | 'DATA' | 'ADVANCED'
  const [selectedTrack, setSelectedTrack] = useState('ALL');

  // Selected guide role for the Complete Preparation Guide tab
  const [selectedGuideRoleId, setSelectedGuideRoleId] = useState('role-frontend');

  // Modal selection for role details & complete prep guide
  const [selectedJob, setSelectedJob] = useState(null);

  // Modal selection for company details & view all companies
  const [showAllCompaniesModal, setShowAllCompaniesModal] = useState(false);
  const [selectedCompanyModal, setSelectedCompanyModal] = useState(null);

  // Search input
  const [searchQuery, setSearchQuery] = useState('');

  // 1-Click apply state
  const [appliedJobs, setAppliedJobs] = useState(() => {
    const apps = getAppliedApplications();
    const map = {};
    apps.forEach(a => {
      map[a.jobId] = true;
    });
    return map;
  });

  // Notification alert when application is submitted
  const [justAppliedJob, setJustAppliedJob] = useState(null);

  // Disability & Inclusion card disappearance state
  const [disabilityStatus, setDisabilityStatus] = useState('none');
  const [isDiversitySubmitted, setIsDiversitySubmitted] = useState(() => {
    return localStorage.getItem('fairhire_diversity_submitted') === 'true';
  });

  // Interactive General Checklist State
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fairhire_prep_checklist');
      return saved ? JSON.parse(saved) : { 1: true, 3: true };
    } catch (e) {
      return { 1: true, 3: true };
    }
  });

  const toggleChecklist = (step) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [step]: !prev[step] };
      localStorage.setItem('fairhire_prep_checklist', JSON.stringify(updated));
      return updated;
    });
  };

  // Real-time synchronization with Job Store & HR Uploads
  const [isProfileFrozen, setIsProfileFrozen] = useState(() => {
    const uid = user?._id || user?.id || 'guest';
    return localStorage.getItem(`fairhire_profile_frozen_${uid}`) === 'true';
  });

  useEffect(() => {
    const syncJobs = () => {
      setJobsList(getStoredJobs());
    };

    const handleProfileUpdate = () => {
      const uid = user?._id || user?.id || 'guest';
      setIsProfileFrozen(localStorage.getItem(`fairhire_profile_frozen_${uid}`) === 'true');
    };

    window.addEventListener('fairhire_jobs_updated', syncJobs);
    window.addEventListener('fairhire_profile_updated', handleProfileUpdate);
    window.addEventListener('storage', syncJobs);
    window.addEventListener('storage', handleProfileUpdate);

    return () => {
      window.removeEventListener('fairhire_jobs_updated', syncJobs);
      window.removeEventListener('fairhire_profile_updated', handleProfileUpdate);
      window.removeEventListener('storage', syncJobs);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, []);

  const handleDisabilitySubmit = (e) => {
    if (e) e.preventDefault();
    setIsDiversitySubmitted(true);
    localStorage.setItem('fairhire_diversity_submitted', 'true');
  };

  const handleApplyToJob = async (role, e) => {
    if (e) e.stopPropagation();

    // 1. Save to candidate applicationStore
    applyToJobStore(role, user);

    // 2. Increment applicant count in unified jobStore
    incrementJobApplicantCount(role.id);

    // 3. Register in candidateApi for recruiter pipeline
    try {
      await candidateApi.applyCandidate({
        jobId: role.id,
        targetRole: role.title,
        fullName: user?.name || 'Alex Morgan',
        email: user?.email || 'alex.morgan@example.com',
        experience: role.experience || '3 years',
        degree: role.degree || "Bachelor's Degree",
        skills: role.tags || role.skills || []
      });
    } catch (err) {
      console.warn('Candidate sync error', err);
    }

    setAppliedJobs(prev => ({ ...prev, [role.id]: true }));
    setJustAppliedJob(role);

    setTimeout(() => {
      setJustAppliedJob(prev => (prev?.id === role.id ? null : prev));
    }, 6000);
  };

  // Track counts
  const hrUploadedCount = jobsList.filter(j => j.isHrUploaded).length;
  const webCount = jobsList.filter(j => j.trackId === 'WEB').length;
  const dataCount = jobsList.filter(j => j.trackId === 'DATA').length;
  const advCount = jobsList.filter(j => j.trackId === 'ADVANCED').length;

  const filteredRoles = jobsList.filter((job) => {
    if (selectedTrack === 'HR_UPLOADED') {
      if (!job.isHrUploaded) return false;
    } else if (selectedTrack !== 'ALL' && job.trackId !== selectedTrack) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = job.title?.toLowerCase().includes(q);
      const companyMatch = job.company?.toLowerCase().includes(q);
      const descMatch = job.description?.toLowerCase().includes(q);
      const tagsMatch = (job.tags || job.skills || []).some(t => t.toLowerCase().includes(q));
      return titleMatch || companyMatch || descMatch || tagsMatch;
    }
    return true;
  });

  const filterTabs = [
    { id: 'ALL', label: `All Openings (${jobsList.length})` },
    ...(hrUploadedCount > 0
      ? [{ id: 'HR_UPLOADED', label: `✨ HR Uploaded (${hrUploadedCount})`, isSpecial: true }]
      : []),
    { id: 'WEB', label: `🌐 Web & App Dev (${webCount})` },
    { id: 'DATA', label: `🗄️ Data & Infra (${dataCount})` },
    { id: 'ADVANCED', label: `🧠 Advanced Eng (${advCount})` }
  ];

  // Active guide role object
  const activeGuideRole = PREPARATION_GUIDE_ROLES.find(r => r.id === selectedGuideRoleId) || PREPARATION_GUIDE_ROLES[0];
  const completedChecklistCount = Object.values(checkedItems).filter(Boolean).length;
  const checklistProgressPercent = Math.round((completedChecklistCount / GENERAL_PREPARATION_CHECKLIST.length) * 100);

  return (
    <DashboardLayout>
      {/* Header */}
      <PageHeader
        title={`Welcome back, ${(user?.name || 'Alex').split(' ')[0]} 👋`}
        subtitle="Complete Software Engineering Preparation Guide, interview rounds breakdown, and verified live job openings."
        actions={
          <div className="flex items-center gap-2.5">
            <Link to="/candidate/profile">
              <Button variant="gradient" size="sm" icon={isProfileFrozen ? Award : Sparkles}>
                {isProfileFrozen ? "Profile & Rating (9.4)" : "Profile Wizard"}
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-8">

        {/* ================= TOP PRIMARY NAVIGATION TOGGLE ================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveMainTab('jobs')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeMainTab === 'jobs'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              <span>Live Job Openings ({jobsList.length})</span>
              {hrUploadedCount > 0 && (
                <span className="bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                  {hrUploadedCount} HR
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('guide')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${activeMainTab === 'guide'
                ? 'bg-navy-900 text-white shadow-xs'
                : 'bg-slate-50 text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                }`}
            >
              <BookOpen className="w-4 h-4 text-teal-400" />
              <span>Complete Preparation Guide (7 Roles)</span>
              <span className="bg-teal-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-black">
                Playbook
              </span>
            </button>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-2 self-end sm:self-auto pr-3">
            <span className="font-semibold text-navy-900">General Readiness:</span>
            <span className="font-bold text-teal-600">{completedChecklistCount}/{GENERAL_PREPARATION_CHECKLIST.length} Completed</span>
          </div>
        </div>

        {/* ================= APPLICATION SUBMITTED LIVE NOTIFICATION BANNER ================= */}
        {justAppliedJob && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-emerald-400/30 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                    Application Submitted
                  </span>
                  <span className="text-xs text-emerald-100">• Live Tracking Active</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white mt-1">
                  You applied for {justAppliedJob.title} at {justAppliedJob.company}
                </h4>
                <p className="text-xs text-teal-100 mt-0.5">
                  Your verified profile & semantic match score have moved to the hiring committee queue.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 self-end md:self-auto">
              <Link to="/candidate/status">
                <button className="px-5 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-extrabold shadow-md transition-all flex items-center gap-1.5 cursor-pointer">
                  <span>View Progress in Status Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
              <button
                type="button"
                onClick={() => setJustAppliedJob(null)}
                className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                title="Dismiss"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ================= VIEW MODE 1: COMPLETE PREPARATION GUIDE ================= */}
        {activeMainTab === 'guide' && (
          <div className="space-y-8 animate-fadeIn">

            {/* Guide Header Card */}
            <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                    <span>Official Complete Preparation Guide</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    Software Engineering Roles — Complete Preparation Guide
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                    Detailed blueprint of mandatory knowledge, required skills, typical interview rounds (4–6 stages), recommended certifications, and actionable preparation roadmaps across all 7 major industry tracks.
                  </p>
                </div>

                {/* Checklist Quick Meter */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shrink-0 sm:min-w-[220px]">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span>Preparation Checklist:</span>
                    <span className="text-teal-300">{completedChecklistCount}/{GENERAL_PREPARATION_CHECKLIST.length} ({checklistProgressPercent}%)</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-teal-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${checklistProgressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Role Selection Tabs */}
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-2">
                {PREPARATION_GUIDE_ROLES.map(role => (
                  <button
                    key={role.id}
                    onClick={() => setSelectedGuideRoleId(role.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${selectedGuideRoleId === role.id
                      ? 'bg-teal-500 text-white shadow-md scale-105'
                      : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                      }`}
                  >
                    <span>{role.icon}</span>
                    <span>{role.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Role Detailed Guide Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-8">

              {/* Role Hero Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-200 text-2xl flex items-center justify-center shrink-0 shadow-inner">
                    {activeGuideRole.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                        {activeGuideRole.trackBadge}
                      </span>
                      <span className="text-xs text-slate-400">
                        {activeGuideRole.interviewRounds.length} Typical Rounds
                      </span>
                    </div>
                    <h3 className="text-2xl font-black text-navy-900 tracking-tight mt-1">
                      {activeGuideRole.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(activeGuideRole);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply to Active Openings</span>
                  </button>
                </div>
              </div>

              {/* Grid: Mandatory Knowledge vs Required Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Mandatory Knowledge */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                        📖
                      </div>
                      <h4 className="text-sm font-extrabold text-navy-900 uppercase tracking-wider">
                        Mandatory Knowledge
                      </h4>
                    </div>
                    <ul className="space-y-2.5 mt-4">
                      {activeGuideRole.mandatoryKnowledge.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 2. Required Skills */}
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs">
                        ⚡
                      </div>
                      <h4 className="text-sm font-extrabold text-navy-900 uppercase tracking-wider">
                        Required Skills
                      </h4>
                    </div>
                    <ul className="space-y-2.5 mt-4">
                      {activeGuideRole.requiredSkills.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* 3. Typical Interview Rounds */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                    🎯
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-navy-900">
                      Typical Interview Rounds ({activeGuideRole.interviewRounds.length} Rounds)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Standard hiring pipeline stages expected at leading tech firms and high-growth startups.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeGuideRole.interviewRounds.map((round) => (
                    <div
                      key={round.round}
                      className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-teal-400 hover:shadow-sm transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-navy-900 text-white font-mono">
                          Round {round.round}
                        </span>
                      </div>
                      <h5 className="font-extrabold text-navy-900 text-sm">
                        {round.name}
                      </h5>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {round.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recommended Courses / Certifications */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                    🎓
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-navy-900">
                      Recommended Courses & Certifications
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Top-rated accreditations and curriculum to clear the technical threshold.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeGuideRole.recommendedCourses.map((c, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-teal-50/20 hover:border-teal-300 transition-all flex flex-col justify-between space-y-3"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.badgeColor}`}>
                            {c.provider}
                          </span>
                          <span className="text-[10px] text-slate-500 font-semibold">{c.type}</span>
                        </div>
                        <h6 className="font-bold text-navy-900 text-xs leading-snug">
                          {c.title}
                        </h6>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert(`Opening syllabus and study modules for ${c.title}.`)}
                        className="w-full py-1.5 rounded-lg bg-white hover:bg-navy-900 hover:text-white border border-slate-200 text-[11px] font-bold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View Syllabus</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Actionable Steps to Prepare */}
              <div className="p-6 rounded-2xl bg-teal-50/40 border border-teal-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-teal-500 text-white flex items-center justify-center font-bold text-xs">
                    🚀
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-teal-900">
                    Steps to Prepare for {activeGuideRole.title}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {activeGuideRole.stepsToPrepare.map((step, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-white border border-teal-200/80 text-xs space-y-1">
                      <div className="flex items-center gap-2 font-black text-teal-700">
                        <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px]">
                          {idx + 1}
                        </span>
                        <span>Step {idx + 1}</span>
                      </div>
                      <p className="text-slate-700 text-[11px] leading-relaxed pt-1">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ================= GENERAL PREPARATION CHECKLIST (APPLIES TO ALL ROLES) ================= */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <ListChecks className="w-5 h-5 text-teal-600" />
                    <h3 className="text-lg sm:text-xl font-extrabold text-navy-900 tracking-tight">
                      General Preparation Checklist (Applies to All Roles)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Track your foundational software engineering readiness. Check items off as you complete them.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    {completedChecklistCount} of {GENERAL_PREPARATION_CHECKLIST.length} Completed
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {GENERAL_PREPARATION_CHECKLIST.map((item) => {
                  const isChecked = Boolean(checkedItems[item.step]);
                  return (
                    <div
                      key={item.step}
                      onClick={() => toggleChecklist(item.step)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${isChecked
                        ? 'bg-teal-50/40 border-teal-300'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          type="button"
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-all ${isChecked
                            ? 'bg-teal-600 text-white'
                            : 'border-2 border-slate-300 bg-white text-transparent hover:border-teal-400'
                            }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                              Step {item.step}
                            </span>
                            <span className="text-[10px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.2 rounded border border-teal-200">
                              {item.category}
                            </span>
                          </div>
                          <h5 className={`text-sm font-bold mt-0.5 ${isChecked ? 'text-teal-900 line-through' : 'text-slate-800'}`}>
                            {item.action}
                          </h5>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {item.details}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                *Note: Round counts and formats vary by company size and seniority level — startups often compress this into 2–3 rounds, while large tech companies may run 5–6.
              </div>
            </section>

          </div>
        )}

        {/* ================= VIEW MODE 2: LIVE JOB OPENINGS & HR UPLOADS ================= */}
        {activeMainTab === 'jobs' && (
          <div className="space-y-8 animate-fadeIn">

            {/* 2. DIVERSITY & INCLUSION CARD */}
            {!isDiversitySubmitted && (
              <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm transition-all duration-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-3 py-0.5 rounded-full">
                    Diversity & inclusion
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-navy-900 mt-2">
                  Companies want to build inclusive teams, help us identify your disability status for better jobs.
                </h3>

                <form onSubmit={handleDisabilitySubmit} className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setDisabilityStatus('has_disability')}
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${disabilityStatus === 'has_disability'
                      ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                  >
                    I have a disability
                  </button>

                  <button
                    type="button"
                    onClick={() => setDisabilityStatus('none')}
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${disabilityStatus === 'none'
                      ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                  >
                    I don't have a disability
                  </button>

                  <button
                    type="button"
                    onClick={() => setDisabilityStatus('prefer_not_to_say')}
                    className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${disabilityStatus === 'prefer_not_to_say'
                      ? 'bg-navy-900 text-white border-navy-900 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                  >
                    Prefer not to say
                  </button>

                  <button
                    type="submit"
                    className="ml-auto px-6 py-2 rounded-xl bg-slate-100 hover:bg-navy-900 hover:text-white text-slate-700 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Submit
                  </button>
                </form>
              </section>
            )}

            {/* 3. SOFTWARE INDUSTRY ROLES & TRACKS */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              {/* Section Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
                      Software Industry Roles ({filteredRoles.length})
                    </h3>
                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      Live Openings
                    </span>
                    {hrUploadedCount > 0 && (
                      <span className="text-[11px] font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-purple-600" />
                        <span>{hrUploadedCount} Uploaded by HR</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Select any role to view tailored evaluation screening criteria and <strong>courses to crack technical rounds</strong>.
                  </p>
                </div>

                {/* Track Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {filterTabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setSelectedTrack(tab.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${selectedTrack === tab.id
                        ? tab.isSpecial
                          ? 'bg-purple-700 text-white shadow-xs'
                          : 'bg-navy-900 text-white shadow-xs'
                        : tab.isSpecial
                          ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search bar */}
              <div className="pt-4 pb-2">
                <div className="relative max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search openings by role, company, skills, keywords..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Job Roles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
                {filteredRoles.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => setSelectedJob(role)}
                    className={`p-5 rounded-2xl bg-white border transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden ${role.isHrUploaded
                      ? 'border-purple-200 hover:border-purple-400 hover:shadow-lg bg-gradient-to-b from-purple-50/20 to-white'
                      : 'border-slate-200 hover:border-teal-400 hover:shadow-lg'
                      }`}
                  >
                    <div>
                      {/* Track Badge & Posted time */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                            {role.trackBadge || 'Engineering'}
                          </span>
                          {role.isHrUploaded && (
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
                              <Sparkles className="w-3 h-3 text-purple-600" />
                              <span>HR Uploaded</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {role.postedTime || 'Recently'}
                        </span>
                      </div>

                      {/* Company Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-xl ${role.companyBg || 'bg-teal-600'} text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0`}>
                          {role.companyInitial || (role.company?.charAt(0) || 'J')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className="font-bold text-slate-900 text-sm line-clamp-1">{role.company || 'FairHire Enterprise'}</h5>
                            <span className="text-[11px] text-amber-500 font-bold flex items-center gap-0.5">
                              ★ {role.rating || 4.5}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {role.location}
                          </p>
                        </div>
                      </div>

                      {/* Role Title */}
                      <h4 className="text-base font-extrabold text-navy-900 group-hover:text-teal-600 transition-colors">
                        {role.title}
                      </h4>

                      <p className="text-xs text-teal-700 font-bold mt-1">
                        {role.salary || 'Competitive'}
                      </p>

                      {/* Description / Screening criteria */}
                      <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                        {role.description}
                      </p>

                      {/* Screening Focus Callout */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
                        <span className="font-bold text-navy-900 block mb-0.5">Screened for:</span>
                        <span className="text-slate-600 line-clamp-2">{role.screeningCriteria}</span>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {(role.tags || role.skills || []).slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold"
                          >
                            {tag}
                          </span>
                        ))}
                        {(role.tags || role.skills || []).length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-400 text-[10px] font-semibold">
                            +{(role.tags || role.skills || []).length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Bar: Action Row with View Courses and Direct Apply */}
                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-1 rounded-lg border border-teal-200">
                        <BookOpen className="w-3 h-3 text-teal-600" />
                        {(role.recommendedCourses || role.courses || []).length || 3} Prep Modules
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedJob(role);
                          }}
                          className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-slate-600 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          Prep Guide & Details
                        </button>

                        {appliedJobs[role.id] ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Applied</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={(e) => handleApplyToJob(role, e)}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                          >
                            <Send className="w-3 h-3" />
                            <span>Apply Now</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredRoles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-sm font-bold text-slate-700">No positions found matching your filter or query.</p>
                  <button
                    type="button"
                    onClick={() => { setSelectedTrack('ALL'); setSearchQuery(''); }}
                    className="mt-3 text-xs text-teal-600 font-bold underline cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </section>

            {/* 4. TOP COMPANIES SECTION */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-extrabold text-navy-900 tracking-tight">
                    Top companies
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Explore active hiring partners and enterprise engineering teams</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllCompaniesModal(true);
                  }}
                  className="text-xs font-bold text-teal-600 hover:text-navy-900 bg-teal-50 hover:bg-teal-100/80 px-3 py-1.5 rounded-xl border border-teal-200/60 transition-colors cursor-pointer"
                >
                  View all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-5">
                {TOP_COMPANIES.slice(0, 5).map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all text-center flex flex-col items-center justify-between bg-slate-50/50 hover:bg-white"
                  >
                    <div>
                      <div className={`w-14 h-14 rounded-2xl ${comp.bgColor} text-white flex items-center justify-center font-black text-lg mx-auto shadow-sm mb-3`}>
                        {comp.logoText}
                      </div>
                      <h4 className="font-bold text-navy-900 text-sm line-clamp-1">
                        {comp.name}
                      </h4>
                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mt-1">
                        <span className="font-bold text-amber-500">★ {comp.rating}</span>
                        <span>|</span>
                        <span className="text-[11px]">{comp.reviews}</span>
                      </div>
                      <span className="inline-block mt-2 text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {comp.industry}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedCompanyModal(comp);
                      }}
                      className="mt-4 w-full py-2 rounded-xl text-xs font-bold text-teal-600 hover:bg-teal-50 border border-teal-200 transition-colors cursor-pointer"
                    >
                      Company Profile & Roles
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

      </div>

      {/* ================= 5. INTERACTIVE MODAL: COMPLETE ROLE PREPARATION GUIDE & APPLY ================= */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col">

            {/* Modal Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white sticky top-0 z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${selectedJob.companyBg || 'bg-teal-600'} text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0`}>
                    {selectedJob.companyInitial || (selectedJob.company?.charAt(0) || 'J')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        {selectedJob.trackBadge || 'Engineering'}
                      </span>
                      {selectedJob.isHrUploaded && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-600" />
                          <span>HR Uploaded Position</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight mt-1">
                      {selectedJob.title} — Preparation Guide & Specifications
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="font-bold text-slate-800">{selectedJob.company || 'FairHire Enterprise'}</span>
                      <span>•</span>
                      <span>{selectedJob.location}</span>
                      <span>•</span>
                      <span className="font-bold text-teal-600">{selectedJob.salary || 'Competitive'}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedJob(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-7">

              {/* Role Scope & Screening Criteria */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Candidate Evaluation Focus
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 font-medium leading-relaxed">
                  {selectedJob.description}
                </p>
                <div className="pt-2 border-t border-slate-200/80 text-xs text-teal-800 font-semibold flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Resume Screen: {selectedJob.screeningCriteria}</span>
                </div>
              </div>

              {/* Mandatory Knowledge & Required Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800 mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Mandatory Knowledge</span>
                  </h4>
                  <ul className="space-y-2">
                    {(selectedJob.mandatoryKnowledge || [
                      'Core software engineering principles and architectural patterns',
                      'Object-oriented and functional paradigm proficiency',
                      'API contracts and system performance profiling',
                      'Security and zero-bias data handling basics'
                    ]).map((item, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800 mb-2.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Required Skills</span>
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {(selectedJob.requiredSkills || selectedJob.tags || selectedJob.skills || []).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-[11px] font-semibold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Courses & Certifications */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Recommended Courses & Certifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(selectedJob.recommendedCourses || selectedJob.courses || []).map((course, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-teal-400 transition-all space-y-1.5"
                    >
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-white border-slate-200 text-teal-800">
                        {course.provider}
                      </span>
                      <h5 className="font-bold text-slate-900 text-xs">{course.title}</h5>
                      <p className="text-[11px] text-slate-500">{course.type || course.interviewBenefit || 'Comprehensive study modules'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps to Prepare Roadmap */}
              {(selectedJob.stepsToPrepare || []).length > 0 && (
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                    Steps to Prepare for This Position
                  </h4>
                  <ol className="list-decimal list-inside space-y-1.5 text-xs text-slate-700">
                    {selectedJob.stepsToPrepare.map((step, idx) => (
                      <li key={idx} className="leading-relaxed font-medium">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                {appliedJobs[selectedJob.id] ? (
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Application submitted! Status updated in Live Application Tracker.
                  </span>
                ) : (
                  <span>FairHire contextual semantic AI matches your verified profile automatically.</span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
                >
                  Close
                </button>

                <Button
                  type="button"
                  variant={appliedJobs[selectedJob.id] ? 'success' : 'gradient'}
                  size="md"
                  onClick={() => handleApplyToJob(selectedJob)}
                  disabled={appliedJobs[selectedJob.id]}
                  className="w-full sm:w-auto whitespace-nowrap shadow-md cursor-pointer"
                >
                  {appliedJobs[selectedJob.id] ? '✓ Application Submitted' : '1-Click Apply with AI Match'}
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ================= 6. INTERACTIVE MODAL: ALL HIRING PARTNER COMPANIES DIRECTORY ================= */}
      {showAllCompaniesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto flex flex-col">
            
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white sticky top-0 z-10">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-[11px] font-bold text-teal-700 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-teal-600" />
                    <span>Verified Hiring Network</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
                    Top Hiring Partner Companies
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Explore active enterprise employers, tech stacks, perks, and verified open roles.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllCompaniesModal(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Companies Grid */}
            <div className="p-6 sm:p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {TOP_COMPANIES.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-lg transition-all bg-white flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3.5">
                        <div className={`w-12 h-12 rounded-xl ${comp.bgColor} text-white flex items-center justify-center font-black text-base shadow-sm`}>
                          {comp.logoText}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60">
                          <span>★ {comp.rating}</span>
                        </div>
                      </div>

                      <h4 className="font-bold text-navy-900 text-sm group-hover:text-teal-700 transition-colors">
                        {comp.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        {comp.industry}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-2">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{comp.location}</span>
                      </div>

                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                        {comp.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-teal-600">
                        {comp.roleCount} Open Positions
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAllCompaniesModal(false);
                          setSelectedCompanyModal(comp);
                        }}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-teal-50 hover:bg-teal-600 text-teal-700 hover:text-white transition-all cursor-pointer shadow-2xs"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowAllCompaniesModal(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
              >
                Close Directory
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================= 7. INTERACTIVE MODAL: SINGLE COMPANY PROFILE & CULTURE ================= */}
      {selectedCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col">
            
            {/* Header */}
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-slate-50/80 to-white sticky top-0 z-10">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl ${selectedCompanyModal.bgColor} text-white flex items-center justify-center font-black text-xl shadow-md shrink-0`}>
                    {selectedCompanyModal.logoText}
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-navy-900 tracking-tight">
                      {selectedCompanyModal.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1">
                      <span className="font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {selectedCompanyModal.industry}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-bold text-amber-500">
                        ★ {selectedCompanyModal.rating} ({selectedCompanyModal.reviews})
                      </span>
                      <span>•</span>
                      <span>{selectedCompanyModal.location}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedCompanyModal(null)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Overview */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Company Overview
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedCompanyModal.description}
                </p>
              </div>

              {/* Benefits */}
              {selectedCompanyModal.benefits && (
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <span>Employee Benefits & Culture Highlights</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedCompanyModal.benefits.map((benefit, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hiring Track */}
              <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-teal-900">Active Hiring Track</h4>
                  <p className="text-xs text-teal-700 mt-0.5">
                    {selectedCompanyModal.roleCount} verified engineering positions ready for candidate matching.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCompanyModal(null);
                    setSearchQuery(selectedCompanyModal.name.split(' ')[0]);
                  }}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  Filter Roles
                </button>
              </div>

            </div>

            {/* Footer */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedCompanyModal(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CandidateDashboard;
