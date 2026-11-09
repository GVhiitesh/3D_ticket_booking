import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'brand' | 'neutral' | 'outline' | 'success' | 'warning' | 'vip';
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
      'bg-[#FF6500]/15 text-[#FF6500] border border-[#FF6500]/30 shadow-[0_0_12px_-2px_rgba(255,101,0,0.25)]',
    neutral:
      'bg-[#181818] text-[#FFFFFF] border border-[#222222]',
    outline:
      'bg-transparent text-[#A0A0A0] border border-[#222222]',
    success:
      'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    warning:
      'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    vip:
      'bg-[#B94700]/25 text-[#FFB596] border border-[#B94700]/50 shadow-[0_0_15px_rgba(185,71,0,0.3)]',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6500] animate-pulse shrink-0" />
      )}
      {children}
    </span>
  );
};
