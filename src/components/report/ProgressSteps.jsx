import React from 'react';
import { Check, Loader2, Circle, AlertCircle } from 'lucide-react';

export default function ProgressSteps({
  steps,
  currentStepIndex = 2, // 0-indexed
  isComplete = false,
  error = null,
  className = '',
}) {
  return (
    <div className={`space-y-4 max-w-xl mx-auto ${className}`}>
      <div className="relative">
        <ul className="space-y-4" role="list">
          {steps.map((stepItem, index) => {
            const isFinished = isComplete || index < currentStepIndex;
            const isCurrent = !isComplete && index === currentStepIndex && !error;
            const isUpcoming = !isComplete && index > currentStepIndex;
            const isFailed = !!error && index === currentStepIndex;

            return (
              <li key={index} className="flex items-start gap-4 group">
                {/* Step indicator node */}
                <div className="relative flex items-center justify-center shrink-0">
                  {isFinished && (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {isCurrent && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-blue-100 shadow-sm animate-pulse">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  )}

                  {isUpcoming && (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 text-slate-400 flex items-center justify-center">
                      <Circle className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                  )}

                  {isFailed && (
                    <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center ring-4 ring-rose-100 shadow-sm">
                      <AlertCircle className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}

                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-6 transition-colors ${
                        index < currentStepIndex || isComplete ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className="pt-0.5 space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-semibold transition-colors ${
                        isCurrent
                          ? 'text-blue-700'
                          : isFinished
                          ? 'text-slate-800'
                          : isFailed
                          ? 'text-rose-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {stepItem.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                        In Progress
                      </span>
                    )}
                  </div>
                  {stepItem.description && (
                    <p
                      className={`text-xs transition-colors ${
                        isCurrent ? 'text-slate-600' : isFinished ? 'text-slate-500' : 'text-slate-400'
                      }`}
                    >
                      {stepItem.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
