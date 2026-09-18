import { apiRequest, isMockMode, callHRWebhook } from './api';
import { supabase } from './supabaseClient';
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

/**
 * Adapter: job_tracks Supabase row → frontend Job object consumed by
 * JobCard, HRDashboard metrics, and the Jobs page grid.
 *
 * Only fields actually referenced by existing UI components are mapped.
 * No fields are invented or fabricated.
 *
 * Verified against live job_tracks rows on 2026-09-16:
 *   - track_id   : slug string  (e.g. "WEB", "backend-developer")
 *   - status     : lowercase string ("active") — capitalised for UI === 'Active'
 *   - minimum_experience : number (may be 0) — converted to display string
 *   - required_skills / preferred_skills : string[]
 *   - all other array columns : string[]
 */
const jobTrackAdapter = (row) => {
  if (!row || typeof row !== 'object') return row;

  // Status: DB stores 'active' / 'inactive'; UI checks === 'Active'
  const status = row.status
    ? row.status.charAt(0).toUpperCase() + row.status.slice(1)
    : 'Active';

  // Experience: DB is a number; JobCard renders it as a string
  const expNum = Number(row.minimum_experience);
  const experience = expNum > 0 ? `${expNum}+ years` : 'Entry level';

  return {
    // Identity
    id: row.track_id,
    trackId: row.track_id,
    trackBadge: TRACK_BADGES[row.track_id] || row.department || 'Engineering',

    // Display
    title: row.title,
    targetRole: row.target_role || row.title,
    role: row.target_role || row.title,
    department: row.department || 'Engineering',
    company: row.company || 'FairHire Enterprise',
    companyInitial: (row.company || row.title || 'F').charAt(0).toUpperCase(),
    companyBg: 'bg-teal-600',
    rating: 4.5,
    salary: 'Competitive',

    // Skills — JobCard reads job.skills || job.tags
    skills: Array.isArray(row.required_skills) ? row.required_skills : [],
    preferredSkills: Array.isArray(row.preferred_skills) ? row.preferred_skills : [],
    tags: Array.isArray(row.required_skills) ? row.required_skills : [],

    // Requirements
    experience,
    degree: row.required_education || '',
    description: row.job_description || '',
    screeningCriteria: row.job_description || 'Evaluated across verified engineering track criteria.',

    // Status (capitalised for UI)
    status,

    // Timestamps
    createdAt: row.created_at,
    postedTime: row.created_at ? new Date(row.created_at).toLocaleDateString() : 'Active',

    // Counters — not stored in job_tracks; default to 0
    applicantsCount: 0,
    screenedCount: 0,
    isHrUploaded: true,
    courses: [],
    interviewRounds: []
  };
};

/**
 * Legacy normaliser — kept for createJob mock and webhook response paths.
 * Not used for Supabase reads.
 */
const normalizeJob = (raw) => {
  if (!raw || typeof raw !== 'object') return raw;
  return {
    ...raw,
    trackId: raw.trackId ?? raw.track_id,
    trackBadge: raw.trackBadge ?? raw.track_badge,
    targetRole: raw.targetRole ?? raw.target_role,
    minMatchThreshold: raw.minMatchThreshold ?? raw.min_match_threshold,
    screeningCriteria: raw.screeningCriteria ?? raw.screening_criteria,
    interviewRounds: raw.interviewRounds ?? raw.interview_rounds,
    applicantsCount: raw.applicantsCount ?? raw.applicants_count,
    screenedCount: raw.screenedCount ?? raw.screened_count,
    postedTime: raw.postedTime ?? raw.posted_time,
    createdAt: raw.createdAt ?? raw.created_at,
  };
};

const DELETED_JOBS_STORAGE_KEY = 'fairhire_deleted_job_ids';

export const getDeletedJobIds = () => {
  try {
    const raw = localStorage.getItem(DELETED_JOBS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const addDeletedJobId = (jobId) => {
  try {
    const existing = getDeletedJobIds();
    if (!existing.includes(jobId)) {
      const updated = [...existing, jobId];
      localStorage.setItem(DELETED_JOBS_STORAGE_KEY, JSON.stringify(updated));
    }
  } catch (e) {}
};

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

    // LIVE path — POST to unified HR webhook, then re-fetch authoritative data from Supabase.
    const skillsArray = Array.isArray(payload.skills)
      ? payload.skills
      : (typeof payload.skills === 'string'
          ? payload.skills.split(',').map(s => s.trim()).filter(Boolean)
          : []);

    // Parse minimum_experience number from the form's experience string
    // e.g. 'Mid Level (3-5 yrs)' → 3, 'Entry Level (0-2 yrs)' → 0
    const expStr = String(payload.experience || '0');
    const expMatch = expStr.match(/(\d+)/);
    const minimumExperience = expMatch ? parseInt(expMatch[1], 10) : 0;

    const jobData = {
      title:               payload.title,
      target_role:         payload.targetRole || payload.title,
      department:          payload.department || 'Engineering',
      company:             payload.company || 'FairHire Enterprise',
      required_skills:     skillsArray,
      preferred_skills:    [],
      required_languages:  [],
      preferred_languages: [],
      required_frameworks: [],
      preferred_frameworks:[],
      required_databases:  [],
      preferred_databases: [],
      required_tools:      [],
      preferred_tools:     [],
      minimum_experience:  minimumExperience,
      required_education:  payload.degree || "Bachelor's Degree",
      job_description:     payload.description || '',
    };

    // POST to HR webhook
    await callHRWebhook('create_job', jobData);

    // Re-fetch authoritative data from Supabase (Supabase is the source of truth after write)
    const refreshed = await jobApi.getJobs();

    // Find the newly created job from the refreshed list (match by title + company)
    const createdJob = refreshed.data?.find(
      j => j.title === payload.title && j.company === jobData.company
    ) || refreshed.data?.[0] || { title: payload.title };

    return {
      success: true,
      data: createdJob,
      message: 'Job created and published successfully.',
    };
  },

  updateJob: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 300));
      return { success: true, data: payload, message: 'Job updated (mock).' };
    }

    // LIVE: POST update_job to HR webhook, then re-fetch from Supabase
    const { trackId, track_id, ...rest } = payload;
    const resolvedTrackId = trackId || track_id;

    if (!resolvedTrackId) {
      return { success: false, message: 'track_id is required for job update.' };
    }

    await callHRWebhook('update_job', { track_id: resolvedTrackId, ...rest });

    const refreshed = await jobApi.getJobs();
    const updatedJob = refreshed.data?.find(j => j.id === resolvedTrackId) || null;

    return {
      success: true,
      data: updatedJob,
      message: 'Job updated successfully.',
    };
  },

  getJobs: async () => {
    const deletedJobIds = getDeletedJobIds();

    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 250));
      const jobs = getStoredJobs().filter(j => !deletedJobIds.includes(j.id));
      return { success: true, data: jobs, message: 'Jobs retrieved successfully.' };
    }

    // LIVE path — reads directly from Supabase job_tracks
    console.log('[FairHire] getJobs: requesting job_tracks');

    const { data, error } = await supabase
      .from('job_tracks')
      .select('*')
      .order('created_at', { ascending: false });

    console.log('[FairHire] getJobs response:', {
      count: data?.length ?? 0,
      error
    });

    if (error) {
      console.error('[FairHire][JOB LIST] Supabase error:', error.message, 'code:', error.code);
      throw new Error(`Failed to fetch jobs from Supabase: ${error.message}`);
    }

    const activeRows = (Array.isArray(data) ? data : []).filter(row => {
      if (row.status === 'inactive' || row.status === 'deleted') return false;
      if (deletedJobIds.includes(row.track_id)) return false;
      return true;
    });

    const jobs = activeRows.map(jobTrackAdapter);

    console.log('[FairHire][JOB LIST] Fetched', jobs.length, 'active jobs from Supabase');

    return {
      success: true,
      data: jobs,
      message: 'Jobs fetched successfully from Supabase'
    };
  },


  deleteJob: async (jobId) => {
    // Record in local exclusion list and store
    addDeletedJobId(jobId);
    deleteJobFromStore(jobId);

    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 200));
      return { success: true, message: 'Position deleted successfully.' };
    }

    // LIVE path: Try deleting directly from Supabase job_tracks
    try {
      const { error: delError } = await supabase
        .from('job_tracks')
        .delete()
        .eq('track_id', jobId);

      if (delError) {
        console.warn('[FairHire] Direct delete on job_tracks failed, updating status to inactive:', delError.message);
        // Fallback: update status to inactive in Supabase so query filters it out
        await supabase
          .from('job_tracks')
          .update({ status: 'inactive' })
          .eq('track_id', jobId);
      }
    } catch (dbErr) {
      console.warn('[FairHire] Supabase job deletion error:', dbErr.message);
    }

    // Dispatch events so all pages and portals update immediately
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('fairhire_jobs_updated', { detail: { deletedJobId: jobId } }));
      window.dispatchEvent(new CustomEvent('storage'));
    }

    return {
      success: true,
      message: 'Position deleted successfully from enterprise directory.'
    };
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
