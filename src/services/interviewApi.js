import { apiRequest, isMockMode } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { MOCK_INTERVIEWS, MOCK_LLM_PROMPTS } from '../mock/interviewMock';

let localInterviews = [...MOCK_INTERVIEWS];

export const interviewApi = {
  scheduleInterview: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 500));
      const newInt = {
        id: `INT-${Math.floor(100 + Math.random() * 900)}`,
        candidateId: payload.candidateId,
        candidateName: payload.candidateName || "Candidate",
        jobTitle: payload.jobTitle || "Engineering Position",
        interviewerName: payload.interviewerName || "Interviewer Team",
        date: payload.date || "2026-09-15",
        time: payload.time || "10:00 AM EST",
        status: "Scheduled",
        type: payload.type || "Technical Interview",
        meetingLink: "https://fairhire.meet/room-live"
      };
      localInterviews.unshift(newInt);
      return { success: true, data: newInt, message: "Interview scheduled successfully." };
    }

    return apiRequest(API_ENDPOINTS.interviews.schedule, {
      method: 'POST',
      body: payload
    });
  },

  getInterviews: async () => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return { success: true, data: localInterviews, message: "Interviews fetched." };
    }

    return apiRequest(API_ENDPOINTS.interviews.list);
  },

  getInterviewPrompts: async (params = {}) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      return { success: true, data: MOCK_LLM_PROMPTS, message: "AI interview prompts generated." };
    }

    const query = new URLSearchParams(params).toString();
    return apiRequest(`${API_ENDPOINTS.interviews.prompts}?${query}`);
  },

  submitFeedback: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 600));
      return {
        success: true,
        data: {
          feedbackId: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
          candidateId: payload.candidateId,
          submittedAt: new Date().toISOString(),
          rating: payload.rating,
          recommendation: payload.recommendation
        },
        message: "Evaluation feedback submitted successfully."
      };
    }

    return apiRequest(API_ENDPOINTS.interviews.feedback, {
      method: 'POST',
      body: payload
    });
  }
};
