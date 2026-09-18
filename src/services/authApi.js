import { loginUser, registerUser } from './authService';

export const authApi = {
  login: async (email, password, role = 'candidate') => {
    return loginUser(email, password, role);
  },

  register: async (payload) => {
    return registerUser(payload);
  }
};


