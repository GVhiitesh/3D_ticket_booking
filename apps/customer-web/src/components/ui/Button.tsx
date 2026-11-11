import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 select-none rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cv-accent focus-visible:ring-offset-2 focus-visible:ring-offset-cv-bg active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-sm sm:text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantStyles = {
    primary:
      'bg-cv-accent hover:bg-cv-accent-hover text-white shadow-[0_4px_18px_-2px_rgb(var(--cv-accent-rgb)/0.35)] hover:shadow-[0_6px_24px_-2px_rgb(var(--cv-accent-rgb)/0.45)] border border-transparent',
    secondary:
      'bg-cv-elevated hover:bg-cv-elevated-hover text-cv-primary border border-cv-border hover:border-cv-border-hover shadow-sm',
    outline:
      'bg-transparent hover:bg-cv-primary/[0.05] text-cv-secondary hover:text-cv-primary border border-cv-border hover:border-cv-border-hover',
    ghost:
      'bg-transparent hover:bg-cv-primary/[0.06] text-cv-secondary hover:text-cv-primary border border-transparent',
    danger:
      'bg-red-500/15 hover:bg-red-500/25 text-red-600 dark:text-red-400 border border-red-500/30',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};
