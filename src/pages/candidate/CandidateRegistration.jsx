import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Checkbox from '../../components/common/Checkbox';
import { useAuth } from '../../hooks/useAuth';
import { ROLES, COUNTRY_CODES } from '../../utils/constants';
import { validateEmail, validatePassword, validatePhone, validateRequired } from '../../utils/validators';
import {
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Briefcase,
  GraduationCap,
  Building2,
  Layers,
  Code2,
  Clock,
  Compass,
  FileCheck,
  Check,
  Upload,
  FileUp,
  RefreshCw,
  Zap,
  X,
  FileText
} from 'lucide-react';
import {
  saveCompanyRequirements,
  getDefaultRoundsForCount,
  ROUND_PRESETS
} from '../../services/requirementsStore';
import { extractTextFromFile, parseResumeText } from '../../services/resumeParser';

const CandidateRegistration = () => {
  const navigate = useNavigate();
  const { register, loginWithOAuth, loading: authLoading } = useAuth();

  // Selected Portal: ROLES.CANDIDATE | ROLES.RECRUITER
  const [selectedPortal, setSelectedPortal] = useState(ROLES.CANDIDATE);

  // Candidate experience level: 'fresher' | 'experienced'
  const [experienceType, setExperienceType] = useState('fresher');

  // AI Resume Parser state
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);
  const [parsedResumeFile, setParsedResumeFile] = useState(null);

  // Shared Account Data
  const [accountData, setAccountData] = useState({
    fullName: '',
    email: '',
    password: '',
    countryCode: '+91',
    mobile: '',
    consentAlerts: true
  });

  // Candidate Fresher specific data
  const [fresherData, setFresherData] = useState({
    institution: '',
    degree: 'B.Tech / B.E. Computer Science',
    graduationYear: '2025',
    primarySkills: '',
    targetRole: 'Junior Frontend Developer',
    portfolioUrl: ''
  });

  // Candidate Experienced specific data
  const [experiencedData, setExperiencedData] = useState({
    currentTitle: '',
    currentCompany: '',
    yearsOfExperience: '3-5 years',
    primarySkills: '',
    noticePeriod: '30 Days',
    expectedCtc: '',
    linkedinUrl: ''
  });

  // HR / Recruiter specific data
  const [hrData, setHrData] = useState({
    companyName: '',
    companySize: '51-200 Growth',
    designation: 'Talent Acquisition Specialist',
    hiringDomain: 'Engineering & Product',
    primaryChallenge: 'High Volume Resume Fatigue',
    quarterlyHires: '6-20 hires',
    numRounds: 3,
    rounds: getDefaultRoundsForCount(3)
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Real Resume File Extraction
  const handleCustomResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingResume(true);
    setParsingStep(0);

    try {
      setParsingStep(1);
      const rawText = await extractTextFromFile(file);

      setParsingStep(2);
      await new Promise(r => setTimeout(r, 200));

      setParsingStep(3);
      const parsed = parseResumeText(rawText, file.name);

      setAccountData(prev => ({
        ...prev,
        fullName: parsed.fullName || prev.fullName,
        email: parsed.email || prev.email,
        countryCode: parsed.countryCode || prev.countryCode,
        mobile: parsed.mobile || prev.mobile,
        password: prev.password || 'FairHire@2026'
      }));

      const expType = parsed.experienceType === 'fresher' ? 'fresher' : 'experienced';
      setExperienceType(expType);

      if (expType === 'fresher') {
        setFresherData(prev => ({
          ...prev,
          institution: parsed.institution || prev.institution,
          degree: parsed.degree || prev.degree,
          graduationYear: parsed.graduationYear || prev.graduationYear,
          primarySkills: Array.isArray(parsed.skills) ? parsed.skills.join(', ') : (parsed.skills || prev.primarySkills),
          targetRole: parsed.targetRole || prev.targetRole,
          portfolioUrl: parsed.portfolioUrl || prev.portfolioUrl
        }));
      } else {
        setExperiencedData(prev => ({
          ...prev,
          currentTitle: parsed.currentTitle || prev.currentTitle,
          currentCompany: parsed.currentCompany || prev.currentCompany,
          yearsOfExperience: parsed.experienceYears || prev.yearsOfExperience,
          primarySkills: Array.isArray(parsed.skills) ? parsed.skills.join(', ') : (parsed.skills || prev.primarySkills),
          noticePeriod: parsed.noticePeriod || prev.noticePeriod,
          expectedCtc: parsed.expectedSalary || prev.expectedCtc,
          linkedinUrl: parsed.linkedinUrl || prev.linkedinUrl
        }));
      }

      // Store full parsed data so the Profile Wizard can pick it up seamlessly
      localStorage.setItem('fairhire_pending_profile_data', JSON.stringify({
        ...parsed,
        resumeFileName: file.name
      }));

      setParsedResumeFile(file.name);
      setSuccessMessage(`✨ Real resume "${file.name}" parsed! Details auto-filled directly from file.`);
      setErrors({});
    } catch (err) {
      console.error('Error parsing resume:', err);
      setParsedResumeFile(file.name);
      setSuccessMessage(`Resume "${file.name}" uploaded. Please verify your details.`);
    } finally {
      setIsParsingResume(false);
    }
  };


  const handleAccountChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFresherChange = (e) => {
    const { name, value } = e.target;
    setFresherData(prev => ({ ...prev, [name]: value }));
  };

  const handleExperiencedChange = (e) => {
    const { name, value } = e.target;
    setExperiencedData(prev => ({ ...prev, [name]: value }));
  };

  const handleHrChange = (e) => {
    const { name, value } = e.target;
    setHrData(prev => ({ ...prev, [name]: value }));
  };

  const handleHrRoundCountSelect = (count) => {
    const currentRounds = [...(hrData.rounds || [])];
    let updatedRounds = [];

    if (count > currentRounds.length) {
      const defaults = getDefaultRoundsForCount(count);
      updatedRounds = defaults.map((def, idx) => currentRounds[idx] || def);
    } else {
      updatedRounds = currentRounds.slice(0, count);
    }

    setHrData(prev => ({
      ...prev,
      numRounds: count,
      rounds: updatedRounds
    }));
  };

  const handleHrRoundChange = (index, field, value) => {
    setHrData(prev => {
      const updated = [...(prev.rounds || [])];
      if (updated[index]) {
        updated[index] = { ...updated[index], [field]: value };
      }
      return { ...prev, rounds: updated };
    });
  };

  const handleApplyHrRoundPreset = (index, preset) => {
    setHrData(prev => {
      const updated = [...(prev.rounds || [])];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          name: preset.name,
          description: preset.description
        };
      }
      return { ...prev, rounds: updated };
    });
  };

  const validate = () => {
    const newErrors = {};
    const nameErr = validateRequired(accountData.fullName, 'Full Name');
    if (nameErr) newErrors.fullName = nameErr;

    const emailErr = validateEmail(accountData.email);
    if (emailErr) newErrors.email = emailErr;

    const passErr = validatePassword(accountData.password);
    if (passErr) newErrors.password = passErr;

    const phoneErr = validatePhone(accountData.mobile);
    if (phoneErr) newErrors.mobile = phoneErr;

    // For HR only — still need company name at registration
    if (selectedPortal === ROLES.RECRUITER) {
      if (!hrData.companyName.trim()) {
        newErrors.companyName = 'Company / Organization name is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    setSuccessMessage('');

    const candidateDetails = experienceType === 'fresher' ? fresherData : experiencedData;
    const payload = {
      ...accountData,
      role: selectedPortal,
      ...(selectedPortal === ROLES.CANDIDATE
        ? { experienceType, details: candidateDetails }
        : { details: hrData }
      )
    };

    if (selectedPortal === ROLES.CANDIDATE) {
      localStorage.setItem('fairhire_pending_profile_data', JSON.stringify({
        fullName: accountData.fullName,
        email: accountData.email,
        countryCode: accountData.countryCode,
        mobile: accountData.mobile,
        experienceType,
        ...candidateDetails,
        resumeFileName: parsedResumeFile || ''
      }));
    }

    const res = await register(payload);
    setIsSubmitting(false);

    if (res.success) {
      if (selectedPortal === ROLES.RECRUITER) {
        saveCompanyRequirements({
          companyName: hrData.companyName || 'Enterprise Recruiter',
          hrName: accountData.fullName,
          hrEmail: accountData.email,
          phone: `${accountData.countryCode} ${accountData.mobile}`,
          designation: hrData.designation,
          companySize: hrData.companySize,
          industry: hrData.hiringDomain,
          numRounds: hrData.numRounds || 3,
          rounds: hrData.rounds || getDefaultRoundsForCount(3)
        }, false);
      }

      setSuccessMessage(
        selectedPortal === ROLES.RECRUITER
          ? 'HR workspace ready! Redirecting to Company Requirements...'
          : 'Profile created! Redirecting to your Candidate Dashboard...'
      );

      setTimeout(() => {
        if (selectedPortal === ROLES.RECRUITER) {
          navigate('/recruiter/requirements');
        } else {
          // Always send candidates to the profile wizard to complete/verify their profile
          navigate('/candidate/profile');
        }
      }, 900);
    } else {
      setErrors({ form: res.message || 'Registration failed' });
    }
  };

  const handleOAuthSignUp = async (provider) => {
    setIsSubmitting(true);
    const res = await loginWithOAuth(provider, selectedPortal);
    setIsSubmitting(false);
    if (res.success) {
      navigate(selectedPortal === ROLES.RECRUITER ? '/recruiter' : '/candidate');
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col justify-between font-sans">
      {/* Registration Page Header */}
      <header className="px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/assets/logo.jpg"
              alt="FairHire Logo"
              className="w-9 h-9 rounded-lg object-contain bg-white p-0.5 border border-slate-200"
            />
            <div>
              <span className="text-xl font-extrabold text-navy-900 tracking-tight font-sans">
                Fair<span className="text-teal-500">Hire</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">
                Fair Process. Right Talent.
              </p>
            </div>
          </Link>

          <div className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-teal-600 hover:text-navy-900 underline">
              Log In
            </Link>
          </div>
        </div>
      </header>

      {/* Two-Column Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 lg:p-10 flex items-center justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-6xl">
          
          {/* Left Column: Adaptive Value Proposition */}
          <div className="lg:col-span-4 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-950 text-white rounded-3xl p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden border border-teal-500/30">
            <div className="absolute top-0 right-0 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {selectedPortal === ROLES.CANDIDATE
                    ? 'Candidate Merit Intake'
                    : 'HR & Recruiter Intelligence'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                {selectedPortal === ROLES.CANDIDATE ? (
                  <>
                    Get Discovered on <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-400">Merit</span>, Not Keywords
                  </>
                ) : (
                  <>
                    Conquer <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-teal-400">Volume Fatigue</span> with Semantic AI
                  </>
                )}
              </h2>

              <div className="space-y-4 pt-2">
                {selectedPortal === ROLES.CANDIDATE ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">
                          {experienceType === 'fresher' ? 'Project & Skill Verification' : 'Contextual Career Depth'}
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                          {experienceType === 'fresher'
                            ? 'Highlight academic projects, GitHub repos, and core competencies without keyword penalty.'
                            : 'Proven track record and architectural experience weighted over arbitrary ATS buzzwords.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">Transparent 7-Stage Pipeline</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                          Track your application status live from Screened to Shortlist, Interview, and Offer with zero ghosting.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">Self-Service Scheduling</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                          Lock interview time slots directly on panel calendars with automatic meeting invites.
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">4x Faster Candidate Triage</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                          Process thousands of resumes in minutes into high-signal cohorts with semantic match scoring.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">Built-in 80% Rule Compliance</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                          Automated Adverse Impact calculations protect hiring parity before candidate stages advance.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="p-1.5 rounded-lg bg-teal-500/20 text-teal-300 mt-0.5 shrink-0">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold text-white">Interactive Kanban Pipeline</h4>
                        <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
                          Drag-and-drop progression across Applied, Screened, Shortlisted, Interviewed, and Offered stages.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-navy-800/80 mt-6 relative z-10">
              <p className="text-xs text-teal-300/90 font-medium flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Zero keyword-gaming • Complete EEOC fairness</span>
              </p>
            </div>
          </div>

          {/* Right Column: Tailored Registration Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200/90 shadow-xl flex flex-col justify-center">
            
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                Get Started with FairHire
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Choose your portal and complete your role profile to access tailored workflows.
              </p>
            </div>

            {/* OAuth Quick Sign-Up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-6">
              <button
                type="button"
                onClick={() => handleOAuthSignUp('google')}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-700 transition-all shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.37 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.2.01 10.04.01 12c0 1.96.46 3.8 1.28 5.42l3.99-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Sign up with Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSignUp('github')}
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>Sign up with GitHub</span>
              </button>
            </div>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <span className="relative bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                or sign up with email
              </span>
            </div>

            {/* Portal Selection Question: Candidate vs HR */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-3">
                1. Which Portal are you registering for? <span className="text-rose-500">*</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Candidate Portal Card */}
                <div
                  onClick={() => setSelectedPortal(ROLES.CANDIDATE)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    selectedPortal === ROLES.CANDIDATE
                      ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                    selectedPortal === ROLES.CANDIDATE ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-navy-900">Candidate Portal</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                        Job Seeker
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1">
                      Apply for roles, build verified merit profile, track pipeline milestones.
                    </p>
                  </div>
                </div>

                {/* Recruiter / HR Portal Card */}
                <div
                  onClick={() => setSelectedPortal(ROLES.RECRUITER)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    selectedPortal === ROLES.RECRUITER
                      ? 'bg-navy-50 border-navy-900 ring-2 ring-navy-200 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                    selectedPortal === ROLES.RECRUITER ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-navy-900">HR & Recruiter Portal</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-navy-100 text-navy-900">
                        Hiring Team
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight mt-1">
                      Post requisitions, contextually triage applicants, manage Kanban pipeline.
                    </p>
                  </div>
                </div>
              </div>
            </div>


            {/* Success & Error Banners */}
            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {errors.form && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Basic Account Information */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                  <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    2. Account Credentials
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    name="fullName"
                    value={accountData.fullName}
                    onChange={handleAccountChange}
                    placeholder={selectedPortal === ROLES.CANDIDATE ? 'e.g. Alex Morgan' : 'e.g. Elena Rostova'}
                    required
                    error={errors.fullName}
                  />

                  <Input
                    label={selectedPortal === ROLES.RECRUITER ? 'Work Email' : 'Email Address (Gmail)'}
                    type="email"
                    name="email"
                    value={accountData.email}
                    onChange={handleAccountChange}
                    placeholder={selectedPortal === ROLES.RECRUITER ? 'elena@company.com' : 'alex.morgan@gmail.com'}
                    required
                    error={errors.email}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Create Password"
                    type="password"
                    name="password"
                    value={accountData.password}
                    onChange={handleAccountChange}
                    placeholder="Minimum 8 characters"
                    showPasswordStrength
                    required
                    error={errors.password}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="countryCode"
                        value={accountData.countryCode}
                        onChange={handleAccountChange}
                        className="w-24 rounded-lg text-xs font-bold bg-white border border-slate-300 px-2 py-2.5 outline-none focus:border-teal-500 text-slate-800 cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="mobile"
                        value={accountData.mobile}
                        onChange={handleAccountChange}
                        placeholder="9876543210"
                        required
                        className={`flex-1 rounded-lg text-sm px-3.5 py-2.5 bg-white border ${
                          errors.mobile ? 'border-rose-400' : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                        } outline-none text-slate-800`}
                      />
                    </div>
                    {errors.mobile && <p className="text-xs text-rose-600 font-medium">{errors.mobile}</p>}
                  </div>
                </div>
              </div>

              {/* 3. Role-Specific Questions */}
              {selectedPortal === ROLES.CANDIDATE ? (
                /* === CANDIDATE: Work Status Only (Naukri-style) === */
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      3. Work Status
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div
                      onClick={() => setExperienceType('experienced')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        experienceType === 'experienced'
                          ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mt-0.5 ${experienceType === 'experienced' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-navy-900">I'm experienced</h5>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          I have work experience (excluding internships)
                        </p>
                      </div>
                    </div>

                    <div
                      onClick={() => setExperienceType('fresher')}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                        experienceType === 'fresher'
                          ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-200'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg mt-0.5 ${experienceType === 'fresher' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-sm font-bold text-navy-900">I'm a fresher</h5>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                          I am a student / Haven't worked after graduation
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Fields: Experienced Professional */}
                  {experienceType === 'experienced' && (
                    <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-200/80 space-y-4 animate-fade-in mt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-950 uppercase tracking-wider">
                        <Briefcase className="w-4 h-4 text-teal-600" />
                        <span>Employment & Experience Details</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Current / Previous Job Title"
                          name="currentTitle"
                          value={experiencedData.currentTitle}
                          onChange={handleExperiencedChange}
                          placeholder="e.g. Senior Full Stack Engineer"
                          required
                        />

                        <Input
                          label="Current / Previous Company"
                          name="currentCompany"
                          value={experiencedData.currentCompany}
                          onChange={handleExperiencedChange}
                          placeholder="e.g. Google / Microsoft"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Total Work Experience
                          </label>
                          <select
                            name="yearsOfExperience"
                            value={experiencedData.yearsOfExperience}
                            onChange={handleExperiencedChange}
                            className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-500 text-slate-800"
                          >
                            <option value="1-2 years">1 - 2 years</option>
                            <option value="3-5 years">3 - 5 years</option>
                            <option value="5-8 years">5 - 8 years</option>
                            <option value="8+ years">8+ years</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Notice Period
                          </label>
                          <select
                            name="noticePeriod"
                            value={experiencedData.noticePeriod}
                            onChange={handleExperiencedChange}
                            className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-500 text-slate-800"
                          >
                            <option value="Immediate">Immediate</option>
                            <option value="15 Days">15 Days</option>
                            <option value="30 Days">30 Days</option>
                            <option value="60 Days">60 Days</option>
                            <option value="90 Days">90 Days</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Key Technical Skills"
                          name="primarySkills"
                          value={experiencedData.primarySkills}
                          onChange={handleExperiencedChange}
                          placeholder="e.g. React, Node.js, Python, AWS"
                        />

                        <Input
                          label="Annual Salary / Current CTC"
                          name="expectedCtc"
                          value={experiencedData.expectedCtc}
                          onChange={handleExperiencedChange}
                          placeholder="e.g. ₹15,00,000 / $110,000"
                        />
                      </div>
                    </div>
                  )}

                  {/* Dynamic Fields: Fresher */}
                  {experienceType === 'fresher' && (
                    <div className="p-5 rounded-2xl bg-teal-50/40 border border-teal-200/80 space-y-4 animate-fade-in mt-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-teal-950 uppercase tracking-wider">
                        <GraduationCap className="w-4 h-4 text-teal-600" />
                        <span>Education & Academic Credentials</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Highest Qualification / Degree"
                          name="degree"
                          value={fresherData.degree}
                          onChange={handleFresherChange}
                          placeholder="e.g. B.Tech / B.E. Computer Science"
                          required
                        />

                        <Input
                          label="College / University Name"
                          name="institution"
                          value={fresherData.institution}
                          onChange={handleFresherChange}
                          placeholder="e.g. Stanford University / IIT"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                            Graduation / Passing Year
                          </label>
                          <select
                            name="graduationYear"
                            value={fresherData.graduationYear}
                            onChange={handleFresherChange}
                            className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-500 text-slate-800"
                          >
                            <option value="2026">2026 (Upcoming)</option>
                            <option value="2025">2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                          </select>
                        </div>

                        <Input
                          label="Target Job Role"
                          name="targetRole"
                          value={fresherData.targetRole}
                          onChange={handleFresherChange}
                          placeholder="e.g. Junior Frontend Developer"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          label="Key Skills / Technologies"
                          name="primarySkills"
                          value={fresherData.primarySkills}
                          onChange={handleFresherChange}
                          placeholder="e.g. Java, Python, React, C++"
                        />

                        <Input
                          label="GitHub / Portfolio Link"
                          name="portfolioUrl"
                          value={fresherData.portfolioUrl}
                          onChange={handleFresherChange}
                          placeholder="https://github.com/username"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* =================== HR / RECRUITER QUESTIONS =================== */
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-navy-900"></span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      3. HR & Organization Profile
                    </h4>
                  </div>

                  <div className="p-4 rounded-2xl bg-navy-50/60 border border-navy-200/80 space-y-3.5 animate-fadeIn">
                    <div className="text-xs font-bold text-navy-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-navy-800" />
                      <span>Enterprise Recruitment Questions</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <Input
                        label="Company / Organization Name"
                        name="companyName"
                        value={hrData.companyName}
                        onChange={handleHrChange}
                        placeholder="e.g. Horizon Technologies"
                        required
                        error={errors.companyName}
                      />

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Company Scale / Headcount
                        </label>
                        <select
                          name="companySize"
                          value={hrData.companySize}
                          onChange={handleHrChange}
                          className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-navy-900 text-slate-800"
                        >
                          <option value="1-50 Seed/Early">1 - 50 employees (Early Stage)</option>
                          <option value="51-200 Growth">51 - 200 employees (Growth Stage)</option>
                          <option value="201-1000 Mid-Market">201 - 1000 employees (Mid-Market)</option>
                          <option value="1000+ Enterprise">1000+ employees (Global Enterprise)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Your HR Role / Title
                        </label>
                        <select
                          name="designation"
                          value={hrData.designation}
                          onChange={handleHrChange}
                          className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-navy-900 text-slate-800"
                        >
                          <option value="Talent Acquisition Specialist">Talent Acquisition Specialist</option>
                          <option value="Technical Recruiter">Technical Recruiter</option>
                          <option value="HR Manager">HR Manager</option>
                          <option value="Head of People & Culture">Head of People & Culture</option>
                          <option value="Hiring Manager / Director">Hiring Manager / Director</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Primary Departments You Hire For
                        </label>
                        <select
                          name="hiringDomain"
                          value={hrData.hiringDomain}
                          onChange={handleHrChange}
                          className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-navy-900 text-slate-800"
                        >
                          <option value="Engineering & Product">Software Engineering & Product</option>
                          <option value="Data Science & AI">Data Science & AI / ML</option>
                          <option value="Design & UX">Product Design & Creative</option>
                          <option value="Sales & Operations">Sales & Business Operations</option>
                          <option value="Cross-Functional All">Cross-Functional (All Departments)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Primary Recruitment Challenge
                        </label>
                        <select
                          name="primaryChallenge"
                          value={hrData.primaryChallenge}
                          onChange={handleHrChange}
                          className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-navy-900 text-slate-800"
                        >
                          <option value="High Volume Resume Fatigue">High Volume Resume Fatigue</option>
                          <option value="Slow Screening Turnaround">Slow Screening Turnaround</option>
                          <option value="Keyword Stuffing & False Matches">Keyword Stuffing & False Matches</option>
                          <option value="EEOC & 80% Parity Compliance">EEOC & 80% Parity Compliance</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                          Quarterly Hiring Volume
                        </label>
                        <select
                          name="quarterlyHires"
                          value={hrData.quarterlyHires}
                          onChange={handleHrChange}
                          className="rounded-lg text-xs font-semibold bg-white border border-slate-300 px-3 py-2.5 outline-none focus:border-navy-900 text-slate-800"
                        >
                          <option value="1-5 hires">1 - 5 hires / quarter</option>
                          <option value="6-20 hires">6 - 20 hires / quarter</option>
                          <option value="20-50 hires">20 - 50 hires / quarter</option>
                          <option value="50+ hires">50+ hires / quarter</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* 4. COMPANY HIRING PROCESS & ROUNDS QUESTIONNAIRE */}
                  <div className="flex items-center gap-2 pt-2 pb-1 border-b border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                      4. Company Hiring Process & Rounds
                    </h4>
                  </div>

                  <div className="p-4 sm:p-5 rounded-2xl bg-teal-50/50 border border-teal-200/80 space-y-4 animate-fadeIn">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <label className="text-xs font-extrabold text-navy-900 uppercase tracking-wider">
                          How many rounds will be conducted in your company? <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-slate-500">
                          Click an option below to configure your company's evaluation stages.
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-teal-700 bg-teal-100/70 px-2.5 py-0.5 rounded-full border border-teal-200 w-fit">
                        {hrData.numRounds} {hrData.numRounds === 1 ? 'Round Selected' : 'Rounds Selected'}
                      </span>
                    </div>

                    {/* NEAT 1 TO 6 ROUND BOXES */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2.5">
                      {[
                        { count: 1, label: '1', sub: 'Fast-Track' },
                        { count: 2, label: '2', sub: 'Standard' },
                        { count: 3, label: '3', sub: 'Recommended' },
                        { count: 4, label: '4', sub: 'In-Depth' },
                        { count: 5, label: '5', sub: 'Multi-Stage' },
                        { count: 6, label: '6', sub: 'Enterprise' }
                      ].map((box) => {
                        const isSelected = hrData.numRounds === box.count;
                        return (
                          <div
                            key={box.count}
                            onClick={() => handleHrRoundCountSelect(box.count)}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center cursor-pointer relative select-none ${
                              isSelected
                                ? 'bg-white border-teal-500 ring-2 ring-teal-500/30 shadow-md scale-102'
                                : 'bg-white/80 border-slate-200 hover:border-teal-300 hover:bg-white'
                            }`}
                          >
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-teal-500 text-white flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                            <span className={`text-xl font-black font-mono leading-none ${
                              isSelected ? 'text-teal-600' : 'text-slate-700'
                            }`}>
                              {box.count}
                            </span>
                            <span className={`text-[10px] font-bold mt-1 ${
                              isSelected ? 'text-navy-900' : 'text-slate-500'
                            }`}>
                              {box.sub}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* WHAT ARE THE ROUNDS INPUTS */}
                    <div className="pt-2 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                          What are the rounds?
                        </label>
                        <span className="text-[10px] font-semibold text-slate-500">
                          You can type or adjust round names below
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {(hrData.rounds || []).map((round, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-mono">
                                Stage {idx + 1}
                              </span>
                              <div className="flex flex-wrap items-center gap-1">
                                {ROUND_PRESETS.slice(0, 3).map((preset, pIdx) => (
                                  <button
                                    key={pIdx}
                                    type="button"
                                    onClick={() => handleApplyHrRoundPreset(idx, preset)}
                                    className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors cursor-pointer"
                                  >
                                    + {preset.name.split(' ')[0]}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                              <div className="sm:col-span-5">
                                <input
                                  type="text"
                                  value={round.name || ''}
                                  onChange={(e) => handleHrRoundChange(idx, 'name', e.target.value)}
                                  placeholder={`Round ${idx + 1} Name`}
                                  className="w-full rounded-lg text-xs font-bold bg-slate-50/50 border border-slate-300 p-2 outline-none focus:border-teal-500 text-slate-800"
                                />
                              </div>
                              <div className="sm:col-span-7">
                                <input
                                  type="text"
                                  value={round.description || ''}
                                  onChange={(e) => handleHrRoundChange(idx, 'description', e.target.value)}
                                  placeholder="Evaluation focus & candidate details"
                                  className="w-full rounded-lg text-xs font-normal bg-slate-50/50 border border-slate-300 p-2 outline-none focus:border-teal-500 text-slate-700"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                   </div>
                 </div>
              )}

              {/* Consent & Agreements */}
              <div className="pt-2 space-y-3">
                <Checkbox
                  name="consentAlerts"
                  checked={accountData.consentAlerts}
                  onChange={handleAccountChange}
                  label={
                    selectedPortal === ROLES.CANDIDATE
                      ? 'Receive high-match job opportunities and interview booking alerts via Email and WhatsApp.'
                      : 'Receive candidate application digests and pipeline compliance alerts.'
                  }
                />

                <p className="text-[11px] text-slate-500 leading-relaxed">
                  By clicking Register, you agree to FairHire's{' '}
                  <span className="text-teal-600 font-semibold cursor-pointer underline">
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className="text-teal-600 font-semibold cursor-pointer underline">
                    Fairness Privacy Policy
                  </span>.
                </p>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant={selectedPortal === ROLES.RECRUITER ? 'navy' : 'gradient'}
                  size="lg"
                  className="w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center gap-2"
                  isLoading={isSubmitting || authLoading}
                >
                  <span>
                    {selectedPortal === ROLES.RECRUITER
                      ? 'Complete HR Setup & Launch Hub'
                      : 'Register Now →'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-100 bg-white">
        © 2026 FairHire Platform • Designed to Eliminate Volume Fatigue with Semantic Merit
      </footer>
    </div>
  );
};

export default CandidateRegistration;
