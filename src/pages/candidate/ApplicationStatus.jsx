import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  getAppliedApplications,
  isJobAlreadyApplied
} from '../../services/applicationStore';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  Building2,
  MapPin,
  ShieldCheck,
  BookOpen,
  PlayCircle,
  FileText,
  UserCheck,
  Code2,
  Trophy,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Layers,
  Search,
  Award,
  Zap,
  Check,
  Info,
  X,
  Send,
  Terminal,
  FileCheck,
  Calendar,
  Lock,
  Unlock,
  ThumbsDown
} from 'lucide-react';
import {
  getCandidateHiringState,
  candidateAttendRound
} from '../../services/candidateHiringStore';
import { getCompanyRounds } from '../../services/requirementsStore';
import AiAptitudeAssessment from '../../components/candidates/AiAptitudeAssessment';

const ApplicationStatus = () => {
  const [applications, setApplications] = useState([]);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [activeStageTab, setActiveStageTab] = useState(null);

  const activeCandidateId = (typeof window !== 'undefined' ? localStorage.getItem('fairhire_active_candidate_id') : null) || 'CAND-8492';

  // Candidate hiring progression state
  const [candidateHiring, setCandidateHiring] = useState(() => getCandidateHiringState(activeCandidateId));
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [assessmentSubmitting, setAssessmentSubmitting] = useState(false);
  const [assessmentCompletedSuccess, setAssessmentCompletedSuccess] = useState(null);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);

  // ── Mock Prep Pack Selection & Cheatsheet Drawer State ────────────────────
  const [selectedMockPack, setSelectedMockPack] = useState('Accenture');
  const [activeCheatsheetDrawer, setActiveCheatsheetDrawer] = useState(null);

  const MOCK_PACK_OPTIONS = [
    { id: 'Accenture', name: 'Accenture Series', pattern: 'Accenture Pattern Core', icon: '⚡' },
    { id: 'Cognizant', name: 'Cognizant Track', pattern: 'GenC Next Diagnostic', icon: '🎯' },
    { id: 'TCS', name: 'TCS Ninja/Digital', pattern: 'NQT Advanced Pattern', icon: '🚀' },
    { id: 'Zoho', name: 'Zoho Screening', pattern: 'Systems Screening Pattern', icon: '🧩' }
  ];

  const getMockFrameworkModules = (packName) => [
    {
      id: 'card-1',
      title: 'High-Frequency Logical Matrix Blueprint',
      headerParams: `5-Min Read • ${packName || 'Accenture'} Pattern Core`,
      headerBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      category: 'Logical Reasoning & Deduction',
      focus: 'Syllogisms, Venn Diagrams, and Seating Arrangements.',
      impact: 'Eliminates elimination ambiguity on high-weightage deductive logic puzzles.',
      tags: ['Syllogisms (Euler Circles)', 'Venn Inclusions', 'Circular & Linear Arrays'],
      drawerContent: {
        summary: `Core deductive logic formulas & step-by-step resolution patterns tailored for ${packName || 'Accenture'} assessments.`,
        keyRules: [
          { rule: 'All A are B + All B are C', result: 'Conclusion: All A are C (Definite True)' },
          { rule: 'Some A are B + No B is C', result: 'Conclusion: Some A are not C (Definite True)' },
          { rule: 'Venn Triple Intersection Rule', result: 'Total = n(A) + n(B) + n(C) - n(A∩B) - n(B∩C) - n(C∩A) + n(A∩B∩C)' },
          { rule: 'Circular Seating Direction Strategy', result: 'Facing center = Right is anti-clockwise, Left is clockwise. Start always from bottom position.' }
        ],
        speedHack: 'For 8-person circular seating with alternate facing, immediately fill definite opposite-gender or fixed-anchor positions first.',
        sampleProblem: 'Statements: All developers are engineers. Some engineers are architects.\nConclusion I: Some developers are architects. (Cannot be determined).\nConclusion II: Some engineers are developers. (Definitely True).'
      }
    },
    {
      id: 'card-2',
      title: 'Quantitative Latency & Speed Tricks',
      headerParams: '8-Min Read • Formula Sheet',
      headerBadgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      category: 'Quantitative Ability & Arithmetic',
      focus: 'Work-time constraints, averages, and quick calculation shortcuts.',
      impact: 'Reduces per-question solve time from 90s to under 35s using LCM & percentage fractions.',
      tags: ['Work & Pipe LCM Method', 'Weighted Average Alligation', 'Square & Root Shortcuts'],
      drawerContent: {
        summary: `High-speed quantitative calculation templates & memorization sheet for ${packName || 'Accenture'}.`,
        keyRules: [
          { rule: 'Work & Time (A in x days, B in y days)', result: 'Total Work = LCM(x, y); Combined Rate = (Total / x) + (Total / y)' },
          { rule: 'Average Speed Harmonic Mean', result: 'Equal distance: Avg Speed = 2xy / (x + y)' },
          { rule: 'Percentage to Fraction Conversion', result: '1/6 = 16.67% • 1/7 = 14.28% • 1/8 = 12.5% • 1/12 = 8.33% • 1/14 = 7.14%' },
          { rule: 'Successive Percentage Changes (x% & y%)', result: 'Net Change = (x + y + (xy / 100))%' }
        ],
        speedHack: 'For pipes and cisterns with leaks, treat the leak as a negative hourly efficiency and subtract directly from total input throughput.',
        sampleProblem: 'Pipe A fills in 12h, Pipe B fills in 15h, Drain C empties in 20h.\nLCM = 60 units. Rate A = +5, Rate B = +4, Rate C = -3.\nCombined Rate = 5 + 4 - 3 = +6 units/hr.\nTotal Time = 60 / 6 = 10 hours.'
      }
    },
    {
      id: 'card-3',
      title: 'Technical Syntax & Verbal Spotting',
      headerParams: '10-Min Read • Bug Detection',
      headerBadgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      category: 'Verbal & Technical Diagnostics',
      focus: 'Real-time error identification and technical vocabulary tracking.',
      impact: 'Diagnoses grammar traps, contextual idioms, and programming syntax bugs with 99% accuracy.',
      tags: ['Dangling Modifier Detection', 'Subject-Verb Collective Traps', 'Off-by-One Pointer Faults'],
      drawerContent: {
        summary: `Sentence correction rules and code logic inspection heuristics for ${packName || 'Accenture'}.`,
        keyRules: [
          { rule: 'Subject-Verb Agreement with Prepositional Phrases', result: 'The quality (Singular) of these candidate submissions is (not are) exceptional.' },
          { rule: 'Neither / Nor and Either / Or Rule', result: 'Verb agrees strictly with the closer subject: "Neither the manager nor the engineers are present."' },
          { rule: 'Technical Idiomatic Prepositions', result: 'Comply with • Adhere to • In accordance with • Substituted for • Prone to' },
          { rule: 'Code Loop Invariant Rule', result: 'Check boundary conditions: 0-indexed arrays end at (length - 1); strictly avoid <= length.' }
        ],
        speedHack: 'Cross out parenthetical clauses and prepositional qualifiers ("along with", "as well as", "together with") to isolate the core singular/plural subject immediately.',
        sampleProblem: 'Error Spotting: "The group of cloud architects [A] have decided [B] to deploy [C] the microservice [D]."\nCorrection: Subject is "group" (Singular) -> Error in [B], must be "has decided".'
      }
    }
  ];

  // Sync candidate hiring store in real-time
  useEffect(() => {
    const handleHiringUpdate = () => {
      const currentCandId = (typeof window !== 'undefined' ? localStorage.getItem('fairhire_active_candidate_id') : null) || 'CAND-8492';
      setCandidateHiring(getCandidateHiringState(currentCandId));
    };

    window.addEventListener('fairhire_hiring_updated', handleHiringUpdate);
    window.addEventListener('fairhire_candidate_status_updated', handleHiringUpdate);
    window.addEventListener('fairhire_recruiter_requirements_updated', handleHiringUpdate);
    window.addEventListener('storage', handleHiringUpdate);

    return () => {
      window.removeEventListener('fairhire_hiring_updated', handleHiringUpdate);
      window.removeEventListener('fairhire_candidate_status_updated', handleHiringUpdate);
      window.removeEventListener('fairhire_recruiter_requirements_updated', handleHiringUpdate);
      window.removeEventListener('storage', handleHiringUpdate);
    };
  }, []);

  // Load applications from applicationStore
  useEffect(() => {
    const apps = getAppliedApplications();
    setApplications(apps);
    if (apps.length > 0) {
      setSelectedAppId(apps[0].id);
      // Default active stage tab to current candidate hiring stage
      setActiveStageTab(candidateHiring?.stage || 'Review');
    }
  }, [candidateHiring?.stage]);

  const currentApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleSelectApp = (app) => {
    setSelectedAppId(app.id);
    setActiveStageTab(candidateHiring?.stage || 'Review');
  };

  // Assessment submission handler (attends round with HR timing slot selection or asynchronous)
  const handleCompleteAssessment = (submissionData) => {
    setAssessmentSubmitting(true);
    const roundIdx = candidateHiring?.currentRoundIndex || 0;
    const currentRound = candidateHiring?.rounds?.[roundIdx];
    const isSlotRequired = roundIdx >= 2;
    const availableSlots = currentRound?.invitation?.timingSlots || [
      { id: 'slot-1', text: 'Tomorrow • 10:00 AM - 11:00 AM EST' },
      { id: 'slot-2', text: 'Tomorrow • 02:00 PM - 03:00 PM EST' },
      { id: 'slot-3', text: 'Day After Tomorrow • 11:30 AM - 12:30 PM EST' }
    ];
    const chosenSlotObj = availableSlots[selectedSlotIndex] || availableSlots[0];
    const chosenSlotText = isSlotRequired
      ? (typeof chosenSlotObj === 'string' ? chosenSlotObj : chosenSlotObj?.text || 'Confirmed Slot')
      : 'Asynchronous (Anytime within deadline)';

    setTimeout(() => {
      const currentCandId = currentApp?.candidateId || activeCandidateId;
      const updated = candidateAttendRound(currentCandId, roundIdx, chosenSlotText, submissionData);
      setCandidateHiring(updated);
      setAssessmentSubmitting(false);
      const roundName = updated.rounds?.[roundIdx]?.name || `Round ${roundIdx + 1}`;
      // STRICT CANDIDATE PRIVACY: Candidate must never see the marks, only HR can view
      setAssessmentCompletedSuccess(
        `✓ Assessment for "${roundName}" completed and securely delivered to HR! Evaluator results are now available on the HR recruiter dashboard.`
      );
      setTimeout(() => {
        setAssessmentCompletedSuccess(null);
      }, 7000);
    }, 400);
  };

  if (!currentApp) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Live Application Tracker"
          subtitle="Real-time transparent pipeline progress for your applied software engineering roles."
        />
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No Active Applications Found</h3>
          <p className="text-sm text-slate-500 mb-6">
            Explore 10+ software engineering roles across Web, Data & Advanced engineering tracks to apply with 1-click semantic matching.
          </p>
          <Link to="/candidate">
            <Button variant="gradient" size="md" icon={ArrowRight}>
              Explore Available Roles
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Candidate hiring dynamic stages and round calculation
  const rounds = candidateHiring?.rounds || [];
  const currentRoundIdx = candidateHiring?.currentRoundIndex || 0;
  const activeRound = rounds[currentRoundIdx];
  const isRoundUnlockedForCandidate = candidateHiring?.stage === 'Review' && activeRound?.status === 'waiting_candidate';
  const isOffered = candidateHiring?.finalDecision === 'Offered' || (candidateHiring?.stage === 'Completed' && candidateHiring?.displayStatus === 'Offered');
  const isRejected = candidateHiring?.finalDecision === 'Rejected';

  const liveStatus = isOffered
    ? '🎉 Job Offer Extended'
    : isRejected
    ? 'Application Concluded'
    : candidateHiring?.displayStatus || currentApp.status || 'Applied';

  const currentStage = candidateHiring?.stage || 'Applied';

  // 4 Process Stages matching HR portal
  const STAGES = [
    { id: 'Applied', number: 1, title: 'Applied', desc: 'Initial application intake & decoupled profile' },
    { id: 'AI Screening', number: 2, title: 'AI Screening', desc: 'Automated scan (8.8/10 score)' },
    { id: 'Review', number: 3, title: 'Review', desc: `${rounds.length} Company Rounds by HR` },
    { id: 'Final Decision', number: 4, title: 'Final Decision', desc: 'Offer / Concluded' }
  ];

  const getStageStepState = (stageId) => {
    const stageOrder = ['Applied', 'AI Screening', 'Review', 'Final Decision', 'Completed'];
    const currentIdx = stageOrder.indexOf(currentStage);
    const targetIdx = stageOrder.indexOf(stageId);

    if (currentIdx > targetIdx || currentStage === 'Completed') return 'completed';
    if (currentIdx === targetIdx) return 'active';
    return 'upcoming';
  };

  // Current stage helper
  const stages = currentApp.stages || [];
  const completedStagesCount = stages.filter(s => s.status === 'completed').length;
  
  let progressPercent = 25;
  if (candidateHiring?.stage === 'Applied') progressPercent = 20;
  else if (candidateHiring?.stage === 'AI Screening') progressPercent = 40;
  else if (candidateHiring?.stage === 'Review') {
    const completedRounds = rounds.filter(r => r.status === 'completed').length;
    progressPercent = 40 + Math.round((completedRounds / Math.max(rounds.length, 1)) * 40);
  } else if (candidateHiring?.stage === 'Final Decision') {
    progressPercent = 90;
  } else if (candidateHiring?.stage === 'Completed') {
    progressPercent = 100;
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <PageHeader
        title="Live Application Tracker"
        subtitle="Real-time transparent pipeline progress, AI semantic scores, and milestone audit for your applied engineering roles."
        actions={
          <div className="flex items-center gap-2.5">
            <Link to="/candidate">
              <Button variant="outline" size="sm" icon={Search}>
                Browse More Roles
              </Button>
            </Link>
            <Link to="/candidate/profile">
              <Button variant="primary" size="sm">
                Update Profile
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-8">
        
        {/* ================= 1. MULTI-APPLICATION SELECTOR TABS ================= */}
        {applications.length > 1 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-xs">
            <div className="flex items-center justify-between gap-3 mb-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your Applied Roles ({applications.length})
              </span>
              <span className="text-[11px] text-teal-600 font-semibold">
                Click any role to view detailed stage milestones
              </span>
            </div>
            
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {applications.map((app) => {
                const isSelected = app.id === currentApp.id;
                return (
                  <button
                    key={app.id}
                    onClick={() => handleSelectApp(app)}
                    className={`px-4 py-3 rounded-xl border text-left transition-all flex items-center gap-3 shrink-0 cursor-pointer ${
                      isSelected
                        ? 'bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-teal-400/40'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg ${app.companyBg || 'bg-teal-600'} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                      {app.companyInitial || app.company.charAt(0)}
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold leading-tight">
                        {app.jobTitle}
                      </h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-semibold ${isSelected ? 'text-teal-300' : 'text-slate-500'}`}>
                          {app.company}
                        </span>
                        <span className="inline-block w-1 h-1 rounded-full bg-slate-400" />
                        <span className={`text-[10px] font-bold ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                          {app.status || 'Active in Pipeline'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= ACTIVE ASSESSMENT UNLOCKED BANNER (WHEN HR APPROVES ROUND) ================= */}
        {isRoundUnlockedForCandidate && activeRound && (
          <div className="bg-gradient-to-br from-navy-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-teal-400/40 animate-in fade-in slide-in-from-top-3 duration-300 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header / Badges */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-navy-800 relative z-10">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-lg font-black ring-4 ring-teal-500/20">
                  <PlayCircle className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-3 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
                      Status: Sent to Candidate by HR
                    </span>
                    <span className="text-xs text-slate-300">• Action Required: Round {currentRoundIdx + 1} of {rounds.length}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                    You are invited to attend: {activeRound.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                    {activeRound.description} — {currentRoundIdx >= 2 
                      ? 'The HR team has approved your profile for this round. Please review the completion timeframe and select your preferred interview slot below.'
                      : `The HR team has approved your profile for this round with a ${activeRound.invitation?.deadlineDays || 3}-day deadline. You can attend this AI Aptitude Assessment anytime before the deadline.`}
                  </p>
                </div>
              </div>

              {/* Deadline highlight card */}
              <div className="shrink-0 p-3.5 rounded-2xl bg-navy-900/90 border border-amber-400/40 shadow-inner text-xs flex flex-col sm:items-end">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
                  <Clock className="w-4 h-4" />
                  <span className="text-[11px] uppercase tracking-wider">Completion Deadline</span>
                </div>
                <p className="text-white font-extrabold text-sm">
                  Complete within {activeRound.invitation?.deadlineDays || 3} Days
                </p>
                <p className="text-[11px] text-amber-200/90 mt-0.5">
                  Must submit before: <strong>{activeRound.invitation?.deadlineDate || '3 days'}</strong>
                </p>
              </div>
            </div>

            {/* Rounds 1 & 2: Asynchronous Assessment (No Scheduling Time Slot Needed) */}
            {currentRoundIdx < 2 ? (
              <div className="pt-5 relative z-10 space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-navy-900/90 border border-teal-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                        ⚡ Asynchronous Assessment
                      </span>
                      <span className="text-xs text-slate-300">Scheduling time slot is not required</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-extrabold text-white">
                      Attend Anytime Within The {activeRound.invitation?.deadlineDays || 3}-Day Deadline
                    </h4>
                    <p className="text-xs text-slate-300 max-w-xl">
                      10 technical aptitude questions tailored to <strong>{currentApp.jobTitle}</strong>. 1 minute per question. Your answers are evaluated and sent directly to HR.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAssessmentModal(true)}
                    className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-navy-950 text-xs font-black shadow-xl hover:shadow-teal-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
                  >
                    <Sparkles className="w-4 h-4 text-navy-950" />
                    <span>Start AI Aptitude Assessment Now</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {activeRound.invitation?.instructions && (
                  <div className="p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-teal-300 block mb-0.5">HR Evaluation Instructions:</span>
                      <span>{activeRound.invitation.instructions}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Round 3: Scheduling Time Slot is Required */
              <div className="pt-5 relative z-10">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      Timing Slots Provided by HR (Select Your Preferred Slot):
                    </h4>
                  </div>
                  <span className="text-[11px] text-teal-300 font-medium">
                    {((activeRound.invitation?.timingSlots || []).length || 3)} slots available
                  </span>
                </div>

                {/* Selectable Timing Slot Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                  {(activeRound.invitation?.timingSlots || [
                    { id: 'slot-1', text: 'Tomorrow • 10:00 AM - 11:00 AM EST' },
                    { id: 'slot-2', text: 'Tomorrow • 02:00 PM - 03:00 PM EST' },
                    { id: 'slot-3', text: 'Day After Tomorrow • 11:30 AM - 12:30 PM EST' }
                  ]).map((slot, idx) => {
                    const isSelected = selectedSlotIndex === idx;
                    const slotText = typeof slot === 'string' ? slot : slot.text;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedSlotIndex(idx)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 relative ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-400 shadow-xl ring-2 ring-teal-300/40'
                            : 'bg-navy-900/80 hover:bg-navy-800 text-slate-200 border-navy-700/80 hover:border-teal-500/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-navy-800 text-teal-300'
                          }`}>
                            Slot {idx + 1}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold bg-white text-teal-900 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3 text-teal-700" /> Selected
                            </span>
                          )}
                        </div>

                        <div>
                          <p className="text-xs font-mono font-bold">
                            {slotText}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Instructions from HR (if provided) */}
                {activeRound.invitation?.instructions && (
                  <div className="mb-5 p-3.5 rounded-xl bg-navy-900/60 border border-navy-800 text-xs text-slate-300 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-teal-300 block mb-0.5">HR Evaluation Instructions:</span>
                      <span>{activeRound.invitation.instructions}</span>
                    </div>
                  </div>
                )}

                {/* Bottom confirmation action */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-navy-800">
                  <div className="text-xs text-slate-400">
                    <span>Selected Slot: </span>
                    <strong className="text-teal-300 font-mono">
                      {typeof (activeRound.invitation?.timingSlots?.[selectedSlotIndex] || (activeRound.invitation?.timingSlots?.[0])) === 'string'
                        ? (activeRound.invitation?.timingSlots?.[selectedSlotIndex] || activeRound.invitation?.timingSlots?.[0])
                        : (activeRound.invitation?.timingSlots?.[selectedSlotIndex]?.text || activeRound.invitation?.timingSlots?.[0]?.text || 'Tomorrow • 10:00 AM - 11:00 AM EST')}
                    </strong>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAssessmentModal(true)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-navy-950 text-xs font-black shadow-xl hover:shadow-teal-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-navy-950" />
                    <span>Confirm Slot & Attend Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= ASSESSMENT COMPLETED SUCCESS NOTIFICATION ================= */}
        {assessmentCompletedSuccess && (
          <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-2xl p-5 shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-xs sm:text-sm font-bold">{assessmentCompletedSuccess}</p>
            </div>
            <button
              onClick={() => setAssessmentCompletedSuccess(null)}
              className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ================= JOB OFFER EXTENDED BANNER ================= */}
        {isOffered && (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-emerald-300 flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-emerald-700 flex items-center justify-center shrink-0 shadow-lg">
                <Trophy className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full border border-white/30">
                  🎉 Final Decision: Official Job Offer
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Congratulations! You've Received a Job Offer
                </h3>
                <p className="text-xs text-emerald-100 mt-1 max-w-xl">
                  You have successfully cleared all {rounds.length} company interview rounds. FairHire parity verified offer benchmarks are ready for your review.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert("Offer Accepted! Welcome to the team.")}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-black shadow-xl transition-all flex items-center gap-2 cursor-pointer shrink-0 active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Review & Accept Offer</span>
            </button>
          </div>
        )}

        {/* ================= 2. HERO EXECUTIVE APPLICATION CARD ================= */}
        <section className="bg-gradient-to-br from-navy-900 via-navy-950 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-xl relative overflow-hidden">
          {/* Ambient Glow background */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Metadata Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-navy-800/80 relative z-10">
            <div className="flex items-center gap-3.5">
              <div className={`w-14 h-14 rounded-2xl ${currentApp.companyBg || 'bg-teal-600'} text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0 border border-white/10`}>
                {currentApp.companyInitial || currentApp.company.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                    {currentApp.company}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 bg-navy-800/80 px-2.5 py-0.5 rounded-full border border-navy-700">
                    ID: {currentApp.id}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                  {currentApp.jobTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-300">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-400" />
                    {currentApp.location}
                  </span>
                  <span>•</span>
                  <span className="text-teal-300 font-bold">
                    {currentApp.salary}
                  </span>
                  <span>•</span>
                  <span className="text-slate-400">
                    Applied: {new Date(currentApp.appliedDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Live Status Pill with pulsating dot */}
            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-400/30 text-teal-300 text-xs font-extrabold shadow-inner">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-400"></span>
                </span>
                <span>{liveStatus}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Phase: {candidateHiring?.stage || 'Applied'}
              </span>
            </div>
          </div>

          {/* Attractive Luminescent Progress Bar */}
          <div className="my-6 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Overall Hiring Pipeline Progress</span>
              </span>
              <span className="text-teal-300 font-extrabold font-mono">
                {progressPercent}% Completed
              </span>
            </div>
            
            {/* Outer Progress Track */}
            <div className="w-full h-3.5 rounded-full bg-navy-800/90 border border-navy-700/80 p-0.5 overflow-hidden shadow-inner relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 transition-all duration-700 shadow-md relative"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/60 rounded-full blur-[1px]" />
              </div>
            </div>

            {/* Milestone Label Markers (4 Processes Matching HR Portal) */}
            <div className="grid grid-cols-4 text-[10px] font-semibold text-slate-400 mt-2 px-1">
              <span className={`text-left ${currentStage === 'Applied' ? 'text-amber-300 font-bold' : 'text-teal-300'}`}>1. Applied</span>
              <span className={`text-center ${currentStage === 'AI Screening' ? 'text-amber-300 font-bold' : getStageStepState('AI Screening') === 'completed' ? 'text-teal-300' : ''}`}>2. AI Screening</span>
              <span className={`text-center ${currentStage === 'Review' ? 'text-amber-300 font-bold' : getStageStepState('Review') === 'completed' ? 'text-teal-300' : ''}`}>3. Review ({rounds.length} Rounds)</span>
              <span className={`text-right ${currentStage === 'Final Decision' || currentStage === 'Completed' ? 'text-amber-300 font-bold' : ''}`}>4. Final Decision</span>
            </div>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-navy-800/80 relative z-10 text-xs">
            <div className="p-3 rounded-xl bg-navy-800/50 border border-navy-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                AI Match Index
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-black text-white font-sans">{currentApp.aiScore || 9.1}</span>
                <span className="text-xs text-slate-400">/ 10</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-navy-800/50 border border-navy-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Blind Screening
              </span>
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Decoupled
              </span>
            </div>

            <div className="p-3 rounded-xl bg-navy-800/50 border border-navy-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Response SLA
              </span>
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                &lt; 48h Turnaround
              </span>
            </div>

            <div className="p-3 rounded-xl bg-navy-800/50 border border-navy-700/60">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Curated Prep
              </span>
              <span className="text-xs font-bold text-teal-300 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" />
                3 Framework Modules Ready
              </span>
            </div>
          </div>
        </section>

        {/* ================= 3. INTERACTIVE HIRING PIPELINE STAGES (4 PROCESSES MATCHING HR PORTAL) ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
                  Hiring Pipeline Flow
                </span>
                <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  Real-time Synchronization
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-navy-900 tracking-tight mt-0.5">
                Interactive Hiring Pipeline Stages
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Applied → AI Screening → Review ({rounds.length} Company Rounds) → Final Decision
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                <Check className="w-3 h-3 text-emerald-600" />
                Completed
              </span>
              <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                Active Now
              </span>
              <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Upcoming
              </span>
            </div>
          </div>

          {/* 4-Step Stepper Layout (Matching HR portal) */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-6">
            {STAGES.map((s) => {
              const stepState = getStageStepState(s.id);
              const isCompleted = stepState === 'completed';
              const isActive = stepState === 'active';
              const isSelected = activeStageTab === s.id;

              return (
                <div
                  key={s.id}
                  onClick={() => setActiveStageTab(s.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-teal-50/70 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                      : isActive
                      ? 'bg-teal-50/40 border-teal-300 shadow-xs'
                      : isCompleted
                      ? 'bg-emerald-50/30 border-emerald-300 hover:bg-emerald-50/60'
                      : 'bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-transform group-hover:scale-105 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : isActive
                          ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : s.number}
                    </div>

                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isActive
                          ? 'bg-teal-600 text-white'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isCompleted ? 'Done' : isActive ? 'Active' : 'Pending'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Process {s.number}
                    </span>
                    <h4
                      className={`text-xs sm:text-sm font-extrabold mt-0.5 ${
                        isActive || isSelected ? 'text-navy-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                      }`}
                    >
                      {s.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{s.desc}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>{isSelected ? 'Viewing details' : 'Click to inspect'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90 text-teal-600' : 'text-slate-300'}`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ================= STAGE CONTENT AREA ================= */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            {/* ---------------- PROCESS 1: APPLIED ---------------- */}
            {activeStageTab === 'Applied' && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-black">
                    <Check className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Process 1: Intake & Blind Profile
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-navy-900 mt-0.5">
                      Application Submitted & Decoupled Successfully
                    </h4>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-600">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-navy-900 block mb-1">✓ EEOC Blind Screening:</span>
                    <p>Demographic markers (name, gender, age, zip code) were decoupled from technical competencies for 100% merit-based evaluation.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-navy-900 block mb-1">✓ Automated Queue:</span>
                    <p>Candidate profile automatically forwarded to the AI screening engine for semantic qualification matching.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- PROCESS 2: AI SCREENING ---------------- */}
            {activeStageTab === 'AI Screening' && (
              <div className="p-6 rounded-3xl bg-teal-50/50 border border-teal-200 text-xs text-slate-600 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-white px-2 py-0.5 rounded-full border border-teal-200">
                      Process 2: Automated AI Screening
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-navy-900 mt-0.5">
                      AI Match Score: 8.8 / 10 • Competencies Verified
                    </h4>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-navy-900 block mb-0.5">Automated Scan</span>
                    <span className="text-emerald-700 font-bold">100% Completed</span>
                    <p className="text-[11px] text-slate-500 mt-1">Evaluated code samples, repositories, and technical stack requirements.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-navy-900 block mb-0.5">Semantic Fit</span>
                    <span className="text-teal-700 font-bold">High Match (8.8/10)</span>
                    <p className="text-[11px] text-slate-500 mt-1">Strong alignment with engineering specifications and system architecture.</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200">
                    <span className="font-bold text-navy-900 block mb-0.5">Hiring Queue</span>
                    <span className="text-teal-700 font-bold">Advanced to Review</span>
                    <p className="text-[11px] text-slate-500 mt-1">Profile queued directly for HR interview rounds approval.</p>
                  </div>
                </div>
              </div>
            )}

            {/* ---------------- PROCESS 3: REVIEW STATUS (ROUNDS POSTED BY HR + INTERVIEW SCHEDULE) ---------------- */}
            {activeStageTab === 'Review' && (
              <div className="space-y-6 animate-in fade-in">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                        Process 3: Review Status
                      </span>
                      <span className="text-xs text-slate-400">
                        {rounds.filter(r => r.status === 'completed').length} of {rounds.length} Rounds Cleared
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-navy-900 mt-1">
                      Company Evaluation Rounds Posted by HR ({rounds.length} Rounds)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Each round requires HR approval, candidate completion, and evaluation scoring until the final decision. When approved by HR, your interview schedule, deadline, and timing slots will appear below.
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block">
                      Current: Round {currentRoundIdx + 1} of {rounds.length}
                    </span>
                  </div>
                </div>

                {/* Display All Rounds Posted by HR */}
                <div className="space-y-4">
                  {rounds.map((round, idx) => {
                    const isRoundCurrent = idx === currentRoundIdx && candidateHiring?.stage === 'Review';
                    const isCompleted = round.status === 'completed';
                    const isWaitingCandidate = round.status === 'waiting_candidate';
                    const isPendingApproval = round.status === 'pending_hr_approval';
                    const isRejectedRound = round.status === 'rejected' || (candidateHiring?.finalDecision === 'Rejected' && isRoundCurrent);
                    const isLocked = !isCompleted && !isWaitingCandidate && !isPendingApproval;

                    return (
                      <div
                        key={round.round || idx}
                        className={`p-5 sm:p-6 rounded-3xl border transition-all ${
                          isWaitingCandidate
                            ? 'bg-gradient-to-r from-teal-50/70 via-white to-teal-50/50 border-teal-400 shadow-md ring-2 ring-teal-400/20'
                            : isCompleted
                            ? 'bg-emerald-50/20 border-emerald-300 shadow-xs'
                            : isPendingApproval
                            ? 'bg-slate-50 border-amber-300'
                            : isRejectedRound
                            ? 'bg-rose-50/40 border-rose-300'
                            : 'bg-slate-50/60 border-slate-200 text-slate-400'
                        }`}
                      >
                        {/* Round Header & Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                                isCompleted
                                  ? 'bg-emerald-600 text-white'
                                  : isWaitingCandidate
                                  ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                                  : isRejectedRound
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {isCompleted ? <Check className="w-4 h-4" /> : isRejectedRound ? <ThumbsDown className="w-4 h-4" /> : idx + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                  Round {round.round || idx + 1} of {rounds.length}
                                </span>
                                {isWaitingCandidate && (
                                  <span className="text-[10px] font-extrabold uppercase bg-teal-100 text-teal-800 border border-teal-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                                    Approved by HR • Schedule Ready
                                  </span>
                                )}
                              </div>
                              <h5 className="text-sm sm:text-base font-black text-navy-900 mt-0.5">
                                {round.name}
                              </h5>
                            </div>
                          </div>

                          {/* Round Status Badge */}
                          <div>
                            {isCompleted && (
                              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Submitted to HR • Pending HR Review</span>
                              </span>
                            )}
                            {isWaitingCandidate && (
                              <span className="text-xs font-bold text-teal-800 bg-teal-100 border border-teal-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-teal-700" />
                                <span>Approved by HR • Action Required</span>
                              </span>
                            )}
                            {isPendingApproval && (
                              <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>Pending HR Approval</span>
                              </span>
                            )}
                            {isRejectedRound && (
                              <span className="text-xs font-bold text-rose-800 bg-rose-100 border border-rose-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                                <ThumbsDown className="w-3.5 h-3.5 text-rose-700" />
                                <span>Rejected</span>
                              </span>
                            )}
                            {isLocked && (
                              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                <Lock className="w-3.5 h-3.5" />
                                <span>Locked until prior round clearance</span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Round Description */}
                        <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                          {round.description}
                        </p>

                        {/* ---------------- INTERVIEW SCHEDULE POSTED BY HR (IF APPROVED) ---------------- */}
                        {isWaitingCandidate && (
                          <div className="mt-4 p-4 rounded-2xl bg-white border-2 border-teal-300/80 shadow-sm space-y-4">
                            {idx < 2 ? (
                              /* Rounds 1 & 2: Asynchronous AI Assessment (No Timing Slots Required) */
                              <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                                      <Sparkles className="w-4 h-4 text-teal-700" />
                                    </div>
                                    <div>
                                      <h6 className="text-xs sm:text-sm font-black text-navy-900">
                                        Round {idx + 1} AI Aptitude Assessment Ready
                                      </h6>
                                      <p className="text-[11px] text-slate-500">
                                        Asynchronous round — Scheduling a time slot is not required. Attend anytime within the deadline.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Deadline Info */}
                                  <div className="p-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-1.5 self-start sm:self-auto">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Complete within {round.invitation?.deadlineDays || 3} days (Deadline: <strong>{round.invitation?.deadlineDate || '3 days'}</strong>)</span>
                                  </div>
                                </div>

                                <div className="p-3.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                  <div className="space-y-0.5">
                                    <p className="font-bold text-navy-900">10 AI Aptitude Questions (1 Minute per Question)</p>
                                    <p className="text-[11px] text-slate-600">Questions are role-specific for {currentApp.jobTitle}. Timer auto-advances upon timeout. Marks remain confidential to HR.</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShowAssessmentModal(true)}
                                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95 shrink-0"
                                  >
                                    <PlayCircle className="w-4 h-4" />
                                    <span>Start AI Aptitude Test</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ) : (
                              /* Round 3: Scheduling Time Slots Required */
                              <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                                      <Calendar className="w-4 h-4 text-teal-700" />
                                    </div>
                                    <div>
                                      <h6 className="text-xs sm:text-sm font-black text-navy-900">
                                        Round 3 Interview Schedule & Timing Slots Posted by HR
                                      </h6>
                                      <p className="text-[11px] text-slate-500">
                                        The HR team has approved you for Round 3 and posted available interview timing slots.
                                      </p>
                                    </div>
                                  </div>

                                  {/* Deadline Info */}
                                  <div className="p-2 px-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-bold flex items-center gap-1.5 self-start sm:self-auto">
                                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                                    <span>Complete within {round.invitation?.deadlineDays || 3} days (Deadline: <strong>{round.invitation?.deadlineDate || '3 days'}</strong>)</span>
                                  </div>
                                </div>

                                {/* Selectable Timing Slots */}
                                <div>
                                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                                    Select Your Preferred Timing Slot:
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                    {(round.invitation?.timingSlots || [
                                      { id: 'slot-1', text: 'Tomorrow • 10:00 AM - 11:00 AM EST' },
                                      { id: 'slot-2', text: 'Tomorrow • 02:00 PM - 03:00 PM EST' },
                                      { id: 'slot-3', text: 'Day After Tomorrow • 11:30 AM - 12:30 PM EST' }
                                    ]).map((slot, sIdx) => {
                                      const isSelected = selectedSlotIndex === sIdx;
                                      const slotText = typeof slot === 'string' ? slot : slot.text;
                                      return (
                                        <button
                                          key={sIdx}
                                          type="button"
                                          onClick={() => setSelectedSlotIndex(sIdx)}
                                          className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                                            isSelected
                                              ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                                          }`}
                                        >
                                          <div className="flex items-center justify-between text-[10px] font-black uppercase">
                                            <span className={isSelected ? 'text-teal-100' : 'text-slate-400'}>Slot {sIdx + 1}</span>
                                            {isSelected && <Check className="w-3 h-3 text-white" />}
                                          </div>
                                          <span className="text-xs font-mono font-bold leading-tight">{slotText}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Action Attend Button */}
                                <div className="flex items-center justify-end pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setShowAssessmentModal(true)}
                                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                                  >
                                    <PlayCircle className="w-4 h-4" />
                                    <span>Attend Round {idx + 1} Assessment Now</span>
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Instructions from HR if present */}
                            {round.invitation?.instructions && (
                              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                                <strong>HR Instructions:</strong> {round.invitation.instructions}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Completed Round Details */}
                        {isCompleted && round.result && (
                          <div className="mt-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 font-bold text-emerald-900">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Assessment Completed • Evaluated by {round.result.evaluatedBy}</span>
                              </div>
                              <p className="text-[11px] text-emerald-800 mt-0.5">
                                <em>Results submitted directly to HR recruiter dashboard. Marks are kept confidential under FairHire Blind Screening.</em>
                              </p>
                            </div>

                            {round.selectedSlot && (
                              <span className="text-[11px] text-slate-500 font-mono bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                                {round.selectedSlot}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Pending HR Approval Note */}
                        {isPendingApproval && (
                          <div className="mt-3 p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>Awaiting HR recruiter approval for this round. Once approved, the interview schedule and timing slots will appear here.</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ---------------- PROCESS 4: FINAL DECISION ---------------- */}
            {activeStageTab === 'Final Decision' && (
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                    isOffered ? 'bg-emerald-600 text-white' : isRejected ? 'bg-rose-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {isOffered ? <Trophy className="w-5 h-5" /> : isRejected ? <ThumbsDown className="w-5 h-5" /> : <Award className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                      Process 4: Final Decision
                    </span>
                    <h4 className="text-sm sm:text-base font-black text-navy-900 mt-0.5">
                      {isOffered ? 'Official Job Offer Extended!' : isRejected ? 'Application Concluded (Rejected)' : `Pending Completion of All ${rounds.length} Rounds`}
                    </h4>
                  </div>
                </div>

                <p className="leading-relaxed">
                  {isOffered
                    ? 'Congratulations! You have completed all company evaluation rounds and been approved for hire with FairHire pay parity verified compensation benchmarks.'
                    : isRejected
                    ? 'Thank you for your time and participation. Transparent feedback and closure details have been recorded.'
                    : `The final hiring decision (Job Offer or Concluded) will be made by the HR committee once you complete all ${rounds.length} sequential evaluation rounds.`}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* ================= 4. STRUCTURED FRAMEWORK PREPARATION MODULES ================= */}
        <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-navy-900 tracking-tight">
                  Structured Framework Preparation Modules
                </h3>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  Mock Prep Pack Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Calibrated cheatsheet blueprints and speed heuristics aligned with 2025-2026 hiring patterns.
              </p>
            </div>

            {/* Mock Prep Pack Selector Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 border border-slate-200 text-xs font-bold">
              {MOCK_PACK_OPTIONS.map((pack) => (
                <button
                  key={pack.id}
                  type="button"
                  onClick={() => setSelectedMockPack(pack.id)}
                  className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                    selectedMockPack === pack.id
                      ? 'bg-navy-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{pack.icon}</span>
                  <span>{pack.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* The 3 Structured Framework Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {getMockFrameworkModules(selectedMockPack).map((module) => (
              <div
                key={module.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-teal-400 hover:bg-white hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Header Parameters Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${module.headerBadgeColor}`}>
                      {module.headerParams}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Blueprint
                    </span>
                  </div>

                  {/* Card Title */}
                  <h4 className="text-base font-black text-navy-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {module.title}
                  </h4>

                  {/* Focus Parameters Box */}
                  <div className="p-3 rounded-xl bg-white border border-slate-200/90 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Focus Parameters:
                    </span>
                    <p className="font-semibold text-slate-800 leading-snug">
                      {module.focus}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {module.tags.map((tag, tidx) => (
                      <span
                        key={tidx}
                        className="text-[10px] font-medium text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button: 📖 Open Cheatsheet Drawer */}
                <div className="mt-5 pt-3 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => setActiveCheatsheetDrawer(module)}
                    className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>📖 Open Cheatsheet Drawer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= CHEATSHEET SLIDE-IN DRAWER MODAL ================= */}
        {activeCheatsheetDrawer && (
          <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 relative overflow-hidden my-8 space-y-6">
              
              {/* Top Header & Close Button */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-lg border mb-2 ${activeCheatsheetDrawer.headerBadgeColor}`}>
                    {activeCheatsheetDrawer.headerParams}
                  </span>
                  <h3 className="text-xl font-black text-navy-900 tracking-tight">
                    {activeCheatsheetDrawer.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeCheatsheetDrawer.drawerContent.summary}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveCheatsheetDrawer(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Focus Summary Box */}
              <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-teal-950 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                  Targeted Focus Topics:
                </span>
                <p className="font-bold text-teal-900">
                  {activeCheatsheetDrawer.focus}
                </p>
              </div>

              {/* Key Rules & Formula Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Key Rules & High-Speed Formulas
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {activeCheatsheetDrawer.drawerContent.keyRules.map((kr, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                      <strong className="text-navy-900 font-bold block">{kr.rule}</strong>
                      <p className="text-teal-800 font-mono text-[11px] bg-white p-2 rounded-lg border border-slate-200">
                        {kr.result}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Speed Hack Banner */}
              <div className="p-3.5 rounded-2xl bg-purple-50/80 border border-purple-200 text-xs text-purple-950 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Speed Hack & Elimination Strategy</span>
                </span>
                <p className="text-slate-700 text-[11px] leading-relaxed">
                  {activeCheatsheetDrawer.drawerContent.speedHack}
                </p>
              </div>

              {/* Sample Problem Walkthrough */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Worked Sample Pattern
                </h4>
                <div className="p-3.5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-[11px] leading-relaxed whitespace-pre-line shadow-inner">
                  {activeCheatsheetDrawer.drawerContent.sampleProblem}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveCheatsheetDrawer(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs cursor-pointer"
                >
                  Close Cheatsheet
                </button>

                <Link to="/candidate/aptitude">
                  <button
                    type="button"
                    className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Practice Pattern in Mock Exam</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>

            </div>
          </div>
        )}

        {/* ================= 5. COMPLIANCE & BLIND EVALUATION GUARANTEE ================= */}
        <section className="p-6 rounded-3xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-extrabold text-navy-900 text-sm">
                FairHire Zero-Ghosting & Blind Screening SLA
              </h5>
              <p className="text-xs text-slate-500 mt-0.5">
                Every application is bound by automated recruiter SLAs. You are guaranteed a transparent decision or direct feedback within 48 hours of each milestone.
              </p>
            </div>
          </div>

          <Link to="/candidate/profile" className="shrink-0">
            <button className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-white transition-all text-xs cursor-pointer">
              Review Consent & Privacy
            </button>
          </Link>
        </section>

      </div>

      {/* ================= INTERACTIVE AI APTITUDE ASSESSMENT MODAL ================= */}
      {showAssessmentModal && activeRound && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full p-6 sm:p-8 relative overflow-hidden my-8">
            <button
              type="button"
              onClick={() => setShowAssessmentModal(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer z-20"
              title="Close Assessment"
            >
              <X className="w-5 h-5" />
            </button>

            <AiAptitudeAssessment
              roleTitle={currentApp?.jobTitle || 'Frontend Engineer'}
              roundName={activeRound.name}
              candidateId={currentApp?.candidateId || activeCandidateId}
              onComplete={(submission) => {
                handleCompleteAssessment(submission);
              }}
              onClose={() => setShowAssessmentModal(false)}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ApplicationStatus;
