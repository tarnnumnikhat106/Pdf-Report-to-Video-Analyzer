import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({
  title = "Analyzing medical document...",
  subtitle = "Our multi-stage pipeline is evaluating parameters and reference ranges.",
  className = "",
  inline = false,
}) {
  if (inline) {
    return (
      <div className={`flex items-center gap-3 py-4 text-slate-600 ${className}`}>
        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
        <span className="text-sm font-medium">{title}</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
        <div className="absolute -inset-2 bg-blue-500/10 rounded-3xl -z-10 animate-pulse" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-md leading-relaxed">{subtitle}</p>
    </div>
  );
}
