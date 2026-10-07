import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({
  title = "Unable to process report",
  message = "An unexpected error occurred during processing. Please try again or verify that your file is an unobstructed medical report.",
  onRetry,
  className = "",
}) {
  return (
    <div className={`p-8 text-center bg-white rounded-2xl border border-rose-200 shadow-xs max-w-lg mx-auto ${className}`}>
      <div className="w-12 h-12 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-900 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-600 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" icon={RotateCcw} size="sm">
          Try Again
        </Button>
      )}
    </div>
  );
}
