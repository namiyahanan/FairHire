import { apiRequest, isMockMode } from './api';

export const authApi = {
  login: async (email, password, role = 'candidate') => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 400));
      const mockUsers = {
        candidate: { id: 'USR-CAND-1', name: 'Alex Morgan', email, role: 'candidate', avatar: null },
        recruiter: { id: 'USR-REC-1', name: 'Elena Rostova', email, role: 'recruiter', avatar: null },
        interviewer: { id: 'USR-INT-1', name: 'Dr. Elena Rostova', email, role: 'interviewer', avatar: null },
        admin: { id: 'USR-ADM-1', name: 'Marcus Vance', email, role: 'admin', avatar: null },
      };

      const user = mockUsers[role] || mockUsers.candidate;
      return {
        success: true,
        data: {
          token: `mock-jwt-token-${role}`,
          user
        },
        message: 'Logged in successfully.'
      };
    }

    return apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password, role }
    });
  },

  register: async (payload) => {
    if (isMockMode()) {
      await new Promise(res => setTimeout(res, 500));
      const role = payload.role || 'candidate';
      const isRecruiter = role === 'recruiter';
      return {
        success: true,
        data: {
          id: isRecruiter ? `REC-${Math.floor(1000 + Math.random() * 9000)}` : `CAND-${Math.floor(1000 + Math.random() * 9000)}`,
          email: payload.email,
          name: payload.fullName || (isRecruiter ? 'HR Recruiter' : 'Candidate'),
          role: role,
          token: `mock-jwt-token-${role}`,
          profile: payload
        },
        message: isRecruiter
          ? 'Recruiter workspace initialized successfully.'
          : 'Candidate account created successfully.'
      };
    }

    return apiRequest('/auth/register', {
      method: 'POST',
      body: payload
    });
  }
};
