// Utility to manage candidate applications and dynamic progress tracking.
// ALL storage keys are USER-SCOPED so different accounts never share data.

const BASE_STORAGE_KEY = 'fairhire_candidate_applications';
const BASE_VER_KEY = 'fairhire_applications_ver';

// --------------------------------------------------------------------------
// Resolve the current user's ID from auth storage.
// Returns a sanitised string like "usr_abc123" or "demo" for the demo account.
// --------------------------------------------------------------------------
const getCurrentUserId = () => {
  try {
    const raw =
      sessionStorage.getItem('fairhire_user') ||
      localStorage.getItem('fairhire_user');
    if (!raw) return '__guest__';
    const u = JSON.parse(raw);
    // Use whichever ID is present; sanitise to safe chars for a key suffix
    const id = u?.id || u?.candidateId || u?.email || '__guest__';
    return String(id).replace(/[^a-zA-Z0-9_@.-]/g, '_').slice(0, 64);
  } catch {
    return '__guest__';
  }
};

// Per-user storage keys
const userStorageKey = () => `${BASE_STORAGE_KEY}__${getCurrentUserId()}`;
const userVerKey = () => `${BASE_VER_KEY}__${getCurrentUserId()}`;

// --------------------------------------------------------------------------
// DEMO APPLICATIONS — only shown for the built-in demo/seed account.
// Real sign-ups always start with an empty list.
// --------------------------------------------------------------------------
const DEMO_USER_IDS = ['USR-CAND-1', 'alex-morgan', 'cand-demo'];

const DEMO_DATA_VER = 'v8_user_scoped';

export const DEFAULT_APPLICATIONS = [
  {
    id: 'APP-BACKEND-DEV-001',
    jobId: 'role-backend',
    trackId: 'backend-developer',
    jobTitle: 'Backend Developer',
    company: 'FairHire Enterprise',
    companyInitial: 'FH',
    companyBg: 'bg-teal-600',
    location: 'Remote / Hybrid',
    salary: 'Competitive • $120k - $150k',
    appliedDate: 'Sep 18, 2026',
    status: 'Applied • Round 1 Action Required',
    statusBadgeVariant: 'teal',
    currentStageIndex: 0,
    progressPercent: 20,
    aiScore: '9.1',
    screeningCriteria: 'Python, REST API, Microservices architecture, PostgreSQL, asynchronous systems.',
    rationale: 'Candidate profile exhibits top 5% match for Backend Developer competencies and clean system design.',
    matchedSkills: ['Python', 'PostgreSQL', 'REST API', 'Docker', 'FastAPI'],
    missingSkills: [],
    courses: [
      { title: 'Advanced Backend System Design & Scalability', provider: 'Coursera / DeepLearning.AI' },
      { title: 'PostgreSQL Query Optimization & Indexing', provider: 'DataCamp / Industry' }
    ],
    stages: [
      { id: 'stage-1', number: '01', name: 'Applied', badge: 'Active Now', status: 'completed', timestamp: 'Sep 18, 2026', description: 'Application intake & decoupled profile.', details: 'Demographic markers decoupled for blind screening.' },
      { id: 'stage-2', number: '02', name: 'AI Screening', badge: 'Pending', status: 'upcoming', timestamp: 'Pending', description: 'Automated semantic competency scan.', details: 'Awaiting round 1 aptitude assessment results.' },
      { id: 'stage-3', number: '03', name: 'Review', badge: 'Pending', status: 'upcoming', timestamp: 'Pending', description: '3 Company Rounds by HR.', details: 'Initial HR Screening, Technical Assessment, Panel.' },
      { id: 'stage-4', number: '04', name: 'Final Decision', badge: 'Pending', status: 'upcoming', timestamp: 'Pending', description: 'Offer / Concluded.', details: 'Final hiring decision and salary package negotiation.' }
    ]
  },
  {
    id: 'APP-FULLSTACK-ENG-002',
    jobId: 'role-fullstack',
    trackId: 'WEB',
    jobTitle: 'Full Stack Engineer',
    company: 'FairHire Cloud Tech',
    companyInitial: 'FT',
    companyBg: 'bg-indigo-600',
    location: 'Bangalore, India • Hybrid',
    salary: '₹22 - 28 LPA',
    appliedDate: 'Sep 15, 2026',
    status: 'AI Screening Completed • 8.9 Match',
    statusBadgeVariant: 'emerald',
    currentStageIndex: 1,
    progressPercent: 45,
    aiScore: '8.9',
    screeningCriteria: 'React 18, TypeScript, Node.js, GraphQL, Cloud Native deployments.',
    rationale: 'Strong frontend architecture paired with modern TypeScript and fullstack full-lifecycle experience.',
    matchedSkills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Git'],
    missingSkills: ['GraphQL'],
    courses: [
      { title: 'Modern React 18 Concurrent Features & State Machines', provider: 'Frontend Masters' }
    ],
    stages: [
      { id: 'stage-1', number: '01', name: 'Applied', badge: 'Completed', status: 'completed', timestamp: 'Sep 15, 2026', description: 'Application intake & decoupled profile.', details: 'Demographic markers decoupled for blind screening.' },
      { id: 'stage-2', number: '02', name: 'AI Screening', badge: 'Completed (8.9/10)', status: 'completed', timestamp: 'Sep 16, 2026', description: 'Automated semantic competency scan.', details: 'Semantic fit confirmed above 85% threshold.' },
      { id: 'stage-3', number: '03', name: 'Review', badge: 'Active / Queue', status: 'current', timestamp: 'Under Review', description: 'Hiring Committee Review.', details: 'Engineering panel reviewing candidate GitHub repositories.' },
      { id: 'stage-4', number: '04', name: 'Final Decision', badge: 'Upcoming', status: 'upcoming', timestamp: 'Pending', description: 'Offer / Concluded.', details: 'Pending interview outcome.' }
    ]
  },
  {
    id: 'APP-DATA-INFRA-003',
    jobId: 'role-data',
    trackId: 'DATA',
    jobTitle: 'Data & Infrastructure Specialist',
    company: 'FinTech Dynamics',
    companyInitial: 'FD',
    companyBg: 'bg-amber-600',
    location: 'Remote',
    salary: 'Competitive • $135k - $160k',
    appliedDate: 'Sep 10, 2026',
    status: 'In Review • Round 2 Scheduled',
    statusBadgeVariant: 'indigo',
    currentStageIndex: 2,
    progressPercent: 70,
    aiScore: '9.4',
    screeningCriteria: 'Distributed Data Systems, Kafka, Spark, Snowflake, AWS Infrastructure.',
    rationale: 'Exceptional depth in streaming data architecture and high-throughput transactional infrastructure.',
    matchedSkills: ['Python', 'SQL', 'Kafka', 'Docker', 'AWS'],
    missingSkills: [],
    courses: [
      { title: 'Distributed Systems & Fault Tolerance in Financial Data', provider: 'MIT OpenCourseWare' }
    ],
    stages: [
      { id: 'stage-1', number: '01', name: 'Applied', badge: 'Completed', status: 'completed', timestamp: 'Sep 10, 2026', description: 'Application intake & decoupled profile.', details: 'Demographic markers decoupled for blind screening.' },
      { id: 'stage-2', number: '02', name: 'AI Screening', badge: 'Completed (9.4/10)', status: 'completed', timestamp: 'Sep 11, 2026', description: 'Automated semantic competency scan.', details: 'Ranked #1 in streaming infrastructure domain.' },
      { id: 'stage-3', number: '03', name: 'Review', badge: 'Active / Round 2', status: 'current', timestamp: 'Sep 19, 2026', description: 'Technical Deep-Dive & Architecture.', details: 'Panel interview confirmed on calendar.' },
      { id: 'stage-4', number: '04', name: 'Final Decision', badge: 'Upcoming', status: 'upcoming', timestamp: 'Pending', description: 'Offer / Concluded.', details: 'Awaiting panel completion.' }
    ]
  }
];

// --------------------------------------------------------------------------
// Returns true if the current logged-in user is the built-in demo account
// --------------------------------------------------------------------------
export const isCurrentUserDemo = () => {
  try {
    const raw =
      sessionStorage.getItem('fairhire_user') ||
      localStorage.getItem('fairhire_user');
    if (!raw) return false;
    const u = JSON.parse(raw);
    const id = (u?.id || u?.candidateId || '').toLowerCase();
    const name = (u?.name || '').toLowerCase();
    return (
      DEMO_USER_IDS.some(d => id.includes(d.toLowerCase())) ||
      name.includes('alex morgan')
    );
  } catch {
    return false;
  }
};

// --------------------------------------------------------------------------
// getAppliedApplications — reads THIS user's applications only
// --------------------------------------------------------------------------
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
    company: app.company || companyName,
    companyInitial: app.companyInitial || 'FH',
    companyBg: app.companyBg || 'bg-teal-600',
    trackId: app.trackId || app.jobId || '',
    jobId: app.jobId || app.trackId || app.id
  });

  const STORAGE_KEY = userStorageKey();
  const VER_KEY = userVerKey();

  try {
    const storedVer = localStorage.getItem(VER_KEY);
    const raw = localStorage.getItem(STORAGE_KEY);

    // For the demo account: seed with 3 demo apps if not yet initialised
    if (isCurrentUserDemo()) {
      if (storedVer !== DEMO_DATA_VER || !raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
        localStorage.setItem(VER_KEY, DEMO_DATA_VER);
        return DEFAULT_APPLICATIONS.map(normalizeApp);
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_APPLICATIONS));
        return DEFAULT_APPLICATIONS.map(normalizeApp);
      }
      return parsed.map(normalizeApp);
    }

    // For ALL real users: strictly read only THIS user's applications
    if (!raw) return [];
    let parsed = [];
    try {
      parsed = JSON.parse(raw);
    } catch {
      return [];
    }
    if (!Array.isArray(parsed)) return [];

    // Filter out built-in demo jobs if they were ever saved into this real user's storage
    const DEMO_JOB_IDS = new Set(['APP-BACKEND-DEV-001', 'APP-FULLSTACK-ENG-002', 'APP-DATA-INFRA-003']);
    const userOnlyApps = parsed.filter(app => !DEMO_JOB_IDS.has(app.id));

    // If demo apps were cleaned out, persist the cleaned list back to localStorage
    if (userOnlyApps.length !== parsed.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userOnlyApps));
    }

    return userOnlyApps.map(normalizeApp);
  } catch (e) {
    console.error('[FairHire] Error reading applications from localStorage', e);
    return [];
  }
};

// --------------------------------------------------------------------------
export const isJobAlreadyApplied = (jobId) => {
  const apps = getAppliedApplications();
  return apps.some(app => app.jobId === jobId || app.trackId === jobId);
};

// --------------------------------------------------------------------------
export const applyToJobStore = (role, candidateUser = null) => {
  const STORAGE_KEY = userStorageKey();
  const currentApps = getAppliedApplications();

  // Check if already applied
  const existing = currentApps.find(app => 
    (role.id && app.jobId === role.id) || 
    (role.trackId && app.trackId === role.trackId)
  );
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
    currentStageIndex: 1,
    progressPercent: 40,
    aiScore: (8.6 + (Math.random() * 0.9)).toFixed(1),
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
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated', { detail: newApp }));
    window.dispatchEvent(new CustomEvent('storage'));
  }
  return { success: true, alreadyApplied: false, application: newApp };
};

// --------------------------------------------------------------------------
// Approve application for technical interview
// --------------------------------------------------------------------------
export const approveApplicationForInterview = (appIdOrJobId = null) => {
  const STORAGE_KEY = userStorageKey();
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

// --------------------------------------------------------------------------
// Revoke interview approval
// --------------------------------------------------------------------------
export const revokeApplicationApproval = (appIdOrJobId = null) => {
  const STORAGE_KEY = userStorageKey();
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

// --------------------------------------------------------------------------
export const isAnyApplicationApprovedForInterview = () => {
  const apps = getAppliedApplications();
  return apps.some(a =>
    a.currentStageIndex >= 3 ||
    a.status === 'Approved for Interview' ||
    a.status === 'Shortlisted' ||
    a.status === 'Interview Scheduled'
  );
};

// --------------------------------------------------------------------------
// Clear all applications for the current user (e.g. on logout cleanup)
// --------------------------------------------------------------------------
export const clearUserApplications = () => {
  localStorage.removeItem(userStorageKey());
  localStorage.removeItem(userVerKey());
};
