import { useState, useCallback } from 'react';
import { jobApi } from '../services/jobApi';

export const useJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [roles, setRoles] = useState([]);
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.getJobs();
      if (res.success) {
        setJobs(Array.isArray(res.data) ? res.data : []);
      } else {
        setError(res.message);
      }
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoles = useCallback(async () => {
    try {
      const res = await jobApi.getJobRoles();
      if (res.success) {
        setRoles(res.data);
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const fetchTemplate = useCallback(async (roleName) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.getJobTemplate(roleName);
      if (res.success) {
        setTemplate(res.data);
      } else {
        setError(res.message);
      }
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createJob = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.createJob(payload);
      if (res.success) {
        await fetchJobs();
      } else {
        setError(res.message);
      }
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.updateJob(payload);
      if (res.success) {
        await fetchJobs();
      } else {
        setError(res.message);
      }
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (jobId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await jobApi.deleteJob(jobId);
      if (res.success) {
        setJobs(prev => prev.filter(j => j.id !== jobId));
      } else {
        setError(res.message);
      }
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    roles,
    template,
    loading,
    error,
    fetchJobs,
    fetchRoles,
    fetchTemplate,
    createJob,
    updateJob,
    deleteJob
  };
};
