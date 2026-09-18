import React, { createContext, useState, useEffect } from 'react';
import { authApi } from '../services/authApi';
import {
  initiateGoogleOAuth,
  loginWithGoogleProfile,
  findStoredAccountByEmail
} from '../services/authService';
import { supabase } from '../services/supabaseClient';
import { ROLES } from '../utils/constants';
import { clearUserApplications } from '../services/applicationStore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Only load if explicitly authenticated in the active session
    const savedSession = sessionStorage.getItem('fairhire_user');
    if (savedSession) {
      try { return JSON.parse(savedSession); } catch (e) {}
    }
    const savedLocal = localStorage.getItem('fairhire_user');
    if (savedLocal) {
      try { return JSON.parse(savedLocal); } catch (e) {}
    }
    return null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Sync user state changes to storage
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

  // Helper to process session from Supabase (including OAuth redirects)
  const processSupabaseSession = async (session) => {
    if (!session?.user) return;
    const sbUser = session.user;
    const meta = sbUser.user_metadata || {};
    const email = sbUser.email;
    const fullName = meta.full_name || meta.name || email?.split('@')[0] || 'Google User';

    // Determine role: metadata -> saved OAuth preference -> stored account -> default CANDIDATE
    let resolvedRole = meta.role;
    if (!resolvedRole) {
      const storedOAuthRole = localStorage.getItem('fairhire_oauth_role');
      if (storedOAuthRole) {
        resolvedRole = storedOAuthRole;
        localStorage.removeItem('fairhire_oauth_role');
      }
    }
    if (!resolvedRole) {
      const stored = findStoredAccountByEmail(email);
      resolvedRole = stored?.role || ROLES.CANDIDATE;
    }

    const candidateId = meta.candidate_id || `cand-g-${email.replace(/[^a-z0-9]/g, '').slice(0, 10)}`;

    // If candidate, ensure candidate_profiles row exists in Supabase
    if (resolvedRole === ROLES.CANDIDATE) {
      try {
        const { data: existingProf } = await supabase
          .from('candidate_profiles')
          .select('candidate_id')
          .eq('email', email)
          .maybeSingle();

        if (!existingProf) {
          await supabase.from('candidate_profiles').insert({
            candidate_id: candidateId,
            full_name: fullName,
            email,
            track_id: 'WEB',
            skills: ['React', 'JavaScript', 'Web Development'],
            status: 'registered'
          });
        }
      } catch (e) {
        console.warn('[FairHire Auth] Supabase candidate_profiles sync note:', e);
      }
    }

    const authenticatedUser = {
      id: sbUser.id,
      candidateId,
      name: fullName,
      email: email,
      role: resolvedRole,
      avatar: meta.avatar_url || meta.picture || null,
      provider: sbUser.app_metadata?.provider || 'google',
      token: session.access_token
    };

    setUser(authenticatedUser);
    sessionStorage.setItem('fairhire_user', JSON.stringify(authenticatedUser));
    localStorage.setItem('fairhire_user', JSON.stringify(authenticatedUser));
    if (session.access_token) {
      sessionStorage.setItem('fairhire_token', session.access_token);
      localStorage.setItem('fairhire_token', session.access_token);
    }
  };

  // Listen to Supabase Auth state events (such as OAuth redirects)
  useEffect(() => {
    // 1. Check current session immediately on mount
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        await processSupabaseSession(session);
      }
      setAuthInitialized(true);
    }).catch(() => {
      setAuthInitialized(true);
    });

    // 2. Subscribe to auth events
    let authListener = null;
    try {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user && (
          event === 'SIGNED_IN' ||
          event === 'INITIAL_SESSION' ||
          event === 'TOKEN_REFRESHED' ||
          event === 'USER_UPDATED'
        )) {
          await processSupabaseSession(session);
        } else if (event === 'SIGNED_OUT') {
          // Handled via logout()
        }
      });
      authListener = data?.subscription;
    } catch (err) {
      console.warn('[FairHire Auth] Supabase onAuthStateChange initialization note:', err);
    }

    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);


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
          const stored = findStoredAccountByEmail(emailLower);
          if (stored?.role) resolvedRole = stored.role;
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
      const msg = err.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = async (provider = 'google', preferredRole = null) => {
    setLoading(true);
    setError(null);
    try {
      if (preferredRole) {
        localStorage.setItem('fairhire_oauth_role', preferredRole);
      }
      if (provider === 'google') {
        const oauthRes = await initiateGoogleOAuth({
          redirectTo: `${window.location.origin}/login`
        });

        // If provider is active and URL returned, redirect
        if (oauthRes.success && oauthRes.url) {
          window.location.href = oauthRes.url;
          return { success: true, redirecting: true };
        }


        // If provider is not enabled in Supabase yet, return details for fallback
        if (!oauthRes.providerEnabled) {
          return {
            success: false,
            providerNotConfigured: true,
            message: oauthRes.message || 'Google provider is not enabled in Supabase Dashboard.'
          };
        }
      }

      // Generic fallback for other providers or if simulated
      const fallbackUser = {
        name: provider === 'google' ? 'Google User' : 'GitHub User',
        email: provider === 'google' ? 'google.user@gmail.com' : 'github.user@github.com'
      };
      const res = await loginWithGoogleProfile(fallbackUser, preferredRole || ROLES.CANDIDATE);
      if (res.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('fairhire_token', res.data.token);
        }
      }
      return res;
    } catch (err) {
      const msg = err.message || 'OAuth authentication failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogleDirect = async (profile, preferredRole = ROLES.CANDIDATE) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginWithGoogleProfile(profile, preferredRole);
      if (res.success) {
        setUser(res.data.user);
        if (res.data.token) {
          localStorage.setItem('fairhire_token', res.data.token);
        }
      } else {
        setError(res.message);
      }
      return res;
    } catch (err) {
      const msg = err.message || 'Google sign-in failed';
      setError(msg);
      return { success: false, message: msg };
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
      const msg = err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
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
      name: roleNames[newRole] || user?.name || 'FairHire User'
    };
    setUser(updatedUser);
  };

  const logout = async () => {
    try {
      // Clear this user's per-user application store BEFORE clearing auth
      // so the userId can still be resolved from storage during cleanup
      clearUserApplications();
      await supabase.auth.signOut();
    } catch (e) {}
    setUser(null);
    sessionStorage.removeItem('fairhire_user');
    sessionStorage.removeItem('fairhire_token');
    localStorage.removeItem('fairhire_user');
    localStorage.removeItem('fairhire_token');
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || ROLES.CANDIDATE,
      isAuthenticated: !!user,
      authInitialized,
      loading,
      error,
      login,

      loginWithOAuth,
      signInWithGoogleDirect,
      register,
      switchRole,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

