export const MOCK_FAIRNESS_METRICS = {
  overallFairnessScore: 94.2,
  adverseImpactRatio: 0.92, // > 0.80 standard threshold
  complianceStatus: "Compliant & Verified",
  totalCandidatesEvaluated: 1240,
  parityMetrics: [
    { category: "Demographic Parity", metric: "Selection Rate Equalization", ratio: 0.94, status: "Optimal" },
    { category: "Equal Opportunity", metric: "True Positive Parity Across Experience Tiers", ratio: 0.91, status: "Optimal" },
    { category: "Semantic Consistency", metric: "Resume Format Variance Sensitivity", ratio: 0.96, status: "Exceptional" },
    { category: "Keyword Neutrality", metric: "Synonym Skill Recognition Score", ratio: 0.95, status: "Exceptional" }
  ],
  demographicBreakdown: [
    { group: "Traditional Tech Degrees", applicantShare: "48%", shortlistShare: "49%", impactRatio: "0.98" },
    { group: "Alternative / Self-Taught", applicantShare: "32%", shortlistShare: "31%", impactRatio: "0.94" },
    { group: "Early Career (0-2 Yrs)", applicantShare: "20%", shortlistShare: "20%", impactRatio: "0.95" }
  ]
};

export const MOCK_AUDIT_LOGS = [
  {
    id: "LOG-9001",
    timestamp: "2026-09-08T12:30:15Z",
    actor: "Elena Rostova (Recruiter)",
    role: "recruiter",
    action: "STATUS_CHANGE",
    resource: "Candidate Application",
    candidateId: "CAND-9104",
    jobId: "JOB-2026-01",
    status: "SUCCESS",
    details: "Changed candidate status from Screened to Shortlisted"
  },
  {
    id: "LOG-9002",
    timestamp: "2026-09-08T11:15:00Z",
    actor: "Alex Morgan (Candidate)",
    role: "candidate",
    action: "APPLICATION_SUBMIT",
    resource: "Job Application",
    candidateId: "CAND-8492",
    jobId: "JOB-2026-01",
    status: "SUCCESS",
    details: "Submitted profile and target role application"
  },
  {
    id: "LOG-9003",
    timestamp: "2026-09-08T10:05:42Z",
    actor: "AI Engine (SNS Workbench)",
    role: "system",
    action: "AI_SCREENING",
    resource: "Candidate Score Vector",
    candidateId: "CAND-8492",
    jobId: "JOB-2026-01",
    status: "SUCCESS",
    details: "Evaluated resume semantics. Computed AI score 8.8/10"
  },
  {
    id: "LOG-9004",
    timestamp: "2026-09-07T16:20:00Z",
    actor: "David Chen (Candidate)",
    role: "candidate",
    action: "SLOT_CONFIRM",
    resource: "Interview Booking",
    candidateId: "CAND-7731",
    jobId: "JOB-2026-02",
    status: "SUCCESS",
    details: "Confirmed interview slot for 2026-09-09 01:00 PM EST"
  },
  {
    id: "LOG-9005",
    timestamp: "2026-09-07T14:10:00Z",
    actor: "Marcus Vance (Admin)",
    role: "admin",
    action: "COMPLIANCE_AUDIT",
    resource: "Fairness Report",
    candidateId: "N/A",
    jobId: "JOB-2026-01",
    status: "SUCCESS",
    details: "Executed quarterly Adverse Impact Ratio compliance check"
  }
];
