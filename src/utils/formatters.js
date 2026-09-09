export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatScore = (score) => {
  if (score === undefined || score === null) return 'N/A';
  return Number(score).toFixed(1);
};

export const getScoreBadgeColor = (score) => {
  if (!score) return 'bg-slate-100 text-slate-700';
  if (score >= 8.5) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (score >= 7.0) return 'bg-teal-50 text-teal-700 border-teal-200';
  if (score >= 5.0) return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-rose-50 text-rose-700 border-rose-200';
};
