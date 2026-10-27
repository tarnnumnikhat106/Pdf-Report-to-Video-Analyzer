import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'info', onClose }) {
  const icons = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-accent" />,
    warning: <AlertTriangle className="h-4 w-4 shrink-0 text-attention" />,
    error: <AlertCircle className="h-4 w-4 shrink-0 text-danger" />,
    info: <Info className="h-4 w-4 shrink-0 text-ink-soft" />,
  };

  const accents = {
    success: 'border-l-accent',
    warning: 'border-l-attention',
    error: 'border-l-danger',
    info: 'border-l-ink-soft',
  };

  return (
    <div
      role="alert"
      className={`pointer-events-auto flex items-start gap-3 rounded-md border border-line border-l-2 bg-surface p-3.5 shadow-[0_18px_40px_-28px_rgba(28,27,24,0.55)] transition-all duration-300 animate-in slide-in-from-bottom-2 ${
        accents[type] || accents.info
      }`}
    >
      {icons[type] || icons.info}
      <div className="flex-1 pr-1 text-sm leading-relaxed text-ink">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="rounded-sm p-1 text-muted transition-colors hover:bg-paper-deep hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
