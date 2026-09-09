import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import { ROLES } from '../utils/constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Only load if explicitly authenticated in the active session
    const saved = sessionStorage.getItem('fairhire_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('fairhire_user', JSON.stringify(user));
      localStorage.setItem('fairhire_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('fairhire_user');
      sessionStorage.removeItem('fairhire_token');
      localStorage.removeItem('fairhire_user');
      localStorage.removeItem('fairhire_token');
    }
  }, [user]);

  const login = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      let resolvedRole = role;
      if (!resolvedRole) {
        const emailLower = (email || '').toLowerCase().trim();
        if (emailLower.includes('recruiter') || emailLower.includes('hr') || emailLower.includes('elena.rostova')) {
          resolvedRole = ROLES.RECRUITER;
        } else {
          const savedUser = localStorage.getItem('fairhire_user');
          if (savedUser) {
            try {
              const parsed = JSON.parse(savedUser);
              if (parsed.email && parsed.email.toLowerCase() === emailLower && parsed.role) {
                resolvedRole = parsed.role;
              }
            } catch (e) {}
          }
          if (!resolvedRole) resolvedRole = ROLES.CANDIDATE;
        }
      }

      const res = await authApi.login(email, password, resolvedRole);
      if (res.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('fairhire_token', res.data.token);
        }
        return res;
      } else {
        setError(res.message);
        return res;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = async (provider = 'google', preferredRole = null) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise(r => setTimeout(r, 450));
      let targetRole = preferredRole;
      if (!targetRole) {
        const savedUser = localStorage.getItem('fairhire_user');
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser);
            if (parsed.role) targetRole = parsed.role;
          } catch (e) {}
        }
        if (!targetRole) targetRole = ROLES.CANDIDATE;
      }

      const oauthUser = {
        id: `USR-OAUTH-${Date.now().toString().slice(-4)}`,
        name: provider === 'google' ? 'Google User (Alex Morgan)' : 'GitHub Verified User',
        email: provider === 'google' ? 'alex.morgan@gmail.com' : 'alex.morgan@github.com',
        role: targetRole,
        provider
      };

      setUser(oauthUser);
      localStorage.setItem('fairhire_token', `mock-oauth-token-${provider}`);
      return { success: true, data: { user: oauthUser } };
    } catch (err) {
      setError(err.message || 'OAuth authentication failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register(payload);
      if (res.success) {
        const userRole = payload.role || ROLES.CANDIDATE;
        const newUser = {
          id: res.data.id,
          name: payload.fullName || (userRole === ROLES.RECRUITER ? 'Elena Rostova' : 'Alex Morgan'),
          email: payload.email,
          role: userRole,
          profile: payload
        };
        setUser(newUser);
        if (res.data.token) {
          localStorage.setItem('fairhire_token', res.data.token);
        }
        return res;
      } else {
        setError(res.message);
        return res;
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  const switchRole = (newRole) => {
    const roleNames = {
      [ROLES.CANDIDATE]: 'Alex Morgan',
      [ROLES.RECRUITER]: 'Elena Rostova (Recruiter)',
      [ROLES.INTERVIEWER]: 'Dr. Elena Rostova (Interviewer)',
      [ROLES.ADMIN]: 'Marcus Vance (Admin)'
    };
    const updatedUser = {
      ...user,
      role: newRole,
      name: roleNames[newRole] || user.name
    };
    setUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fairhire_user');
    localStorage.removeItem('fairhire_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || ROLES.CANDIDATE,
      isAuthenticated: !!user,
      loading,
      error,
      login,
      loginWithOAuth,
      register,
      switchRole,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};
