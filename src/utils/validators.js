export const validateEmail = (email) => {
  if (!email) return 'Email is required';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return 'Please enter a valid work email address';
  return '';
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters long';
  return '';
};

export const calculatePasswordStrength = (password) => {
  if (!password) return { score: 0, label: 'Empty', color: 'bg-slate-200' };
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 1) return { score: 20, label: 'Weak', color: 'bg-rose-500' };
  if (score <= 3) return { score: 60, label: 'Medium', color: 'bg-amber-500' };
  return { score: 100, label: 'Strong', color: 'bg-emerald-500' };
};

export const validatePhone = (phone) => {
  if (!phone) return 'Mobile number is required';
  const cleanPhone = phone.replace(/[\s\-()]/g, '');
  if (!/^\d{7,15}$/.test(cleanPhone)) return 'Please enter a valid mobile number';
  return '';
};

export const validateRequired = (value, fieldName = 'Field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};
