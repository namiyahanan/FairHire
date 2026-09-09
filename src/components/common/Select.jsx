import React from 'react';
import { ChevronDown } from 'lucide-react';

const Select = ({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option...',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-lg text-sm transition-all outline-none appearance-none pr-10 pl-3.5 py-2.5 bg-white border
            ${error ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'}
            disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            text-slate-800 ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const lbl = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={idx} value={val}>
                {lbl}
              </option>
            );
          })}
        </select>
        <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 pointer-events-none" />
      </div>

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Select;
