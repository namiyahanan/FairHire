// Centralized persistent Job Store supporting HR uploads and Candidate Portal synchronization
import { MOCK_JOBS } from '../mock/jobMock';
import { PREPARATION_GUIDE_ROLES, GENERAL_PREPARATION_CHECKLIST } from '../data/preparationGuideData';

const STORAGE_KEY = 'fairhire_all_jobs';
const DATA_VERSION = 'v4_coimbatore';

export { GENERAL_PREPARATION_CHECKLIST, PREPARATION_GUIDE_ROLES };

export const TRACKS = {
  WEB: '🌐 1. Web & Application Development',
  DATA: '🗄️ 2. Data & Infrastructure',
  ADVANCED: '🧠 3. Advanced Engineering'
};

export const TRACK_BADGES = {
  WEB: 'Web & App Dev',
  DATA: 'Data & Infra',
  ADVANCED: 'Advanced Eng'
};

// Formatted initial roles embedding the complete preparation guide specifications
export const INITIAL_SOFTWARE_ROLES = PREPARATION_GUIDE_ROLES.map(role => ({
  ...role,
  company: 'FairHire Enterprise',
  companyInitial: 'FH',
  companyBg: 'bg-teal-600',
  role: role.title,
  department: role.trackId === 'WEB' ? 'Engineering' : role.trackId === 'DATA' ? 'Data & Cloud Infrastructure' : 'AI & Advanced Systems',
  degree: "Bachelor's Degree",
  experience: '3+ years',
  minMatchThreshold: 75,
  status: 'Active',
  applicantsCount: role.id === 'role-fullstack' ? 42 : role.id === 'role-aiml' ? 29 : 18,
  screenedCount: role.id === 'role-fullstack' ? 38 : role.id === 'role-aiml' ? 26 : 15,
  createdAt: '2026-09-01T10:00:00Z',
  isHrUploaded: false,
  // Ensure legacy courses array is also available for components reading .courses
  courses: (role.recommendedCourses || []).map((rc, idx) => ({
    title: rc.title,
    provider: rc.provider,
    duration: '12-16 Hours • Guided Labs',
    level: rc.type || 'Comprehensive',
    badgeColor: rc.badgeColor || 'bg-teal-50 text-teal-700 border-teal-200',
    interviewBenefit: `Directly prepares for ${role.title} technical rounds.`,
    topics: (role.mandatoryKnowledge || []).slice(0, 3)
  }))
}));

// Helper to dynamically generate tailored interview preparation courses
export const generateCoursesForRole = (roleTitle, skills = []) => {
  const primarySkills = skills.length > 0 ? skills.slice(0, 4) : ['Core Architecture', 'System Design'];
  return [
    {
      title: `${roleTitle} Technical Architecture & Deep Dive`,
      provider: 'Coursera / Industry Experts',
      duration: '16 Hours • Guided Labs',
      level: 'Advanced',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      interviewBenefit: `Prepares you for the live technical screen and core architecture rounds for ${roleTitle}.`,
      topics: primarySkills
    },
    {
      title: `${primarySkills[0] || 'System Design'} High-Throughput & Production Patterns`,
      provider: 'Educative.io',
      duration: '12 Hours • Interactive Labs',
      level: 'Intermediate → Advanced',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      interviewBenefit: 'Teaches resilient failure handling, scalability benchmarks, and enterprise logic.',
      topics: ['System Resilience', 'Scalability Patterns', ...primarySkills.slice(1, 3)]
    },
    {
      title: 'Contextual Problem Solving & Live Coding Rounds',
      provider: 'Frontend / Backend Masters',
      duration: '10 Hours • Real Scenarios',
      level: 'Advanced',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      interviewBenefit: 'Master the exact technical interview questions and scenario defenses.',
      topics: ['Live Problem Solving', 'Clean Code Principles', 'Whiteboard Defense']
    }
  ];
};

// Helper to auto-categorize an engineering track
export const detectTrackForRole = (title = '', department = '', skills = []) => {
  const text = `${title} ${department} ${skills.join(' ')}`.toLowerCase();
  if (
    text.includes('data') ||
    text.includes('dba') ||
    text.includes('devops') ||
    text.includes('sre') ||
    text.includes('cloud') ||
    text.includes('infra') ||
    text.includes('kubernetes') ||
    text.includes('docker') ||
    text.includes('terraform') ||
    text.includes('database') ||
    text.includes('reliability')
  ) {
    return 'DATA';
  }

  if (
    text.includes('ai') ||
    text.includes('ml') ||
    text.includes('machine learning') ||
    text.includes('neural') ||
    text.includes('nlp') ||
    text.includes('llm') ||
    text.includes('security') ||
    text.includes('cyber') ||
    text.includes('appsec') ||
    text.includes('research') ||
    text.includes('scientist')
  ) {
    return 'ADVANCED';
  }

  return 'WEB';
};

// Retrieve all stored jobs from localStorage with auto-upgrade to FairHire company standards
export const getStoredJobs = () => {
  let companyName = 'FairHire Enterprise';
  try {
    const reqRaw = localStorage.getItem('fairhire_company_requirements');
    if (reqRaw) {
      const parsedReq = JSON.parse(reqRaw);
      if (parsedReq.companyName) companyName = parsedReq.companyName;
    }
  } catch (e) {}

  const normalizeJob = (job) => ({
    ...job,
    company: companyName,
    companyInitial: 'FH',
    companyBg: 'bg-teal-600'
  });

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const storedVersion = localStorage.getItem('fairhire_jobs_data_ver');

    if (!raw || storedVersion !== DATA_VERSION) {
      let existingHrJobs = [];
      if (raw) {
        try {
          const prev = JSON.parse(raw);
          if (Array.isArray(prev)) {
            existingHrJobs = prev.filter(j => j.isHrUploaded).map(normalizeJob);
          }
        } catch (e) {}
      }
      const initialWithHr = [...existingHrJobs, ...INITIAL_SOFTWARE_ROLES.map(normalizeJob)];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialWithHr));
      localStorage.setItem('fairhire_jobs_data_ver', DATA_VERSION);
      return initialWithHr;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const normalizedInitial = INITIAL_SOFTWARE_ROLES.map(normalizeJob);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedInitial));
      localStorage.setItem('fairhire_jobs_data_ver', DATA_VERSION);
      return normalizedInitial;
    }

    // Auto-migrate if mandatoryKnowledge is missing
    const needsMigration = parsed.some(
      job => !job.isHrUploaded && !job.mandatoryKnowledge && PREPARATION_GUIDE_ROLES.some(p => p.id === job.id)
    );

    if (needsMigration) {
      const hrJobs = parsed.filter(j => j.isHrUploaded).map(normalizeJob);
      const standardJobs = INITIAL_SOFTWARE_ROLES.map(guideRole => {
        const existing = parsed.find(j => j.id === guideRole.id) || {};
        return normalizeJob({
          ...guideRole,
          applicantsCount: existing.applicantsCount || guideRole.applicantsCount,
          screenedCount: existing.screenedCount || guideRole.screenedCount,
          status: existing.status || 'Active'
        });
      });
      const merged = [...hrJobs, ...standardJobs];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      localStorage.setItem('fairhire_jobs_data_ver', DATA_VERSION);
      return merged;
    }

    // Always normalize every job to the FairHire company from HR portal
    return parsed.map(normalizeJob);
  } catch (e) {
    console.error('Error loading stored jobs', e);
    return INITIAL_SOFTWARE_ROLES.map(normalizeJob);
  }
};

// Save a new job (e.g. from HR upload or creation)
export const saveJobToStore = (newJob) => {
  const currentJobs = getStoredJobs();
  const updatedJobs = [newJob, ...currentJobs.filter(j => j.id !== newJob.id)];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedJobs));
  } catch (e) {
    console.error('Error saving job to localStorage', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_jobs_updated', { detail: newJob }));
  }

  return updatedJobs;
};

// Increment applicant count for a job when candidate applies
export const incrementJobApplicantCount = (jobId) => {
  const currentJobs = getStoredJobs();
  let found = false;
  const updated = currentJobs.map(job => {
    if (job.id === jobId) {
      found = true;
      return {
        ...job,
        applicantsCount: (job.applicantsCount || 0) + 1,
        screenedCount: (job.screenedCount || 0) + 1
      };
    }
    return job;
  });

  if (found) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {}
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fairhire_jobs_updated'));
    }
  }
  return updated;
};

// Delete a job from store (HR position deletion)
export const deleteJobFromStore = (jobId) => {
  const currentJobs = getStoredJobs();
  const updated = currentJobs.filter(j => j.id !== jobId);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Error deleting job from localStorage', e);
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_jobs_updated', { detail: { deletedJobId: jobId } }));
    window.dispatchEvent(new CustomEvent('storage'));
  }

  return updated;
};

