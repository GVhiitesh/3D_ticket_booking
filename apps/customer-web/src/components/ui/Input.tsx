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
          <label htmlFor={inputId} className="text-xs font-medium text-cv-secondary">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          {leftIcon && (
            <span className="absolute left-3.5 text-cv-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-cv-bg-subtle text-cv-primary placeholder-cv-muted text-sm rounded-xl border border-cv-border transition-colors focus:border-cv-accent focus:ring-1 focus:ring-cv-accent focus:outline-none disabled:opacity-50 disabled:bg-cv-surface ${
              leftIcon ? 'pl-10' : 'pl-4'
            } ${rightIcon ? 'pr-10' : 'pr-4'} py-2.5 ${
              error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 text-cv-muted flex items-center justify-center">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <span className="text-[11px] text-red-600 dark:text-red-400 font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-[11px] text-cv-muted">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
