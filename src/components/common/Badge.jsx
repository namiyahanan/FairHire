import React from 'react';

const Badge = ({
  children,
  variant = 'default', // 'default' | 'success' | 'warning' | 'error' | 'info' | 'teal' | 'navy'
  size = 'md', // 'sm' | 'md'
  icon: Icon = null,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs font-medium',
    md: 'px-2.5 py-1 text-xs font-semibold'
  };

  const variantStyles = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-rose-50 text-rose-700 border-rose-200',
    info: 'bg-sky-50 text-sky-700 border-sky-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    navy: 'bg-navy-900 text-white border-navy-800'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}>
      {Icon && <Icon className="w-3 h-3" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
