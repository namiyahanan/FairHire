import { useState, useCallback } from 'react';
import { interviewApi } from '../services/interviewApi';

export const useInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInterviews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await interviewApi.getInterviews();
      if (res.success) {
        setInterviews(res.data);
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

  const fetchPrompts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await interviewApi.getInterviewPrompts(params);
      if (res.success) {
        setPrompts(res.data);
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

  const submitFeedback = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await interviewApi.submitFeedback(payload);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const scheduleInterview = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await interviewApi.scheduleInterview(payload);
      if (res.success) {
        setInterviews(prev => [res.data, ...prev]);
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
    interviews,
    prompts,
    loading,
    error,
    fetchInterviews,
    fetchPrompts,
    submitFeedback,
    scheduleInterview
  };
};
