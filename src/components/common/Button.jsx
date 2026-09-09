import React from 'react';
import Loader from './Loader';

const Button = ({
  children,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'gradient' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  onClick,
  className = '',
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed select-none";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5"
  };

  const variantStyles = {
    primary: "bg-navy-800 hover:bg-navy-900 text-white focus:ring-navy-700 shadow-sm",
    gradient: "btn-primary-gradient text-white focus:ring-teal-500 shadow-md font-semibold",
    secondary: "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-400",
    outline: "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-navy-600 bg-white",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-300",
    danger: "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500 shadow-sm"
  };

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyle} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader size="sm" color={variant === 'outline' || variant === 'ghost' || variant === 'secondary' ? 'navy' : 'white'} />
          <span>{children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon className={size === 'sm' ? "w-3.5 h-3.5" : size === 'lg' ? "w-5 h-5" : "w-4 h-4"} />}
          <span>{children}</span>
        </>
      )}
    </button>
  );
};

export default Button;
