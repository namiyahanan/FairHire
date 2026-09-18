import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Sparkles,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  BrainCircuit,
  FileCheck,
  ChevronLeft,
  Lock,
  Layers
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import AiAptitudeAssessment from '../../components/candidates/AiAptitudeAssessment';
import { startAssessment, submitAssessment, checkCandidateAssessmentResult } from '../../services/candidateApi';
import { useAuth } from '../../hooks/useAuth';

const CandidateAssessmentPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [candidateId, setCandidateId] = useState(() => {
    return (
      searchParams.get('candidateId') ||
      user?.id ||
      (typeof window !== 'undefined' ? localStorage.getItem('fairhire_active_candidate_id') : null) ||
      'C011'
    );
  });

  const [trackId, setTrackId] = useState(() => {
    return searchParams.get('trackId') || 'backend-developer';
  });

  const [roleTitle, setRoleTitle] = useState(() => {
    const t = searchParams.get('trackId') || 'backend-developer';
    return t === 'WEB' ? 'Frontend Engineer' : 'Backend Developer';
  });

  const [assessmentId, setAssessmentId] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [startError, setStartError] = useState(null);
  const [isAssessmentActive, setIsAssessmentActive] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Single-attempt check
  const [existingResult, setExistingResult] = useState(null);
  const [checkingExisting, setCheckingExisting] = useState(true);

  // Check if candidate already attended & completed the assessment
  useEffect(() => {
    let cancelled = false;
    const checkStatus = async () => {
      setCheckingExisting(true);
      try {
        const res = await checkCandidateAssessmentResult(candidateId, trackId);
        if (!cancelled && res) {
          setExistingResult(res);
        }
      } catch (e) {
        console.warn('Error checking existing assessment:', e);
      } finally {
        if (!cancelled) setCheckingExisting(false);
      }
    };

    checkStatus();
    return () => {
      cancelled = true;
    };
  }, [candidateId, trackId]);

  // Sync candidateId from storage if changed
  useEffect(() => {
    const storedId = localStorage.getItem('fairhire_active_candidate_id');
    if (storedId && !searchParams.get('candidateId')) {
      setCandidateId(storedId);
    }
  }, [searchParams]);


  const handleStart = async () => {
    if (existingResult) {
      alert('You have already completed this assessment. Multiple attempts are not permitted.');
      return;
    }

    setIsStarting(true);
    setStartError(null);

    const activeCand = candidateId || 'C011';
    const activeTrack = trackId || 'backend-developer';

    try {
      // startAssessment now always resolves a valid UUID (webhook → DB fallback → crypto.randomUUID)
      const result = await startAssessment({
        candidateId: activeCand,
        trackId: activeTrack
      });

      const aId = result?.assessment_id;
      console.log('[FairHire] Assessment starting with ID:', aId);
      setAssessmentId(aId);
    } catch (err) {
      console.error('[FairHire] startAssessment failed entirely:', err.message);
      // This should not happen anymore since startAssessment handles all fallbacks internally
      setStartError('Could not initialize assessment. Please refresh and try again.');
    } finally {
      setIsAssessmentActive(true);
      setIsStarting(false);
    }
  };


  const handleComplete = async (submission) => {
    setIsSubmitting(true);
    try {
      const res = await submitAssessment({
        candidateId: candidateId || 'C011',
        assessmentId: assessmentId || submission.assessmentId,
        trackId: trackId || 'backend-developer',
        answers: submission.answers,
        timeSpentSeconds: submission.timeSpentSeconds
      });

      setSubmissionResult(res);
      setExistingResult(res?.persistedResult || {
        candidate_id: candidateId,
        track_id: trackId,
        status: 'completed',
        score: res?.score,
        total_score: res?.total_score,
        percentage: res?.percentage,
        completed_at: new Date().toISOString()
      });
      setIsAssessmentActive(false);
    } catch (e) {
      console.error('[FairHire] Submission error:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <PageHeader
        title="AI Technical Assessment"
        subtitle="Role-tailored 20-question evaluation powered by FairHire live proctoring & Supabase integration."
        actions={
          <Link to="/candidate/status">
            <Button variant="outline" size="sm" icon={ChevronLeft}>
              Application Status
            </Button>
          </Link>
        }
      />

      {/* Main Container */}
      <div className="max-w-4xl mx-auto space-y-6">
        {startError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-between gap-3 text-xs font-semibold">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{startError}</span>
            </div>
            <button
              onClick={() => setStartError(null)}
              className="text-rose-600 hover:text-rose-800 font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {checkingExisting ? (
          <div className="p-12 text-center text-slate-500 text-sm flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 animate-spin text-teal-600" />
            <span>Checking evaluation records in Supabase...</span>
          </div>
        ) : existingResult ? (
          /* Assessment Already Completed View (Single Attempt Enforced) */
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 px-3.5 py-1 rounded-full inline-block">
                ✓ Evaluation Completed & Stored
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-950">
                Assessment Already Completed
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
                You have successfully completed your {roleTitle} Technical Evaluation. Your results have been evaluated and securely submitted to the HR Recruiter team.
              </p>
            </div>

            {/* Assessment Details Card */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate</span>
                <span className="font-mono font-bold text-navy-900">{existingResult.candidate_id || candidateId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Track</span>
                <span className="font-mono font-bold text-navy-900">{existingResult.track_id || trackId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Score</span>
                <span className="font-mono font-bold text-emerald-700">
                  {existingResult.score !== undefined
                    ? `${existingResult.score}/${existingResult.total_score || 20} (${existingResult.percentage}%)`
                    : 'Evaluated'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Status</span>
                <span className="font-bold text-teal-700 capitalize">{existingResult.status || 'Completed'}</span>
              </div>
            </div>

            {/* Fairness notice */}
            <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs text-teal-900 flex items-start gap-2.5 text-left">
              <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Single Attempt Fairness Rule:</span>
                <span>
                  To comply with FairHire algorithmic fairness and EEOC parity benchmarks, technical aptitude evaluations are limited to one single attempt per candidate application.
                </span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/candidate/status" className="w-full sm:w-auto">
                <Button variant="gradient" size="md" icon={ArrowRight} className="w-full">
                  View Live Application Tracker
                </Button>
              </Link>
              <Link to="/candidate" className="w-full sm:w-auto">
                <Button variant="outline" size="md" className="w-full">
                  Candidate Dashboard
                </Button>
              </Link>
            </div>
          </div>
        ) : !isAssessmentActive ? (
          /* Pre-Assessment Overview & Launch Card */
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-navy-950 via-slate-900 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-teal-500/30 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-6">
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full border border-teal-400/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Round 2: Technical & Coding Assessment
                  </span>
                  <span className="text-xs text-slate-300">• Live Evaluator</span>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-white">
                    {roleTitle} Technical Evaluation
                  </h2>
                  <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
                    This assessment tests your hands-on competencies in <strong>{roleTitle}</strong> engineering.
                    Exactly 20 AI-generated multiple choice questions loaded directly from the database.
                  </p>
                </div>

                {/* Grid of Key Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-teal-400">
                      <Layers className="w-4 h-4" />
                      <span className="text-[11px] uppercase font-bold text-slate-400">Question Format</span>
                    </div>
                    <p className="text-base font-extrabold text-white">20 Technical MCQs</p>
                    <p className="text-[11px] text-slate-400">4 options per question</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span className="text-[11px] uppercase font-bold text-slate-400">Timer Pacing</span>
                    </div>
                    <p className="text-base font-extrabold text-white">60 Seconds / Q</p>
                    <p className="text-[11px] text-slate-400">Auto-advances on timeout</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-900/80 border border-slate-800 space-y-1">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[11px] uppercase font-bold text-slate-400">Confidentiality</span>
                    </div>
                    <p className="text-base font-extrabold text-white">Blind Evaluation</p>
                    <p className="text-[11px] text-slate-400">Results sent straight to HR</p>
                  </div>
                </div>

                {/* Candidate and Track selector */}
                <div className="pt-2 p-4 rounded-2xl bg-navy-900/60 border border-navy-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Candidate Session</span>
                    <p className="text-xs text-slate-200">
                      Active Candidate ID: <strong className="text-teal-300 font-mono">{candidateId}</strong> • Track:{' '}
                      <strong className="text-teal-300 font-mono">{trackId}</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={isStarting}
                    onClick={handleStart}
                    className={`w-full sm:w-auto px-8 py-4 rounded-2xl text-navy-950 font-black text-sm shadow-xl transition-all flex items-center justify-center gap-2.5 cursor-pointer active:scale-95 ${
                      isStarting
                        ? 'bg-teal-300 opacity-80 cursor-not-allowed'
                        : 'bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-400 hover:from-teal-300 hover:to-emerald-300 hover:shadow-teal-500/25'
                    }`}
                  >
                    {isStarting ? (
                      <>
                        <Clock className="w-5 h-5 animate-spin" />
                        <span>Initializing Assessment...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 text-navy-950" />
                        <span>Start Assessment Now</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Proctoring & Integrity Guidelines */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-navy-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Assessment Instructions & Integrity Rules
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <h4 className="font-bold text-navy-900">1. Full-Screen Proctoring</h4>
                  <p>
                    The assessment runs in locked full-screen mode. Exiting full-screen or switching tabs is monitored and logged in the evaluation audit.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <h4 className="font-bold text-navy-900">2. Real-Time Countdown</h4>
                  <p>
                    Each question has a dedicated 60-second timer. Selected answers are preserved automatically when the timer expires.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <h4 className="font-bold text-navy-900">3. Role-Aligned Difficulty</h4>
                  <p>
                    All 20 questions are generated specifically for the required skills in this engineering track.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <h4 className="font-bold text-navy-900">4. Parity & Blind Evaluation</h4>
                  <p>
                    Candidate names and demographic data are masked during technical evaluation to eliminate bias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Proctored Assessment Container */
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 relative overflow-hidden animate-in fade-in duration-300">
            <AiAptitudeAssessment
              assessmentId={assessmentId}
              roleTitle={roleTitle}
              roundName="Technical & Coding Assessment"
              candidateId={candidateId}
              onComplete={handleComplete}
              onClose={() => setIsAssessmentActive(false)}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CandidateAssessmentPage;
