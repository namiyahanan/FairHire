import { supabase } from './supabaseClient.js';
import { ROLES } from '../utils/constants.js';

const CREDENTIALS_KEY = 'fairhire_registered_accounts';

// Seed demo accounts if not already present
export const getStoredAccounts = () => {
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('[FairHire Auth] Failed to read stored accounts', e);
  }

  // Default seed accounts for out-of-the-box demo
  const initialSeeds = [
    {
      id: 'USR-CAND-DEMO',
      candidateId: 'candidate-001',
      email: 'alex.morgan@gmail.com',
      password: 'Password123!',
      fullName: 'Alex Morgan',
      role: ROLES.CANDIDATE,
      provider: 'credentials',
      details: {
        skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS'],
        degree: 'B.Tech Computer Science',
        graduationYear: '2024',
        experienceType: 'fresher'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'USR-REC-DEMO',
      email: 'elena.rostova@fairhire.io',
      password: 'Password123!',
      fullName: 'Elena Rostova',
      role: ROLES.RECRUITER,
      provider: 'credentials',
      details: {
        companyName: 'FairHire Tech',
        designation: 'Head of Talent Acquisition'
      },
      createdAt: new Date().toISOString()
    }
  ];

  try {
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(initialSeeds));
  } catch (e) {}

  return initialSeeds;
};

export const saveStoredAccount = (account) => {
  const accounts = getStoredAccounts();
  const existingIndex = accounts.findIndex(
    a => a.email.toLowerCase() === account.email.toLowerCase()
  );

  if (existingIndex >= 0) {
    accounts[existingIndex] = {
      ...accounts[existingIndex],
      ...account,
      updatedAt: new Date().toISOString()
    };
  } else {
    accounts.push({
      ...account,
      createdAt: new Date().toISOString()
    });
  }

  localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(accounts));
};

export const findStoredAccountByEmail = (email) => {
  if (!email) return null;
  const accounts = getStoredAccounts();
  const target = email.trim().toLowerCase();
  return accounts.find(a => a.email && a.email.toLowerCase() === target) || null;
};

/**
 * Register a user:
 * 1. Attempts Supabase Auth signUp to record in Supabase auth.users
 * 2. If Candidate, saves profile into Supabase candidate_profiles table
 * 3. Persists account in the credentials store for reliable instant sign-in
 */
export const registerUser = async (payload) => {
  const email = (payload.email || '').trim().toLowerCase();
  const password = payload.password || 'FairHire@2026';
  const role = payload.role || ROLES.CANDIDATE;
  const fullName = payload.fullName || (role === ROLES.RECRUITER ? 'Recruiter' : 'Candidate');
  const phone = payload.mobile ? `${payload.countryCode || '+91'} ${payload.mobile}` : null;

  // Check if account already exists locally
  const existing = findStoredAccountByEmail(email);
  if (existing) {
    return {
      success: false,
      message: 'An account with this email already exists. Please sign in instead.'
    };
  }

  let supabaseUserId = null;
  let candidateId = `cand-${Date.now().toString().slice(-6)}`;

  // 1. Supabase Auth signUp
  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
          phone,
          candidate_id: candidateId
        }
      }
    });

    if (authError) {
      console.warn('[FairHire Auth] Supabase auth.signUp note:', authError.message);
    } else if (authData?.user?.id) {
      supabaseUserId = authData.user.id;
      candidateId = authData.user.id;
    }
  } catch (err) {
    console.warn('[FairHire Auth] Supabase auth exception:', err);
  }

  // 2. If Candidate, sync profile to Supabase candidate_profiles table
  if (role === ROLES.CANDIDATE) {
    try {
      const skillsArray = Array.isArray(payload.details?.primarySkills)
        ? payload.details.primarySkills
        : typeof payload.details?.primarySkills === 'string'
        ? payload.details.primarySkills.split(',').map(s => s.trim()).filter(Boolean)
        : ['Frontend', 'JavaScript', 'Problem Solving'];

      const profilePayload = {
        candidate_id: candidateId,
        full_name: fullName,
        email,
        phone,
        track_id: payload.experienceType === 'experienced' ? 'ENGINEERING-EXP' : 'WEB-FRESHER',
        skills: skillsArray,
        education: payload.details?.degree
          ? [{ degree: payload.details.degree, institution: payload.details.institution || 'University', year: payload.details.graduationYear || '2025' }]
          : null,
        total_experience_years: payload.experienceType === 'experienced' ? 3 : 0,
        status: 'registered'
      };

      // Check if candidate profile already exists with this email
      const { data: existingProf } = await supabase
        .from('candidate_profiles')
        .select('candidate_id')
        .eq('email', email)
        .maybeSingle();

      if (existingProf?.candidate_id) {
        const { error: updateErr } = await supabase
          .from('candidate_profiles')
          .update(profilePayload)
          .eq('candidate_id', existingProf.candidate_id);

        if (updateErr) {
          console.warn('[FairHire Auth] candidate_profiles update note:', updateErr.message);
        } else {
          console.log('[FairHire Auth] candidate profile updated in Supabase candidate_profiles');
        }
      } else {
        const { error: insertErr } = await supabase
          .from('candidate_profiles')
          .insert(profilePayload);

        if (insertErr) {
          console.warn('[FairHire Auth] candidate_profiles insert note:', insertErr.message);
        } else {
          console.log('[FairHire Auth] candidate profile inserted into Supabase candidate_profiles');
        }
      }

    } catch (candErr) {
      console.warn('[FairHire Auth] candidate_profiles sync skipped:', candErr);
    }
  }

  // 3. Save into persistent credential storage
  const newAccount = {
    id: supabaseUserId || `USR-${role.toUpperCase().slice(0, 4)}-${Date.now().toString().slice(-4)}`,
    candidateId,
    email,
    password, // Stored for instant login fallback
    fullName,
    role,
    phone,
    provider: 'credentials',
    details: payload.details || {},
    experienceType: payload.experienceType,
    token: `fht_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  };

  saveStoredAccount(newAccount);

  const userSession = {
    id: newAccount.id,
    candidateId: newAccount.candidateId,
    name: newAccount.fullName,
    email: newAccount.email,
    role: newAccount.role,
    phone: newAccount.phone,
    profile: payload,
    provider: 'credentials'
  };

  return {
    success: true,
    data: {
      user: userSession,
      token: newAccount.token
    },
    message: role === ROLES.RECRUITER
      ? 'Recruiter account registered and configured successfully.'
      : 'Candidate account registered successfully.'
  };
};

/**
 * Login user:
 * 1. Checks Supabase Auth signInWithPassword
 * 2. If Supabase fails (e.g. Email not confirmed, offline), authenticates against credential store
 * 3. Supports demo accounts
 */
export const loginUser = async (email, password, preferredRole = null) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  if (!cleanEmail || !cleanPass) {
    return {
      success: false,
      message: 'Email and password are required.'
    };
  }

  let authenticatedAccount = null;

  // 1. Try Supabase Auth signInWithPassword
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass
    });

    if (!authError && authData?.user) {
      const sbUser = authData.user;
      const meta = sbUser.user_metadata || {};
      authenticatedAccount = {
        id: sbUser.id,
        email: sbUser.email,
        fullName: meta.full_name || meta.name || cleanEmail.split('@')[0],
        role: meta.role || preferredRole || ROLES.CANDIDATE,
        token: authData.session?.access_token || `token_${Date.now()}`
      };
    } else if (authError) {
      console.log('[FairHire Auth] Supabase password signin note:', authError.message);
    }
  } catch (err) {
    console.warn('[FairHire Auth] Supabase sign in error, checking local store:', err);
  }

  // 2. If not authenticated via Supabase, check local credential store
  if (!authenticatedAccount) {
    const stored = findStoredAccountByEmail(cleanEmail);
    if (stored) {
      if (stored.password === cleanPass) {
        authenticatedAccount = stored;
      } else {
        return {
          success: false,
          message: 'Incorrect password. Please verify your credentials and try again.'
        };
      }
    }
  }

  // 3. Check demo fallbacks
  if (!authenticatedAccount) {
    if (cleanEmail === 'alex.morgan@gmail.com' && cleanPass === 'Password123!') {
      authenticatedAccount = {
        id: 'USR-CAND-DEMO',
        candidateId: 'candidate-001',
        email: 'alex.morgan@gmail.com',
        fullName: 'Alex Morgan',
        role: ROLES.CANDIDATE
      };
    } else if (cleanEmail === 'elena.rostova@fairhire.io' && cleanPass === 'Password123!') {
      authenticatedAccount = {
        id: 'USR-REC-DEMO',
        email: 'elena.rostova@fairhire.io',
        fullName: 'Elena Rostova',
        role: ROLES.RECRUITER
      };
    }
  }

  if (!authenticatedAccount) {
    return {
      success: false,
      message: 'No account found with this email. Please check your email or click "Get Started" to register.'
    };
  }

  const role = authenticatedAccount.role || preferredRole || ROLES.CANDIDATE;

  // Try to read candidate profile from Supabase to enrich session
  let candidateData = null;
  if (role === ROLES.CANDIDATE) {
    try {
      const { data: prof } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (prof) candidateData = prof;
    } catch (e) {}
  }

  const user = {
    id: authenticatedAccount.id || `USR-${Date.now()}`,
    candidateId: authenticatedAccount.candidateId || candidateData?.candidate_id || `cand-${cleanEmail.replace(/[^a-z0-9]/g, '').slice(0, 10)}`,
    name: authenticatedAccount.fullName || authenticatedAccount.name || (role === ROLES.RECRUITER ? 'Elena Rostova' : 'Alex Morgan'),
    email: cleanEmail,
    role,
    phone: authenticatedAccount.phone || candidateData?.phone,
    profile: candidateData || authenticatedAccount.details || {},
    provider: authenticatedAccount.provider || 'credentials'
  };

  const token = authenticatedAccount.token || `fht_${Date.now()}`;

  return {
    success: true,
    data: {
      user,
      token
    },
    message: 'Signed in successfully.'
  };
};

/**
 * Handle Google OAuth Sign-in:
 * 1. Checks if Supabase OAuth is supported & enabled
 * 2. If configured, triggers window.location redirect via Supabase
 * 3. Returns { providerEnabled: boolean, redirectUrl?: string, error?: string }
 */
export const initiateGoogleOAuth = async (options = {}) => {
  const redirectTo = options.redirectTo || `${window.location.origin}/login`;
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent'
        }
      }
    });

    if (error) {
      const isNotEnabled = (error.message || '').toLowerCase().includes('not enabled') ||
        (error.message || '').toLowerCase().includes('validation_failed');
      return {
        success: false,
        providerEnabled: !isNotEnabled,
        message: error.message
      };
    }

    if (data?.url) {
      return {
        success: true,
        providerEnabled: true,
        url: data.url
      };
    }

    return { success: false, providerEnabled: false, message: 'No OAuth URL returned' };
  } catch (err) {
    return {
      success: false,
      providerEnabled: false,
      message: err.message || 'Google OAuth initialization failed'
    };
  }
};

/**
 * Complete Google Sign-In with given profile data:
 * Used both when returning from live Google OAuth or via Google Account selector
 */
export const loginWithGoogleProfile = async (googleProfile, preferredRole = ROLES.CANDIDATE) => {
  const email = (googleProfile.email || '').trim().toLowerCase();
  const fullName = googleProfile.name || googleProfile.fullName || 'Google User';
  const role = preferredRole || ROLES.CANDIDATE;
  const candidateId = `cand-g-${email.replace(/[^a-z0-9]/g, '').slice(0, 10)}`;

  // Check if candidate already has a profile in Supabase
  let candidateData = null;
  if (role === ROLES.CANDIDATE) {
    try {
      const { data: existingProf } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (existingProf) {
        candidateData = existingProf;
      } else {
        // Create candidate_profiles entry
        const { data: newProf } = await supabase
          .from('candidate_profiles')
          .insert({
            candidate_id: candidateId,
            full_name: fullName,
            email,
            track_id: 'WEB',
            skills: ['React', 'JavaScript', 'Web Development'],
            status: 'registered'
          })
          .select()
          .maybeSingle();

        if (newProf) candidateData = newProf;
      }
    } catch (e) {
      console.warn('[FairHire Auth] Google profile candidate_profiles sync note:', e);
    }
  }

  // Save/Update in credential store
  const account = {
    id: googleProfile.id || `USR-G-${Date.now().toString().slice(-4)}`,
    candidateId,
    email,
    fullName,
    role,
    avatar: googleProfile.picture || googleProfile.avatar || null,
    provider: 'google',
    details: candidateData || {},
    token: `google_oauth_${Date.now()}`
  };

  saveStoredAccount(account);

  const user = {
    id: account.id,
    candidateId,
    name: fullName,
    email,
    role,
    avatar: account.avatar,
    profile: candidateData || {},
    provider: 'google'
  };

  return {
    success: true,
    data: {
      user,
      token: account.token
    },
    message: 'Signed in with Google successfully.'
  };
};
