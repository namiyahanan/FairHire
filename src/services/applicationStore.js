// Utility to manage candidate applications and dynamic progress tracking
const STORAGE_KEY = 'fairhire_candidate_applications';

export const DEFAULT_APPLICATIONS = [];
const APPLICATIONS_DATA_VER = 'v5_clean_apps';

export const getAppliedApplications = () => {
  let companyName = 'FairHire Enterprise';
  try {
    const reqRaw = localStorage.getItem('fairhire_company_requirements');
    if (reqRaw) {
      const parsedReq = JSON.parse(reqRaw);
      if (parsedReq.companyName) companyName = parsedReq.companyName;
    }
  } catch (e) {}

  const normalizeApp = (app) => ({
    ...app,
    company: companyName,
    companyInitial: 'FH',
    companyBg: 'bg-teal-600'
  });

  try {
    const storedVer = localStorage.getItem('fairhire_applications_ver');
    if (storedVer !== APPLICATIONS_DATA_VER) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem('fairhire_applications_ver', APPLICATIONS_DATA_VER);
      return [];
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    return parsed.map(normalizeApp);
  } catch (e) {
    console.error('Error reading applied applications from localStorage', e);
    return [];
  }
};

export const isJobAlreadyApplied = (jobId) => {
  const apps = getAppliedApplications();
  return apps.some(app => app.jobId === jobId);
};

export const applyToJobStore = (role, candidateUser = null) => {
  const currentApps = getAppliedApplications();
  
  // Check if already applied
  const existing = currentApps.find(app => app.jobId === role.id);
  if (existing) {
    return { success: true, alreadyApplied: true, application: existing };
  }

  const newApp = {
    id: `APP-${role.id.toUpperCase()}-${Date.now().toString().slice(-4)}`,
    jobId: role.id,
    jobTitle: role.title,
    company: role.company,
    companyInitial: role.companyInitial || role.company.charAt(0),
    companyBg: role.companyBg || 'bg-teal-600',
    location: role.location,
    salary: role.salary,
    appliedDate: new Date().toISOString(),
    status: 'AI Screened & Ranked',
    statusBadgeVariant: 'teal',
    currentStageIndex: 1, // Stage 2 active
    progressPercent: 40,
    aiScore: (8.6 + (Math.random() * 0.9)).toFixed(1), // 8.6 to 9.5
    screeningCriteria: role.screeningCriteria || 'Semantic match across core engineering requirements.',
    rationale: `Candidate exhibits strong semantic alignment with ${role.title} requirements. Demonstrates high proficiency in ${role.tags.slice(0, 3).join(', ')}.`,
    matchedSkills: role.tags,
    missingSkills: [],
    courses: role.courses || [],
    stages: [
      {
        id: 'stage-1',
        number: '01',
        name: 'Application Intake & Compliance',
        badge: 'Completed',
        status: 'completed',
        timestamp: 'Just now',
        description: 'Application received and confirmed. Demographic markers anonymized.',
        details: 'Candidate token assigned. Zero-bias compliance verification passed.'
      },
      {
        id: 'stage-2',
        number: '02',
        name: 'AI Contextual Screening & Fit',
        badge: 'Completed',
        status: 'completed',
        timestamp: 'Just now',
        description: 'Semantic match calculated against role criteria.',
        details: `Screened for: ${role.screeningCriteria}`
      },
      {
        id: 'stage-3',
        number: '03',
        name: 'Recruiter Review & Shortlisting',
        badge: 'Active / In Progress',
        status: 'current',
        timestamp: 'Active Now (ETA: 24-48 hrs)',
        description: `Hiring team at ${role.company} reviewing candidate portfolio and competency score.`,
        details: 'Placed in hiring team active review queue.'
      },
      {
        id: 'stage-4',
        number: '04',
        name: 'Technical & System Assessment',
        badge: 'Upcoming',
        status: 'upcoming',
        timestamp: 'Pending recruiter review',
        description: 'Interactive technical interview and domain challenge.',
        details: 'Prepare with the curated preparation courses attached to this role.'
      },
      {
        id: 'stage-5',
        number: '05',
        name: 'Final Panel & Offer Generation',
        badge: 'Upcoming',
        status: 'upcoming',
        timestamp: 'Pending assessment',
        description: 'Final team debrief and compensation offer package.',
        details: 'FairHire parity and fair-pay guidelines apply.'
      }
    ]
  };

  const updatedApps = [newApp, ...currentApps];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedApps));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_application_updated', { detail: newApp }));
    window.dispatchEvent(new CustomEvent('storage'));
  }
  return { success: true, alreadyApplied: false, application: newApp };
};

// Approve application for technical interview (advances stage 3 to completed, stage 4 to current)
export const approveApplicationForInterview = (appIdOrJobId = null) => {
  const currentApps = getAppliedApplications();
  let updatedApp = null;
  const updated = currentApps.map(app => {
    if (!appIdOrJobId || app.id === appIdOrJobId || app.jobId === appIdOrJobId) {
      const updatedStages = app.stages.map((s, idx) => {
        if (idx < 3) return { ...s, status: 'completed', badge: 'Completed' };
        if (idx === 3) return { ...s, status: 'current', badge: 'Active / Booking Open', details: 'HR has approved your application! You can now select and reserve an interview slot.' };
        return s;
      });

      updatedApp = {
        ...app,
        status: 'Approved for Interview',
        statusBadgeVariant: 'emerald',
        currentStageIndex: 3,
        progressPercent: 75,
        stages: updatedStages
      };
      return updatedApp;
    }
    return app;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_application_updated'));
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated'));
  }
  return updatedApp;
};

// Revoke interview approval (reverts to stage 2 / In Recruiter Review)
export const revokeApplicationApproval = (appIdOrJobId = null) => {
  const currentApps = getAppliedApplications();
  let updatedApp = null;
  const updated = currentApps.map(app => {
    if (!appIdOrJobId || app.id === appIdOrJobId || app.jobId === appIdOrJobId) {
      const updatedStages = app.stages.map((s, idx) => {
        if (idx < 2) return { ...s, status: 'completed', badge: 'Completed' };
        if (idx === 2) return { ...s, status: 'current', badge: 'Active / In Progress', details: 'Engineering Hiring Committee evaluating anonymized credentials and portfolio.' };
        return { ...s, status: 'upcoming', badge: 'Upcoming' };
      });

      updatedApp = {
        ...app,
        status: 'In Recruiter Review',
        statusBadgeVariant: 'teal',
        currentStageIndex: 2,
        progressPercent: 55,
        stages: updatedStages
      };
      return updatedApp;
    }
    return app;
  });

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_application_updated'));
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated'));
  }
  return updatedApp;
};

// Check if any applied application has been approved by HR
export const isAnyApplicationApprovedForInterview = () => {
  const apps = getAppliedApplications();
  return apps.some(a => 
    a.currentStageIndex >= 3 || 
    a.status === 'Approved for Interview' || 
    a.status === 'Shortlisted' ||
    a.status === 'Interview Scheduled'
  );
};

