import { apiRequest, isMockMode } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { MOCK_CANDIDATES } from '../mock/candidateMock';
import {
  approveApplicationForInterview,
  revokeApplicationApproval,
  isAnyApplicationApprovedForInterview
} from './applicationStore';
import { getCandidateHiringState } from './candidateHiringStore';

const CANDIDATES_STORAGE_KEY = 'fairhire_all_candidates';
const CANDIDATES_DATA_VER = 'v6_strict_candidate_apply';

export const getStoredCandidates = () => {
  try {
    const storedVer = localStorage.getItem('fairhire_candidates_ver');
    if (storedVer !== CANDIDATES_DATA_VER) {
      localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify([]));
      localStorage.setItem('fairhire_candidates_ver', CANDIDATES_DATA_VER);
      return [];
    }

    const raw = localStorage.getItem(CANDIDATES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return [];
    
    // Sync each candidate with their dynamic hiring status (defaults to Applied)
    return parsed.map(c => {
      const hiringState = getCandidateHiringState(c.id);
      return {
        ...c,
        status: hiringState.displayStatus || c.status || 'Applied',
        hiringStage: hiringState.stage || 'Applied'
      };
    });
  } catch (e) {
    return [];
  }
};

export const clearAllCandidatesInStore = () => {
  try {
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify([]));
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated'));
    window.dispatchEvent(new CustomEvent('fairhire_candidates_cleared'));
    window.dispatchEvent(new CustomEvent('storage'));
  }
  return [];
};

export const deleteCandidateFromStore = (candidateId) => {
  const current = getStoredCandidates();
  const updated = current.filter(c => c.id !== candidateId);
  saveCandidates(updated);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated', { detail: { deletedId: candidateId } }));
    window.dispatchEvent(new CustomEvent('storage'));
  }
  return updated;
};

export const saveCandidates = (cands) => {
  try {
    localStorage.setItem(CANDIDATES_STORAGE_KEY, JSON.stringify(cands));
  } catch (e) {}
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated'));
    window.dispatchEvent(new CustomEvent('storage'));
  }
};

// Check if candidate is approved by HR for interview booking
export const isInterviewBookingApproved = (candidateId = 'CAND-8492') => {
  const current = getStoredCandidates();
  const cand = current.find(c => c.id === candidateId || c.email === 'alex.morgan@example.com' || c.email === 'alex.morgan@gmail.com');
  
  if (cand) {
    const approvedStatuses = ['Shortlisted', 'Interview Scheduled', 'Interviewed', 'Offered', 'Hired'];
    if (approvedStatuses.includes(cand.status)) {
      return { approved: true, candidate: cand, status: cand.status };
    }
  }

  // Check application store
  if (isAnyApplicationApprovedForInterview()) {
    return { approved: true, candidate: cand, status: 'Shortlisted / Approved' };
  }

  return {
    approved: false,
    candidate: cand,
    status: cand?.status || 'Screened (Pending HR Review)'
  };
};

// HR approves candidate for technical interview
export const approveCandidateInStore = (candidateId = 'CAND-8492') => {
  const current = getStoredCandidates();
  let updatedCand = null;
  const updated = current.map(c => {
    if (c.id === candidateId || c.email === 'alex.morgan@example.com' || c.email === 'alex.morgan@gmail.com') {
      const defaultSlots = [
        { id: "SLOT-101", date: "2026-09-12", time: "10:00 AM - 11:00 AM EST", status: "available" },
        { id: "SLOT-102", date: "2026-09-12", time: "02:00 PM - 03:00 PM EST", status: "available" },
        { id: "SLOT-103", date: "2026-09-13", time: "11:30 AM - 12:30 PM EST", status: "available" }
      ];
      updatedCand = {
        ...c,
        status: 'Shortlisted',
        interviewSlots: c.interviewSlots && c.interviewSlots.length > 0 ? c.interviewSlots : defaultSlots,
        timeline: [
          ...(c.timeline || []),
          { status: 'Shortlisted', timestamp: new Date().toISOString(), note: 'Recruiter reviewed profile and approved candidate for interview booking.' }
        ]
      };
      return updatedCand;
    }
    return c;
  });

  saveCandidates(updated);
  approveApplicationForInterview();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated', { detail: { candidateId, status: 'Shortlisted' } }));
  }

  return updatedCand;
};

// Revoke interview approval (re-locks interview booking)
export const revokeCandidateApprovalInStore = (candidateId = 'CAND-8492') => {
  const current = getStoredCandidates();
  let updatedCand = null;
  const updated = current.map(c => {
    if (c.id === candidateId || c.email === 'alex.morgan@example.com' || c.email === 'alex.morgan@gmail.com') {
      updatedCand = {
        ...c,
        status: 'Screened',
        selectedSlot: null,
        timeline: [
          ...(c.timeline || []),
          { status: 'Screened', timestamp: new Date().toISOString(), note: 'Recruiter returned candidate to review queue.' }
        ]
      };
      return updatedCand;
    }
    return c;
  });

  saveCandidates(updated);
  revokeApplicationApproval();

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated', { detail: { candidateId, status: 'Screened' } }));
  }

  return updatedCand;
};

export const candidateApi = {
  applyCandidate: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      const current = getStoredCandidates();
      const candId = payload.candidateId || payload.id || 'CAND-8492';
      
      // Initialize candidate hiring store at 'Applied' stage
      getCandidateHiringState(candId);
      try {
        localStorage.setItem('fairhire_active_candidate_id', candId);
      } catch (e) {}

      const newCand = {
        id: candId,
        jobId: payload.jobId || "JOB-2026-01",
        jobTitle: payload.targetRole || "Senior Full Stack Engineer",
        maskedName: `Candidate #${candId.replace(/\D/g, '') || Math.floor(1000 + Math.random() * 9000)}`,
        name: payload.fullName || "Candidate User",
        email: payload.email || "candidate@example.com",
        phone: payload.mobile || "+91 9876543210",
        location: payload.location || "Remote / Hybrid",
        experienceYears: parseInt(payload.experience) || 3,
        education: payload.degree || "Bachelor's Degree",
        aiScore: parseFloat((8.8 + Math.random() * 0.8).toFixed(1)),
        matchedSkills: Array.isArray(payload.skills) ? payload.skills : (payload.skills ? payload.skills.split(',').map(s => s.trim()) : ["React", "JavaScript", "Web Architecture"]),
        missingSkills: [],
        status: "Applied",
        hiringStage: "Applied",
        appliedDate: new Date().toISOString(),
        resumeSummary: payload.summary || `Candidate submitted verified application for ${payload.targetRole || 'engineering position'} via FairHire Candidate Portal.`,
        rationale: `Contextual semantic matching engine identified high alignment with ${payload.targetRole || 'role'} technical criteria.`,
        interviewSlots: [
          { id: "SLOT-NEW-1", date: "2026-09-15", time: "10:00 AM EST", status: "available" },
          { id: "SLOT-NEW-2", date: "2026-09-15", time: "02:00 PM EST", status: "available" }
        ],
        timeline: [
          { status: "Applied", timestamp: new Date().toISOString(), note: "Application submitted via Candidate Portal" }
        ]
      };

      const existingIdx = current.findIndex(c => (c.id === candId || c.email === payload.email) && c.jobId === payload.jobId);
      let updated;
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = newCand;
      } else {
        updated = [newCand, ...current];
      }

      saveCandidates(updated);
      return { success: true, data: newCand, message: "Application submitted and entered into HR pipeline." };
    }

    return apiRequest(API_ENDPOINTS.candidates.apply, {
      method: 'POST',
      body: payload
    });
  },

  getCandidateStatus: async (candidateId) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      const current = getStoredCandidates();
      const cand = current.find(c => c.id === candidateId) || (current.length > 0 && candidateId === 'CAND-8492' ? current[0] : null);
      return {
        success: !!cand,
        data: cand || null,
        message: cand ? "Candidate status fetched." : "No candidate found with this ID."
      };
    }

    return apiRequest(`${API_ENDPOINTS.candidates.statusCheck}?candidate_id=${candidateId}`);
  },

  getCandidates: async (filters = {}) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      const current = getStoredCandidates();
      let filtered = [...current];
      if (filters.status && filters.status !== 'All') {
        filtered = filtered.filter(c => c.status === filters.status);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(c => 
          c.name.toLowerCase().includes(q) || 
          c.jobTitle.toLowerCase().includes(q) || 
          c.id.toLowerCase().includes(q)
        );
      }
      return { success: true, data: filtered, message: "Candidates fetched successfully." };
    }

    return apiRequest(API_ENDPOINTS.candidates.list);
  },

  confirmInterviewSlot: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      const current = getStoredCandidates();
      const cand = current.find(c => c.id === payload.candidateId);
      if (cand) {
        cand.status = "Interview Scheduled";
        cand.selectedSlot = payload.slot;
        cand.timeline.push({
          status: "Interview Scheduled",
          timestamp: new Date().toISOString(),
          note: `Confirmed slot for ${payload.slot.date} at ${payload.slot.time}`
        });
        saveCandidates(current);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated'));
      }

      return { success: true, data: cand || {}, message: "Interview slot confirmed successfully." };
    }

    return apiRequest(API_ENDPOINTS.candidates.confirmSlot, {
      method: 'POST',
      body: payload
    });
  },

  updateCandidateStatus: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      const current = getStoredCandidates();
      const cand = current.find(c => c.id === payload.candidateId);
      if (cand) {
        cand.status = payload.status;
        cand.timeline.push({
          status: payload.status,
          timestamp: new Date().toISOString(),
          note: payload.note || `Status updated to ${payload.status} by recruiter`
        });

        // If approved by HR, sync application store
        if (payload.status === 'Shortlisted' || payload.status === 'Interview Scheduled') {
          approveApplicationForInterview();
        } else if (payload.status === 'Applied' || payload.status === 'Screened') {
          revokeApplicationApproval();
        }

        saveCandidates(current);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('fairhire_candidate_status_updated', { detail: payload }));
      }

      return { success: true, data: cand || {}, message: `Candidate status updated to ${payload.status}.` };
    }

    return apiRequest(API_ENDPOINTS.candidates.status, {
      method: 'POST',
      body: payload
    });
  },

  deleteCandidate: async (candidateId) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 150));
      const updated = deleteCandidateFromStore(candidateId);
      return { success: true, data: updated, message: "Candidate removed from pipeline." };
    }
    return apiRequest(`${API_ENDPOINTS.candidates.list}/${candidateId}`, {
      method: 'DELETE'
    });
  },

  clearAllCandidates: async () => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 150));
      clearAllCandidatesInStore();
      return { success: true, message: "All candidates removed from pipeline." };
    }
    return apiRequest(`${API_ENDPOINTS.candidates.list}/clear-all`, {
      method: 'POST'
    });
  }
};
