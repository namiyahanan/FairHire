import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { calculatePasswordStrength } from '../../utils/validators';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  helperText = '',
  required = false,
  disabled = false,
  showPasswordStrength = false,
  icon: Icon = null,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  const strength = isPasswordType && showPasswordStrength ? calculatePasswordStrength(value) : null;

  return (
    <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold uppercase tracking-wider text-slate-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-lg text-sm transition-all outline-none
            ${Icon ? 'pl-9' : 'pl-3.5'}
            ${isPasswordType ? 'pr-10' : 'pr-3.5'}
            py-2.5 bg-white border
            ${error ? 'border-rose-400 focus:ring-2 focus:ring-rose-200' : 'border-slate-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'}
            disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed
            placeholder:text-slate-400 text-slate-800
            ${className}
          `}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {strength && value && (
        <div className="flex flex-col gap-1 mt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Password Strength:</span>
            <span className="font-medium text-slate-700">{strength.label}</span>
          </div>
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-300 ${strength.color}`} style={{ width: `${strength.score}%` }} />
          </div>
        </div>
      )}

      {error ? (
        <p className="text-xs text-rose-600 font-medium">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;
