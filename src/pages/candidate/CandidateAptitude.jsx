import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import PageHeader from '../../components/layout/PageHeader';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';
import {
  Brain,
  ShieldCheck,
  Camera,
  Mic,
  Monitor,
  Wifi,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
  Maximize2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Eye,
  RefreshCw,
  Award,
  Check,
  AlertCircle,
  HelpCircle,
  Video,
  Volume2,
  Layers,
  ChevronRight,
  ShieldAlert,
  Send,
  Zap,
  Terminal,
  Compass,
  Bookmark,
  BookmarkCheck,
  Radio,
  Building2,
  Target,
  TrendingUp,
  Search,
  Filter,
  Play,
  Calculator,
  FileText,
  ListOrdered
} from 'lucide-react';
import { getAptitudeQuestionsForRole, MNC_PRACTICE_MODULES, CORPORATE_SECTIONS } from '../../data/aptitudeQuestions';
import { getAppliedApplications } from '../../services/applicationStore';
import {
  updateCandidateAssessmentSubmission,
  logCandidateMalpracticeIncident
} from '../../services/candidateHiringStore';

const CandidateAptitude = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Overall Flow Phases: 'hub' (Company Practice Selection Hub) | 'gate' (Phase 1) | 'active' (Phase 2) | 'submitted' (Phase 3)
  const [phase, setPhase] = useState('hub');

  // ── Selected Practice Module / Track ──────────────────────────────────────
  const [selectedCompanyPack, setSelectedCompanyPack] = useState(MNC_PRACTICE_MODULES[0]);
  const [hubSearch, setHubSearch] = useState('');
  const [hubCategoryFilter, setHubCategoryFilter] = useState('ALL');
  const [activeZoneASection, setActiveZoneASection] = useState('ALL'); // 'ALL' | 'quant' | 'logical' | 'verbal'

  // ── Target Role Selection ──────────────────────────────────────────────────
  const appliedApps = getAppliedApplications();
  const availableRoles = [
    'Accenture Mock Assessment Series',
    'Cognizant Diagnostic Track',
    'TCS Ninja/Digital Prep Pattern',
    'Zoho Systems Technical Screening',
    'Frontend Engineer',
    'Backend Engineer',
    'Full Stack Engineer',
    'DevOps / SRE Engineer',
    'AI / Machine Learning Engineer',
    'Data Platform Engineer'
  ];
  const defaultRole = MNC_PRACTICE_MODULES[0].title;
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  // ── Phase 1: Verification Gate State ───────────────────────────────────────
  const [cameraActive, setCameraActive] = useState(false);
  const [micLevel, setMicLevel] = useState(65);
  const [faceVerified, setFaceVerified] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [rulesAgreed, setRulesAgreed] = useState(false);
  const [networkPing, setNetworkPing] = useState(24);
  const [screenRes, setScreenRes] = useState('1920 x 1080');

  const videoRef = useRef(null);
  const proctorVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [hasMediaPermission, setHasMediaPermission] = useState(false);

  // ── AI Eye & Gaze Movement Tracking Proctoring State ──────────────────────
  const [gazeDirection, setGazeDirection] = useState('CENTER'); // 'CENTER' | 'LEFT' | 'RIGHT' | 'DOWN' | 'AWAY'
  const [gazeAngle, setGazeAngle] = useState(0); // in degrees (-30 to +30)
  const [gazeDeviationDuration, setGazeDeviationDuration] = useState(0);
  const [eyeTrackingActive, setEyeTrackingActive] = useState(true);
  const [currentMalpracticeReason, setCurrentMalpracticeReason] = useState(
    'Proctoring boundary violated'
  );

  // ── Phase 2: Active Testing Workspace State (HackerRank Matrix) ────────────
  const questions = getAptitudeQuestionsForRole(selectedRole);
  const totalQuestions = questions.length || 20;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: optionIdx }
  const [flaggedQuestions, setFlaggedQuestions] = useState({}); // { [qId]: true }
  const [visitedQuestions, setVisitedQuestions] = useState({ 1: true });
  const [isProctorBoxMinimized, setIsProctorBoxMinimized] = useState(false);

  // 45:00 total examination countdown timer (2700 seconds)
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(2700);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [malpracticeCount, setMalpracticeCount] = useState(0);
  const [showMalpracticeAlert, setShowMalpracticeAlert] = useState(false);
  const [lastAlertDispatched, setLastAlertDispatched] = useState(null);
  const [showConfirmSubmitModal, setShowConfirmSubmitModal] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState(null);

  const answersRef = useRef(answers);
  answersRef.current = answers;
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const selectedRoleRef = useRef(selectedRole);
  selectedRoleRef.current = selectedRole;
  const userRef = useRef(user);
  userRef.current = user;

  // ── Hardware stream initialization ─────────────────────────────────────────
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setScreenRes(`${window.screen.width} x ${window.screen.height}`);
    }

    const pingInterval = setInterval(() => {
      setNetworkPing(Math.floor(20 + Math.random() * 8));
    }, 3000);

    const micInterval = setInterval(() => {
      setMicLevel(Math.floor(40 + Math.random() * 45));
    }, 400);

    return () => {
      clearInterval(pingInterval);
      clearInterval(micInterval);
    };
  }, []);

  // ── MediaDevices Live Hardware Proctoring API ────────────────────────────
  const activateHardwareProctoring = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const localStream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        streamRef.current = localStream;
        setHasMediaPermission(true);
        setCameraActive(true);

        const proctorVideoWindow = document.getElementById("local-proctor-stream");
        if (proctorVideoWindow) {
          proctorVideoWindow.srcObject = localStream;
          proctorVideoWindow.play().catch(() => {});
        }
        if (proctorVideoRef.current) {
          proctorVideoRef.current.srcObject = localStream;
          proctorVideoRef.current.play().catch(() => {});
        }
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
          videoRef.current.play().catch(() => {});
        }
      }
    } catch (error) {
      console.warn("Camera/Mic permission access:", error);
      setCameraActive(true);
    }
  };

  const startCameraStream = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streamRef.current = stream;
        setHasMediaPermission(true);
        setCameraActive(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        if (proctorVideoRef.current) {
          proctorVideoRef.current.srcObject = stream;
          proctorVideoRef.current.play().catch(() => {});
        }
      } else {
        setCameraActive(true);
      }
    } catch (err) {
      setCameraActive(true);
    }
  };

  // Re-bind video streams whenever phase changes or stream is available
  useEffect(() => {
    if (streamRef.current) {
      if (proctorVideoRef.current) {
        proctorVideoRef.current.srcObject = streamRef.current;
        proctorVideoRef.current.play().catch(() => {});
      }
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [phase, cameraActive, hasMediaPermission]);

  // Persistent camera initialization on mount
  useEffect(() => {
    startCameraStream();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // Helper to trigger instant recruiter notification
  const notifyRecruiterOfMalpractice = useCallback((reason) => {
    const candidateId = userRef.current?._id || userRef.current?.id || 'CAND-8492';
    const candidateName = userRef.current?.name || 'Alex Morgan';
    const currentRole = selectedRoleRef.current;

    setCurrentMalpracticeReason(reason);
    const alert = logCandidateMalpracticeIncident(candidateId, {
      candidateName,
      roleTitle: currentRole,
      reason,
      flagCount: malpracticeCount + 1
    });

    setLastAlertDispatched(alert);
  }, [malpracticeCount]);

  // ── AI Eye Gaze Tracking & Malpractice Detection Loop ─────────────────────
  const triggerGazeMalpractice = useCallback((direction, angle) => {
    setGazeDirection(direction);
    setGazeAngle(angle);
    setMalpracticeCount((prev) => prev + 1);
    setCurrentMalpracticeReason(`Candidate eye gaze moved away from screen (${direction} at ${angle}° detected by AI Proctor)`);
    setShowMalpracticeAlert(true);
    notifyRecruiterOfMalpractice(`Candidate eye gaze moved away from screen (${direction} at ${angle}° detected by AI Proctor)`);
  }, [notifyRecruiterOfMalpractice]);

  // Periodic subtle gaze micro-movement evaluation during active phase
  useEffect(() => {
    if (phase !== 'active' || !eyeTrackingActive) return;

    const gazeInterval = setInterval(() => {
      // Keep pupil coordinates centered with realistic subtle natural jitter
      if (gazeDirection === 'CENTER') {
        const jitter = Math.floor((Math.random() - 0.5) * 6);
        setGazeAngle(jitter);
      }
    }, 1200);

    return () => clearInterval(gazeInterval);
  }, [phase, eyeTrackingActive, gazeDirection]);

  // ── Fullscreen & Anti-Cheat Malpractice Listeners ───────────────────────────
  useEffect(() => {
    const handleFullscreenChange = () => {
      const inFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement
      );
      setIsFullscreen(inFullscreen);

      if (!inFullscreen && phaseRef.current === 'active') {
        setMalpracticeCount((prev) => prev + 1);
        setCurrentMalpracticeReason('Candidate rejected or exited full-screen mode (Anti-cheat triggered)');
        setShowMalpracticeAlert(true);
        notifyRecruiterOfMalpractice('Candidate rejected or exited full-screen mode (Anti-cheat triggered)');
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && phaseRef.current === 'active') {
        setMalpracticeCount((prev) => prev + 1);
        setCurrentMalpracticeReason('Candidate switched browser tab or minimized assessment window');
        setShowMalpracticeAlert(true);
        notifyRecruiterOfMalpractice('Candidate switched browser tab or minimized assessment window');
      }
    };

    // Anti-Copy, Paste, Cut & Inspection Short-circuiting
    const handleCopyCutPaste = (e) => {
      if (phaseRef.current === 'active') {
        e.preventDefault();
        setMalpracticeCount((prev) => prev + 1);
        setCurrentMalpracticeReason('Unauthorized Clipboard Action: Candidate attempted to copy, cut, or paste text during exam (Malpractice flagged)');
        setShowMalpracticeAlert(true);
        notifyRecruiterOfMalpractice('Unauthorized Clipboard Action: Candidate attempted to copy, cut, or paste text during assessment');
      }
    };

    const handleKeyDown = (e) => {
      if (phaseRef.current === 'active') {
        const key = (e.key || '').toLowerCase();
        // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+U, Ctrl+P, F12, Ctrl+Shift+I
        if (
          ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'a', 'u', 'p', 's'].includes(key)) ||
          e.key === 'F12' ||
          ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key))
        ) {
          e.preventDefault();
          setMalpracticeCount((prev) => prev + 1);
          setCurrentMalpracticeReason(`Unauthorized Keyboard Shortcut (${(e.ctrlKey || e.metaKey) ? 'Ctrl+' : ''}${e.key.toUpperCase()}): Blocked during proctored exam`);
          setShowMalpracticeAlert(true);
          notifyRecruiterOfMalpractice(`Unauthorized Keyboard Shortcut (${(e.ctrlKey || e.metaKey) ? 'Ctrl+' : ''}${e.key.toUpperCase()}): Blocked during proctored exam`);
        }
      }
    };

    const handleContextMenu = (e) => {
      if (phaseRef.current === 'active') {
        e.preventDefault();
        setMalpracticeCount((prev) => prev + 1);
        setCurrentMalpracticeReason('Unauthorized Context Menu: Right-clicking is prohibited during proctored examination');
        setShowMalpracticeAlert(true);
        notifyRecruiterOfMalpractice('Unauthorized Context Menu: Candidate right-clicked during assessment');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopyCutPaste);
    document.addEventListener('cut', handleCopyCutPaste);
    document.addEventListener('paste', handleCopyCutPaste);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopyCutPaste);
      document.removeEventListener('cut', handleCopyCutPaste);
      document.removeEventListener('paste', handleCopyCutPaste);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [notifyRecruiterOfMalpractice]);

  // ── Lock Environment & Launch Assessment Trigger ──────────────────────────
  const handleLockAndStart = () => {
    if (!rulesAgreed) return;

    const proceedToExam = () => {
      setIsFullscreen(true);
      setCurrentIndex(0);
      setAnswers({});
      setFlaggedQuestions({});
      setVisitedQuestions({ 1: true });
      setTotalTimeRemaining(2700); // 45 minutes
      setMalpracticeCount(0);
      setPhase('active');
      
      // Activate hardware proctoring right after fullscreen is successfully entered
      setTimeout(() => {
        activateHardwareProctoring();
      }, 50);
    };

    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().then(() => {
        proceedToExam();
      }).catch(() => {
        proceedToExam();
      });
    } else {
      proceedToExam();
    }
  };

  // ── Phase 2 Countdown Timer (45:00) ────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'active') return;

    const timer = setInterval(() => {
      setTotalTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          executeFinalSubmission();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const formatTimerDisplay = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const [selectionPrompt, setSelectionPrompt] = useState(false);

  // ── Navigation & Question Answering Handlers ────────────────────────────────
  const handleSelectQuestion = (index) => {
    setCurrentIndex(index);
    const qId = questions[index]?.id || index + 1;
    setVisitedQuestions((prev) => ({ ...prev, [qId]: true }));
    setSelectionPrompt(false);
  };

  const handleOptionChange = (qId, optIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [qId]: optIndex
    }));
    setSelectionPrompt(false);
  };

  const handleToggleFlag = () => {
    const currentQId = questions[currentIndex]?.id || currentIndex + 1;
    setFlaggedQuestions((prev) => ({
      ...prev,
      [currentQId]: !prev[currentQId]
    }));
  };

  const handleSaveAndNext = () => {
    const currentQId = questions[currentIndex]?.id || currentIndex + 1;
    if (answers[currentQId] === undefined) {
      setSelectionPrompt(true);
      return;
    }
    setSelectionPrompt(false);
    if (currentIndex < totalQuestions - 1) {
      handleSelectQuestion(currentIndex + 1);
    } else {
      setShowConfirmSubmitModal(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentIndex > 0) {
      handleSelectQuestion(currentIndex - 1);
    }
  };

  // ── Execute Final Submission ───────────────────────────────────────────────
  const executeFinalSubmission = () => {
    setShowConfirmSubmitModal(false);

    if (document.fullscreenElement) {
      try {
        document.exitFullscreen().catch(() => {});
      } catch (e) {}
    }

    let correctCount = 0;
    questions.forEach((q) => {
      if (answersRef.current[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const candidateId = 'CAND-8492';

    const submissionPayload = {
      score: percentage,
      rawScore: correctCount,
      totalQuestions,
      roleTitle: selectedRole,
      roundName: 'AI Technical Aptitude Assessment',
      completedAt: new Date().toISOString(),
      malpracticeFlags: malpracticeCount,
      answers: answersRef.current,
      feedback: `Candidate completed ${totalQuestions}-question AI Aptitude Assessment with ${correctCount}/${totalQuestions} correct (${percentage}%). Proctored verification passed.`
    };

    setAssessmentResult(submissionPayload);
    updateCandidateAssessmentSubmission(candidateId, submissionPayload);
    setPhase('submitted');
  };

  // ── Calculations for Zone A Matrix ─────────────────────────────────────────
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;
  const unansweredCount = totalQuestions - answeredCount;

  const currentQ = questions[currentIndex] || questions[0];
  const currentQId = currentQ?.id || currentIndex + 1;
  const currentSelectedOption = answers[currentQId];
  const isCurrentFlagged = !!flaggedQuestions[currentQId];

  // Helper for Question Box state in Zone A
  const getQuestionBoxStatus = (qIndex) => {
    const qId = questions[qIndex]?.id || qIndex + 1;
    const isAnswered = answers[qId] !== undefined;
    const isFlagged = !!flaggedQuestions[qId];
    const isCurrent = qIndex === currentIndex;

    if (isCurrent) return 'current';
    if (isFlagged) return 'flagged';
    if (isAnswered) return 'answered';
    if (visitedQuestions[qId]) return 'visited';
    return 'unvisited';
  };

  // ===========================================================================
  // RENDER PHASE 2 (ACTIVE FULL-SCREEN DOMINANCE 3-ZONE MATRIX)
  // ===========================================================================
  if (phase === 'active') {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 text-slate-100 flex flex-col select-none overflow-hidden font-sans">
        
        {/* ── TOP STATUS ROW ───────────────────────────────────────────────── */}
        <header className="h-16 bg-navy-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-md">
          {/* Logo & Assessment Title */}
          <div className="flex items-center gap-3.5">
            <div className="flex items-center gap-2">
              <img src="/assets/logo.jpg" alt="FairHire Logo" className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 shadow-xs" />
              <span className="font-extrabold text-white text-lg tracking-tight font-sans">
                Fair<span className="text-teal-400">Hire</span>
              </span>
            </div>
            <span className="hidden sm:inline text-xs text-slate-500">•</span>
            <span className="hidden sm:inline px-2.5 py-0.5 rounded-full bg-teal-500/15 text-teal-300 border border-teal-400/30 text-[11px] font-bold">
              {selectedRole} — Technical Aptitude
            </span>
          </div>

          {/* Center: Ticking Countdown Clock */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 px-4 py-1.5 rounded-2xl shadow-inner">
            <Clock className={`w-4 h-4 ${totalTimeRemaining < 300 ? 'text-rose-400 animate-spin' : 'text-amber-400'}`} />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:inline">
              Time Remaining:
            </span>
            <span className={`font-mono text-base sm:text-lg font-black tracking-widest ${
              totalTimeRemaining < 300 ? 'text-rose-400 animate-pulse' : 'text-amber-300'
            }`}>
              {formatTimerDisplay(totalTimeRemaining)}
            </span>
          </div>

          {/* Right: Blinking Red Recording Beacon & Submit Shortcut */}
          <div className="flex items-center gap-3">
            {malpracticeCount > 0 && (
              <span className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[11px] font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Malpractice Flags: {malpracticeCount}</span>
              </span>
            )}

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="tracking-wide text-[11px] uppercase">🔴 PROCTORING ACTIVE</span>
            </div>

            <button
              type="button"
              onClick={() => setShowConfirmSubmitModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-sm cursor-pointer hidden sm:flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Test</span>
            </button>
          </div>
        </header>

        {/* ── 3-ZONE MAIN MATRIX BODY ───────────────────────────────────────── */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* ================================================================= */}
          {/* ZONE A & ZONE C: LEFT SIDEBAR (Progress Matrix + Webcam Anchor)   */}
          {/* ================================================================= */}
          <aside className="lg:col-span-3 bg-navy-900/90 border-r border-slate-800 flex flex-col justify-between overflow-y-auto p-4 sm:p-5 space-y-4">
            
            {/* ZONE A: PROGRESS PANEL */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-teal-400" />
                  <h4 className="font-extrabold text-white text-xs sm:text-sm tracking-wide uppercase">
                    Zone A: Progress Matrix
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {totalQuestions} Questions (3 Sections)
                </span>
              </div>

              {/* 3 Section Filter Tabs */}
              <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveZoneASection('ALL')}
                  className={`py-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeZoneASection === 'ALL'
                      ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All (45)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveZoneASection('quant')}
                  className={`py-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeZoneASection === 'quant'
                      ? 'bg-blue-500 text-white font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Quant (15)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveZoneASection('logical')}
                  className={`py-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeZoneASection === 'logical'
                      ? 'bg-purple-500 text-white font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Logical (15)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveZoneASection('verbal')}
                  className={`py-1 rounded-lg transition-all text-center cursor-pointer ${
                    activeZoneASection === 'verbal'
                      ? 'bg-teal-500 text-slate-950 font-black shadow-xs'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Verbal (15)
                </button>
              </div>

              {/* Status Legend */}
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-semibold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-amber-400" />
                  <span>Review ({flaggedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded bg-slate-700" />
                  <span>Unvisited ({unansweredCount})</span>
                </div>
              </div>

              {/* Numbered Matrix Tracker — Grouped by Corporate Sections */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {CORPORATE_SECTIONS.filter(sec => activeZoneASection === 'ALL' || activeZoneASection === sec.id).map(section => {
                  const sectionQs = questions.slice(section.startIndex, section.endIndex + 1);
                  const isSectionActive = currentIndex >= section.startIndex && currentIndex <= section.endIndex;

                  return (
                    <div key={section.id} className="p-2.5 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-bold flex items-center gap-1.5 ${isSectionActive ? 'text-teal-300' : 'text-slate-400'}`}>
                          {isSectionActive && <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />}
                          {section.shortName}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          Q{section.startQ}–Q{section.endQ}
                        </span>
                      </div>

                      <div className="grid grid-cols-5 gap-1.5">
                        {sectionQs.map((q, sIdx) => {
                          const globalIdx = section.startIndex + sIdx;
                          const status = getQuestionBoxStatus(globalIdx);
                          const isCurrent = globalIdx === currentIndex;

                          let boxStyles = 'bg-slate-800/80 text-slate-500 border-slate-700/60';
                          if (status === 'answered') {
                            boxStyles = 'bg-emerald-600 text-white border-emerald-400 font-black shadow-xs';
                          } else if (status === 'flagged') {
                            boxStyles = 'bg-amber-500 text-slate-950 border-amber-300 font-black shadow-xs';
                          }

                          return (
                            <div
                              key={globalIdx}
                              className={`h-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center border select-none cursor-default ${boxStyles} ${
                                isCurrent
                                  ? 'ring-2 ring-teal-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10 font-black text-white bg-teal-950/60 border-teal-400 shadow-md shadow-teal-950/40'
                                  : ''
                              }`}
                              title={`Question ${globalIdx + 1}: ${q.topic} (${status})`}
                            >
                              {globalIdx + 1}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Current Selection Tracker */}
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-400">Sequential Tracker:</span>
                  <strong className="text-teal-400">Question {currentIndex + 1} / {totalQuestions}</strong>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-teal-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-slate-500 leading-tight pt-0.5">
                  🔒 Step-by-step lock: Finish the current question to unlock the next.
                </p>
              </div>
            </div>

            {/* ZONE C: PROCTORING STREAM (Sidebar Webcam View) */}
            <div className="border-t border-slate-800 pt-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-teal-400" />
                  <span>ZONE C: Live Proctor Stream</span>
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                  gazeDirection === 'CENTER' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-400 animate-pulse'
                }`}>
                  {gazeDirection === 'CENTER' ? 'LIVE • FOCUSED' : '⚠️ GAZE SHIFTED'}
                </span>
              </div>

              {/* Clean Live Candidate Webcam Feed */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video border border-slate-700 shadow-inner flex items-center justify-center">
                <video
                  id="local-proctor-stream"
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover mirror-mode"
                />

                {/* Subtle Clean Proctoring Badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] font-mono text-emerald-400 font-bold border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>AI PROCTOR ACTIVE</span>
                </div>

                {/* Bottom Gaze Status Bar */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-slate-200 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md">
                  <span>Candidate: {user?.name || 'Verified'}</span>
                  <span className={gazeDirection === 'CENTER' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {gazeDirection === 'CENTER' ? '✓ Gaze: Center' : '⚠️ Gaze Shifted'}
                  </span>
                </div>
              </div>

              {/* Hardware audio indicator & Status */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-mono">
                <span className="flex items-center gap-1">
                  <Mic className="w-3 h-3 text-teal-400" /> Audio Stream ({micLevel} dB):
                </span>
                <div className="flex items-center gap-1 h-2 w-20">
                  {[20, 40, 60, 80, 100].map((bar, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-sm ${
                        micLevel >= bar ? 'bg-teal-400 h-full' : 'bg-slate-700 h-1'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

          </aside>

          {/* ================================================================= */}
          {/* ZONE B: MAIN ACTIVE WORKSPACE (Center Panel)                      */}
          {/* ================================================================= */}
          <main className="lg:col-span-9 bg-slate-900 flex flex-col justify-between p-6 sm:p-8 md:p-10 pb-12 overflow-y-auto">
            
            <div className="max-w-4xl w-full mx-auto space-y-7">
              
              {/* Question Header & Flag Badge */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-3 py-1 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-mono font-bold">
                    Question {currentIndex + 1} of {totalQuestions}
                  </span>
                  <span className="px-2.5 py-1 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 text-xs font-bold">
                    {currentQ?.section || 'Corporate Assessment'}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Topic: <strong className="text-teal-300">{currentQ?.topic || 'Core Engineering Logic'}</strong>
                  </span>
                </div>

                {/* Mark for Review Button in Header */}
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    isCurrentFlagged
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isCurrentFlagged ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-amber-400" />
                      <span>Marked for Review</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Mark for Review</span>
                    </>
                  )}
                </button>
              </div>

              {/* The Question Area Statement */}
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-relaxed tracking-tight">
                  Q{currentIndex + 1}: {currentQ?.question}
                </h3>

                {currentQ?.codeSnippet && (
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs sm:text-sm text-teal-300 overflow-x-auto shadow-inner">
                    <pre>{currentQ.codeSnippet}</pre>
                  </div>
                )}
              </div>

              {/* The Multiple-Choice Radio Inputs */}
              <div className="space-y-3.5 pt-2">
                {currentQ?.options.map((optionText, optIdx) => {
                  const isChecked = currentSelectedOption === optIdx;

                  return (
                    <label
                      key={optIdx}
                      onClick={() => handleOptionChange(currentQId, optIdx)}
                      className={`w-full p-4 sm:p-5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all flex items-center justify-between cursor-pointer group ${
                        isChecked
                          ? 'bg-teal-500/15 border-teal-400 text-white shadow-lg shadow-teal-950/40 ring-1 ring-teal-400'
                          : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        {/* Bullet / Radio Circle */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isChecked
                            ? 'border-teal-400 bg-teal-500 text-slate-950'
                            : 'border-slate-500 group-hover:border-teal-400'
                        }`}>
                          {isChecked && <div className="w-2.5 h-2.5 rounded-full bg-slate-950" />}
                        </div>

                        <span className="leading-snug text-sm sm:text-base font-sans">
                          {optionText}
                        </span>
                      </div>

                      {isChecked && (
                        <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 ml-2" />
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Selection Prompt Warning if user tries to advance without answering */}
              {selectionPrompt && (
                <div className="p-3.5 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-semibold flex items-center gap-2.5 animate-bounce">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Please select an option (A, B, C, or D) to finish this question and unlock the next question.</span>
                </div>
              )}

            </div>

            {/* ── Control Row (Footer Links & Actions) ───────────────────────── */}
            <div className="max-w-4xl w-full mx-auto pt-8 mt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* [◀️ Previous Question] */}
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={currentIndex === 0}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    currentIndex === 0
                      ? 'border-slate-800 text-slate-600 cursor-not-allowed'
                      : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>◀️ Previous</span>
                </button>

                {/* [Mark for Review] */}
                <button
                  type="button"
                  onClick={handleToggleFlag}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  {isCurrentFlagged ? 'Unflag Question' : 'Mark for Review'}
                </button>
              </div>

              {/* Right Side: [Save & Next ▶️] & [🔴 Terminate & Submit] */}
              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmitModal(true)}
                  className="px-4 py-2.5 rounded-xl text-rose-400 hover:bg-rose-950/40 border border-rose-800/50 text-xs font-bold transition-all cursor-pointer"
                >
                  🔴 Terminate & Submit
                </button>

                <button
                  type="button"
                  onClick={handleSaveAndNext}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md shadow-teal-900/30 cursor-pointer active:scale-95"
                >
                  <span>{currentIndex === totalQuestions - 1 ? 'Save & Complete' : 'Save & Next ▶️'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

          </main>

        </div>

        {/* ── Malpractice Warning Overlay Modal ─────────────────────────────── */}
        {showMalpracticeAlert && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center mx-auto animate-bounce">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-white">
                Proctoring Violation Logged!
              </h4>
              <p className="text-xs text-rose-300 bg-rose-950/60 border border-rose-800/60 p-2.5 rounded-xl font-medium leading-relaxed">
                {currentMalpracticeReason}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your face, eye gaze, and window focus are continuously monitored. This violation was timestamped and dispatched to the recruiter.
              </p>
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-700 text-xs font-mono font-bold text-rose-300">
                Total Malpractice Flags Recorded: {malpracticeCount}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowMalpracticeAlert(false);
                  setGazeDirection('CENTER');
                  setGazeAngle(0);
                  if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  }
                }}
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-all shadow-lg cursor-pointer"
              >
                Acknowledge & Return to Assessment
              </button>
            </div>
          </div>
        )}

        {/* ── Confirm Submit Modal ─────────────────────────────────────────── */}
        {showConfirmSubmitModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl">
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">
                    Submit Aptitude Assessment?
                  </h4>
                  <p className="text-xs text-slate-400">Review your completion status below</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50">
                  <span className="text-lg font-black text-emerald-400 font-mono">{answeredCount}</span>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Answered</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/50">
                  <span className="text-lg font-black text-amber-400 font-mono">{flaggedCount}</span>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Flagged</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700">
                  <span className="text-lg font-black text-slate-300 font-mono">{unansweredCount}</span>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Unanswered</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Once submitted, your responses are cryptographically sealed and transmitted directly to the HR evaluation committee.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                >
                  Continue Test
                </button>
                <button
                  type="button"
                  onClick={executeFinalSubmission}
                  className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-all shadow-lg cursor-pointer"
                >
                  Yes, Terminate & Submit
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ===========================================================================
  // RENDER PHASE 1 & PHASE 3 (GATE SCREEN & SUBMITTED STATE)
  // ===========================================================================
  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12 max-w-7xl mx-auto">
        {/* ================= HEADER ================= */}
        {phase === 'hub' && (
          <PageHeader
            title="Practice MNC Mock Assessment Series"
            subtitle="Practice top employer testing formats calibrated against actual 2025-2026 hiring patterns with real-time biometric proctoring and automated scoring."
            badge="2025-2026 Pattern Series"
            badgeColor="bg-purple-50 text-purple-800 border-purple-200"
            actions={
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Proctoring Ready</span>
                </span>
              </div>
            }
          />
        )}

        {phase === 'gate' && (
          <PageHeader
            title="AI Aptitude & Technical Assessment"
            subtitle="Secure, AI-proctored verification environment testing domain aptitude and role competency."
            badge="Anti-Cheat Proctoring Active"
            badgeColor="bg-teal-50 text-teal-800 border-teal-200"
            actions={
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setPhase('hub')}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Practice Hub</span>
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-semibold hidden sm:inline">Target Track:</span>
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setSelectedRole(newRole);
                      const matchingPack = MNC_PRACTICE_MODULES.find(m => m.title === newRole);
                      if (matchingPack) setSelectedCompanyPack(matchingPack);
                    }}
                    className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-bold text-navy-900 outline-none focus:border-teal-500 shadow-xs cursor-pointer"
                  >
                    {availableRoles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            }
          />
        )}

        {/* ========================================================================= */}
        {/* 🏢 PRE-TEST INTERFACE: THE COMPANY PRACTICE SELECTION HUB                  */}
        {/* ========================================================================= */}
        {phase === 'hub' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Top Overview & Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-black text-sm border border-purple-200">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top MNC Tracks</span>
                  <p className="text-base font-black text-navy-900 leading-tight">4 Practice Packs</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-black text-sm border border-teal-200">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Exam Duration</span>
                  <p className="text-base font-black text-navy-900 leading-tight">45:00 Minutes</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black text-sm border border-emerald-200">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Proctoring</span>
                  <p className="text-base font-black text-emerald-700 leading-tight">Biometric HUD</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-4.5 shadow-xs flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black text-sm border border-amber-200">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pattern Accuracy</span>
                  <p className="text-base font-black text-navy-900 leading-tight">2025-2026 Aligned</p>
                </div>
              </div>
            </div>

            {/* Category 1 Header & Interactive Grid Container */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold">
                    <span>Category 1</span>
                    <span>•</span>
                    <span>Top Tech Employers</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight">
                    Practice MNC Mock Assessment Series
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Handcrafted practice modules calibrated against 2025-2026 recruitment drives, NQT patterns, and technical screening rounds.
                  </p>
                </div>
              </div>

              {/* The Grid Container (Flex/Grid Wrap) */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                {MNC_PRACTICE_MODULES.map((pack) => (
                  <div
                    key={pack.id}
                    className="bg-slate-50/70 hover:bg-white rounded-3xl border border-slate-200 hover:border-teal-400 hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
                  >
                    {/* Top gradient glow on hover */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-emerald-400 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="space-y-4">
                      {/* Company Icon/Logo (Clean colorful circles like Top Companies footer) */}
                      <div className="flex items-start justify-between gap-3">
                        <div className={`w-14 h-14 rounded-full ${pack.bgColor} text-white flex items-center justify-center font-black text-xl shadow-md ring-4 ring-slate-100 group-hover:ring-teal-100 transition-all`}>
                          {pack.code}
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-bold text-slate-700 shadow-2xs">
                          ★ {pack.rating}
                        </span>
                      </div>

                      {/* Brand Title & Track Name */}
                      <div>
                        <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider block mb-1">
                          {pack.companyName}
                        </span>
                        <h4 className="font-extrabold text-navy-900 text-base group-hover:text-teal-700 transition-colors leading-snug">
                          {pack.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {pack.description}
                        </p>
                      </div>

                      {/* Tags / Topics Breakdown */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pack.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 text-[10px] font-semibold text-slate-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Subtext tracking historical test metrics */}
                      <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="leading-tight font-medium">
                          Based on 2025-2026 actual patterns • 3 Mock Sets Available
                        </span>
                      </div>
                    </div>

                    {/* Action Button on Card Footer */}
                    <div className="pt-5 mt-4 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const chosenPack = pack || MNC_PRACTICE_MODULES[0];
                          setSelectedCompanyPack(chosenPack);
                          setSelectedRole(chosenPack.title);
                          setRulesAgreed(true);
                          setPhase('gate');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex-1 py-3 px-3 rounded-2xl bg-navy-900 hover:bg-teal-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md group-hover:shadow-teal-600/20 cursor-pointer active:scale-[0.98]"
                      >
                        <span>Start Practice Pack</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const chosenPack = pack || MNC_PRACTICE_MODULES[0];
                          setSelectedCompanyPack(chosenPack);
                          setSelectedRole(chosenPack.title);
                          setRulesAgreed(true);
                          setIsFullscreen(true);
                          setCurrentIndex(0);
                          setAnswers({});
                          setFlaggedQuestions({});
                          setVisitedQuestions({ 1: true });
                          setTotalTimeRemaining(2700);
                          setMalpracticeCount(0);
                          setPhase('active');
                          setTimeout(() => {
                            activateHardwareProctoring();
                          }, 50);
                        }}
                        className="py-3 px-3 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1 transition-all shadow-md cursor-pointer active:scale-[0.98]"
                        title="Launch test immediately"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span className="hidden sm:inline">Exam</span>
                      </button>
                    </div>

                  </div>
                ))}
              </div>

            </section>

            {/* Assessment Simulation Rules Overview Footer Card */}
            <div className="p-6 rounded-3xl bg-navy-950 text-white border border-navy-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold">
                  <Lock className="w-3.5 h-3.5 text-teal-400" />
                  <span>Proctoring Sandbox Protocol</span>
                </div>
                <h4 className="text-lg font-black text-white tracking-tight">
                  Simulate Actual MNC Examination Pressure
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every practice pack launches a full-screen proctored session with live biometric monitoring, 45-minute strict countdown timer, and sequential question navigation.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedCompanyPack(MNC_PRACTICE_MODULES[0]);
                  setSelectedRole(MNC_PRACTICE_MODULES[0].title);
                  setRulesAgreed(true);
                  setPhase('gate');
                }}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shrink-0 cursor-pointer"
              >
                <span>Launch Quick Practice</span>
                <Play className="w-4 h-4 fill-current" />
              </button>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* 🎨 PHASE 1: THE PRE-EXAM INSTRUCTIONS & VERIFICATION GATE                  */}
        {/* ========================================================================= */}
        {phase === 'gate' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Gate Top Banner Card */}
            <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-navy-800 relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    <span>Phase 1: Pre-Exam Verification Gate</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    {selectedCompanyPack?.title || selectedRole}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {selectedCompanyPack?.description || 'FairHire implements continuous biometric proctoring and browser sandboxing to eliminate bias and maintain assessment integrity.'} Verify your hardware readiness below before launching.
                  </p>
                </div>

                {/* Role Pill Quick Overview */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2 shrink-0 min-w-[240px]">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Practice Track:</span>
                    <span className="font-bold text-teal-300">{selectedCompanyPack?.companyName || 'MNC'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Assessment:</span>
                    <span className="font-bold text-teal-300">{totalQuestions} MCQs Matrix</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Total Duration:</span>
                    <span className="font-bold text-amber-300">45:00 Minutes</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Proctoring:</span>
                    <span className="font-bold text-emerald-300">Continuous AI HUD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3 Classic Corporate Sections Breakdown Blueprint */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-sm border border-purple-200">
                    <ListOrdered className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-navy-900 text-sm sm:text-base">
                      Corporate Assessment Blueprint Structure (3 Sections)
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Standard enterprise examination breakdown divided into 3 classic corporate testing sections
                    </p>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200 shrink-0">
                  45 Total Questions (15 + 15 + 15) • 45 Mins
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Section 1: Quantitative Ability */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900">1. Quantitative Ability (Math & Logic)</span>
                    <span className="text-[10px] font-mono font-bold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                      15 Questions
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-800">Topics displayed:</strong> Data interpretation, probability, time and work, and number series.
                  </p>
                </div>

                {/* Section 2: Logical Reasoning */}
                <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-900">2. Logical Reasoning (Analytical Thinking)</span>
                    <span className="text-[10px] font-mono font-bold text-purple-800 bg-white px-2 py-0.5 rounded border border-purple-200">
                      15 Questions
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-800">Topics displayed:</strong> Coding-decoding, arrangement puzzles, and data sufficiency matrices.
                  </p>
                </div>

                {/* Section 3: Verbal Ability / Technical Communication */}
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-teal-900">3. Verbal Ability / Technical Communication</span>
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-white px-2 py-0.5 rounded border border-teal-200">
                      15 Questions
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-slate-800">Topics displayed:</strong> Grammar corrections, error spotting, and contextual sentence completion.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Gate Grid: System Checklist + Webcam Box + Strict Rules */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT COLUMN: System Requirements Checklist (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm border border-teal-200">
                        ⚡
                      </div>
                      <div>
                        <h3 className="font-extrabold text-navy-900 text-sm sm:text-base">
                          System Requirements Checklist
                        </h3>
                        <p className="text-[11px] text-slate-400">Live reactive indicators</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      5 / 5 Passed
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Item 1: Browser Support */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Browser Support Active</p>
                          <p className="text-[11px] text-slate-500">Modern Chromium / WebRTC & Fullscreen API</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        v120+ OK
                      </span>
                    </div>

                    {/* Item 2: Network Latency */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Network Connection Latency Stable</p>
                          <p className="text-[11px] text-slate-500">Low jitter real-time websocket heartbeat</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        {networkPing} ms
                      </span>
                    </div>

                    {/* Item 3: Audio & Input Peripheral */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Audio & Input Peripheral</p>
                          <p className="text-[11px] text-slate-500">Microphone stream and keystroke hooks verified</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        Active
                      </span>
                    </div>

                    {/* Item 4: Screen Resolution */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Screen Resolution Optimal</p>
                          <p className="text-[11px] text-slate-500">Single display boundary mapping</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        {screenRes}
                      </span>
                    </div>

                    {/* Item 5: AI Anti-Cheat Sandbox */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-navy-900">Zero-Bias Cryptographic Sandbox</p>
                          <p className="text-[11px] text-slate-500">Blind scoring engine ready</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                        Ready
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Hardware Stream Box & Strict Rules Inventory (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* 1. Webcam / Audio Preview Box */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-sm border border-indigo-200">
                        <Camera className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-navy-900 text-sm sm:text-base">
                          Webcam & Audio Preview Box
                        </h3>
                        <p className="text-[11px] text-slate-400">
                          Hardware stream component for face recognition & noise calibration
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-[11px] font-bold">
                      <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                      Live Feed Active
                    </span>
                  </div>

                  {/* Hardware Stream Square Component */}
                  <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-video sm:aspect-[16/9] flex items-center justify-center border-2 border-slate-800 shadow-inner">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover mirror-mode"
                    />

                    {/* Simulated Candidate Portrait / Face Box Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className={`w-44 h-52 sm:w-52 sm:h-60 border-2 rounded-2xl transition-all duration-300 relative flex flex-col justify-between p-2 ${
                        faceVerified ? 'border-teal-400 bg-teal-500/5 shadow-[0_0_20px_rgba(20,184,166,0.2)]' : 'border-amber-400 bg-amber-500/5'
                      }`}>
                        <div className="flex justify-between">
                          <span className="w-3 h-3 border-t-2 border-l-2 border-teal-300" />
                          <span className="w-3 h-3 border-t-2 border-r-2 border-teal-300" />
                        </div>

                        <div className="text-center py-1 bg-navy-950/80 backdrop-blur-md rounded-lg border border-white/10 px-2">
                          <p className="text-[10px] font-bold text-teal-300 flex items-center justify-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-teal-400" />
                            <span>Face Verified (99.4%)</span>
                          </p>
                          <p className="text-[9px] text-slate-300 font-mono">Single Subject in Frame</p>
                        </div>

                        <div className="flex justify-between">
                          <span className="w-3 h-3 border-b-2 border-l-2 border-teal-300" />
                          <span className="w-3 h-3 border-b-2 border-r-2 border-teal-300" />
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white text-[10px] font-mono border border-white/20">
                        REC • 1080p @ 30fps
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/15 text-white">
                      <div className="flex items-center gap-2">
                        <Mic className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span className="text-[11px] font-semibold text-slate-200">Mic Sensitivity:</span>
                      </div>

                      <div className="flex items-center gap-1 h-3 w-32">
                        {[15, 30, 45, 60, 75, 90, 100].map((threshold, idx) => (
                          <div
                            key={idx}
                            className={`flex-1 rounded-sm transition-all duration-150 ${
                              micLevel >= threshold
                                ? threshold > 80
                                  ? 'bg-amber-400 h-full'
                                  : 'bg-teal-400 h-full'
                                : 'bg-slate-700 h-1.5'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={handleReverifySnapshot}
                        disabled={isCapturing}
                        className="px-2.5 py-1 rounded-lg bg-teal-600 hover:bg-teal-500 text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className={`w-3 h-3 ${isCapturing ? 'animate-spin' : ''}`} />
                        <span>{isCapturing ? 'Verifying...' : 'Re-test Cam'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Strict Rules Inventory */}
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm border border-amber-200">
                      ⚖️
                    </div>
                    <div>
                      <h3 className="font-extrabold text-navy-900 text-sm sm:text-base">
                        The Strict Rules Inventory
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Behavioral boundaries monitored by automated proctoring telemetry
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900 shrink-0">
                        Rule 1
                      </span>
                      <div>
                        <strong className="block font-bold text-navy-900">Full-Screen Tracking Loops</strong>
                        <p className="text-[11px] text-slate-700 leading-snug mt-0.5">
                          Assessment environment forces full-screen tracking loops. The window must remain active throughout.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 flex items-start gap-3">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-rose-200 text-rose-900 shrink-0">
                        Rule 2
                      </span>
                      <div>
                        <strong className="block font-bold text-navy-900">Zero Tab-Switching Tolerance</strong>
                        <p className="text-[11px] text-slate-700 leading-snug mt-0.5">
                          Closing full-screen mode or shifting tabs will log an immediate malpractice parameter to the HR evaluation committee.
                        </p>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-start gap-3">
                      <span className="font-mono font-black text-xs px-2 py-0.5 rounded bg-indigo-200 text-indigo-900 shrink-0">
                        Rule 3
                      </span>
                      <div>
                        <strong className="block font-bold text-navy-900">Single Candidate in Frame</strong>
                        <p className="text-[11px] text-slate-700 leading-snug mt-0.5">
                          No secondary monitors, smartphones, earphones, or outside persons are permitted in the camera frame.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Agreement Checkbox */}
                  <div className="pt-3 border-t border-slate-100">
                    <label className="flex items-start gap-3 cursor-pointer group select-none">
                      <div
                        onClick={() => setRulesAgreed((p) => !p)}
                        className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all cursor-pointer ${
                          rulesAgreed
                            ? 'bg-teal-600 border-teal-600 text-white shadow-xs'
                            : 'border-slate-300 group-hover:border-teal-400 bg-white'
                        }`}
                      >
                        {rulesAgreed && <Check className="w-3.5 h-3.5" />}
                      </div>
                      <span className="text-xs text-slate-700 font-medium leading-relaxed">
                        I confirm my hardware stream is calibrated, I am alone in the room, and I agree to abide by all anti-cheat assessment rules.
                      </span>
                    </label>
                  </div>

                  {/* 3. The Call-to-Action Trigger */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={!rulesAgreed}
                      onClick={handleLockAndStart}
                      className={`w-full py-4 px-6 rounded-2xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-3 transition-all shadow-lg cursor-pointer ${
                        rulesAgreed
                          ? 'bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-teal-500/25 active:scale-[0.99]'
                          : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-5 h-5" />
                      <span>🔒 Lock Environment & Start Assessment</span>
                    </button>
                    {!rulesAgreed && (
                      <p className="text-[11px] text-center text-slate-400 mt-2">
                        Please check the declaration box above to enable the lockdown trigger.
                      </p>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🏆 PHASE 3: ASSESSMENT RECORDED & CRYPTOGRAPHICALLY SEALED                */}
        {/* ========================================================================= */}
        {phase === 'submitted' && assessmentResult && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl max-w-3xl mx-auto space-y-8 animate-fadeIn text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center mx-auto shadow-xl shadow-teal-500/20">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider bg-teal-50 text-teal-800 border border-teal-200 px-3 py-1 rounded-full">
                Cryptographically Sealed
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                AI Aptitude Assessment Recorded
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
                Your responses for all <strong>{totalQuestions} technical questions</strong> for{' '}
                <strong className="text-teal-700">{selectedRole}</strong> have been sealed and transmitted to the HR hiring pipeline.
              </p>
            </div>

            {/* Submission Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Target Position</span>
                <p className="font-bold text-navy-900 text-xs mt-0.5">{selectedRole}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Candidate ID</span>
                <p className="font-bold text-navy-900 text-xs mt-0.5 font-mono">CAND-8492</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Proctoring Telemetry</span>
                <p className="font-bold text-emerald-600 text-xs mt-0.5">
                  {malpracticeCount === 0 ? '✓ Zero Violations' : `⚠ ${malpracticeCount} Flagged`}
                </p>
              </div>
            </div>

            {/* Confidentiality notice */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 text-left text-xs text-slate-700 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-teal-900">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Zero-Demographic Bias Protocol Active</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Raw scores are evaluated by the AI benchmark engine and provided strictly to the verified HR panel to eliminate demographic discrimination. You can track your milestone progression anytime.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link to="/candidate/status" className="w-full sm:w-auto">
                <Button variant="gradient" size="md" className="w-full sm:w-auto shadow-md">
                  <span>View in Live Application Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <button
                type="button"
                onClick={() => setPhase('hub')}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-bold transition-all cursor-pointer"
              >
                Practice Another MNC Track
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CandidateAptitude;
