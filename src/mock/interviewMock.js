export const MOCK_INTERVIEWS = [
  {
    id: "INT-301",
    candidateId: "CAND-7731",
    candidateName: "David Chen",
    jobTitle: "Lead AI Systems Architect",
    interviewerName: "Dr. Elena Rostova",
    date: "2026-09-09",
    time: "01:00 PM EST",
    status: "Upcoming",
    type: "Technical Deep Dive",
    meetingLink: "https://fairhire.meet/room-301"
  },
  {
    id: "INT-302",
    candidateId: "CAND-9104",
    candidateName: "Priya Sharma",
    jobTitle: "Senior Full Stack Engineer",
    interviewerName: "Dr. Elena Rostova",
    date: "2026-09-12",
    time: "03:00 PM EST",
    status: "Scheduled",
    type: "System Architecture & Live Code",
    meetingLink: "https://fairhire.meet/room-302"
  }
];

export const MOCK_LLM_PROMPTS = [
  {
    category: "Technical Expertise",
    question: "Can you explain how you design resilient state management and data caching layers when building data-dense enterprise dashboards in React?",
    evaluationCriteria: "Evaluates depth in React component lifecycle, state normalization, optimistic updates, and prevention of re-render bottlenecks."
  },
  {
    category: "Problem Solving",
    question: "Suppose a candidate screening job returns partial semantic match vectors with borderline confidence scores. How would you design the fallback evaluation and feedback loop?",
    evaluationCriteria: "Assesses architectural clarity in handling edge-case data, confidence thresholds, human-in-the-loop validation, and fallback mechanisms."
  },
  {
    category: "Communication",
    question: "How do you communicate AI match rationales and fairness metrics to non-technical stakeholders (e.g., hiring managers and HR directors)?",
    evaluationCriteria: "Looks for transparency, clear non-jargon explanations, emphasis on human oversight, and data-driven storytelling."
  },
  {
    category: "Role Knowledge",
    question: "What strategies do you employ to guarantee WCAG 2.1 AA accessibility standards across complex UI elements like modal wizards, data tables, and dynamic tab panels?",
    evaluationCriteria: "Checks practical knowledge of semantic HTML tags, keyboard navigation, focus management, and ARIA roles."
  },
  {
    category: "Behavioral",
    question: "Describe a situation where a business requirement conflicted with user privacy or non-bias guidelines. How did you resolve the conflict?",
    evaluationCriteria: "Tests ethical commitment, conflict resolution skills, enterprise compliance awareness, and cross-functional leadership."
  }
];
