import React from 'react';
import { Check } from 'lucide-react';

const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  description,
  disabled = false,
  error = '',
  className = '',
  ...props
}) => {
  const checkboxId = id || name;

  return (
    <div className={`flex items-start gap-3 select-none ${className}`}>
      <div className="relative flex items-center mt-0.5">
        <input
          type="checkbox"
          id={checkboxId}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="peer sr-only"
          {...props}
        />
        <div
          onClick={() => !disabled && onChange({ target: { name, checked: !checked } })}
          className={`
            w-4 h-4 rounded border flex items-center justify-center transition-all cursor-pointer
            peer-focus:ring-2 peer-focus:ring-teal-200
            ${checked ? 'bg-teal-500 border-teal-500 text-white' : 'bg-white border-slate-300 hover:border-slate-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>

      {(label || description) && (
        <div className="flex flex-col text-sm cursor-pointer" onClick={() => !disabled && onChange({ target: { name, checked: !checked } })}>
          {label && <span className="font-medium text-slate-800">{label}</span>}
          {description && <span className="text-xs text-slate-500 mt-0.5">{description}</span>}
          {error && <span className="text-xs text-rose-600 font-medium mt-0.5">{error}</span>}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
