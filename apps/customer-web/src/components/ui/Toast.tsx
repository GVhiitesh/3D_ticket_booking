import React, { createContext, useContext, useState, useCallback } from 'react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}

interface ToastContextType {
  toast: (options: { type?: ToastMessage['type']; title?: string; message: string; duration?: number }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 4500,
    }: {
      type?: ToastMessage['type'];
      title?: string;
      message: string;
      duration?: number;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setToasts((prev) => [...prev, { id, type, title, message }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => {
          const borderColors = {
            success: 'border-emerald-600/35 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-400',
            error: 'border-red-600/35 dark:border-red-500/40 text-red-600 dark:text-red-400',
            warning: 'border-amber-600/35 dark:border-amber-500/40 text-amber-700 dark:text-amber-400',
            info: 'border-cv-accent/40 text-cv-accent',
          };
          const icons = {
            success: 'check_circle',
            error: 'error',
            warning: 'warning',
            info: 'info',
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl bg-cv-surface/95 border ${borderColors[t.type]} shadow-elevated-xl backdrop-blur-xl transition-all animate-fade-in`}
            >
              <span className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${borderColors[t.type]}`}>
                {icons[t.type]}
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                {t.title && <strong className="text-xs font-semibold text-cv-primary">{t.title}</strong>}
                <p className="text-xs text-cv-secondary leading-relaxed">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-cv-muted hover:text-cv-primary transition-colors text-xs"
              >
                &times;
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
