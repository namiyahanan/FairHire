// Centralized persistent Company Requirements and Hiring Rounds Store
// Supports HR profile details, freeze state, EEOC verification, and candidate portal synchronization

const STORAGE_KEY = 'fairhire_company_requirements';
const FREEZE_KEY = 'fairhire_recruiter_requirements_frozen';

export const ROUND_PRESETS = [
  { name: 'Initial HR Screening', description: 'Cultural fit, communication skills, and compensation expectations.' },
  { name: 'Online Coding Assessment', description: 'DSA fundamentals, algorithmic problem solving, and language-specific tests.' },
  { name: 'Technical Live Coding', description: 'Hands-on problem solving, live debugging, and clean code practices.' },
  { name: 'System Architecture & Design', description: 'Scalability, microservices, high-throughput components, and design defense.' },
  { name: 'Take-Home Project Review', description: 'Review of functional assignment, architecture rationale, and best practices.' },
  { name: 'Managerial & Behavioral Round', description: 'Past conflict resolution, team collaboration, leadership, and work ethos.' },
  { name: 'Culture Fit & Leadership', description: 'Company values alignment, career aspirations, and cross-functional fit.' },
  { name: 'Bar Raiser / Executive Round', description: 'High-level vision, innovation potential, and final executive endorsement.' }
];

export const getDefaultRoundsForCount = (count) => {
  const num = Math.min(Math.max(Number(count) || 3, 1), 6);
  
  const presetsMap = {
    1: [
      { round: 1, name: 'Comprehensive Technical & Cultural Evaluation', description: 'Holistic assessment covering core domain skills, practical problem solving, and organizational alignment.' }
    ],
    2: [
      { round: 1, name: 'Screening & Technical Assessment', description: 'Initial profile review followed by core engineering and domain fundamentals.' },
      { round: 2, name: 'Managerial & Cultural Fit', description: 'Deep dive into past projects, architecture defense, and collaborative cultural alignment.' }
    ],
    3: [
      { round: 1, name: 'Initial HR Screening Call', description: 'Cultural fit, communication fluency, background verification, and expectation alignment.' },
      { round: 2, name: 'Technical & Live Problem Solving', description: 'Practical coding, domain problem-solving, and system thinking under guided scenarios.' },
      { round: 3, name: 'Managerial & Cultural Fit', description: 'Leadership principles, team dynamics, scenario-based defense, and organizational values.' }
    ],
    4: [
      { round: 1, name: 'Resume & HR Screening', description: 'Verification of background, communication skills, and initial role alignment.' },
      { round: 2, name: 'Technical Assessment / Live Coding', description: 'Hands-on coding, algorithmic efficiency, and syntax mastery.' },
      { round: 3, name: 'System Architecture & Engineering Depth', description: 'High-level component design, state management, and scalability patterns.' },
      { round: 4, name: 'Hiring Manager & Culture Alignment', description: 'Team fit, past deliverables, architectural philosophy, and cross-functional values.' }
    ],
    5: [
      { round: 1, name: 'Recruiter Screening Call', description: 'Initial alignment on experience, communication, and compensation parameters.' },
      { round: 2, name: 'Online Technical Screen', description: 'Automated problem-solving assessment and domain specific challenges.' },
      { round: 3, name: 'Technical Live Coding Round', description: 'Interactive coding, live problem dissection, and runtime optimization.' },
      { round: 4, name: 'System Design & Modularity', description: 'End-to-end architecture, API integration, and trade-off justification.' },
      { round: 5, name: 'Executive & Cultural Alignment', description: 'Long-term growth trajectory, team chemistry, and executive interview.' }
    ],
    6: [
      { round: 1, name: 'Talent Acquisition Screen', description: 'High-level career trajectory, communication clarity, and candidate motivation.' },
      { round: 2, name: 'Online Skill & Coding Challenge', description: 'Timed assessment testing data structures, algorithms, and practical debugging.' },
      { round: 3, name: 'Technical Deep Dive 1 (Algorithms & Core)', description: 'Low-level code implementation, time complexity, and data structures.' },
      { round: 4, name: 'Technical Deep Dive 2 (System Design)', description: 'Architecture, microservices, cloud infrastructure, and fault tolerance.' },
      { round: 5, name: 'Cross-Functional Team Collaboration', description: 'Interactions with product, design, and QA leads on real-world simulations.' },
      { round: 6, name: 'Bar Raiser / Executive Leadership', description: 'Objective evaluation against highest standard of culture and excellence.' }
    ]
  };

  return presetsMap[num] || presetsMap[3];
};

export const INITIAL_COMPANY_REQUIREMENTS = {
  companyName: 'FairHire Enterprise',
  hrName: 'Elena Rostova',
  hrEmail: 'elena.rostova@fairhire.io',
  phone: '+1 (555) 349-8821',
  designation: 'Head of Talent Acquisition',
  industry: 'Software & Cloud Engineering',
  companySize: '51-200 Growth',
  workModel: 'Hybrid / Remote Friendly',
  headquarters: 'San Francisco, CA / Bengaluru Global Hub',
  website: 'https://fairhire.io',
  hiringMission: 'Committed to 100% blind merit-based screening under the EEOC 80% adverse impact standard. Candidates are evaluated contextually on demonstrated capabilities rather than rigid pedigree.',
  
  // Hiring rounds configuration
  numRounds: 3,
  rounds: getDefaultRoundsForCount(3),
  
  // Compliance & standards
  blindScreeningActive: true,
  minPassingThreshold: 75,
  verificationToken: 'FH-EEOC-HR-8842',
  isFrozen: false,
  frozenAt: null,
  updatedAt: new Date().toISOString()
};

// Retrieve requirements from localStorage with fallback
export const getCompanyRequirements = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const frozenVal = localStorage.getItem(FREEZE_KEY) === 'true';

    if (!raw) {
      const initial = { ...INITIAL_COMPANY_REQUIREMENTS, isFrozen: frozenVal };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_COMPANY_REQUIREMENTS,
      ...parsed,
      isFrozen: frozenVal || parsed.isFrozen === true,
      rounds: Array.isArray(parsed.rounds) && parsed.rounds.length > 0 
        ? parsed.rounds 
        : getDefaultRoundsForCount(parsed.numRounds || 3)
    };
  } catch (e) {
    console.error('Failed to load company requirements', e);
    return INITIAL_COMPANY_REQUIREMENTS;
  }
};

// Save updated requirements
export const saveCompanyRequirements = (updatedData, shouldFreeze = false) => {
  try {
    const existing = getCompanyRequirements();
    const token = existing.verificationToken || `FH-EEOC-HR-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const merged = {
      ...existing,
      ...updatedData,
      verificationToken: token,
      isFrozen: shouldFreeze ? true : (updatedData.isFrozen ?? existing.isFrozen),
      frozenAt: shouldFreeze ? new Date().toISOString() : (updatedData.frozenAt || existing.frozenAt),
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    if (shouldFreeze) {
      localStorage.setItem(FREEZE_KEY, 'true');
    }

    dispatchRequirementsUpdated(merged);
    return merged;
  } catch (e) {
    console.error('Failed to save company requirements', e);
    return updatedData;
  }
};

// Freeze requirements
export const freezeCompanyRequirements = (dataToFreeze = {}) => {
  const existing = getCompanyRequirements();
  const token = `FH-EEOC-HR-${Math.floor(1000 + Math.random() * 9000)}`;
  
  const frozen = {
    ...existing,
    ...dataToFreeze,
    isFrozen: true,
    frozenAt: new Date().toISOString(),
    verificationToken: token,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(frozen));
  localStorage.setItem(FREEZE_KEY, 'true');

  dispatchRequirementsUpdated(frozen);
  return frozen;
};

// Unfreeze requirements for editing
export const unfreezeCompanyRequirements = () => {
  try {
    localStorage.removeItem(FREEZE_KEY);
    localStorage.setItem(FREEZE_KEY, 'false');
  } catch (e) {}

  const existing = getCompanyRequirements();
  const unfrozen = {
    ...existing,
    isFrozen: false,
    frozenAt: null,
    updatedAt: new Date().toISOString()
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unfrozen));
    localStorage.setItem(FREEZE_KEY, 'false');
  } catch (e) {
    console.error('Failed to save unfrozen state', e);
  }

  dispatchRequirementsUpdated(unfrozen);
  return unfrozen;
};

// Quick helper to fetch the active company rounds
export const getCompanyRounds = () => {
  const reqs = getCompanyRequirements();
  return reqs.rounds && reqs.rounds.length > 0
    ? reqs.rounds
    : getDefaultRoundsForCount(reqs.numRounds || 3);
};

// Event dispatcher to notify all listening components
const dispatchRequirementsUpdated = (details) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_recruiter_requirements_updated', {
      detail: details
    }));
    window.dispatchEvent(new CustomEvent('storage'));
  }
};
