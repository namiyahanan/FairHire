// Centralized Persistent Candidate Hiring Process & Sequential Rounds Store
// Supports: Applied -> AI Screening -> Review (Round 1..N) -> Final Decision (Offer / Reject)
import { getCompanyRounds } from './requirementsStore';

const HIRING_STORAGE_KEY = 'fairhire_candidate_hiring_state';

// Generate dynamic round evaluations based on round title
const generateRoundResult = (roundName, roundNumber, candidateName = 'Candidate') => {
  const scores = [88, 91, 94, 96, 92, 95];
  const score = scores[(roundNumber - 1) % scores.length] || 90;

  const feedbacks = [
    `Excellent verbal articulation, clear career motivations, and verified cultural alignment with team principles.`,
    `Strong algorithmic efficiency and clean modular code architecture. Completed live problem-solving with optimal time complexity.`,
    `Demonstrated deep architectural maturity, resilience trade-offs, and high-throughput system design acumen.`,
    `Clear cross-functional ownership, strong leadership under pressure, and collaborative problem dissection.`,
    `Exemplary domain depth, sound technical reasoning, and executive vision alignment.`
  ];

  const feedback = feedbacks[(roundNumber - 1) % feedbacks.length] || `Candidate performed exceptionally well in ${roundName}.`;

  return {
    score,
    status: 'Passed',
    passedAt: new Date().toISOString(),
    feedback,
    evaluatedBy: roundNumber === 1 ? 'Talent Acquisition Team' : roundNumber === 2 ? 'Senior Staff Engineer' : 'Engineering Manager / Director'
  };
};

export const getHiringStore = () => {
  try {
    const raw = localStorage.getItem(HIRING_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const saveHiringStore = (store) => {
  try {
    localStorage.setItem(HIRING_STORAGE_KEY, JSON.stringify(store));
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_hiring_updated'));
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated'));
    window.dispatchEvent(new CustomEvent('storage'));
  }
};

// Retrieve or initialize hiring state for a candidate
export const getCandidateHiringState = (candidateId = 'CAND-8492') => {
  const store = getHiringStore();
  const companyRounds = getCompanyRounds();

  if (store[candidateId]) {
    const existing = store[candidateId];
    // Ensure rounds array matches company rounds length/structure
    if (!existing.rounds || existing.rounds.length === 0) {
      existing.rounds = companyRounds.map((r, idx) => ({
        round: r.round || idx + 1,
        name: r.name,
        description: r.description,
        status: idx === 0 ? 'pending_hr_approval' : 'locked',
        hrApproved: false,
        hrApprovedAt: null,
        candidateAttended: false,
        candidateAttendedAt: null,
        result: null
      }));
    }
    return existing;
  }

  // Initialize fresh candidate at "Applied"
  const initialRounds = companyRounds.map((r, idx) => ({
    round: r.round || idx + 1,
    name: r.name,
    description: r.description,
    status: idx === 0 ? 'pending_hr_approval' : 'locked',
    hrApproved: false,
    hrApprovedAt: null,
    candidateAttended: false,
    candidateAttendedAt: null,
    result: null
  }));

  const initial = {
    candidateId,
    stage: 'Applied', // 'Applied' | 'AI Screening' | 'Review' | 'Final Decision' | 'Completed'
    displayStatus: 'Applied',
    currentRoundIndex: 0,
    rounds: initialRounds,
    finalDecision: null, // 'Offered' | 'Rejected' | null
    timeline: [
      {
        stage: 'Applied',
        title: 'Application Submitted',
        timestamp: new Date().toISOString(),
        note: 'Candidate submitted verified application via Candidate Portal'
      }
    ]
  };

  store[candidateId] = initial;
  saveHiringStore(store);
  return initial;
};

// 1. Advance: Applied -> AI Screening
export const advanceToAiScreening = (candidateId) => {
  const store = getHiringStore();
  const current = getCandidateHiringState(candidateId);

  const updated = {
    ...current,
    stage: 'AI Screening',
    displayStatus: 'AI Screening',
    timeline: [
      ...current.timeline,
      {
        stage: 'AI Screening',
        title: 'AI Semantic Screening Initiated',
        timestamp: new Date().toISOString(),
        note: 'Contextual AI matching engine verified profile competencies against role criteria'
      }
    ]
  };

  store[candidateId] = updated;
  saveHiringStore(store);
  return updated;
};

// 2. Advance: AI Screening -> Review (Rounds Stage)
export const advanceToReview = (candidateId) => {
  const store = getHiringStore();
  const current = getCandidateHiringState(candidateId);

  const rounds = [...(current.rounds || [])];
  if (rounds[0]) {
    rounds[0].status = 'pending_hr_approval';
  }

  const updated = {
    ...current,
    stage: 'Review',
    displayStatus: 'Review (Round 1 Pending)',
    currentRoundIndex: 0,
    rounds,
    timeline: [
      ...current.timeline,
      {
        stage: 'Review',
        title: 'Sent to HR Review',
        timestamp: new Date().toISOString(),
        note: 'AI Screening passed. Candidate is queued for HR round-by-round interview evaluation'
      }
    ]
  };

  store[candidateId] = updated;
  saveHiringStore(store);
  return updated;
};

// 3. HR Approves Candidate for a Round (Sends invitation with deadline & timing slots to Candidate)
export const approveRoundByHr = (candidateId, roundIndex = 0, invitationDetails = {}) => {
  const store = getHiringStore();
  const current = getCandidateHiringState(candidateId);
  const rounds = [...(current.rounds || [])];

  const deadlineDays = Number(invitationDetails.deadlineDays) || 3;
  const deadlineDate = invitationDetails.deadlineDate || new Date(Date.now() + deadlineDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const defaultTimingSlots = [
    { id: 'slot-1', text: 'Tomorrow • 10:00 AM - 11:00 AM EST' },
    { id: 'slot-2', text: 'Tomorrow • 02:00 PM - 03:00 PM EST' },
    { id: 'slot-3', text: 'Day After Tomorrow • 11:30 AM - 12:30 PM EST' }
  ];

  const timingSlots = Array.isArray(invitationDetails.timingSlots) && invitationDetails.timingSlots.length > 0
    ? invitationDetails.timingSlots
    : defaultTimingSlots;

  if (rounds[roundIndex]) {
    rounds[roundIndex] = {
      ...rounds[roundIndex],
      status: 'waiting_candidate',
      hrApproved: true,
      hrApprovedAt: new Date().toISOString(),
      invitation: {
        deadlineDays,
        deadlineDate,
        timingSlots,
        instructions: invitationDetails.instructions || 'Please ensure a stable environment and attend within your selected slot.',
        sentAt: new Date().toISOString()
      },
      selectedSlot: null
    };
  }

  const roundName = rounds[roundIndex]?.name || `Round ${roundIndex + 1}`;

  const updated = {
    ...current,
    stage: 'Review',
    displayStatus: `Round ${roundIndex + 1}: Sent to Candidate`,
    currentRoundIndex: roundIndex,
    rounds,
    timeline: [
      ...current.timeline,
      {
        stage: 'Review',
        title: `Invitation Sent to Candidate for ${roundName}`,
        timestamp: new Date().toISOString(),
        note: `HR specified ${deadlineDays}-day deadline (${deadlineDate}) with ${timingSlots.length} available timing slots.`
      }
    ]
  };

  store[candidateId] = updated;
  saveHiringStore(store);
  return updated;
};

// 4. Candidate Attends Round Assessment (Result automatically generated and sent to HR)
export const candidateAttendRound = (candidateId, roundIndex = 0, selectedSlot = null) => {
  const store = getHiringStore();
  const current = getCandidateHiringState(candidateId);
  const rounds = [...(current.rounds || [])];

  if (rounds[roundIndex]) {
    const roundNumber = rounds[roundIndex].round || roundIndex + 1;
    const result = generateRoundResult(rounds[roundIndex].name, roundNumber);

    const chosenSlot = selectedSlot || rounds[roundIndex].selectedSlot || rounds[roundIndex].invitation?.timingSlots?.[0]?.text || 'Confirmed Slot';

    rounds[roundIndex] = {
      ...rounds[roundIndex],
      status: 'completed',
      candidateAttended: true,
      candidateAttendedAt: new Date().toISOString(),
      selectedSlot: chosenSlot,
      result
    };
  }

  const roundName = rounds[roundIndex]?.name || `Round ${roundIndex + 1}`;

  const updated = {
    ...current,
    stage: 'Review',
    displayStatus: `Round ${roundIndex + 1} Completed (Result Available)`,
    currentRoundIndex: roundIndex,
    rounds,
    timeline: [
      ...current.timeline,
      {
        stage: 'Review',
        title: `Candidate Attended ${roundName}`,
        timestamp: new Date().toISOString(),
        note: `Assessment completed. Score ${rounds[roundIndex]?.result?.score}% with evaluation result sent to HR.`
      }
    ]
  };

  store[candidateId] = updated;
  saveHiringStore(store);
  return updated;
};

// 5. HR Clicks to Proceed to Next Round or Final Decision
export const proceedToNextRound = (candidateId) => {
  const store = getHiringStore();
  const current = getCandidateHiringState(candidateId);
  const rounds = [...(current.rounds || [])];
  const nextIdx = (current.currentRoundIndex || 0) + 1;

  if (nextIdx < rounds.length) {
    // Unlock next round for HR approval
    rounds[nextIdx] = {
      ...rounds[nextIdx],
      status: 'pending_hr_approval'
    };

    const nextRoundName = rounds[nextIdx]?.name || `Round ${nextIdx + 1}`;

    const updated = {
      ...current,
      stage: 'Review',
      displayStatus: `Round ${nextIdx + 1} (Pending HR Approval)`,
      currentRoundIndex: nextIdx,
      rounds,
      timeline: [
        ...current.timeline,
        {
          stage: 'Review',
          title: `Advanced to Round ${nextIdx + 1}: ${nextRoundName}`,
          timestamp: new Date().toISOString(),
          note: `Previous round passed. Ready for HR to approve Round ${nextIdx + 1}.`
        }
      ]
    };

    store[candidateId] = updated;
    saveHiringStore(store);
    return updated;
  } else {
    // All specified rounds are completed -> Show Approve or Reject Option
    const updated = {
      ...current,
      stage: 'Final Decision',
      displayStatus: 'All Rounds Completed (Decision Needed)',
      timeline: [
        ...current.timeline,
        {
          stage: 'Final Decision',
          title: 'All Interview Rounds Completed',
          timestamp: new Date().toISOString(),
          note: 'Candidate completed all company hiring rounds. Awaiting final HR decision: Offer or Reject.'
        }
      ]
    };

    store[candidateId] = updated;
    saveHiringStore(store);
    return updated;
  }
};

// 6. HR Final Decision: Approve (Offer) or Reject
export const submitFinalDecision = (candidateId, decision = 'Offer') => {
  const store = getHiringStore();
  const current = getCandidateHiringState(candidateId);
  const isOffer = decision === 'Offer';

  const updated = {
    ...current,
    stage: 'Completed',
    finalDecision: isOffer ? 'Offered' : 'Rejected',
    displayStatus: isOffer ? 'Offered' : 'Rejected',
    timeline: [
      ...current.timeline,
      {
        stage: 'Completed',
        title: isOffer ? '🎉 Job Offer Extended' : 'Application Concluded',
        timestamp: new Date().toISOString(),
        note: isOffer
          ? 'HR has approved candidate. Official offer letter and terms extended.'
          : 'HR decided not to move forward after reviewing complete evaluation dossier.'
      }
    ]
  };

  store[candidateId] = updated;
  saveHiringStore(store);
  return updated;
};

// Reset candidate hiring state back to initial Applied (for demo purposes)
export const resetCandidateHiringState = (candidateId) => {
  const store = getHiringStore();
  delete store[candidateId];
  saveHiringStore(store);
  return getCandidateHiringState(candidateId);
};
