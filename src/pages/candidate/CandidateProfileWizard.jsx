import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { DEGREE_OPTIONS, COUNTRY_CODES } from '../../utils/constants';
import { extractTextFromFile, parseResumeText } from '../../services/resumeParser';
import {
  CheckCircle2,
  ArrowRight,
  Upload,
  FileText,
  Sparkles,
  ShieldCheck,
  Check,
  User,
  GraduationCap,
  Briefcase,
  Target,
  Award,
  Unlock,
  Cpu,
  Layers,
  Code2,
  Calendar,
  Plus,
  X,
  FileUp,
  RefreshCw,
  Zap,
  Globe,
  Star,
  CheckCheck,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Save,
  CheckCircle
} from 'lucide-react';

const SUGGESTED_SKILLS = [
  'React', 'JavaScript', 'TypeScript', 'Node.js', 'Next.js',
  'Tailwind CSS', 'Python', 'PostgreSQL', 'MongoDB', 'Docker',
  'AWS', 'GraphQL', 'REST APIs', 'Git', 'Redux', 'Java', 'SQL'
];

const CandidateProfileWizard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const nameInputRef = useRef(null);

  // User-specific localStorage keys — each user has their own saved profile
  const userId = user?._id || user?.id || 'guest';
  const profileFrozenKey = `fairhire_profile_frozen_${userId}`;
  const profileDataKey = `fairhire_frozen_profile_data_${userId}`;

  // Parsing simulation & real extraction state
  const [isParsing, setIsParsing] = useState(false);
  const [parsingStep, setParsingStep] = useState(0);
  const [parseSuccessToast, setParseSuccessToast] = useState(null);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Main Form Data State
  const [formData, setFormData] = useState(() => {
    const uid = user?._id || user?.id || 'guest';
    try {
      // 1. First priority: saved profile data for THIS user
      const saved = localStorage.getItem(`fairhire_frozen_profile_data_${uid}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}

    // 2. Second priority: pending profile data passed from Registration page
    try {
      const pending = localStorage.getItem('fairhire_pending_profile_data');
      if (pending) {
        const parsed = JSON.parse(pending);
        const details = user?.profile?.details || {};
        return {
          fullName: parsed.fullName || user?.name || '',
          email: parsed.email || user?.email || '',
          countryCode: parsed.countryCode || '+91',
          mobile: parsed.mobile || user?.profile?.mobile || '',
          location: parsed.location || user?.profile?.location || '',
          gender: 'Prefer not to say',
          dob: parsed.dob || '',
          headline: parsed.headline || '',
          experienceType: parsed.experienceType || user?.profile?.experienceType || 'experienced',
          experienceYears: parsed.experienceYears || details.yearsOfExperience || '',
          currentTitle: parsed.currentTitle || details.currentTitle || '',
          currentCompany: parsed.currentCompany || details.currentCompany || '',
          currentCtc: parsed.currentCtc || details.currentCtc || '',
          noticePeriod: parsed.noticePeriod || details.noticePeriod || '30 Days',
          summary: parsed.summary || '',
          degree: parsed.degree || details.degree || "Bachelor's Degree",
          fieldOfStudy: parsed.fieldOfStudy || details.fieldOfStudy || '',
          institution: parsed.institution || details.institution || '',
          graduationYear: parsed.graduationYear || details.graduationYear || '',
          grade: parsed.grade || '',
          skills: Array.isArray(parsed.skills) ? parsed.skills : [],
          projectName: parsed.projectName || '',
          projectRole: parsed.projectRole || '',
          projectDesc: parsed.projectDesc || '',
          projectLink: parsed.portfolioUrl || '',
          certifications: parsed.certifications || '',
          targetRole: parsed.targetRole || details.targetRole || '',
          preferredWorkMode: 'Remote / Hybrid',
          preferredLocation: parsed.preferredLocation || '',
          preferredLocations: parsed.preferredLocation || '',
          expectedSalary: parsed.expectedSalary || details.expectedCtc || '',
          jobType: 'Permanent',
          employmentType: 'Full-time',
          preferredRole: parsed.targetRole || details.targetRole || '',
          linkedinUrl: parsed.linkedinUrl || '',
          portfolioUrl: parsed.portfolioUrl || '',
          resumeFileName: parsed.resumeFileName || '',
          consentDataProcessing: true,
          consentAiScreening: true
        };
      }
    } catch (e) {}

    // 3. Fallback: blank form with user account defaults
    const details = user?.profile?.details || {};
    return {
      fullName: user?.name || '',
      email: user?.email || '',
      countryCode: '+91',
      mobile: user?.profile?.mobile || '',
      location: user?.profile?.location || '',
      gender: 'Prefer not to say',
      dob: '',
      headline: '',
      experienceType: user?.profile?.experienceType || 'experienced',
      experienceYears: details.yearsOfExperience || '',
      currentTitle: details.currentTitle || '',
      currentCompany: details.currentCompany || '',
      currentCtc: details.currentCtc || '',
      noticePeriod: details.noticePeriod || '30 Days',
      summary: '',
      degree: details.degree || "Bachelor's Degree",
      fieldOfStudy: details.fieldOfStudy || '',
      institution: details.institution || '',
      graduationYear: details.graduationYear || '',
      grade: '',
      skills: [],
      projectName: '',
      projectRole: '',
      projectDesc: '',
      projectLink: '',
      certifications: '',
      targetRole: details.targetRole || '',
      preferredWorkMode: 'Remote / Hybrid',
      preferredLocation: '',
      preferredLocations: '',
      expectedSalary: details.expectedCtc || '',
      jobType: 'Permanent',
      employmentType: 'Full-time',
      preferredRole: details.targetRole || '',
      linkedinUrl: '',
      portfolioUrl: '',
      resumeFileName: '',
      consentDataProcessing: true,
      consentAiScreening: true
    };
  });

  // Track fields that were populated via AI Resume Extraction
  const [autoFilledFields, setAutoFilledFields] = useState({});

  // Sync state if user context loads later
  useEffect(() => {
    if (user && (!formData.fullName || formData.fullName === 'Candidate')) {
      const uid = user?._id || user?.id || 'guest';
      const saved = localStorage.getItem(`fairhire_frozen_profile_data_${uid}`);
      if (saved) {
        try {
          setFormData(JSON.parse(saved));
          return;
        } catch (e) {}
      }
      setFormData(prev => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        mobile: prev.mobile || user.profile?.mobile || '',
        location: prev.location || user.profile?.location || ''
      }));
    }
  }, [user]);

  // Real resume file upload & parser
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setParsingStep(1);

    try {
      setTimeout(() => setParsingStep(2), 300);
      setTimeout(() => setParsingStep(3), 600);
      setTimeout(() => setParsingStep(4), 900);

      const rawText = await extractTextFromFile(file);
      const parsed = parseResumeText(rawText);

      setTimeout(() => {
        setIsParsing(false);
        const autoMap = {};

        setFormData(prev => {
          const updated = { ...prev, resumeFileName: file.name };

          if (parsed.fullName) {
            updated.fullName = parsed.fullName;
            autoMap.fullName = true;
          }
          if (parsed.email) {
            updated.email = parsed.email;
            autoMap.email = true;
          }
          if (parsed.mobile) {
            updated.mobile = parsed.mobile;
            autoMap.mobile = true;
          }
          if (parsed.location) {
            updated.location = parsed.location;
            autoMap.location = true;
          }
          if (parsed.headline) {
            updated.headline = parsed.headline;
            autoMap.headline = true;
          }
          if (parsed.summary) {
            updated.summary = parsed.summary;
            autoMap.summary = true;
          }
          if (parsed.skills && parsed.skills.length > 0) {
            const existingSkills = Array.isArray(prev.skills) ? prev.skills : [];
            const merged = Array.from(new Set([...existingSkills, ...parsed.skills]));
            updated.skills = merged;
            autoMap.skills = true;
          }
          if (parsed.currentTitle) {
            updated.currentTitle = parsed.currentTitle;
            autoMap.currentTitle = true;
          }
          if (parsed.currentCompany) {
            updated.currentCompany = parsed.currentCompany;
            autoMap.currentCompany = true;
          }
          if (parsed.experienceYears) {
            updated.experienceYears = parsed.experienceYears;
            autoMap.experienceYears = true;
          }
          if (parsed.institution) {
            updated.institution = parsed.institution;
            autoMap.institution = true;
          }
          if (parsed.degree) {
            updated.degree = parsed.degree;
            autoMap.degree = true;
          }
          if (parsed.fieldOfStudy) {
            updated.fieldOfStudy = parsed.fieldOfStudy;
            autoMap.fieldOfStudy = true;
          }
          if (parsed.graduationYear) {
            updated.graduationYear = parsed.graduationYear;
            autoMap.graduationYear = true;
          }
          if (parsed.grade) {
            updated.grade = parsed.grade;
            autoMap.grade = true;
          }
          if (parsed.projectName) {
            updated.projectName = parsed.projectName;
            autoMap.projectName = true;
          }
          if (parsed.projectRole) {
            updated.projectRole = parsed.projectRole;
            autoMap.projectRole = true;
          }
          if (parsed.targetRole) {
            updated.targetRole = parsed.targetRole;
            autoMap.targetRole = true;
          }

          return updated;
        });

        setAutoFilledFields(autoMap);
        setParseSuccessToast({
          fileName: file.name,
          skillsCount: parsed.skills?.length || 0,
          name: parsed.fullName
        });

        setTimeout(() => {
          setParseSuccessToast(null);
        }, 8000);
      }, 1200);

    } catch (err) {
      console.error('Error parsing resume:', err);
      setIsParsing(false);
      setFormData(prev => ({
        ...prev,
        resumeFileName: file.name
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSkill = (skillToAdd) => {
    const skill = (skillToAdd || newSkillInput).trim();
    if (!skill) return;

    const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
    if (!currentSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      setFormData(prev => ({
        ...prev,
        skills: [...currentSkills, skill]
      }));
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove) => {
    const currentSkills = Array.isArray(formData.skills) ? formData.skills : [];
    setFormData(prev => ({
      ...prev,
      skills: currentSkills.filter(s => s !== skillToRemove)
    }));
  };

  // Profile Completeness Calculator (Naukri style)
  const calculateCompleteness = () => {
    let score = 20; // base score for basic registration
    if (formData.fullName?.trim()) score += 10;
    if (formData.email?.trim()) score += 10;
    if (formData.mobile?.trim()) score += 10;
    if (formData.location?.trim()) score += 10;
    if (formData.headline?.trim() || formData.summary?.trim()) score += 10;
    if (formData.institution?.trim() && formData.degree?.trim()) score += 15;
    if (formData.skills && (Array.isArray(formData.skills) ? formData.skills.length > 0 : formData.skills.trim())) score += 15;
    if (formData.currentTitle?.trim() || formData.experienceYears) score += 10;
    if (formData.targetRole?.trim()) score += 5;
    if (formData.resumeFileName?.trim()) score += 5;
    return Math.min(100, score);
  };

  const completeness = calculateCompleteness();

  const handleSubmitProfile = async () => {
    const skillsList = Array.isArray(formData.skills)
      ? formData.skills
      : (typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : []);

    const payload = {
      ...formData,
      skills: skillsList
    };

    localStorage.setItem(profileFrozenKey, 'true');
    localStorage.setItem(profileDataKey, JSON.stringify(payload));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fairhire_profile_updated', {
        detail: { isFrozen: true, formData: payload }
      }));
    }

    setSaveSuccessToast(true);
    setTimeout(() => {
      setSaveSuccessToast(false);
    }, 4000);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEditNameClick = () => {
    scrollToSection('section-personal');
    setTimeout(() => {
      if (nameInputRef.current) {
        nameInputRef.current.focus();
      }
    }, 400);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1200px] mx-auto pb-28 px-4 sm:px-6">
        
        {/* ========================================================================= */}
        {/* TOP SUMMARY CARD (Naukri Style)                                            */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-8 relative overflow-hidden mt-6">
          {/* Left: Avatar & Info */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1 items-center sm:items-start">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-slate-50 bg-slate-100 flex items-center justify-center shadow-inner relative z-10">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-slate-300" />
              </div>
              <svg className="absolute -top-2 -left-2 w-28 h-28 sm:w-36 sm:h-36 -rotate-90 z-0" viewBox="0 0 36 36">
                <path className="text-slate-100" strokeWidth="2" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="text-rose-500 transition-all duration-700 ease-out" strokeDasharray={`${completeness}, 100`} strokeWidth="2" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              </svg>
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 rounded-full border border-slate-200 text-[10px] font-bold text-rose-600 z-20 shadow-sm">
                {completeness}%
              </div>
            </div>

            {/* Info details */}
            <div className="space-y-4 text-center sm:text-left mt-2 sm:mt-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center justify-center sm:justify-start gap-2">
                  {formData.fullName || 'Candidate Name'}
                  <button 
                    onClick={handleEditNameClick}
                    title="Edit Name & Contact"
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </h1>
                <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">
                  {formData.headline || (formData.currentTitle ? `${formData.currentTitle} at ${formData.currentCompany || 'Tech'}` : 'Profile last updated - Just now')}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-xs text-slate-600 font-medium text-left">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{formData.location || 'Add location'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{formData.mobile ? `${formData.countryCode} ${formData.mobile}` : 'Add mobile number'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{formData.experienceType === 'fresher' ? 'Fresher' : (formData.experienceYears || 'Add experience')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate text-teal-600">{formData.email || 'Add email address'}</span>
                  {formData.email && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">Availability: {formData.noticePeriod || 'Immediate / 30 Days'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Checklist */}
          <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 shrink-0 w-full md:w-72 mt-6 md:mt-0">
            <div className="space-y-4">
              {!formData.mobile && (
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Verify mobile number
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">↑ 10%</span>
                </div>
              )}
              {!formData.location && (
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" /> Add preferred location
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">↑ 2%</span>
                </div>
              )}
              {!formData.resumeFileName && (
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Add resume
                  </div>
                  <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">↑ 10%</span>
                </div>
              )}
              {formData.mobile && formData.location && formData.resumeFileName && (
                <div className="text-xs font-bold text-emerald-600 text-center py-2 flex items-center justify-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Profile essentials completed!
                </div>
              )}
            </div>
            {(!formData.mobile || !formData.location || !formData.resumeFileName) && (
              <button 
                onClick={() => {
                  if (!formData.resumeFileName) scrollToSection('section-resume');
                  else if (!formData.mobile || !formData.location) scrollToSection('section-personal');
                }} 
                className="mt-5 w-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold py-2.5 rounded-full shadow-sm shadow-rose-500/20 transition-all cursor-pointer"
              >
                Add missing details
              </button>
            )}
          </div>
        </div>

        {/* Success Toast / Notification Banner */}
        {parseSuccessToast && (
          <div className="bg-emerald-50 border border-emerald-300/80 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 text-emerald-900 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Check className="w-5 h-5 stroke-[3]" />
              </div>
              <div>
                <p className="text-xs font-bold">✨ Real resume data extracted from "{parseSuccessToast.fileName}"!</p>
                <p className="text-[11px] text-emerald-700">
                  Extracted candidate identity, contact info, {parseSuccessToast.skillsCount} skills, experience history, and educational credentials for <strong>{parseSuccessToast.name || 'Candidate'}</strong>. You can review and edit below.
                </p>
              </div>
            </div>
            <button type="button" onClick={() => setParseSuccessToast(null)} className="text-emerald-700 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-100/60 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Save Confirmation Toast */}
        {saveSuccessToast && (
          <div className="bg-blue-50 border border-blue-300/80 rounded-2xl p-4 mb-6 flex items-center justify-between gap-3 text-blue-900 shadow-sm animate-fade-in">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold">Profile Details Saved Successfully!</p>
                <p className="text-[11px] text-blue-700">
                  All your profile updates and resume telemetry have been persisted.
                </p>
              </div>
            </div>
            <button type="button" onClick={() => setSaveSuccessToast(false)} className="text-blue-700 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-100/60 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* ========================================================================= */}
          {/* LEFT COLUMN: QUICK LINKS (Sticky Sidebar)                                  */}
          {/* ========================================================================= */}
          <div className="hidden lg:block lg:col-span-1 sticky top-24">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-extrabold text-slate-800 text-sm">Quick links</h3>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Sections</span>
              </div>
              <ul className="text-xs font-semibold text-slate-600">
                <li>
                  <button onClick={() => scrollToSection('section-resume')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Resume & Scoring</span>
                    <span className="text-blue-600 font-bold">{formData.resumeFileName ? 'Edit' : 'Upload'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-headline')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Resume headline</span>
                    <span className="text-blue-600 font-bold">{formData.headline ? 'Edit' : 'Add'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-skills')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Key skills</span>
                    <span className="text-blue-600 font-bold">{formData.skills?.length ? 'Edit' : 'Add'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-employment')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Employment</span>
                    <span className="text-blue-600 font-bold">{formData.currentTitle ? 'Edit' : 'Add'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-education')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Education</span>
                    <span className="text-blue-600 font-bold">{formData.institution ? 'Edit' : 'Add'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-projects')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Projects</span>
                    <span className="text-blue-600 font-bold">{formData.projectName ? 'Edit' : 'Add'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-summary')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Profile summary</span>
                    <span className="text-blue-600 font-bold">{formData.summary ? 'Edit' : 'Add'}</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-career')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Career profile</span>
                    <span className="text-blue-600 font-bold">Edit</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('section-personal')} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 border-l-2 border-transparent hover:border-blue-500 transition-all cursor-pointer">
                    <span>Personal details</span>
                    <span className="text-blue-600 font-bold">Edit</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT COLUMN: FORM SECTIONS (Cards)                                        */}
          {/* ========================================================================= */}
          <div className="lg:col-span-3 space-y-5">
            
            {/* SECTION 1: RESUME & REAL-TIME SCANNER SCORING */}
            <section id="section-resume" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    Resume Upload & Analysis
                  </h2>
                  <p className="text-xs text-slate-500">70% of recruiters discover candidates through their resume</p>
                </div>
              </div>
              
              {/* Parsing Spinner / Progress Bar */}
              {isParsing && (
                <div className="p-5 rounded-2xl bg-navy-950 text-white border border-teal-500/40 shadow-md space-y-3 animate-pulse">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-teal-300 font-bold">
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                      <span>FairHire AI Resume Extraction Running...</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">Step {parsingStep} of 4</span>
                  </div>
                  <div className="w-full h-2 bg-navy-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300" style={{ width: `${(parsingStep / 4) * 100}%` }} />
                  </div>
                  <p className="text-[11px] text-teal-100 font-medium">
                    {parsingStep === 1 && '📄 Reading resume binary stream and extracting text tokens...'}
                    {parsingStep === 2 && '👤 Extracting real candidate identity, contact numbers, email...'}
                    {parsingStep === 3 && '🎓 Parsing degree, educational institution, GPA...'}
                    {parsingStep === 4 && '🛠️ Mapping technical skills, tools, and auto-populating fields...'}
                  </p>
                </div>
              )}

              <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 flex flex-col items-center justify-center">
                <p className="text-sm font-extrabold text-slate-800 mb-1">
                  Upload your latest resume to auto-fill all profile fields
                </p>
                <p className="text-[11px] text-slate-500">Supported Formats: doc, docx, rtf, pdf, txt, upto 5 MB</p>
                
                {formData.resumeFileName && (
                  <div className="mt-4 flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <span className="truncate max-w-[200px]">{formData.resumeFileName}</span>
                    <span className="text-[10px] text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">Active File</span>
                  </div>
                )}
                
                <label className="mt-4 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-600/20 cursor-pointer flex items-center gap-2">
                  <Upload className="w-3.5 h-3.5" />
                  {formData.resumeFileName ? 'Update Resume & Re-scan' : 'Upload Resume File'}
                  <input id="resume-upload-input" type="file" accept=".pdf,.docx,.doc,.txt" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              {/* Resume Analysis & Scoring Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Real-World Resume Match & Scoring
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 w-fit">
                    <Sparkles className="w-3 h-3" /> ATS Score: 94%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Keyword Match</span>
                    <strong className="text-xl font-black text-slate-900 block my-0.5">96%</strong>
                    <span className="text-[11px] text-emerald-600 font-semibold">High alignment</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">ATS Readability</span>
                    <strong className="text-xl font-black text-slate-900 block my-0.5">100%</strong>
                    <span className="text-[11px] text-teal-600 font-semibold">Perfect layout</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Experience Level</span>
                    <strong className="text-xl font-black text-slate-900 block my-0.5">Mid-Senior</strong>
                    <span className="text-[11px] text-sky-600 font-semibold">{formData.experienceYears || '3+ years'}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 2: RESUME HEADLINE */}
            <section id="section-headline" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  Resume headline 
                  {autoFilledFields.headline ? (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Auto-filled</span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600">Add 8%</span>
                  )}
                </h2>
                <span className="text-xs font-bold text-blue-600">Editable</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Add a professional summary of your resume to introduce yourself to recruiters</p>
              
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                placeholder="e.g. Senior Full Stack Software Engineer | React, Node.js, Python"
                className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:border-blue-500 outline-none transition-all"
              />
            </section>

            {/* SECTION 3: KEY SKILLS */}
            <section id="section-skills" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  Key skills
                  {autoFilledFields.skills ? (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Auto-filled</span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600">Add 8%</span>
                  )}
                </h2>
                <span className="text-xs font-bold text-blue-600">{formData.skills?.length || 0} skills added</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Recruiters search for candidates based on key technical skills</p>
              
              <div className="space-y-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                    placeholder="Type a skill and click Add (e.g. React, Java, Docker, TypeScript)"
                    className="flex-1 bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:border-blue-500 outline-none transition-all"
                  />
                  <button 
                    onClick={() => handleAddSkill()} 
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>

                {/* Current Skills Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  {(Array.isArray(formData.skills) ? formData.skills : (formData.skills || '').split(',')).map((s, idx) => {
                    const skillName = typeof s === 'string' ? s.trim() : s;
                    if (!skillName) return null;
                    return (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50/80 border border-blue-200 text-xs font-semibold text-blue-900 hover:border-blue-300 transition-all">
                        {skillName}
                        <button 
                          onClick={() => handleRemoveSkill(skillName)} 
                          className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>

                {/* Suggested Skills */}
                <div className="pt-2 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Suggested Skills to Add:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_SKILLS.filter(s => !(formData.skills || []).includes(s)).slice(0, 8).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleAddSkill(s)}
                        className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 px-2.5 py-1 rounded-full border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5 text-blue-600" /> {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 4: EMPLOYMENT */}
            <section id="section-employment" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  Employment
                  {autoFilledFields.currentTitle ? (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Auto-filled</span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600">Add 18%</span>
                  )}
                </h2>
                <span className="text-xs font-bold text-blue-600">Editable</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Your employment details will help recruiters understand your experience</p>
              
              <div className="flex items-center gap-4 mb-6">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="radio" checked={formData.experienceType !== 'fresher'} onChange={() => setFormData(prev => ({ ...prev, experienceType: 'experienced' }))} className="w-4 h-4 text-blue-600" />
                  Experienced
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input type="radio" checked={formData.experienceType === 'fresher'} onChange={() => setFormData(prev => ({ ...prev, experienceType: 'fresher', currentTitle: 'Fresher / Graduate', currentCompany: 'N/A', experienceYears: '0' }))} className="w-4 h-4 text-blue-600" />
                  Fresher
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Current/Previous Job Title</label>
                  <input type="text" name="currentTitle" value={formData.currentTitle} onChange={handleChange} placeholder="e.g. Software Engineer" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Company Name</label>
                  <input type="text" name="currentCompany" value={formData.currentCompany} onChange={handleChange} placeholder="e.g. Google / Microsoft" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Total Experience</label>
                  <input type="text" name="experienceYears" value={formData.experienceYears} onChange={handleChange} placeholder="e.g. 3.5 Years" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Notice Period</label>
                  <select name="noticePeriod" value={formData.noticePeriod} onChange={handleChange} className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500">
                    <option value="Immediate">Immediate</option>
                    <option value="15 Days">15 Days</option>
                    <option value="30 Days">30 Days</option>
                    <option value="60 Days">60 Days</option>
                    <option value="90 Days">90 Days</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 5: EDUCATION */}
            <section id="section-education" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  Education
                  {autoFilledFields.institution ? (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Auto-filled</span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-600">Add 10%</span>
                  )}
                </h2>
                <span className="text-xs font-bold text-blue-600">Editable</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Your qualifications help employers know your educational credentials</p>
              
              <div className="space-y-4">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-slate-900">
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-slate-800 text-sm mb-1 border-b border-slate-200 pb-2">Graduation / Degree Details</h3>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Degree</label>
                    <select name="degree" value={formData.degree} onChange={handleChange} className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-2.5 border border-slate-300 outline-none focus:border-blue-500">
                      {DEGREE_OPTIONS.map((deg) => (
                        <option key={deg} value={deg}>{deg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Specialization</label>
                    <input type="text" name="fieldOfStudy" value={formData.fieldOfStudy} onChange={handleChange} placeholder="e.g. Computer Science and Engineering" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-2.5 border border-slate-300 outline-none focus:border-blue-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">University / Institute</label>
                    <input type="text" name="institution" value={formData.institution} onChange={handleChange} placeholder="e.g. Stanford University / IIT" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-2.5 border border-slate-300 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Graduation Year</label>
                    <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} placeholder="e.g. 2024" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-2.5 border border-slate-300 outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Marks / Grade</label>
                    <input type="text" name="grade" value={formData.grade} onChange={handleChange} placeholder="e.g. 8.8 CGPA / First Class" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-2.5 border border-slate-300 outline-none focus:border-blue-500" />
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 6: PROJECTS */}
            <section id="section-projects" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800">Projects</h2>
                <span className="text-xs font-bold text-blue-600">Editable</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Showcase your technical projects, open-source work, or portfolio projects</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Project Name</label>
                  <input type="text" name="projectName" value={formData.projectName} onChange={handleChange} placeholder="e.g. FairHire AI Talent Platform" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Project Role</label>
                  <input type="text" name="projectRole" value={formData.projectRole} onChange={handleChange} placeholder="e.g. Lead Full Stack Architect" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Project Description & Tech Stack</label>
                  <textarea name="projectDesc" rows={2} value={formData.projectDesc} onChange={handleChange} placeholder="Architected scalable microservices, built responsive React frontend, and integrated ML models..." className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
              </div>
            </section>

            {/* SECTION 7: PROFILE SUMMARY */}
            <section id="section-summary" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  Profile summary <span className="text-[10px] font-bold text-emerald-600">Add 8%</span>
                </h2>
                <span className="text-xs font-bold text-blue-600">Editable</span>
              </div>
              <p className="text-xs text-slate-500 mb-4">Highlight your key career achievements to help employers know your potential</p>
              <textarea
                name="summary"
                rows={4}
                value={formData.summary}
                onChange={handleChange}
                placeholder="Write a short summary about your background, career focus, and major technical strengths..."
                className="w-full bg-white text-xs font-normal text-slate-900 rounded-xl px-4 py-3 border border-slate-300 focus:border-blue-500 outline-none transition-all leading-relaxed"
              />
            </section>

            {/* SECTION 8: CAREER PROFILE */}
            <section id="section-career" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  Career profile preferences
                </h2>
                <span className="text-xs font-bold text-blue-600">Editable</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">Add details about your preferred job profile to personalize opportunities</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Target Job Role</label>
                  <input type="text" name="targetRole" value={formData.targetRole} onChange={handleChange} placeholder="e.g. Senior Software Engineer" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Preferred Location</label>
                  <input type="text" name="preferredLocation" value={formData.preferredLocation} onChange={handleChange} placeholder="e.g. Bangalore, Remote, Pune" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Expected CTC / Salary</label>
                  <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} placeholder="e.g. ₹20,00,000 / $120,000" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Desired Employment Type</label>
                  <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500">
                    <option value="Full-time">Full-time</option>
                    <option value="Contract / Freelance">Contract / Freelance</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>
            </section>

            {/* SECTION 9: PERSONAL DETAILS */}
            <section id="section-personal" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                  Personal details
                  {autoFilledFields.fullName && (
                    <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">Auto-filled</span>
                  )}
                </h2>
                <span className="text-xs font-bold text-blue-600">Editable</span>
              </div>
              <p className="text-xs text-slate-500 mb-6">This information is used to contact you and verify your identity</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input 
                    ref={nameInputRef}
                    type="text" 
                    name="fullName" 
                    value={formData.fullName} 
                    onChange={handleChange} 
                    className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Mobile Number</label>
                  <div className="flex gap-2">
                    <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="bg-white text-xs font-semibold text-slate-900 rounded-xl px-3 py-3 border border-slate-300 outline-none focus:border-blue-500">
                      {COUNTRY_CODES.map((c) => (<option key={c.code} value={c.code}>{c.code}</option>))}
                    </select>
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="flex-1 bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" required />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Date of Birth</label>
                  <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Current Location</label>
                  <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" required />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">LinkedIn Profile URL</label>
                  <input type="url" name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/username" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">GitHub / Portfolio Website</label>
                  <input type="url" name="portfolioUrl" value={formData.portfolioUrl} onChange={handleChange} placeholder="https://github.com/username" className="w-full bg-white text-xs font-semibold text-slate-900 rounded-xl px-4 py-3 border border-slate-300 outline-none focus:border-blue-500" />
                </div>
              </div>
            </section>
            
          </div>
        </div>

        {/* BOTTOM SAVE BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.08)] z-30">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Full profile editing enabled. Updates save directly to your candidate profile.</span>
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSubmitProfile}
                className="flex-1 sm:flex-none px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold text-sm shadow-md shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Profile Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CandidateProfileWizard;
