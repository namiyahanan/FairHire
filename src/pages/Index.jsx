import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import Badge from '../components/common/Badge';
import {
  Sparkles,
  ShieldCheck,
  Briefcase,
  Users,
  Calendar,
  Award,
  ArrowRight,
  CheckCircle,
  Cpu,
  Layers,
  Scale,
  FileText,
  Check,
  ChevronRight,
  Zap,
  UserCheck,
  GitBranch
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { switchRole, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(ROLES.CANDIDATE);

  // Active top-level section: 'overview' | 'portals' | 'pipeline'
  const [activeSection, setActiveSection] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    return ['overview', 'portals', 'pipeline'].includes(hash) ? hash : 'overview';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'portals', 'pipeline'].includes(hash)) {
        setActiveSection(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavClick = (section) => {
    setActiveSection(section);
    window.location.hash = section;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle direct launch into any portal with login requirement
  const handleLaunchPortal = (role, targetPath) => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      switchRole(role);
      navigate(targetPath);
    }
  };

  const portals = [
    {
      id: ROLES.CANDIDATE,
      roleName: 'Candidate Portal',
      tagline: 'Merit-First Career Experience & Transparent Tracking',
      badge: 'Job Seekers & Applicants',
      badgeVariant: 'teal',
      icon: UserCheck,
      path: '/candidate',
      targetAudience: 'Software Engineers, Technical Talent, Product Designers & Career Switchers',
      mission:
        'Eliminates the traditional recruitment "black hole" and keyword-stuffing penalties. Candidates are evaluated contextually on demonstrable technical competence, project depth, and verified skills with 24/7 transparent pipeline visibility.',
      workflowSteps: [
        {
          step: '01',
          title: 'Merit Intake Profile',
          desc: 'Create verified profile showcasing career milestones, technical stack proficiencies, and portfolio repositories.'
        },
        {
          step: '02',
          title: 'Skill Taxonomy Indexing',
          desc: 'Automated semantic tagging parses experience contextually without requiring repetitive keyword gaming.'
        },
        {
          step: '03',
          title: 'Live Application Tracker',
          desc: 'Real-time telemetry across all 7 pipeline stages (Applied → Screened → Shortlisted → Interview → Offered → Hired).'
        },
        {
          step: '04',
          title: 'Self-Service Scheduling',
          desc: 'Select preferred panel interview slots with instant calendar synchronization and virtual interview room links.'
        }
      ],
      features: [
        { title: 'Proof-Over-Keywords', desc: 'Semantic evaluation rewards project impact, engineering architecture, and problem complexity.' },
        { title: 'Complete Transparency', desc: 'No ghosting; applicants track their status with live milestone feedback at every pipeline step.' },
        { title: 'Interactive Slot Booking', desc: 'Direct self-service calendar booking eliminates back-and-forth email scheduling friction.' },
        { title: 'Contextual AI Match Feedback', desc: 'Transparent role match breakdown highlights technical strengths and target qualifications.' }
      ],
      endpoints: [
        { method: 'POST', path: '/candidates/apply', desc: 'Candidate application & verified profile submission' },
        { method: 'GET', path: '/candidates/status-check', desc: 'Real-time stage check & interview slot status' },
        { method: 'POST', path: '/candidates/confirm-slot', desc: 'Locks candidate interview booking and meeting link' },
        { method: 'POST', path: '/candidates/status', desc: 'Candidate progression status webhook' }
      ],
      subRoutes: [
        { name: 'Candidate Overview', path: '/candidate', desc: 'Applicant command center & application summary' },
        { name: 'Profile Wizard', path: '/candidate/profile', desc: 'Step-by-step verified experience & portfolio' },
        { name: 'Live Application Tracker', path: '/candidate/status', desc: 'Real-time milestone tracker across all stages' },
        { name: 'Interview Slot Booking', path: '/candidate/interview', desc: 'Self-service calendar & virtual room link' }
      ],
      ctaText: 'Launch Candidate Portal',
      color: 'teal'
    },
    {
      id: ROLES.RECRUITER,
      roleName: 'Recruiter & HR Dashboard',
      tagline: 'High-Velocity Semantic Talent Triage & Pipeline Intelligence',
      badge: 'Talent Acquisition & HR Leaders',
      badgeVariant: 'navy',
      icon: Briefcase,
      path: '/recruiter',
      targetAudience: 'HR Managers, Talent Acquisition Leads, Technical Recruiters & Hiring Managers',
      mission:
        'Engineered to conquer recruitment Volume Fatigue. Contextually evaluates hundreds of candidates in minutes using semantic AI, while maintaining 100% human decision authority and EEOC 80% adverse impact parity compliance.',
      workflowSteps: [
        {
          step: '01',
          title: 'Requisition & Templates',
          desc: 'Instant job creation with auto-populating role templates (GET /job-template) and semantic matching criteria.'
        },
        {
          step: '02',
          title: 'Contextual AI Screening',
          desc: 'Evaluates resumes for semantic relevance, returning 0-100% match scores with granular skill breakdown matrices.'
        },
        {
          step: '03',
          title: 'Kanban Pipeline Triage',
          desc: 'Interactive drag-and-drop applicant management across Applied, Screened, Shortlisted, Interviewed, and Offered.'
        },
        {
          step: '04',
          title: 'Human-in-the-Loop Decision',
          desc: 'AI scores serve as recommendations; hiring, advancement, and offer decisions remain entirely in human hands.'
        }
      ],
      features: [
        { title: 'Volume Fatigue Elimination', desc: 'Processes thousands of applicants into high-signal cohorts with 4x faster turnaround.' },
        { title: 'Interactive Kanban Board', desc: 'Drag-and-drop pipeline progression with batch status triggers and candidate dossiers.' },
        { title: 'Automated Job Templates', desc: 'Pre-populates job posting criteria and technical competency matrices instantly.' },
        { title: 'AI vs. Human Decision Markers', desc: 'Strict visual separation ensures complete clarity between AI scoring and human hiring choices.' }
      ],
      endpoints: [
        { method: 'POST', path: '/jobs/post', desc: 'Publish position with semantic screening criteria' },
        { method: 'GET', path: '/job-roles', desc: 'Fetch enterprise role taxonomies and department list' },
        { method: 'GET', path: '/job-template', desc: 'Auto-populate job posting template with qualifications' },
        { method: 'POST', path: '/candidates/status', desc: 'Recruiter pipeline status progression webhook' }
      ],
      subRoutes: [
        { name: 'Recruiter Intelligence Hub', path: '/recruiter', desc: 'Pipeline telemetry, applicant volume & velocity' },
        { name: 'Pipeline Kanban Board', path: '/recruiter/candidates', desc: 'Interactive drag-and-drop candidate management' },
        { name: 'Active Job Postings', path: '/recruiter/jobs', desc: 'Manage open requisitions and department quotas' },
        { name: 'Create Job Position', path: '/recruiter/jobs/create', desc: 'Post new roles with auto-populated templates' }
      ],
      ctaText: 'Launch Recruiter Dashboard',
      color: 'navy'
    }
  ];

  const activePortalData = portals.find(p => p.id === activeTab) || portals[0];

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'portals', label: 'Role Portals' },
    { id: 'pipeline', label: 'Pipeline' }
  ];

  return (
    <div className="min-h-screen bg-surface-bg text-slate-800 flex flex-col selection:bg-teal-500 selection:text-white font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-navy-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('overview')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <img
              src="/assets/logo.jpg"
              alt="FairHire Logo"
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 shadow"
            />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white flex items-center gap-0.5">
                Fair<span className="text-teal-400">Hire</span>
              </span>
              <p className="text-[9px] uppercase tracking-widest font-semibold text-teal-300/80 -mt-0.5">
                Fair Process. Right Talent.
              </p>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 bg-navy-950/70 p-1 rounded-xl border border-navy-800/80">
            {navItems.map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-navy-800/70'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5 rounded-md hover:bg-navy-800/80 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary-gradient text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg shadow-md hover:shadow-teal-500/20 transition-all flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-center gap-1 px-3 py-2 bg-navy-950 border-t border-navy-800 overflow-x-auto">
          {navItems.map((tab) => {
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleNavClick(tab.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal-500 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Dynamic Viewport - Displays ONLY the specific selected section */}
      <main className="flex-1 flex flex-col">
        {/* 1. OVERVIEW VIEW */}
        {activeSection === 'overview' && (
          <div>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-navy-900 via-navy-800 to-navy-900 text-white pt-20 pb-24 border-b border-navy-700/50">
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-teal-500/15 blur-[120px] rounded-full pointer-events-none" />
              <div className="absolute top-1/2 right-10 w-[300px] h-[300px] bg-sky-500/10 blur-[100px] rounded-full pointer-events-none" />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-800/90 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Next-Gen Semantic Recruitment & Compliance Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
                  Fair Process. Right Talent. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-teal-300 to-sky-300">
                    Zero Volume Fatigue.
                  </span>
                </h1>

                <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
                  FairHire tackles <strong>Volume Fatigue</strong> in corporate recruitment by contextually evaluating candidates using semantic, AI-assisted matching rather than rigid keyword filters.
                </p>
              </div>
            </section>

            {/* Core Mission & The Problem Solved */}
            <section className="py-20 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                  <Badge variant="teal" size="md" icon={Scale} className="mb-3">
                    The Recruitment Paradox
                  </Badge>
                  <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
                    Solving Volume Fatigue Without Sacrificing Fairness
                  </h2>
                  <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                    Modern recruitment teams receive thousands of applications per opening. Traditional Applicant Tracking Systems (ATS) rely on dumb keyword matching—penalizing great candidates and creating severe compliance risks.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                  {/* Traditional ATS Column */}
                  <div className="p-8 rounded-2xl bg-rose-50/50 border border-rose-200/80 relative">
                    <div className="inline-flex items-center gap-2 text-rose-700 font-bold text-xs uppercase tracking-wider mb-4">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                      The Legacy Problem: Volume Fatigue
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-4">
                      Brittle Keyword Filters & Black-Box Rejections
                    </h3>
                    <ul className="space-y-3.5 text-sm text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span><strong>Keyword stuffing wins:</strong> Candidates game ATS algorithms with hidden keywords rather than actual technical capability.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span><strong>Talent dropped prematurely:</strong> Non-traditional backgrounds and career switchers are filtered out automatically.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span><strong>EEOC liability risk:</strong> No automated checks for Adverse Impact or compliance with the 4/5ths (80%) hiring rule.</span>
                      </li>
                    </ul>
                  </div>

                  {/* FairHire Solution Column */}
                  <div className="p-8 rounded-2xl bg-teal-50/60 border border-teal-200/90 relative shadow-sm">
                    <div className="inline-flex items-center gap-2 text-teal-800 font-bold text-xs uppercase tracking-wider mb-4">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      The FairHire Solution
                    </div>
                    <h3 className="text-xl font-bold text-navy-900 mb-4">
                      Contextual Semantic AI with Human-in-the-Loop
                    </h3>
                    <ul className="space-y-3.5 text-sm text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <span><strong>Semantic resume comprehension:</strong> Evaluates project depth, system impact, and transferable competencies.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <span><strong>Built-in 80% Rule Analytics:</strong> Proactive compliance metrics compute Adverse Impact Ratio before offers are finalized.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                        <span><strong>AI assists, humans decide:</strong> Clear visual boundaries between AI match scores and human hiring decisions.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Technology Stack Badges */}
            <section className="py-16 bg-surface-bg border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mb-6">
                  Engineered with Modern Production-Grade Technologies
                </p>
                <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-slate-600 font-medium text-sm">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500"></span>
                    React 18
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                    Vite 5 Bundler
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                    Tailwind CSS v3
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    Lucide Icons
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
                    React Router DOM v6
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    Context API State
                  </span>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* 2. ROLE PORTALS VIEW */}
        {activeSection === 'portals' && (
          <section className="py-16 bg-surface-bg flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-10">
                <Badge variant="navy" size="md" icon={Layers} className="mb-3">
                  Role-Based Architecture
                </Badge>
                <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
                  Tailored Portals: Candidate & Recruiter Experience
                </h2>
                <p className="mt-3 text-slate-600 leading-relaxed text-sm sm:text-base">
                  FairHire provides dedicated interfaces tailored to the distinct needs of job applicants and HR recruitment teams.
                </p>
              </div>

              {/* Role Navigation Pills */}
              <div className="flex items-center justify-center gap-3 max-w-md mx-auto mb-10 p-1.5 bg-slate-200/90 rounded-2xl shadow-inner">
                {portals.map((p) => {
                  const Icon = p.icon;
                  const isSelected = activeTab === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setActiveTab(p.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        isSelected
                          ? 'bg-navy-900 text-white shadow-md scale-[1.02]'
                          : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span>{p.roleName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Portal Showcase Card */}
              <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transition-all">
                {/* Card Header */}
                <div className="p-8 sm:p-10 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-navy-900 text-teal-400 flex items-center justify-center shadow-md shrink-0">
                        {React.createElement(activePortalData.icon, { className: 'w-8 h-8' })}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                            {activePortalData.roleName}
                          </h3>
                          <Badge variant={activePortalData.badgeVariant}>{activePortalData.badge}</Badge>
                        </div>
                        <p className="text-sm font-semibold text-teal-600 mt-1">
                          {activePortalData.tagline}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0 bg-white sm:bg-transparent p-3.5 sm:p-0 rounded-xl border sm:border-0 border-slate-200">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                        Target Audience
                      </span>
                      <span className="text-xs font-semibold text-navy-900 block mt-0.5 max-w-[260px]">
                        {activePortalData.targetAudience}
                      </span>
                    </div>
                  </div>

                  {/* Mission & Purpose Callout Banner */}
                  <div className="mt-8 p-5 rounded-2xl bg-slate-100/90 border border-slate-200">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      Role Mission & Value Proposition
                    </span>
                    <p className="text-slate-800 text-xs sm:text-sm mt-2 font-medium leading-relaxed">
                      {activePortalData.mission}
                    </p>
                  </div>
                </div>

                {/* Card Body - Clean Full Width Breakdown */}
                <div className="p-8 sm:p-10 space-y-10">
                  {/* 4-Step Core Workflow */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Structured Role Workflow (4 Key Phases)
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {activePortalData.workflowSteps.map((ws, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-400/80 hover:bg-teal-50/20 transition-all flex flex-col justify-between group"
                        >
                          <div>
                            <div className="text-xs font-mono font-bold text-teal-600 mb-2">
                              PHASE {ws.step}
                            </div>
                            <h5 className="font-bold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">
                              {ws.title}
                            </h5>
                            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                              {ws.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Key Capabilities & Features */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        Key Capabilities & Platform Features
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {activePortalData.features.map((feat, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 text-xs sm:text-sm"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                          <div>
                            <strong className="text-slate-900 font-semibold block sm:inline">{feat.title}: </strong>
                            <span className="text-slate-600">{feat.desc}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 3. PIPELINE VIEW */}
        {activeSection === 'pipeline' && (
          <section className="py-16 bg-white flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-14">
                <Badge variant="teal" size="md" icon={GitBranch} className="mb-3">
                  Kanban Pipeline
                </Badge>
                <h2 className="text-3xl font-extrabold text-navy-900 tracking-tight">
                  Full Lifecycle Recruitment Journey
                </h2>
                <p className="mt-4 text-slate-600 leading-relaxed text-sm sm:text-base">
                  Candidates smoothly transition through structured stages with continuous semantic evaluation and bias protection.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 max-w-6xl mx-auto">
                {[
                  { step: '01', title: 'Applied', desc: 'Application & profile intake', icon: FileText, role: 'Candidate' },
                  { step: '02', title: 'Screened', desc: 'Contextual AI matching score', icon: Cpu, role: 'AI Engine' },
                  { step: '03', title: 'Shortlisted', desc: 'Recruiter human review', icon: UserCheck, role: 'Recruiter' },
                  { step: '04', title: 'Scheduled', desc: 'Self-service slot lock', icon: Calendar, role: 'Candidate' },
                  { step: '05', title: 'Interviewed', desc: 'Rubric scoring & LLM prompts', icon: Users, role: 'Interviewer' },
                  { step: '06', title: 'Offered', desc: 'Offer generation & parity check', icon: Award, role: 'HR & Admin' },
                  { step: '07', title: 'Hired / End', desc: 'Onboarding & audit archival', icon: CheckCircle, role: 'All' }
                ].map((st, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between hover:border-teal-400 hover:shadow-md transition-all group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                        <span className="font-bold text-teal-600 text-sm">{st.step}</span>
                        <span className="text-[10px] bg-slate-200/80 px-2 py-0.5 rounded text-slate-700 font-semibold">{st.role}</span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-teal-600 transition-colors">
                        {st.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{st.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-navy-900 text-slate-400 py-12 text-sm border-t border-navy-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-navy-800">
            <div
              onClick={() => handleNavClick('overview')}
              className="flex items-center gap-3 cursor-pointer"
            >
              <img
                src="/assets/logo.jpg"
                alt="FairHire Logo"
                className="w-8 h-8 rounded-lg object-contain bg-white p-0.5"
              />
              <span className="text-lg font-bold text-white tracking-tight">
                Fair<span className="text-teal-400">Hire</span>
              </span>
              <span className="text-xs text-slate-500 pl-2 border-l border-navy-700">
                Fair Process. Right Talent.
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
              {navItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleNavClick(tab.id)}
                  className={`transition-colors ${
                    activeSection === tab.id ? 'text-teal-400 font-semibold' : 'hover:text-teal-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <span className="text-slate-600 hidden sm:inline">|</span>
              <button
                onClick={() => handleLaunchPortal(ROLES.CANDIDATE, '/candidate')}
                className="hover:text-teal-400 transition-colors"
              >
                Candidate Portal
              </button>
              <button
                onClick={() => handleLaunchPortal(ROLES.RECRUITER, '/recruiter')}
                className="hover:text-teal-400 transition-colors"
              >
                Recruiter Hub
              </button>
              <Link to="/login" className="hover:text-teal-400 transition-colors">
                Login
              </Link>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <p>© 2026 FairHire Platform. Designed to eliminate volume fatigue with semantic fairness.</p>
            <p>Compliance Standards: EEOC 4/5ths Rule • Adverse Impact Ratio Monitoring</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
