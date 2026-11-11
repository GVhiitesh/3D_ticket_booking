import React, { useEffect } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-cv-surface border border-cv-border rounded-3xl p-6 sm:p-8 shadow-elevated-xl flex flex-col gap-6 text-cv-primary`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-cv-elevated hover:bg-cv-elevated-hover text-cv-secondary hover:text-cv-primary flex items-center justify-center transition-colors border border-cv-border"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header */}
        {(title || subtitle) && (
          <div className="flex flex-col gap-1 pr-8">
            {subtitle && (
              <span className="text-[11px] font-semibold text-cv-accent uppercase tracking-wider">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-cv-primary">
                {title}
              </h2>
            )}
          </div>
        )}

        {/* Body */}
        <div className="w-full">{children}</div>
      </div>
    </div>
  );
};
