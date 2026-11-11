import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'brand-solid' | 'ink' | 'neutral' | 'outline' | 'success' | 'warning' | 'vip';
  size?: 'sm' | 'md';
  pulse?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  pulse = false,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 font-sans font-semibold tracking-wider uppercase select-none rounded-md transition-colors';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-[11px] px-2.5 py-1',
  };

  const variantStyles = {
    brand:
      'bg-cv-accent/15 text-cv-accent border border-cv-accent/30 shadow-glow-orange-sm',
    'brand-solid':
      'bg-cv-accent text-white border border-transparent shadow-sm',
    ink:
      'bg-[#141414] text-white border border-[#141414] dark:border-white/15',
    neutral:
      'bg-cv-elevated text-cv-primary border border-cv-border',
    outline:
      'bg-transparent text-cv-secondary border border-cv-border',
    success:
      'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-600/30 dark:border-emerald-500/30',
    warning:
      'bg-amber-500/15 text-amber-800 dark:text-amber-400 border border-amber-600/30 dark:border-amber-500/30',
    vip:
      'bg-cv-amber/20 text-cv-amber dark:text-[#FFB596] border border-cv-amber/40',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
      )}
      {children}
    </span>
  );
};
