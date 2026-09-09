export const API_ENDPOINTS = {
  candidates: {
    apply: "/candidates/apply",
    statusCheck: "/candidates/status-check",
    confirmSlot: "/candidates/confirm-slot",
    status: "/candidates/status",
    list: "/candidates"
  },

  jobs: {
    post: "/jobs/post",
    roles: "/job-roles",
    template: "/job-template",
    list: "/jobs"
  },

  interviews: {
    schedule: "/interviews/schedule",
    feedback: "/interviews/feedback",
    prompts: "/interviews/llm-prompts",
    list: "/interviews"
  },

  compliance: {
    fairness: "/compliance/fairness",
    auditLogs: "/admin/audit-log"
  }
};

export const ROLES = {
  CANDIDATE: 'candidate',
  RECRUITER: 'recruiter',
  INTERVIEWER: 'interviewer',
  ADMIN: 'admin'
};

export const PIPELINE_STAGES = [
  'Applied',
  'Screened',
  'Shortlisted',
  'Interview Scheduled',
  'Interviewed',
  'Offered',
  'Hired',
  'Rejected'
];

export const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
];

export const EXPERIENCE_LEVELS = [
  'Entry Level (0-2 yrs)',
  'Mid Level (3-5 yrs)',
  'Senior Level (6-9 yrs)',
  'Lead / Managerial (10+ yrs)'
];

export const DEGREE_OPTIONS = [
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate / PhD",
  "Diploma / Associate Degree",
  "Self-taught / Other"
];
