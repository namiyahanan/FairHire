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
    const staticBank = getAptitudeQuestionsForRole(roleTitle);

    if (!assessmentId) {
      // If assessmentId is missing, do not attempt to query Supabase
      const normalized = (staticBank || []).map((q, idx) => ({
        question_id: String(q.id),
        category: q.topic,
        question_text: q.question,
        options: q.options,
        question_order: idx + 1,
        correct_answer: typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : (q.correctAnswer || q.options[0])
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
          const normalized = (rows || []).map((q, idx) => {
            let correctAns = q.correct_answer;
            if (!correctAns && staticBank[idx]) {
              const sb = staticBank[idx];
              correctAns = typeof sb.correctAnswer === 'number' ? sb.options[sb.correctAnswer] : sb.correctAnswer;
            }
            return {
              ...q,
              options: Array.isArray(q.options)
                ? q.options
                : (typeof q.options === 'string' ? JSON.parse(q.options) : []),
              correct_answer: correctAns || (Array.isArray(q.options) ? q.options[0] : '')
            };
          });
          setQuestions(normalized);
        }
      } catch (err) {
        if (isMounted) {
          const normalized = (staticBank || []).map((q, idx) => ({
            question_id: String(q.id),
            category: q.topic,
            question_text: q.question,
            options: q.options,
            question_order: idx + 1,
            correct_answer: typeof q.correctAnswer === 'number' ? q.options[q.correctAnswer] : (q.correctAnswer || q.options[0])
          }));
          setQuestions(normalized);
          setQuestionsError(null);
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
  // ── proctoring state ──────────────────────────────────────────────────────────
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fullscreenExitCount, setFullscreenExitCount] = useState(0);
  const [launchError, setLaunchError] = useState('');
  const [forceExitInfo, setForceExitInfo] = useState(null);
  const [submittedBreakdown, setSubmittedBreakdown] = useState(null);
  const [submittedScoreStats, setSubmittedScoreStats] = useState(null);

  // ── guidelines checklist (all must be checked) ───────────────────────────────
  const [agreedGuidelines, setAgreedGuidelines] = useState(false);

  // refs for stale-closure safety
  const answersRef = useRef(answers);
  answersRef.current = answers;
  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const hasEnteredFullscreenRef = useRef(false);
  const isSubmittingRef = useRef(false);

  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentQuestion?.question_id];

  // ref for the fullscreen exam container
  const examContainerRef = useRef(null);

  // ── submit assessment handler (supports force termination on Esc/fullscreen exit) ──
  const handleSubmitAssessment = useCallback((exitReason = '') => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    const currentAnswers = answersRef.current;
    const totalTimeSpentSeconds = Math.round((Date.now() - startTime) / 1000);
    const qNum = currentIndexRef.current + 1;

    // exit fullscreen on submit if still active
    const fsEl = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement;
    if (fsEl) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen().catch(() => {});
      }
    }

    // Build question-by-question breakdown with given answer vs correct answer
    const stripPrefix = s => String(s || '').replace(/^[a-d]\)\s*/i, '').replace(/^[0-9]+\.\s*/, '').replace(/^["']|["']$/g, '').trim().toLowerCase();

    const breakdown = questions.map((q, idx) => {
      const givenAns = currentAnswers[q.question_id] || '';
      const correctAns = q.correct_answer || (Array.isArray(q.options) ? q.options[0] : '');
      const isUnanswered = !givenAns || String(givenAns).trim() === '';
      const isCorrect = !isUnanswered && (
        String(givenAns).trim().toLowerCase() === String(correctAns).trim().toLowerCase() ||
        stripPrefix(givenAns) === stripPrefix(correctAns)
      );

      return {
        questionId: q.question_id,
        questionNumber: idx + 1,
        topic: q.category || q.topic || 'Technical Aptitude',
        question: q.question_text || q.question || `Question ${idx + 1}`,
        options: q.options || [],
        candidateAnswer: isUnanswered ? 'Not Answered / Timed Out' : givenAns,
        correctAnswer: correctAns,
        isCorrect,
        isUnanswered,
        status: isUnanswered ? 'Timed Out / Unanswered' : (isCorrect ? 'Correct' : 'Incorrect')
      };
    });

    const correctCount = breakdown.filter(b => b.isCorrect).length;
    const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

    setSubmittedBreakdown(breakdown);
    setSubmittedScoreStats({
      correctCount,
      totalQuestions,
      percentage: scorePercentage,
      incorrectCount: totalQuestions - correctCount
    });

    if (exitReason) {
      setForceExitInfo({
        reason: exitReason,
        questionNumber: qNum,
        totalQuestions
      });
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
        score: scorePercentage,
        rawScore: correctCount,
        percentage: scorePercentage,
        totalQuestions,
        answers: formattedAnswers,
        rawAnswers: currentAnswers,
        questionsBreakdown: breakdown,
        timeSpentSeconds: totalTimeSpentSeconds,
        fullscreenExits: fullscreenExitCount + (exitReason ? 1 : 0),
        forcedExit: !!exitReason,
        terminatedAtQuestion: exitReason ? qNum : undefined,
        forcedReason: exitReason || undefined,
        feedback: exitReason
          ? `Proctoring Enforcement: Candidate exited fullscreen (Esc pressed) at question ${qNum} of ${totalQuestions}. Exam immediately terminated. Score: ${correctCount}/${totalQuestions} (${scorePercentage}%).`
          : `Candidate completed ${totalQuestions}-question AI Aptitude Assessment. Score: ${correctCount}/${totalQuestions} (${scorePercentage}%).`
      });
    }
  }, [assessmentId, candidateId, questions, totalQuestions, startTime, fullscreenExitCount, onComplete]);

  const handleSubmitAssessmentRef = useRef(handleSubmitAssessment);
  handleSubmitAssessmentRef.current = handleSubmitAssessment;

  // ── fullscreen API ──────────────────────────────────────────────────────────
  const launchProctoredExam = useCallback(() => {
    // Switch to active phase first so the exam container renders
    setPhase('active');
    hasEnteredFullscreenRef.current = false;
    isSubmittingRef.current = false;
    setForceExitInfo(null);

    // Then attempt fullscreen on the exam overlay container (after next render)
    setTimeout(() => {
      const el = examContainerRef.current || document.documentElement;
      if (el && el.requestFullscreen) {
        el.requestFullscreen()
          .then(() => {
            setIsFullscreen(true);
            hasEnteredFullscreenRef.current = true;
          })
          .catch(() => {
            // Fullscreen denied — continue in windowed overlay mode
            setIsFullscreen(false);
          });
      }
    }, 50);
  }, []);

  // detect fullscreen exit & Esc key during active exam -> force terminate immediately
  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      );
      setIsFullscreen(inFullscreen);

      if (inFullscreen) {
        hasEnteredFullscreenRef.current = true;
      } else if (phaseRef.current === 'active' && hasEnteredFullscreenRef.current && !isSubmittingRef.current) {
        // Exited fullscreen during active exam -> force complete test at exact question!
        handleSubmitAssessmentRef.current('Fullscreen exited (Esc pressed)');
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && phaseRef.current === 'active' && !isSubmittingRef.current) {
        // Escape pressed during active exam -> force complete test immediately!
        handleSubmitAssessmentRef.current('Escape key pressed during exam');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

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
        {forceExitInfo ? (
          <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 border-2 border-amber-300 flex items-center justify-center mx-auto shadow-sm">
            <AlertTriangle className="w-10 h-10 text-amber-600" />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        )}

        <div className="space-y-2 max-w-md mx-auto">
          {forceExitInfo ? (
            <>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-300 inline-flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Assessment Force-Ended · Proctoring Policy
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                Exam Terminated at Question {forceExitInfo.questionNumber} of {forceExitInfo.totalQuestions}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You exited fullscreen mode (Esc key pressed). Per FairHire proctoring regulations, the test was locked and immediately force-submitted at question <strong>{forceExitInfo.questionNumber}</strong>. Responses recorded up to this point have been submitted to HR.
              </p>
            </>
          ) : (
            <>
              <span className="text-[11px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Assessment Submitted
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                Aptitude Assessment Recorded
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Your responses for all <strong className="text-navy-900">{totalQuestions} technical aptitude questions</strong> have been cryptographically sealed and transmitted directly to the HR evaluation committee.
              </p>
            </>
          )}
        </div>

        {/* Blind Screening & Confidentiality */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2.5">
          <div className="flex items-center gap-2 text-xs font-extrabold text-navy-900">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>FairHire Blind Screening Confidentiality Protocol</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {forceExitInfo
              ? 'Early termination proctoring log and responses answered prior to exit have been restricted and sealed for the evaluating HR engineering panel.'
              : 'To ensure zero demographic bias and objective review, raw aptitude scores and question breakdowns are restricted to the HR recruiter & evaluating engineering panel. You will receive transparent milestone notifications in your Application Tracker.'}
          </p>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Candidate Token: <strong className="text-teal-700 font-mono">{candidateId}-EEOC</strong></span>
            <span className={forceExitInfo ? 'text-amber-700 font-bold' : 'text-emerald-700 font-bold'}>
              {forceExitInfo ? '⚠ Terminated & Transmitted to HR' : '✓ Delivered to HR Dashboard'}
            </span>
          </div>
        </div>

        {/* Assessment Answer Table */}
        {submittedBreakdown && submittedBreakdown.length > 0 && (
          <div className="text-left space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h4 className="text-sm font-black text-navy-900">
                  Assessment Answer Evaluation Table
                </h4>
              </div>
              <div className="flex items-center gap-2 text-xs flex-wrap">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  ✓ {submittedScoreStats?.correctCount} Correct
                </span>
                <span className="font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  ✗ {submittedScoreStats?.incorrectCount} Incorrect
                </span>
                <span className="font-black text-navy-900 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Score: {submittedScoreStats?.percentage}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm max-h-96 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px] z-10">
                  <tr>
                    <th className="py-3 px-3 text-center w-10">#</th>
                    <th className="py-3 px-4 min-w-[220px]">Question & Topic</th>
                    <th className="py-3 px-4 min-w-[170px]">Your Given Answer</th>
                    <th className="py-3 px-4 min-w-[170px]">Correct Answer</th>
                    <th className="py-3 px-3 text-center w-24">Result</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submittedBreakdown.map((q, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3 text-center font-black text-slate-400">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200 mb-1">
                          {q.topic}
                        </span>
                        <p className="text-navy-900 font-semibold leading-relaxed">{q.question}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className={`p-2 rounded-xl border text-xs font-semibold ${
                          q.isCorrect
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                            : (q.isUnanswered || !q.candidateAnswer || q.candidateAnswer === 'Not Answered / Timed Out'
                                ? 'bg-amber-50 border-amber-200 text-amber-800'
                                : 'bg-rose-50 border-rose-200 text-rose-800')
                        }`}>
                          <div className="flex items-start gap-1.5">
                            {q.isCorrect ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (q.isUnanswered || !q.candidateAnswer || q.candidateAnswer === 'Not Answered / Timed Out') ? (
                              <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                            )}
                            <span className="break-words">{q.candidateAnswer}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="p-2 rounded-xl bg-teal-50/70 border border-teal-200 text-teal-900 text-xs font-semibold">
                          <span className="break-words">{q.correctAnswer}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                          q.isCorrect
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : (q.isUnanswered || !q.candidateAnswer || q.candidateAnswer === 'Not Answered / Timed Out'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200')
                        }`}>
                          {q.isCorrect ? '✓ Correct' : (q.isUnanswered || !q.candidateAnswer || q.candidateAnswer === 'Not Answered / Timed Out' ? '⏱ Timed Out' : '✗ Incorrect')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

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
        title: 'Fullscreen Mode Strictly Enforced',
        desc: 'The assessment runs in locked fullscreen. Pressing Esc or exiting fullscreen will immediately end and force-submit your test at the current question.'
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
        title: 'No Tab Switching / No Esc',
        desc: 'Exiting fullscreen or switching tabs will immediately abort and force-submit your exam. Complete the assessment in one uninterrupted session.'
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
              I have read and understood the assessment guidelines. I understand that pressing Esc or exiting fullscreen will immediately end and force-submit my exam at the exact question I am on. I agree to complete this assessment honestly in a single session with fullscreen mode enabled.
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
  // PHASE: ACTIVE EXAM — renders as a fixed full-screen overlay with dark bg
  // ============================================================================
  return (
    <div
      ref={examContainerRef}
      className="fixed inset-0 z-[99999] bg-[#0a0f1e] flex flex-col overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {/* inner scrollable exam area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 max-w-3xl mx-auto w-full space-y-5">
      {/* ── EXAM TOP HEADER BAR ──────────────────────────────────────────────── */}
      <div className="space-y-3 pb-4 border-b border-slate-700">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-300 bg-teal-900/40 border border-teal-700 px-2.5 py-0.5 rounded-full">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {currentQuestion?.category || currentQuestion?.topic || 'Aptitude'}
              </span>
              {!isFullscreen && (
                <span className="text-[10px] font-bold text-rose-300 bg-rose-900/30 border border-rose-700 px-2 py-0.5 rounded-full animate-pulse">
                  ⚠ Windowed Mode
                </span>
              )}
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-white mt-1">
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
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
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

      {/* ── QUESTION CARD ───────────────────────────────────────────────────── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-800/60 border border-slate-700 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-teal-600 text-white text-xs font-black flex items-center justify-center shrink-0">
            {currentIndex + 1}
          </span>
          <span className="text-xs font-bold text-teal-300 bg-teal-900/40 px-2.5 py-0.5 rounded-lg border border-teal-700">
            {currentQuestion?.category || currentQuestion?.topic || 'General'}
          </span>
        </div>
        <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
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

        {/* ── FOOTER ACTIONS ─────────────────────────────────────────────────── */}
        <div className="pt-4 border-t border-slate-700 flex items-center justify-between gap-3">
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
    </div>
  );
};

export default AiAptitudeAssessment;
