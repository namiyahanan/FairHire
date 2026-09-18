import { useState, useCallback } from 'react';
import { candidateApi } from '../services/candidateApi';

export const useCandidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCandidates = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateApi.getCandidates(filters);
      if (res.success) {
        setCandidates(res.data);
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

  const fetchCandidateStatus = useCallback(async (candidateId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateApi.getCandidateStatus(candidateId);
      if (res.success) {
        setCurrentCandidate(res.data);
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

  const applyCandidate = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateApi.applyCandidate(payload);
      if (res.success) {
        setCurrentCandidate(res.data);
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

  const updateCandidateStatus = async (candidateId, status, note = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateApi.updateCandidateStatus({ candidateId, status, note });
      if (res.success) {
        await fetchCandidates();
        if (currentCandidate && currentCandidate.id === candidateId) {
          await fetchCandidateStatus(candidateId);
        }
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

  const shortlistCandidate = async (candidateId) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateApi.shortlistCandidate(candidateId);
      if (res.success) {
        await fetchCandidates();
        if (currentCandidate && currentCandidate.id === candidateId) {
          await fetchCandidateStatus(candidateId);
        }
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

  const rejectCandidate = async (candidateId, notes = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateApi.rejectCandidate(candidateId, notes);
      if (res.success) {
        await fetchCandidates();
        if (currentCandidate && currentCandidate.id === candidateId) {
          await fetchCandidateStatus(candidateId);
        }
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

  const confirmInterviewSlot = async (candidateId, slot) => {
    setLoading(true);
    setError(null);
    try {
      const res = await candidateApi.confirmInterviewSlot({ candidateId, slot });
      if (res.success) {
        setCurrentCandidate(res.data);
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

  const deleteCandidate = async (candidateId) => {
    setLoading(true);
    try {
      const res = await candidateApi.deleteCandidate(candidateId);
      if (res.success) {
        setCandidates(prev => prev.filter(c => c.id !== candidateId));
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const clearAllCandidates = async () => {
    setLoading(true);
    try {
      const res = await candidateApi.clearAllCandidates();
      if (res.success) {
        setCandidates([]);
      }
      return res;
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    candidates,
    currentCandidate,
    loading,
    error,
    fetchCandidates,
    fetchCandidateStatus,
    applyCandidate,
    updateCandidateStatus,
    shortlistCandidate,
    rejectCandidate,
    confirmInterviewSlot,
    deleteCandidate,
    clearAllCandidates
  };
};
