import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div className={`animate-pulse bg-slate-200 ${variantStyles[variant]} ${className}`} />
  );
};

export default Skeleton;
