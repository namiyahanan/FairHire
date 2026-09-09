import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  PlayCircle,
  Award,
  ChevronRight,
  Sparkles,
  UserCheck,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Lock,
  Unlock,
  FileCheck,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Check,
  Send,
  Sliders,
  Calendar,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';
import { getCompanyRounds } from '../../services/requirementsStore';
import {
  getCandidateHiringState,
  advanceToAiScreening,
  advanceToReview,
  approveRoundByHr,
  candidateAttendRound,
  proceedToNextRound,
  submitFinalDecision,
  resetCandidateHiringState
} from '../../services/candidateHiringStore';

const CandidateHiringWorkflow = ({
  candidateId = 'CAND-8492',
  candidateName = 'Alex Morgan',
  jobTitle = 'Senior Full Stack Engineer',
  onStateChange = null
}) => {
  const [hiringState, setHiringState] = useState(() => getCandidateHiringState(candidateId));
  const [companyRounds, setCompanyRounds] = useState(() => getCompanyRounds());
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState(null);
  const [autoScreeningStep, setAutoScreeningStep] = useState(0);

  // Round invitation configuration modal state
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteRoundIndex, setInviteRoundIndex] = useState(0);
  const [deadlineDays, setDeadlineDays] = useState(3);
  const [timingSlots, setTimingSlots] = useState([
    'Tomorrow • 10:00 AM - 11:00 AM EST',
    'Tomorrow • 02:00 PM - 03:00 PM EST',
    'Day After Tomorrow • 11:30 AM - 12:30 PM EST'
  ]);
  const [newSlotInput, setNewSlotInput] = useState('');
  const [instructions, setInstructions] = useState('Please ensure a quiet environment with a working webcam & microphone.');

  // Sync state whenever event fires or candidateId changes
  useEffect(() => {
    const refreshState = () => {
      setHiringState(getCandidateHiringState(candidateId));
      setCompanyRounds(getCompanyRounds());
    };

    refreshState();

    window.addEventListener('fairhire_hiring_updated', refreshState);
    window.addEventListener('fairhire_recruiter_requirements_updated', refreshState);
    window.addEventListener('storage', refreshState);

    return () => {
      window.removeEventListener('fairhire_hiring_updated', refreshState);
      window.removeEventListener('fairhire_recruiter_requirements_updated', refreshState);
      window.removeEventListener('storage', refreshState);
    };
  }, [candidateId]);

  // Automated AI Screening: triggers automatically when candidate is in 'Applied'
  useEffect(() => {
    if (hiringState.stage === 'Applied') {
      setAutoScreeningStep(1);

      const t1 = setTimeout(() => {
        setAutoScreeningStep(2);
      }, 500);

      const t2 = setTimeout(() => {
        setAutoScreeningStep(3);
      }, 1000);

      const t3 = setTimeout(() => {
        advanceToAiScreening(candidateId);
        const updated = advanceToReview(candidateId);
        setHiringState(updated);
        setAutoScreeningStep(0);
        showNotification('✓ AI Screening completed automatically (Match Score: 8.8/10)! Candidate advanced to Review.');
        if (onStateChange) onStateChange(updated);
      }, 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    } else if (hiringState.stage === 'AI Screening') {
      const t = setTimeout(() => {
        const updated = advanceToReview(candidateId);
        setHiringState(updated);
        if (onStateChange) onStateChange(updated);
      }, 600);
      return () => clearTimeout(t);
    }
  }, [candidateId, hiringState.stage]);

  const showNotification = (msg) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  // 3. HR opens Invitation Configuration Modal
  const handleOpenInviteModal = (roundIndex) => {
    setInviteRoundIndex(roundIndex);
    setDeadlineDays(3);
    setTimingSlots([
      'Tomorrow • 10:00 AM - 11:00 AM EST',
      'Tomorrow • 02:00 PM - 03:00 PM EST',
      'Day After Tomorrow • 11:30 AM - 12:30 PM EST'
    ]);
    setShowInviteModal(true);
  };

  const handleAddTimingSlot = () => {
    if (newSlotInput.trim()) {
      setTimingSlots(prev => [...prev, newSlotInput.trim()]);
      setNewSlotInput('');
    }
  };

  const handleRemoveTimingSlot = (idxToRemove) => {
    setTimingSlots(prev => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSendRoundInvitation = () => {
    setActionLoading(true);
    const deadlineDate = new Date(Date.now() + Number(deadlineDays) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    const isSlotRequired = inviteRoundIndex >= 2;
    const formattedSlots = isSlotRequired
      ? timingSlots.map((text, idx) => ({ id: `slot-${idx + 1}`, text }))
      : [];

    setTimeout(() => {
      const updated = approveRoundByHr(candidateId, inviteRoundIndex, {
        deadlineDays,
        deadlineDate,
        timingSlots: formattedSlots,
        instructions
      });
      setHiringState(updated);
      setActionLoading(false);
      setShowInviteModal(false);
      const roundName = updated.rounds[inviteRoundIndex]?.name || `Round ${inviteRoundIndex + 1}`;
      if (isSlotRequired) {
        showNotification(`✓ Round 3 interview invitation sent to candidate with ${formattedSlots.length} timing slots & deadline of ${deadlineDate}!`);
      } else {
        showNotification(`✓ Round ${inviteRoundIndex + 1} assessment unlocked for candidate with ${deadlineDays}-day deadline (${deadlineDate})! Candidate can attend anytime.`);
      }
      if (onStateChange) onStateChange(updated);
    }, 400);
  };

  // 4. Candidate Attends Round (Simulation from Recruiter View or via Candidate Portal)
  const handleCandidateAttend = (roundIndex) => {
    setActionLoading(true);
    setTimeout(() => {
      const updated = candidateAttendRound(candidateId, roundIndex);
      setHiringState(updated);
      setActionLoading(false);
      const roundName = updated.rounds[roundIndex]?.name || `Round ${roundIndex + 1}`;
      const score = updated.rounds[roundIndex]?.result?.score || 90;
      showNotification(`🎉 Assessment completed for ${roundName}! Result (${score}%) automatically sent to HR.`);
      if (onStateChange) onStateChange(updated);
    }, 450);
  };

  // 5. HR Advances to Next Round or Final Decision
  const handleProceedNextRound = () => {
    setActionLoading(true);
    setTimeout(() => {
      const updated = proceedToNextRound(candidateId);
      setHiringState(updated);
      setActionLoading(false);
      if (updated.stage === 'Final Decision') {
        showNotification('✓ All rounds completed! Ready for Final Hiring Decision (Offer or Reject).');
      } else {
        const nextIdx = updated.currentRoundIndex;
        const nextName = updated.rounds[nextIdx]?.name || `Round ${nextIdx + 1}`;
        showNotification(`✓ Advanced to Round ${nextIdx + 1}: ${nextName}. Pending HR approval.`);
      }
      if (onStateChange) onStateChange(updated);
    }, 350);
  };

  // 6. HR Submits Final Decision (Offer or Reject)
  const handleFinalDecision = (decision) => {
    setActionLoading(true);
    setTimeout(() => {
      const updated = submitFinalDecision(candidateId, decision);
      setHiringState(updated);
      setActionLoading(false);
      showNotification(
        decision === 'Offer'
          ? '🎉 Official Job Offer extended to candidate!'
          : 'Application concluded with decision: Rejected.'
      );
      if (onStateChange) onStateChange(updated);
    }, 400);
  };

  // 7. Reset flow for testing
  const handleResetFlow = () => {
    const fresh = resetCandidateHiringState(candidateId);
    setHiringState(fresh);
    showNotification('Process reset: Candidate is back at "Applied" stage.');
    if (onStateChange) onStateChange(fresh);
  };

  const currentStage = hiringState.stage || 'Applied';
  const rounds = hiringState.rounds || [];
  const currentRoundIdx = hiringState.currentRoundIndex || 0;
  const activeRound = rounds[currentRoundIdx] || rounds[0];

  const totalRoundsCount = rounds.length;
  const completedRoundsCount = rounds.filter((r) => r.status === 'completed').length;

  // Stages stepper definition
  const STAGES = [
    { id: 'Applied', number: 1, title: 'Applied', desc: 'Initial intake' },
    { id: 'AI Screening', number: 2, title: 'AI Screening', desc: 'Semantic match' },
    { id: 'Review', number: 3, title: 'Review & Rounds', desc: `${totalRoundsCount} Company Rounds` },
    { id: 'Final Decision', number: 4, title: 'Final Decision', desc: 'Approve / Reject' }
  ];

  const getStageStepState = (stageId) => {
    const stageOrder = ['Applied', 'AI Screening', 'Review', 'Final Decision', 'Completed'];
    const currentIdx = stageOrder.indexOf(currentStage);
    const targetIdx = stageOrder.indexOf(stageId);

    if (currentIdx > targetIdx || currentStage === 'Completed') return 'completed';
    if (currentIdx === targetIdx) return 'active';
    return 'upcoming';
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Feedback Toast */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-navy-950 text-white p-4 rounded-2xl shadow-2xl border border-teal-500/40 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-200">{feedbackToast}</p>
        </div>
      )}

      {/* ================= 1. SELECTED ROUNDS BY HR IN THE STARTING ================= */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <h3 className="text-base sm:text-lg font-black text-navy-900 tracking-tight">
                Company Hiring Rounds ({totalRoundsCount} Selected by HR)
              </h3>
              <span className="text-[10px] font-bold text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                Configured in Requirements
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              These rounds were defined in company requirements. The candidate will progress sequentially through each round upon HR approval.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Link to="/recruiter/requirements">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5 text-teal-600" />
                <span>Adjust Rounds</span>
              </button>
            </Link>

            <button
              type="button"
              onClick={handleResetFlow}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 text-slate-600 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Reset progress to initial Applied stage for demo"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Process</span>
            </button>
          </div>
        </div>

        {/* Selected Rounds Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-5">
          {rounds.map((roundItem, idx) => {
            const isCompleted = roundItem.status === 'completed';
            const isActive = currentStage === 'Review' && currentRoundIdx === idx;
            const isWaitingCandidate = roundItem.status === 'waiting_candidate';
            const isPendingApproval = roundItem.status === 'pending_hr_approval';

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCompleted
                    ? 'bg-emerald-50/40 border-emerald-200 shadow-xs'
                    : isActive
                    ? 'bg-teal-50/50 border-teal-400 ring-2 ring-teal-400/20 shadow-sm'
                    : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                      Round {roundItem.round || idx + 1} of {totalRoundsCount}
                    </span>

                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isWaitingCandidate
                          ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                          : isPendingApproval && isActive
                          ? 'bg-blue-100 text-blue-800 border-blue-300'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {isCompleted
                        ? `✓ Passed (${roundItem.result?.score}%)`
                        : isWaitingCandidate
                        ? 'Candidate Attending'
                        : isPendingApproval && isActive
                        ? 'Needs HR Approval'
                        : 'Upcoming'}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-sm font-black text-navy-900 leading-snug">
                    {roundItem.name}
                  </h4>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {roundItem.description}
                  </p>
                </div>

                {/* Status footnote */}
                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                  {isCompleted ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      Evaluated by: {roundItem.result?.evaluatedBy || 'Hiring Team'}
                    </span>
                  ) : isActive ? (
                    <span className="text-teal-700 font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                      Active Stage Round
                    </span>
                  ) : (
                    <span className="text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Locked until prior round clearance
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 2. STEP-BY-STEP HIRING PROGRESSION STEPPER ================= */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">
              Hiring Pipeline Flow
            </span>
            <h3 className="text-lg sm:text-xl font-black text-navy-900 mt-0.5">
              Sequential Candidate Evaluation Process
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Applied → AI Screening → Review (Rounds 1..{totalRoundsCount}) → Final Decision (Offer / Reject)
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-navy-900 block">
              Current Stage:
            </span>
            <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full inline-block mt-0.5">
              {hiringState.displayStatus || currentStage}
            </span>
          </div>
        </div>

        {/* 4-Step Visual Track */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-6">
          {STAGES.map((s) => {
            const stepState = getStageStepState(s.id);
            const isCompleted = stepState === 'completed';
            const isActive = stepState === 'active';

            return (
              <div
                key={s.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-teal-50/70 border-teal-500 shadow-md ring-2 ring-teal-500/20'
                    : isCompleted
                    ? 'bg-emerald-50/30 border-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black ${
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
                  <h4
                    className={`text-xs sm:text-sm font-extrabold ${
                      isActive ? 'text-navy-900' : isCompleted ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= 3. ACTIVE STAGE INTERACTIVE ACTION CONTROLLER ================= */}
        <div className="mt-8 pt-6 border-t border-slate-100">
          {/* ---------------- STAGE 1: APPLIED (AUTOMATED AI SCREENING) ---------------- */}
          {currentStage === 'Applied' && (
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-teal-50 via-slate-50 to-teal-50 border-2 border-teal-300 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden animate-in fade-in">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-7 h-7 animate-spin text-teal-200" style={{ animationDuration: '3s' }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 border border-teal-300 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                      Automatic AI Screening Active
                    </span>
                    <span className="text-xs text-slate-500">• Automatic Assessment</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-navy-900 mt-1">
                    AI Screening Running Automatically for {candidateName}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                    {autoScreeningStep <= 1 && "Decoupling demographic markers for 100% blind EEOC evaluation..."}
                    {autoScreeningStep === 2 && "Performing contextual semantic matching on engineering competencies & architecture..."}
                    {autoScreeningStep >= 3 && "Computed 8.8 / 10 Match Score! Advancing automatically to Review & Rounds..."}
                  </p>
                </div>
              </div>

              {/* Live Automated Progress Track */}
              <div className="w-full md:w-60 shrink-0 bg-white p-3.5 rounded-2xl border border-teal-200 shadow-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-teal-900 mb-1.5">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                    Automated Scan
                  </span>
                  <span className="font-mono text-teal-600">{autoScreeningStep <= 1 ? '35%' : autoScreeningStep === 2 ? '70%' : '100%'}</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: autoScreeningStep <= 1 ? '35%' : autoScreeningStep === 2 ? '70%' : '100%' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------------- STAGE 2: AI SCREENING (AUTO TRANSITION) ---------------- */}
          {currentStage === 'AI Screening' && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-50 via-emerald-50/40 to-teal-50 border border-teal-200 flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in">
              <div className="flex items-start sm:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-800 px-2.5 py-0.5 rounded-full">
                      Stage 2: AI Screening Completed Automatically
                    </span>
                    <span className="text-xs text-emerald-700 font-bold">✓ Semantic Score: 8.8 / 10</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-navy-900 mt-1">
                    AI Screening Verified Automatically • Transitioning to Review
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                    High semantic fit confirmed. Advancing automatically to company interview rounds.
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-end md:self-auto flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-200 px-3.5 py-2 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
                Loading Company Rounds...
              </div>
            </div>
          )}

          {/* ---------------- STAGE 3: REVIEW (SEQUENTIAL ROUNDS) ---------------- */}
          {currentStage === 'Review' && activeRound && (
            <div className="space-y-4">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-navy-900 to-teal-950 text-white border border-teal-500/30 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-navy-800 relative z-10">
                  <div>
                    {/* Automated AI Screening Verified Badge */}
                    <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-[11px] font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span>✓ AI Screening Completed Automatically: 8.8 / 10 Match Score • Competencies Verified</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-400/30 px-2.5 py-0.5 rounded-full">
                        Stage 3: Review Phase • Round {currentRoundIdx + 1} of {totalRoundsCount}
                      </span>
                      <span className="text-xs text-slate-300">• Selected by HR</span>
                    </div>

                    <h4 className="text-lg sm:text-xl font-black text-white mt-1.5 flex items-center gap-2">
                      <span>{activeRound.name}</span>
                      {activeRound.status === 'completed' && (
                        <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2.5 py-0.5 rounded-full">
                          ✓ Passed ({activeRound.result?.score}%)
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-xl">
                      {activeRound.description}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-slate-400 uppercase font-mono block">
                      Progress in Review
                    </span>
                    <span className="text-base font-black text-teal-300">
                      {completedRoundsCount} / {totalRoundsCount} Rounds Cleared
                    </span>
                  </div>
                </div>

                {/* Sub-state A: Pending HR Approval */}
                {activeRound.status === 'pending_hr_approval' && (
                  <div className="mt-5 p-4 rounded-2xl bg-navy-800/80 border border-amber-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <Lock className="w-5 h-5" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-white">
                          Action Required: Approve Candidate for Round {currentRoundIdx + 1}
                        </h5>
                        <p className="text-xs text-slate-300 mt-0.5">
                          When you click approve, this round will be unlocked and visible to the candidate in their Candidate Portal.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleFinalDecision('Reject')}
                        disabled={actionLoading}
                        className="px-4 py-2.5 rounded-xl border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reject Candidate</span>
                      </button>

                      <Button
                        variant="gradient"
                        size="md"
                        icon={Send}
                        loading={actionLoading}
                        onClick={() => handleOpenInviteModal(currentRoundIdx)}
                        className="shadow-md"
                      >
                        Approve for Round {currentRoundIdx + 1} (Configure Deadline & Slots)
                      </Button>
                    </div>
                  </div>
                )}

                {/* Sub-state B: Sent to Candidate (Awaiting candidate slot confirmation & attendance) */}
                {activeRound.status === 'waiting_candidate' && (
                  <div className="mt-5 p-5 rounded-2xl bg-navy-800/90 border border-teal-400/40 space-y-4 relative z-10">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-700/80">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/40 flex items-center justify-center shrink-0">
                          <Send className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 px-2.5 py-0.5 rounded-full border border-teal-400/30">
                              Status: Sent to Candidate
                            </span>
                            <span className="text-xs text-slate-300">• Invitation Active</span>
                          </div>
                          <h5 className="text-sm sm:text-base font-bold text-white mt-1">
                            Invitation successfully delivered to {candidateName}
                          </h5>
                          <p className="text-xs text-slate-300 mt-0.5">
                            Candidate has received the completion deadline and timing slots. Awaiting candidate to select a slot and attend assessment.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => handleCandidateAttend(currentRoundIdx)}
                          disabled={actionLoading}
                          className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-navy-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-lg cursor-pointer active:scale-95"
                          title="Simulate candidate selecting slot and attending assessment"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Simulate Candidate Attending Round {currentRoundIdx + 1}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleFinalDecision('Reject')}
                          disabled={actionLoading}
                          className="px-3.5 py-2 rounded-xl border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    {/* Invitation Details Summary Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-700">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          ⏱️ Completion Timeframe & Deadline
                        </span>
                        <p className="text-white font-semibold flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>Complete within {activeRound.invitation?.deadlineDays || 3} days (Deadline: <strong className="text-amber-300">{activeRound.invitation?.deadlineDate || '3 days'}</strong>)</span>
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-700">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {activeRound.invitation?.timingSlots?.length > 0 ? `📅 Timing Slots Offered by HR (${activeRound.invitation.timingSlots.length})` : '⚡ Assessment Format'}
                        </span>
                        {activeRound.invitation?.timingSlots?.length > 0 ? (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {activeRound.invitation.timingSlots.map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-navy-800 text-teal-300 text-[11px] font-mono border border-teal-500/30">
                                {s.text || s}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-teal-300 font-semibold text-xs flex items-center gap-1.5 mt-0.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                            <span>Asynchronous 10-Question AI Aptitude Test (Candidate can attend anytime within deadline)</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-state C: Round Completed (Result automatically returned to HR) */}
                {activeRound.status === 'completed' && activeRound.result && (
                  <div className="mt-5 space-y-4 relative z-10">
                    <div className="p-5 rounded-2xl bg-navy-950/90 border border-emerald-500/40 text-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-navy-800">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 flex items-center justify-center font-bold">
                            <Check className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="text-sm font-black text-white flex items-center gap-2">
                              <span>Round {currentRoundIdx + 1} Evaluation Result Received</span>
                              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                                {activeRound.result.status}
                              </span>
                            </h5>
                            <p className="text-[11px] text-slate-400">
                              Evaluated by: <strong className="text-slate-200">{activeRound.result.evaluatedBy}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-baseline gap-1.5 self-start sm:self-auto">
                          <span className="text-2xl font-black text-emerald-300 font-sans">
                            {activeRound.result.rawScore !== undefined ? `${activeRound.result.rawScore} / ${activeRound.result.totalQuestions || 10}` : `${activeRound.result.score}%`}
                          </span>
                          <span className="text-xs text-slate-400">({activeRound.result.score}%)</span>
                        </div>
                      </div>

                      {/* Confidential HR Notice */}
                      <div className="mt-3 p-3 rounded-xl bg-teal-950/60 border border-teal-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-teal-300">
                          <Lock className="w-4 h-4 text-teal-400 shrink-0" />
                          <span>
                            <strong>Confidential HR Evaluation Metric:</strong> Score is strictly hidden from the candidate portal under EEOC Blind Screening. Only HR reviewers have access.
                          </span>
                        </div>
                        {activeRound.result.questionsBreakdown && activeRound.result.questionsBreakdown.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowBreakdown(prev => !prev)}
                            className="px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-400/40 text-teal-300 text-xs font-bold transition-all shrink-0 cursor-pointer"
                          >
                            {showBreakdown ? 'Hide Questions Breakdown' : 'View 10 Questions Breakdown'}
                          </button>
                        )}
                      </div>

                      {/* Detailed Question Breakdown Table (HR Exclusive) */}
                      {showBreakdown && activeRound.result.questionsBreakdown && (
                        <div className="mt-3 p-4 rounded-xl bg-navy-900 border border-navy-800 space-y-3 max-h-72 overflow-y-auto">
                          <h6 className="font-bold text-white text-xs flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                            Question-by-Question Evaluation Breakdown (HR Review Exclusive)
                          </h6>
                          <div className="space-y-2">
                            {activeRound.result.questionsBreakdown.map((q, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-xl border text-xs ${
                                  q.isCorrect
                                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
                                    : 'bg-rose-950/40 border-rose-500/30 text-rose-200'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-bold text-white">Q{idx + 1}: {q.topic}</span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    q.isCorrect ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                                  }`}>
                                    {q.isCorrect ? '✓ Correct' : '✗ Incorrect / Timed Out'}
                                  </span>
                                </div>
                                <p className="text-slate-300 mb-1">{q.question}</p>
                                <div className="text-[11px] text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <span>Candidate: <strong className="text-white">{q.candidateAnswer}</strong></span>
                                  {!q.isCorrect && (
                                    <span>Correct: <strong className="text-emerald-400">{q.correctAnswer}</strong></span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="mt-3 p-3 rounded-xl bg-navy-900/80 border border-navy-800 text-slate-300 leading-relaxed">
                        <p className="font-bold text-teal-300 mb-1 flex items-center gap-1.5 text-xs">
                          <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                          Evaluation Feedback & Remarks:
                        </p>
                        {activeRound.result.feedback}
                      </div>
                    </div>

                    {/* HR Advance Button to next round or final decision */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => handleFinalDecision('Reject')}
                        disabled={actionLoading}
                        className="px-4 py-2.5 rounded-xl border border-rose-400/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400" />
                        <span>Reject Candidate</span>
                      </button>

                      <Button
                        variant="gradient"
                        size="md"
                        icon={ArrowRight}
                        loading={actionLoading}
                        onClick={handleProceedNextRound}
                        className="shadow-md"
                      >
                        {currentRoundIdx + 1 < totalRoundsCount
                          ? `Approve & Proceed to Round ${currentRoundIdx + 2}`
                          : 'All Rounds Passed • Proceed to Final Decision'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ---------------- STAGE 4: FINAL DECISION (APPROVE OR REJECT) ---------------- */}
          {currentStage === 'Final Decision' && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-2 border-emerald-300 shadow-md">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-emerald-200">
                <div className="flex items-start sm:items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                    <Award className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                        Stage 4: Final Hiring Decision
                      </span>
                      <span className="text-xs text-emerald-700 font-bold">
                        ✓ All {totalRoundsCount} Specified Rounds Completed
                      </span>
                    </div>
                    <h4 className="text-lg sm:text-xl font-black text-navy-900 mt-1">
                      Candidate has completed all company evaluation rounds!
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                      Review completed assessment scores across all {totalRoundsCount} rounds. You can now make the final step-by-step decision: <strong>Approve & Extend Offer</strong> or <strong>Reject Candidate</strong>.
                    </p>
                  </div>
                </div>

                {/* Approve or Reject buttons */}
                <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                  <button
                    type="button"
                    onClick={() => handleFinalDecision('Reject')}
                    disabled={actionLoading}
                    className="px-5 py-3 rounded-2xl border-2 border-rose-300 bg-white hover:bg-rose-50 text-rose-700 text-xs font-black transition-all flex items-center gap-2 shadow-xs cursor-pointer active:scale-95"
                  >
                    <ThumbsDown className="w-4 h-4" />
                    <span>Reject Candidate</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFinalDecision('Offer')}
                    disabled={actionLoading}
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/20 cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Approve Candidate & Extend Job Offer</span>
                  </button>
                </div>
              </div>

              {/* Summary of all rounds performance */}
              <div className="mt-5">
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
                  Complete Evaluation Rounds Summary:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {rounds.map((r, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs">
                      <div className="flex items-center justify-between font-bold text-navy-900">
                        <span>Round {r.round || i + 1}: {r.name}</span>
                        <span className="text-emerald-700">{r.result?.score}%</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {r.result?.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- STAGE 5: COMPLETED (OFFER OR REJECTED) ---------------- */}
          {currentStage === 'Completed' && (
            <div
              className={`p-6 sm:p-8 rounded-3xl border-2 shadow-md ${
                hiringState.finalDecision === 'Offered'
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300'
                  : 'bg-gradient-to-r from-rose-50 via-slate-50 to-rose-50 border-rose-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                      hiringState.finalDecision === 'Offered'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {hiringState.finalDecision === 'Offered' ? (
                      <Award className="w-7 h-7" />
                    ) : (
                      <ThumbsDown className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        hiringState.finalDecision === 'Offered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}
                    >
                      {hiringState.finalDecision === 'Offered'
                        ? '✓ Final Decision: Job Offer Extended'
                        : 'Final Decision: Application Rejected'}
                    </span>
                    <h4 className="text-lg sm:text-xl font-black text-navy-900 mt-1">
                      {hiringState.finalDecision === 'Offered'
                        ? `Congratulations! ${candidateName} has been approved for hire.`
                        : `Application concluded for ${candidateName}.`}
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {hiringState.finalDecision === 'Offered'
                        ? 'Official compensation benchmarks and offer letter have been issued in the candidate portal.'
                        : 'Transparent feedback and closure notice logged under EEOC parity compliance.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={handleResetFlow}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Re-test Process</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= ROUND INVITATION CONFIGURATION MODAL (HR PROMPT FOR DEADLINE & TIMING SLOTS) ================= */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-7 relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100 relative z-10">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-navy-900 text-white flex items-center justify-center font-black shadow-md shrink-0">
                  <Calendar className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-700 border border-teal-200 px-2.5 py-0.5 rounded-full">
                      Configure Round Invitation
                    </span>
                    <span className="text-xs text-slate-400">Round {inviteRoundIndex + 1} of {totalRoundsCount}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-navy-900 mt-0.5">
                    {rounds[inviteRoundIndex]?.name || `Round ${inviteRoundIndex + 1}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Candidate: <strong className="text-navy-900">{candidateName}</strong>
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Questions */}
            <div className="py-5 space-y-5 relative z-10 text-xs text-slate-700">
              
              {/* Question 1: Completion Deadline / Days */}
              <div>
                <label className="block font-black text-navy-900 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  <span>When should the candidate complete this round? (Deadline)</span>
                </label>
                <p className="text-[11px] text-slate-500 mb-2.5">
                  Select the allowed timeframe or specify how many days the candidate has to attend & complete this round.
                </p>

                {/* Selectable Days Boxes */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { days: 2, label: '2 Days', desc: 'Fast track' },
                    { days: 3, label: '3 Days', desc: 'Recommended' },
                    { days: 5, label: '5 Days', desc: 'Extended' },
                    { days: 7, label: '7 Days', desc: '1 Week' }
                  ].map((item) => {
                    const isSelected = Number(deadlineDays) === item.days;
                    return (
                      <button
                        key={item.days}
                        type="button"
                        onClick={() => setDeadlineDays(item.days)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 text-white border-teal-600 shadow-md ring-2 ring-teal-500/20'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                        }`}
                      >
                        <span className="block text-xs font-black">
                          {item.label}
                        </span>
                        <span className={`block text-[10px] mt-0.5 ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                          {item.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Calculated deadline preview banner */}
                <div className="mt-2.5 p-2.5 rounded-xl bg-teal-50/80 border border-teal-200 flex items-center justify-between text-xs text-teal-900">
                  <span className="font-semibold">Candidate Submission Deadline:</span>
                  <span className="font-black text-teal-700">
                    {new Date(Date.now() + Number(deadlineDays) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })} (in {deadlineDays} days)
                  </span>
                </div>
              </div>

              {/* Question 2: Timing Slots (Only required for Round 3 Live Interview; Round 1 & 2 are asynchronous aptitude assessments) */}
              {inviteRoundIndex >= 2 ? (
                <div>
                  <label className="block font-black text-navy-900 text-xs sm:text-sm mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-teal-600" />
                    <span>Round 3 Live Interview Timing Slots (Given by HR)</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2.5">
                    Provide available live interview slots. The candidate will see these slots in their interface and choose their preferred slot.
                  </p>

                  {/* Slots List */}
                  <div className="space-y-2 mb-3 max-h-48 overflow-y-auto pr-1">
                    {timingSlots.map((slotText, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 group hover:border-teal-300 transition-all"
                      >
                        <div className="flex items-center gap-2 text-xs font-mono text-navy-900">
                          <span className="w-5 h-5 rounded-lg bg-teal-100 text-teal-800 text-[10px] font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{slotText}</span>
                        </div>

                        {timingSlots.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTimingSlot(idx)}
                            className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Remove slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add New Slot Input */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newSlotInput}
                      onChange={(e) => setNewSlotInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTimingSlot();
                        }
                      }}
                      placeholder="e.g. Friday • 03:00 PM - 04:00 PM EST"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                    />
                    <button
                      type="button"
                      onClick={handleAddTimingSlot}
                      disabled={!newSlotInput.trim()}
                      className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Slot</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-teal-900 font-extrabold text-xs sm:text-sm">
                    <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Asynchronous AI Aptitude Assessment (Round {inviteRoundIndex + 1})</span>
                  </div>
                  <p className="text-xs text-teal-700 leading-relaxed">
                    Specific timing slots are <strong>not needed</strong> for Round {inviteRoundIndex + 1}. Once you send this invitation, the candidate can start and complete their 10-question AI Aptitude Assessment <strong>anytime before the {deadlineDays}-day deadline</strong>.
                  </p>
                </div>
              )}

              {/* Instructions / Notes (Optional) */}
              <div>
                <label className="block font-bold text-slate-700 text-xs mb-1">
                  Candidate Assessment Instructions & Notes (Optional):
                </label>
                <textarea
                  rows={2}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Notes for the candidate..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-slate-50"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5 relative z-10">
              <button
                type="button"
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Cancel
              </button>

              <Button
                variant="gradient"
                size="md"
                icon={Send}
                loading={actionLoading}
                onClick={handleSendRoundInvitation}
                className="shadow-md"
              >
                Send Invitation to Candidate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateHiringWorkflow;
