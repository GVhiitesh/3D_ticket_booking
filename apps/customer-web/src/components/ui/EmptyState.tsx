import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'theaters',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="w-full p-12 sm:p-16 rounded-3xl bg-cv-surface border border-cv-border flex flex-col items-center justify-center text-center gap-4 shadow-card-subtle">
      <div className="w-16 h-16 rounded-2xl bg-cv-elevated border border-cv-border flex items-center justify-center text-cv-accent shadow-sm">
        <span className="material-symbols-outlined text-[32px]">{icon}</span>
      </div>
      <div className="flex flex-col gap-1 max-w-md">
        <h3 className="text-xl font-bold text-cv-primary tracking-tight">{title}</h3>
        <p className="text-sm text-cv-secondary leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary" size="md" className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
