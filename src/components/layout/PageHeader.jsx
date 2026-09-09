import React from 'react';

const PageHeader = ({
  title,
  subtitle,
  actions = null,
  badge = null,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200/70 ${className}`}>
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-extrabold text-navy-900 tracking-tight">
            {title}
          </h1>
          {badge && <div>{badge}</div>}
        </div>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-1 max-w-2xl font-normal leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex items-center gap-3 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
