import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import SlotSelector from '../../components/interviews/SlotSelector';
import Toast from '../../components/common/Toast';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useCandidates } from '../../hooks/useCandidates';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import {
  approveCandidateInStore,
  revokeCandidateApprovalInStore
} from '../../services/candidateApi';
import {
  Lock,
  Unlock,
  CheckCircle2,
  Video,
  Calendar,
  Clock,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
  UserCheck,
  AlertCircle,
  HelpCircle,
  RefreshCw
} from 'lucide-react';

const InterviewBooking = () => {
  const { currentCandidate, fetchCandidateStatus, confirmInterviewSlot, loading } = useCandidates();
  const { user, switchRole } = useAuth();

  // Resolve candidate ID from authenticated session — no hardcoded fallback.
  const activeCandidateId =
    user?.id ||
    (typeof window !== 'undefined' ? localStorage.getItem('fairhire_active_candidate_id') : null) ||
    null;

  const [toastMessage, setToastMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!activeCandidateId) return;

    fetchCandidateStatus(activeCandidateId);

    // Re-fetch authoritative status when HR pushes an update event.
    const handleUpdate = () => {
      fetchCandidateStatus(activeCandidateId);
    };

    window.addEventListener('fairhire_candidate_status_updated', handleUpdate);
    window.addEventListener('fairhire_application_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('fairhire_candidate_status_updated', handleUpdate);
      window.removeEventListener('fairhire_application_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [fetchCandidateStatus, activeCandidateId]);

  const handleConfirmSlot = async (slot) => {
    if (!activeCandidateId) return;
    setSubmitting(true);
    const res = await confirmInterviewSlot(activeCandidateId, slot);
    setSubmitting(false);

    if (res.success) {
      setToastMessage(`Interview slot confirmed for ${slot.date} at ${slot.time}!`);
    }
  };

  // Demo simulation controls — use real candidate ID so mock store stays coherent.
  const handleSimulateHrApproval = () => {
    if (!activeCandidateId) return;
    approveCandidateInStore(activeCandidateId);
    // Trigger re-fetch so the component picks up the updated mock store state.
    fetchCandidateStatus(activeCandidateId);
    setToastMessage('✓ HR Approval simulated! Interview booking is now UNLOCKED.');
  };

  const handleSimulateReLock = () => {
    if (!activeCandidateId) return;
    revokeCandidateApprovalInStore(activeCandidateId);
    fetchCandidateStatus(activeCandidateId);
    setToastMessage('🔒 Candidate status reverted to Screened. Interview booking is now BLOCKED.');
  };

  if (loading && !currentCandidate) {
    return (
      <DashboardLayout>
        <div className="h-96 flex items-center justify-center">
          <Loader size="lg" color="teal" />
        </div>
      </DashboardLayout>
    );
  }

  // No authenticated candidate ID — show an informational empty state.
  if (!activeCandidateId) {
    return (
      <DashboardLayout>
        <PageHeader
          title="Interview Booking"
          subtitle="Sign in as a candidate to access your interview booking."
        />
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto shadow-sm my-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-navy-900 mb-2">No Candidate Session Found</h3>
          <p className="text-sm text-slate-500 mb-6">
            Please sign in as a candidate to view your interview booking status.
          </p>
          <Link to="/candidate/status">
            <Button variant="gradient" size="md" icon={Award}>
              Go to Application Status
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  // Candidate data: prefer live Supabase data from useCandidates; fall back to minimal structure.
  const cand = currentCandidate || {
    id: activeCandidateId,
    status: 'Applied',
    interviewSlots: [
      { id: 'SLOT-101', date: '2026-09-12', time: '10:00 AM - 11:00 AM EST', status: 'available' },
      { id: 'SLOT-102', date: '2026-09-12', time: '02:00 PM - 03:00 PM EST', status: 'available' },
      { id: 'SLOT-103', date: '2026-09-13', time: '11:30 AM - 12:30 PM EST', status: 'available' }
    ]
  };

  // Interview eligibility is derived from the authoritative Supabase candidate status —
  // NOT from localStorage. These statuses match the PIPELINE_STATUS_MAP in candidateApi.js.
  const INTERVIEW_ELIGIBLE_STATUSES = [
    'Shortlisted',
    'Interview Scheduled',
    'Interviewed',
    'Offered',
    'Hired',
  ];
  const isApproved = INTERVIEW_ELIGIBLE_STATUSES.includes(cand.status);

  return (
    <DashboardLayout>
      <PageHeader
        title="Interview Booking"
        subtitle={
          isApproved
            ? "Your application is approved! Select and confirm your interview slot below."
            : "Self-service interview booking unlocks automatically once HR approves your application."
        }
        actions={
          <div className="flex items-center gap-2">
            <Link to="/candidate/status">
              <Button variant="outline" size="sm" icon={Award}>
                Application Status
              </Button>
            </Link>
            <Link to="/candidate">
              <Button variant="outline" size="sm" icon={BookOpen}>
                Preparation Guide
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-8 max-w-4xl mx-auto pb-12">

        {/* ================= CASE 1: BLOCKED UNTIL HR APPROVES ================= */}
        {!isApproved && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Main Blocked Notice Card */}
            <div className="bg-white rounded-3xl border border-amber-200/90 shadow-sm p-8 sm:p-10 text-center relative overflow-hidden">
              {/* Subtle ambient amber glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

              <div className="relative z-10 max-w-2xl mx-auto">
                {/* Lock Badge & Icon */}
                <div className="w-18 h-18 rounded-3xl bg-amber-50 border-2 border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <Lock className="w-9 h-9 text-amber-600" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold mb-3">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                  <span>Interview Booking Blocked — Pending HR Approval</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                  Interview Scheduling is Currently Locked
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
                  In accordance with FairHire zero-bias protocols, your anonymized portfolio is currently undergoing human review by the engineering hiring team. Self-service interview booking will <strong>automatically unlock</strong> once a recruiter approves your credentials for the technical round.
                </p>

                {/* 4-Stage Visual Timeline */}
                <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
                    <span>Hiring Pipeline Stage Progress</span>
                    <span className="text-amber-700 font-bold">Stage 3 In Progress</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="p-3 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Completed</span>
                      </span>
                      <p className="text-xs font-bold text-navy-900 mt-1">1. Application Intake</p>
                      <span className="text-[10px] text-slate-400">Demographics anonymized</span>
                    </div>

                    <div className="p-3 rounded-xl bg-white border border-emerald-200 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Score: 8.8/10</span>
                      </span>
                      <p className="text-xs font-bold text-navy-900 mt-1">2. AI Screening</p>
                      <span className="text-[10px] text-slate-400">Semantic match passed</span>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border-2 border-amber-300 flex flex-col justify-between shadow-xs">
                      <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        <span>Active Review</span>
                      </span>
                      <p className="text-xs font-black text-amber-950 mt-1">3. HR Review</p>
                      <span className="text-[10px] text-amber-700 font-semibold">Awaiting HR Approval</span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-100/70 border border-slate-200 text-slate-400 flex flex-col justify-between">
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Lock className="w-3 h-3 text-slate-400" />
                        <span>Locked</span>
                      </span>
                      <p className="text-xs font-bold text-slate-500 mt-1">4. Interview Booking</p>
                      <span className="text-[10px] text-slate-400">Unlocks on HR approval</span>
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link to="/candidate/status" className="w-full sm:w-auto">
                    <Button variant="gradient" size="md" icon={Award} className="w-full sm:w-auto shadow-md">
                      Check Live Status Tracker
                    </Button>
                  </Link>

                  <Link to="/candidate" className="w-full sm:w-auto">
                    <Button variant="outline" size="md" icon={BookOpen} className="w-full sm:w-auto">
                      Explore Interview Prep Guides
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Quick Testing & Simulation Toolbar (For Interactive Paired Evaluation) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/40 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-navy-900">Interactive Demo Evaluation Toolbar</h4>
                  <p className="text-[11px] text-slate-500">
                    You can switch to the Recruiter Portal to approve the candidate, or test instant unlocking below:
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSimulateHrApproval}
                  className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Simulate HR Approval</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    switchRole(ROLES.RECRUITER);
                  }}
                  className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-950 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Switch to HR Portal</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ================= CASE 2: HR HAS APPROVED — UNLOCKED ================= */}
        {isApproved && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Approved Celebration Banner */}
            <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg border border-emerald-400/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white/20 text-white flex items-center justify-center shrink-0 shadow-inner">
                  <Unlock className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                      ✓ HR Approved
                    </span>
                    <span className="text-xs text-emerald-100">• Booking Unlocked</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1">
                    You have been approved for the Technical Interview Round!
                  </h4>
                  <p className="text-xs text-teal-100 mt-0.5">
                    Please select your preferred date &amp; time slot below to confirm your interview appointment.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={handleSimulateReLock}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                  title="Re-lock to test blocked state again"
                >
                  <Lock className="w-3 h-3" />
                  <span>Re-Lock for Demo</span>
                </button>
              </div>
            </div>

            {/* If slot is already confirmed */}
            {cand.selectedSlot ? (
              <div className="bg-white rounded-3xl border border-emerald-200 p-8 shadow-sm text-center flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-0.5 rounded-full">
                    Confirmed Reservation
                  </span>
                  <h3 className="text-2xl font-black text-navy-900 mt-2">Interview Scheduled &amp; Confirmed!</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Your appointment is locked for <strong>{cand.selectedSlot.date}</strong> at <strong>{cand.selectedSlot.time}</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 font-bold text-navy-900">
                    <Video className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Video Conference Room:</span>
                  </div>
                  <a
                    href="https://fairhire.meet/room-301"
                    target="_blank"
                    rel="noreferrer"
                    className="text-teal-600 font-bold underline hover:text-teal-700"
                  >
                    https://fairhire.meet/room-301
                  </a>
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      confirmInterviewSlot(activeCandidateId, null);
                      setToastMessage('Slot cleared. You can select another time.');
                    }}
                    className="text-xs font-bold text-slate-500 hover:text-navy-900 underline cursor-pointer"
                  >
                    Reschedule or Change Slot
                  </button>
                </div>
              </div>
            ) : (
              /* Slot Selector */
              <SlotSelector
                slots={cand.interviewSlots || []}
                onConfirmSlot={handleConfirmSlot}
                isSubmitting={submitting}
              />
            )}

          </div>
        )}

      </div>

      <Toast message={toastMessage} onClose={() => setToastMessage('')} />
    </DashboardLayout>
  );
};

export default InterviewBooking;
