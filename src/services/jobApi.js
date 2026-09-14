import { apiRequest, isMockMode } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { MOCK_JOB_TEMPLATES } from '../mock/jobMock';
import {
  getStoredJobs,
  saveJobToStore,
  deleteJobFromStore,
  detectTrackForRole,
  generateCoursesForRole,
  TRACKS,
  TRACK_BADGES
} from './jobStore';
import { getCompanyRounds, getCompanyRequirements } from './requirementsStore';

const VIBRANT_BG_COLORS = [
  'bg-teal-600',
  'bg-indigo-600',
  'bg-purple-600',
  'bg-blue-600',
  'bg-emerald-600',
  'bg-rose-600',
  'bg-sky-600',
  'bg-amber-600'
];

export const jobApi = {
  createJob: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      
      const skillsArray = Array.isArray(payload.skills)
        ? payload.skills
        : payload.skills?.split(',').map(s => s.trim()).filter(Boolean) || [];

      const targetRole = payload.targetRole || payload.title || 'Software Engineer';
      const trackId = payload.trackId || detectTrackForRole(payload.title, payload.department, skillsArray);
      const trackName = TRACKS[trackId] || TRACKS.WEB;
      const trackBadge = TRACK_BADGES[trackId] || 'Web & App Dev';

      const companyReqs = getCompanyRequirements();
      const company = (payload.company && payload.company.trim()) || companyReqs.companyName || 'FairHire Enterprise';
      const companyInitial = company.charAt(0).toUpperCase();
      const companyBg = payload.companyBg || VIBRANT_BG_COLORS[Math.floor(Math.random() * VIBRANT_BG_COLORS.length)];

      const generatedCourses = generateCoursesForRole(payload.title, skillsArray);
      const activeRounds = payload.interviewRounds || getCompanyRounds();

      const newJob = {
        id: `JOB-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
        title: payload.title,
        role: targetRole,
        department: payload.department || 'Engineering',
        company,
        companyInitial,
        companyBg,
        rating: 4.5,
        reviewsCount: '1.2K+ reviews',
        trackId,
        trackName,
        trackBadge,
        location: payload.location || 'Coimbatore, Tamil Nadu',
        postedTime: 'Just now',
        salary: payload.salary || '₹28 - 40 LPA ($140k)',
        experience: payload.experience || '3+ years',
        degree: payload.degree || "Bachelor's Degree",
        minMatchThreshold: Number(payload.minMatchThreshold) || 75,
        status: 'Active',
        applicantsCount: 0,
        screenedCount: 0,
        createdAt: new Date().toISOString(),
        description: payload.description || `Enterprise engineering position for ${payload.title}. Contextual matching evaluated across core requirements.`,
        screeningCriteria: payload.screeningCriteria || `Evaluated for ${skillsArray.slice(0, 3).join(', ') || 'core competency'} and verified engineering track criteria.`,
        tags: skillsArray,
        skills: skillsArray,
        courses: generatedCourses,
        interviewRounds: activeRounds,
        isHrUploaded: true
      };

      saveJobToStore(newJob);
      return { success: true, data: newJob, message: 'Job created and published successfully to candidate portal.' };
    }

    return apiRequest(API_ENDPOINTS.jobs.post, {
      method: 'POST',
      body: payload
    });
  },

  getJobs: async () => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      const jobs = getStoredJobs();
      return { success: true, data: jobs, message: 'Jobs retrieved successfully.' };
    }

    return apiRequest(API_ENDPOINTS.jobs.list);
  },

  deleteJob: async (jobId) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      deleteJobFromStore(jobId);
      return { success: true, message: 'Position deleted successfully.' };
    }

    return apiRequest(`${API_ENDPOINTS.jobs.list}/${jobId}`, {
      method: 'DELETE'
    });
  },

  getJobRoles: async () => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 150));
      const roles = Object.keys(MOCK_JOB_TEMPLATES);
      return { success: true, data: roles, message: 'Job roles fetched.' };
    }

    return apiRequest(API_ENDPOINTS.jobs.roles);
  },

  getJobTemplate: async (role) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      const template = MOCK_JOB_TEMPLATES[role] || {
        title: `${role} - Standard Position`,
        department: 'General',
        location: 'Remote',
        experience: '3+ years',
        degree: "Bachelor's Degree",
        minMatchThreshold: 75,
        description: `Default enterprise job template for ${role}. Customize requirements as needed.`,
        skills: ['Communication', 'Problem Solving', 'Domain Expertise']
      };
      return { success: true, data: template, message: 'Job template loaded.' };
    }

    return apiRequest(`${API_ENDPOINTS.jobs.template}?role=${encodeURIComponent(role)}`);
  }
};
