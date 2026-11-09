import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#A0A0A0]">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3.5 text-[#707070] pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#0B0B0B] text-white placeholder-[#707070] text-sm rounded-xl border border-[#222222] transition-colors focus:border-[#FF6500] focus:ring-1 focus:ring-[#FF6500] focus:outline-none disabled:opacity-50 disabled:bg-[#111111] ${
              leftIcon ? 'pl-10' : 'pl-4'
            } ${rightIcon ? 'pr-10' : 'pr-4'} py-2.5 ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-[#707070] flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-[11px] text-red-400 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-[#707070]">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
