import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Send,
  X,
  Lock,
  Check,
  Monitor,
  FileText,
  AlertTriangle,
  Eye,
  Info,
  Wifi,
  Volume2,
  BookOpen,
  ChevronRight,
  User,
  Camera,
  Maximize2
} from 'lucide-react';
import Button from '../common/Button';
import { getAptitudeQuestionsForRole } from '../../data/aptitudeQuestions';
import { getAssessmentQuestions } from '../../services/candidateApi';

// ─── PHASES ───────────────────────────────────────────────────────────────────
// 'guidelines' → show rules / start screen
// 'active'     → full-screen proctored questions
// 'submitted'  → completion screen
// ──────────────────────────────────────────────────────────────────────────────

const AiAptitudeAssessment = ({
  roleTitle = 'Frontend Engineer',
  roundName = 'Technical & Coding Assessment',
  candidateId = 'CAND-8492',
  assessmentId = null,
  onComplete,
  onClose
}) => {
  // ── questions loading & state ────────────────────────────────────────────────
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [questionsError, setQuestionsError] = useState(null);
  const totalQuestions = questions.length;

  useEffect(() => {
    if (!assessmentId) {
      // If assessmentId is missing, do not attempt to query Supabase
      const staticBank = getAptitudeQuestionsForRole(roleTitle);
      const normalized = (staticBank || []).map((q, idx) => ({
        question_id: String(q.id),
        category: q.topic,
        question_text: q.question,
        options: q.options,
        question_order: idx + 1
      }));
      setQuestions(normalized);
      setQuestionsLoading(false);
      setQuestionsError(null);
      return;
    }

    let isMounted = true;
    const fetchQuestions = async () => {
      setQuestionsLoading(true);
      setQuestionsError(null);
      try {
        const rows = await getAssessmentQuestions(assessmentId);
        if (isMounted) {
          const normalized = (rows || []).map(q => ({
            ...q,
            options: Array.isArray(q.options)
              ? q.options
              : (typeof q.options === 'string' ? JSON.parse(q.options) : [])
          }));
          setQuestions(normalized);
        }
      } catch (err) {
        if (isMounted) {
          setQuestionsError(err.message || 'Failed to load assessment questions.');
        }
      } finally {
        if (isMounted) {
          setQuestionsLoading(false);
        }
      }
    };

    fetchQuestions();
    return () => {
      isMounted = false;
    };
  }, [assessmentId, roleTitle]);

  // ── phase state ──────────────────────────────────────────────────────────────
  const [phase, setPhase] = useState('guidelines'); // 'guidelines' | 'active' | 'submitted'

  // ── exam state ───────────────────────────────────────────────────────────────
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60);
  const [timeExpiredAlert, setTimeExpiredAlert] = useState(false);
  const [startTime] = useState(() => Date.now());

  // ── fullscreen / proctoring state ────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [launchError, setLaunchError] = useState('');

  // ── guidelines checklist (all must be checked) ───────────────────────────────
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);

  // refs for stale-closure safety
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentQuestion?.question_id];

  // ── fullscreen API ──────────────────────────────────────────────────────────
  const launchProctoredExam = useCallback(() => {
    const examElement = document.documentElement;
    examElement.requestFullscreen()
      .then(() => {
        setIsFullscreen(true);
        setFullscreenWarning(false);
        setPhase('active');
      })
      .catch(() => {
        setLaunchError('You must allow fullscreen mode to take this proctored assessment. Please click "Start Assessment" again and allow fullscreen when prompted by your browser.');
      });
  }, []);

  // detect fullscreen exit
  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      );
      setIsFullscreen(inFullscreen);

      if (!inFullscreen && phaseRef.current === 'active') {
        setFullscreenWarning(true);
        setFullscreenExitCount(prev => prev + 1);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // re-enter fullscreen handler
  const reEnterFullscreen = () => {
    document.documentElement.requestFullscreen().then(() => {
      setIsFullscreen(true);
      setFullscreenWarning(false);
    }).catch(() => {});
  };

  // ── question timer ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;

    setTimeLeft(60);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleAutoAdvance();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, phase]);

  const handleAutoAdvance = () => {
    const idx = currentIndexRef.current;
    if (idx < totalQuestions - 1) {
      setTimeExpiredAlert(true);
      setTimeout(() => setTimeExpiredAlert(false), 2500);
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handleSelectOption = (optionText) => {
    if (!currentQuestion) return;
    setAnswers(prev => ({ ...prev, [currentQuestion.question_id]: optionText }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = useCallback(() => {
    const currentAnswers = answersRef.current;
    const totalTimeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    // exit fullscreen on submit
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }

    setPhase('submitted');

    if (onComplete) {
      const formattedAnswers = questions.map(q => ({
        question_id: q.question_id,
        selected_answer: currentAnswers[q.question_id] || ''
      }));

      onComplete({
        assessmentId,
        candidateId,
        answers: formattedAnswers,
        rawAnswers: currentAnswers,
        totalQuestions,
        timeSpentSeconds: totalTimeSpentSeconds,
        fullscreenExits: fullscreenExitCount,
        feedback: `Candidate completed ${totalQuestions}-question AI Aptitude Assessment.`
      });
    }
  }, [assessmentId, candidateId, questions, totalQuestions, startTime, fullscreenExitCount, onComplete]);

  // ── derived ─────────────────────────────────────────────────────────────────
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
  const isLastQuestion = totalQuestions > 0 && currentIndex === totalQuestions - 1;
  const timerColor =
    timeLeft <= 10
      ? 'text-rose-600 bg-rose-50 border-rose-300 animate-pulse'
      : timeLeft <= 20
      ? 'text-amber-600 bg-amber-50 border-amber-300'
      : 'text-teal-700 bg-teal-50 border-teal-200';

  // ============================================================================
  // LOADING / ERROR STATES
  // ============================================================================
  if (questionsLoading) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto animate-spin">
          <Clock className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-navy-900">Loading your assessment...</h4>
          <p className="text-xs text-slate-500">
            Fetching technical aptitude questions from secure evaluation server.
          </p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4 animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-extrabold text-navy-900">Unable to Load Assessment</h4>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{questionsError}</p>
        </div>
        <div className="pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Assessment
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PHASE: SUBMITTED / COMPLETION SCREEN
  // ============================================================================
  if (phase === 'submitted') {
    return (
      <div className="p-6 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2 max-w-md mx-auto">
          <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Assessment Submitted
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
            Aptitude Assessment Recorded
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Your responses for all <strong className="text-navy-900">{totalQuestions} technical aptitude questions</strong> have been cryptographically sealed and transmitted directly to the HR evaluation committee.
          </p>
        </div>

        {/* Blind Screening & Confidentiality */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-navy-900">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>FairHire Blind Screening Confidentiality Protocol</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            To ensure zero demographic bias and objective review, raw aptitude scores and question breakdowns are restricted to the <strong>HR recruiter & evaluating engineering panel</strong>. You will receive transparent milestone notifications in your Application Tracker.
          </p>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Candidate Token: <strong className="text-teal-700 font-mono">{candidateId}-EEOC</strong></span>
            <span className="text-emerald-700 font-bold">✓ Delivered to HR Dashboard</span>
          </div>
        </div>

        <div className="pt-3">
          <Button variant="gradient" size="md" icon={ArrowRight} onClick={onClose} className="shadow-md">
            Return to Application Tracker
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PHASE: GUIDELINES / START SCREEN
  // ============================================================================
  if (phase === 'guidelines') {
    const guidelines = [
      {
        icon: <Monitor className="w-5 h-5 text-indigo-600" />,
        color: 'bg-indigo-50 border-indigo-200',
        title: 'Fullscreen Mode Required',
        desc: 'The assessment runs in locked fullscreen. Exiting fullscreen (e.g. pressing Esc) is detected and flagged to the HR panel.'
      },
      {
        icon: <Clock className="w-5 h-5 text-amber-600" />,
        color: 'bg-amber-50 border-amber-200',
        title: '1 Minute Per Question',
        desc: `You have exactly 60 seconds per question. The timer auto-advances to the next question when time is up — unanswered questions are recorded as "Timed Out".`
      },
      {
        icon: <FileText className="w-5 h-5 text-teal-600" />,
        color: 'bg-teal-50 border-teal-200',
        title: `${totalQuestions || 20} Questions Total`,
        desc: `All ${totalQuestions || 20} questions are role-specific to ${roleTitle}. Questions cover core technical aptitude, problem-solving, and domain knowledge.`
      },
      {
        icon: <Eye className="w-5 h-5 text-rose-600" />,
        color: 'bg-rose-50 border-rose-200',
        title: 'Scores Are Confidential',
        desc: 'Your marks and score are never shown to you. Only the HR recruiter and the evaluation panel can access the results — ensuring unbiased, blind screening.'
      },
      {
        icon: <AlertTriangle className="w-5 h-5 text-orange-600" />,
        color: 'bg-orange-50 border-orange-200',
        title: 'No Tab Switching / No Refresh',
        desc: 'Any attempt to switch tabs, refresh the page, or leave the assessment will be flagged. Complete the assessment in one uninterrupted session.'
      },
      {
        icon: <Wifi className="w-5 h-5 text-slate-600" />,
        color: 'bg-slate-50 border-slate-200',
        title: 'Stable Internet Required',
        desc: 'Ensure you have a stable internet connection before starting. A disconnection during the assessment may result in data loss.'
      }
    ];

    return (
      <div className="space-y-0 animate-in fade-in duration-300">
        {/* Header */}
        <div className="pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full">
                  Proctored AI Assessment
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-800 border border-indigo-200 px-2.5 py-0.5 rounded-full">
                  {totalQuestions || 20} Questions · {totalQuestions || 20} Minutes
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-navy-900 mt-0.5">
                {roundName}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Role: <strong className="text-teal-700">{roleTitle}</strong></p>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Questions', value: String(totalQuestions || 20), sub: 'MCQ format', icon: <BookOpen className="w-4 h-4 text-teal-600" /> },
              { label: 'Time/Question', value: '1:00', sub: 'Auto-advances', icon: <Clock className="w-4 h-4 text-amber-600" /> },
              { label: 'Total Time', value: `${totalQuestions || 20} Min`, sub: 'Max duration', icon: <Maximize2 className="w-4 h-4 text-indigo-600" /> }
            ].map((stat, i) => (
              <div key={i} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-lg font-black text-navy-900">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{stat.label}</div>
                <div className="text-[10px] text-slate-400">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Guidelines Grid */}
        <div className="py-5">
          <h4 className="text-sm font-black text-navy-900 mb-3 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-teal-600" />
            Assessment Guidelines — Please Read Carefully
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {guidelines.map((g, i) => (
              <div key={i} className={`p-3.5 rounded-2xl border ${g.color} flex items-start gap-3`}>
                <div className="shrink-0 mt-0.5">{g.icon}</div>
                <div>
                  <p className="text-xs font-extrabold text-navy-900">{g.title}</p>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agreement checkbox */}
        <div className="py-4 border-t border-b border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAgreedGuidelines(prev => !prev)}
              className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                agreedGuidelines
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : 'border-slate-300 group-hover:border-teal-400'
              }`}
            >
              {agreedGuidelines && <Check className="w-3.5 h-3.5" />}
            </div>
            <span className="text-xs text-slate-700 leading-relaxed">
              I have read and understood the assessment guidelines. I agree to complete this assessment honestly in a single session with fullscreen mode enabled. I understand that my score is confidential and only visible to the HR team.
            </span>
          </label>
        </div>

        {/* Error message if fullscreen denied */}
        {launchError && (
          <div className="mt-3 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{launchError}</span>
          </div>
        )}

        {/* Start Assessment Button */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>FairHire Blind Screening · Proctored · EEOC Compliant</span>
          </div>
          <button
            id="exam-start-screen"
            type="button"
            disabled={!agreedGuidelines}
            onClick={launchProctoredExam}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2.5 transition-all shadow-lg cursor-pointer active:scale-95 ${
              agreedGuidelines
                ? 'bg-gradient-to-r from-teal-500 to-indigo-600 hover:from-teal-400 hover:to-indigo-500 text-white shadow-teal-500/25'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Maximize2 className="w-4 h-4" />
            <span>Start Proctored Assessment</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // PHASE: ACTIVE EXAM (fullscreen, timed questions)
  // ============================================================================
  return (
    <div className="space-y-5 relative">

      {/* ── FULLSCREEN EXIT WARNING BANNER ──────────────────────────────────── */}
      {fullscreenWarning && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-rose-600 text-white px-6 py-4 flex items-center justify-between gap-4 shadow-2xl animate-in slide-in-from-top duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-sm">⚠️ Fullscreen Exited — Proctoring Alert</p>
              <p className="text-xs text-rose-100 mt-0.5">
                You exited fullscreen mode. This has been flagged to the HR panel. Please return to fullscreen immediately to continue your assessment.
                {fullscreenExitCount > 1 && ` (Exit count: ${fullscreenExitCount})`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={reEnterFullscreen}
            className="shrink-0 px-4 py-2 rounded-xl bg-white text-rose-700 text-xs font-black hover:bg-rose-50 transition-all cursor-pointer"
          >
            Return to Fullscreen
          </button>
        </div>
      )}

      {/* ── EXAM TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {currentQuestion?.category || currentQuestion?.topic || 'Aptitude'}
              </span>
              {!isFullscreen && (
                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-pulse">
                  ⚠ Fullscreen Off
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-navy-900 mt-1">
              AI Technical Aptitude Assessment — {roleTitle}
            </h4>
          </div>

          {/* Countdown Timer */}
          <div id="exam-questions" className={`px-4 py-2 rounded-2xl border flex items-center gap-2 shadow-sm ${timerColor}`}>
            <Clock className="w-4 h-4" />
            <div className="font-mono font-black text-sm sm:text-base leading-none">
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
            <span className="text-[10px] uppercase font-bold opacity-80 hidden sm:inline">
              remaining
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Progress: {currentIndex + 1}/{totalQuestions} questions</span>
            <span className="font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── TIME EXPIRED ALERT ───────────────────────────────────────────────── */}
      {timeExpiredAlert && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>⏱ Time limit reached! Auto-advanced to the next question.</span>
        </div>
      )}

      {/* ── QUESTION CARD ────────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-navy-900 text-white text-xs font-black flex items-center justify-center shrink-0">
            {currentIndex + 1}
          </span>
          <span className="text-xs font-bold text-teal-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
            {currentQuestion?.category || currentQuestion?.topic || 'General'}
          </span>
        </div>
        <p className="text-sm sm:text-base font-bold text-navy-900 leading-relaxed">
          {currentQuestion?.question_text || currentQuestion?.question}
        </p>
      </div>

      {/* ── OPTIONS ──────────────────────────────────────────────────────────── */}
      <div className="space-y-2.5">
        {(currentQuestion?.options || []).map((optionText, optIdx) => {
          const isSelected = selectedOption === optionText;
          return (
            <button
              key={optIdx}
              type="button"
              onClick={() => handleSelectOption(optionText)}
              className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                isSelected
                  ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-teal-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    isSelected
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-slate-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className={`text-xs sm:text-sm font-semibold ${isSelected ? 'text-navy-950 font-bold' : 'text-slate-700'}`}>
                  {optionText}
                </span>
              </div>
              {isSelected && (
                <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-100 px-2 py-0.5 rounded-md shrink-0">
                  Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── FOOTER ACTIONS ───────────────────────────────────────────────────── */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 font-medium">
          ⏱️ Auto-advances in {timeLeft}s if unanswered
        </span>
        <Button
          variant={isLastQuestion ? 'success' : 'gradient'}
          size="md"
          icon={isLastQuestion ? Send : ArrowRight}
          onClick={handleNextQuestion}
          className="shadow-sm"
        >
          {isLastQuestion ? 'Submit Assessment to HR' : 'Save & Next Question'}
        </Button>
      </div>
    </div>
  );
};

export default AiAptitudeAssessment;
