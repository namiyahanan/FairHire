import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Send,
  X,
  Lock,
  ChevronRight,
  Check
} from 'lucide-react';
import Button from '../common/Button';
import { getAptitudeQuestionsForRole } from '../../data/aptitudeQuestions';

const AiAptitudeAssessment = ({
  roleTitle = 'Frontend Engineer',
  roundName = 'Technical & Coding Assessment',
  candidateId = 'CAND-8492',
  onComplete,
  onClose
}) => {
  const questions = getAptitudeQuestionsForRole(roleTitle);
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeExpiredAlert, setTimeExpiredAlert] = useState(false);
  const [startTime] = useState(() => Date.now());

  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentQuestion.id];

  // Ref to hold answers to avoid stale closures in interval
  const answersRef = useRef(answers);
  answersRef.current = answers;

  const currentIndexRef = useRef(currentIndex);
  currentIndexRef.current = currentIndex;

  // Question countdown timer (1 min = 60s)
  useEffect(() => {
    if (isSubmitted) return;

    setTimeLeft(60);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer reached 0: automatically advance to next question
          handleAutoAdvance();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, isSubmitted]);

  const handleAutoAdvance = () => {
    const idx = currentIndexRef.current;
    if (idx < totalQuestions - 1) {
      setTimeExpiredAlert(true);
      setTimeout(() => setTimeExpiredAlert(false), 2200);
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Last question timed out -> auto submit
      handleSubmitAssessment();
    }
  };

  const handleSelectOption = (optIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = () => {
    const currentAnswers = answersRef.current;
    let rawScore = 0;

    const breakdown = questions.map((q) => {
      const candidateAns = currentAnswers[q.id];
      const isCorrect = candidateAns === q.correctAnswer;
      if (isCorrect) rawScore += 1;

      return {
        id: q.id,
        topic: q.topic,
        question: q.question,
        candidateAnswer: candidateAns !== undefined ? q.options[candidateAns] : 'Timed Out / Unanswered',
        candidateOptionIndex: candidateAns,
        correctAnswer: q.options[q.correctAnswer],
        correctOptionIndex: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    const percentageScore = Math.round((rawScore / totalQuestions) * 100);
    const totalTimeSpentSeconds = Math.round((Date.now() - startTime) / 1000);

    setIsSubmitted(true);

    if (onComplete) {
      onComplete({
        score: percentageScore,
        rawScore,
        totalQuestions,
        questionsBreakdown: breakdown,
        timeSpentSeconds: totalTimeSpentSeconds,
        feedback: `Candidate completed ${totalQuestions}-question AI Aptitude Assessment with ${rawScore}/${totalQuestions} correct (${percentageScore}%).`
      });
    }
  };

  // Progress percentage
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);
  const isLastQuestion = currentIndex === totalQuestions - 1;

  // Timer urgency color
  const timerColor =
    timeLeft <= 10
      ? 'text-rose-600 bg-rose-50 border-rose-200 animate-pulse'
      : timeLeft <= 20
      ? 'text-amber-600 bg-amber-50 border-amber-200'
      : 'text-teal-700 bg-teal-50 border-teal-200';

  // =========================================================================
  // SUBMISSION COMPLETE SCREEN (CRITICAL: MARKS ARE HIDDEN FOR CANDIDATE)
  // =========================================================================
  if (isSubmitted) {
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

        {/* Blind Screening & Confidentiality Guarantee Box */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left max-w-lg mx-auto space-y-2.5 shadow-2xs">
          <div className="flex items-center gap-2 text-xs font-extrabold text-navy-900">
            <Lock className="w-4 h-4 text-teal-600" />
            <span>FairHire Blind Screening Confidentiality Protocol</span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            To ensure zero demographic bias and objective review, raw aptitude scores and question breakdowns are restricted to the <strong>HR recruiter & evaluating engineering panel</strong>. You will receive transparent milestone notifications in your Application Tracker.
          </p>
          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span>Candidate Token: <strong className="text-teal-700 font-mono">FH-8492-EEOC</strong></span>
            <span className="text-emerald-700 font-bold">✓ Delivered to HR Dashboard</span>
          </div>
        </div>

        <div className="pt-3">
          <Button
            variant="gradient"
            size="md"
            icon={ArrowRight}
            onClick={onClose}
            className="shadow-md"
          >
            Return to Application Tracker
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE QUESTION SCREEN (1 MIN TIMER PER QUESTION)
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Top Header Bar with Timer & Progress */}
      <div className="space-y-3 pb-4 border-b border-slate-100">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                Question {currentIndex + 1} of {totalQuestions}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {currentQuestion.topic}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-extrabold text-navy-900 mt-1">
              AI Technical Aptitude Assessment ({roleTitle})
            </h4>
          </div>

          {/* 1-Minute Live Countdown Timer */}
          <div className={`px-4 py-2 rounded-2xl border flex items-center gap-2 shadow-2xs ${timerColor}`}>
            <Clock className="w-4 h-4" />
            <div className="font-mono font-black text-sm sm:text-base leading-none">
              00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
            </div>
            <span className="text-[10px] uppercase font-bold opacity-80 hidden sm:inline">
              remaining
            </span>
          </div>
        </div>

        {/* Visual Progress Bar for entire assessment */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
            <span>Progress: {currentIndex + 1}/{totalQuestions} questions</span>
            <span className="font-mono">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Time Expired Notice if automatic advance occurred */}
      {timeExpiredAlert && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Time limit (1 min) reached! Automatically advanced to next question.</span>
        </div>
      )}

      {/* Question Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-navy-900 text-white text-xs font-black flex items-center justify-center font-mono shrink-0">
            {currentIndex + 1}
          </span>
          <span className="text-xs font-bold text-teal-700 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
            {currentQuestion.topic}
          </span>
        </div>

        <p className="text-sm sm:text-base font-bold text-navy-900 leading-relaxed">
          {currentQuestion.question}
        </p>
      </div>

      {/* 4 Multiple Choice Options */}
      <div className="space-y-2.5">
        {currentQuestion.options.map((optionText, optIdx) => {
          const isSelected = selectedOption === optIdx;
          return (
            <button
              key={optIdx}
              type="button"
              onClick={() => handleSelectOption(optIdx)}
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

      {/* Bottom Footer Actions */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 font-medium">
          ⏱️ Auto-advances in {timeLeft}s if not submitted
        </span>

        <div className="flex items-center gap-2.5">
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
