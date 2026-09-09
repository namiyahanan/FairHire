import { apiRequest, isMockMode } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import { MOCK_FAIRNESS_METRICS, MOCK_AUDIT_LOGS } from '../mock/complianceMock';

export const complianceApi = {
  getFairnessMetrics: async (jobId = 'all') => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      return { success: true, data: MOCK_FAIRNESS_METRICS, message: "Fairness metrics fetched." };
    }

    return apiRequest(`${API_ENDPOINTS.compliance.fairness}?job_id=${encodeURIComponent(jobId)}`);
  },

  getAuditLogs: async (params = {}) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      let logs = [...MOCK_AUDIT_LOGS];
      if (params.search) {
        const q = params.search.toLowerCase();
        logs = logs.filter(l =>
          l.actor.toLowerCase().includes(q) ||
          l.action.toLowerCase().includes(q) ||
          l.resource.toLowerCase().includes(q) ||
          l.candidateId.toLowerCase().includes(q)
        );
      }
      if (params.role && params.role !== 'all') {
        logs = logs.filter(l => l.role === params.role);
      }
      return { success: true, data: logs, message: "Audit logs fetched." };
    }

    const query = new URLSearchParams(params).toString();
    return apiRequest(`${API_ENDPOINTS.compliance.auditLogs}?${query}`);
  }
};
