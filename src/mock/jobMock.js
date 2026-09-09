export const MOCK_JOBS = [
  {
    id: "JOB-2026-01",
    title: "Senior Full Stack Engineer",
    role: "Full Stack Developer",
    department: "Engineering",
    location: "Remote / San Francisco",
    experience: "5+ years",
    degree: "Bachelor's Degree",
    minMatchThreshold: 80,
    status: "Active",
    applicantsCount: 42,
    screenedCount: 38,
    createdAt: "2026-08-15T10:00:00Z",
    description: "Building next-generation distributed web applications using React, Node.js, and cloud native services. Focus on high throughput, semantic code structure, and accessible enterprise UI.",
    skills: ["React", "JavaScript", "Node.js", "TypeScript", "REST APIs", "Tailwind CSS", "GraphQL"]
  },
  {
    id: "JOB-2026-02",
    title: "Lead AI Systems Architect",
    role: "AI Engineer",
    department: "AI & Innovation",
    location: "Hybrid / New York",
    experience: "7+ years",
    degree: "Master's Degree",
    minMatchThreshold: 85,
    status: "Active",
    applicantsCount: 29,
    screenedCount: 26,
    createdAt: "2026-08-20T14:30:00Z",
    description: "Designing semantic matching engines, multi-agent evaluation pipelines, and LLM-assisted recruitment workflows with strong privacy and fairness guarantees.",
    skills: ["Python", "PyTorch", "LLM Fine-tuning", "Vector DBs", "FastAPI", "Docker", "Fairness Metrics"]
  },
  {
    id: "JOB-2026-03",
    title: "Enterprise Product Designer",
    role: "UX/UI Designer",
    department: "Design",
    location: "Remote",
    experience: "4+ years",
    degree: "Bachelor's Degree",
    minMatchThreshold: 75,
    status: "Active",
    applicantsCount: 54,
    screenedCount: 50,
    createdAt: "2026-08-28T09:15:00Z",
    description: "Crafting modern, data-dense enterprise dashboards, accessible design systems, and intuitive HR workflows for global clients.",
    skills: ["Figma", "Design Systems", "User Research", "Prototyping", "Accessibility (WCAG)", "CSS Architecture"]
  }
];

export const MOCK_JOB_TEMPLATES = {
  "Full Stack Developer": {
    title: "Senior Full Stack Engineer",
    department: "Engineering",
    location: "Remote / Hybrid",
    experience: "4+ years",
    degree: "Bachelor's Degree",
    minMatchThreshold: 75,
    description: "Responsible for developing responsive frontend interfaces in React and robust RESTful services. Collaborates with product managers and backend data engineers to deliver enterprise solutions.",
    skills: ["React", "JavaScript", "REST APIs", "State Management", "Git", "Tailwind CSS", "Testing"]
  },
  "AI Engineer": {
    title: "Senior AI / Machine Learning Engineer",
    department: "AI Research",
    location: "San Francisco, CA",
    experience: "5+ years",
    degree: "Master's Degree",
    minMatchThreshold: 80,
    description: "Architecting LLM workflows, fine-tuning embedding models, and establishing automated evaluation metrics for candidate matching.",
    skills: ["Python", "TensorFlow/PyTorch", "NLP", "Vector Databases", "Model Evaluation", "Docker"]
  },
  "UX/UI Designer": {
    title: "Lead Product Designer",
    department: "Product Design",
    location: "Remote",
    experience: "3+ years",
    degree: "Bachelor's Degree",
    minMatchThreshold: 70,
    description: "Designing clean, trustworthy user interfaces for complex data workflows. Establishing reusable component design systems.",
    skills: ["Figma", "Prototyping", "Design Systems", "Accessibility", "Information Architecture"]
  }
};
