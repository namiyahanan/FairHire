import React from 'react';

const Loader = ({ size = 'md', color = 'navy', className = '' }) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3'
  };

  const colorStyles = {
    navy: 'border-navy-800 border-t-transparent',
    teal: 'border-teal-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    slate: 'border-slate-400 border-t-transparent'
  };

  return (
    <div className={`animate-spin rounded-full ${sizeStyles[size]} ${colorStyles[color]} ${className}`} />
  );
};

export default Loader;
