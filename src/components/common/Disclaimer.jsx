import React from 'react';
import { ShieldAlert, AlertCircle, Info, Stethoscope } from 'lucide-react';

export default function Disclaimer({
  variant = 'card', // 'card' | 'banner' | 'compact' | 'callout'
  className = '',
  showDoctorNote = true,
}) {
  if (variant === 'banner') {
    return (
      <aside
        aria-label="Medical disclaimer"
        className={`border-b border-ink bg-ink px-4 py-2 text-[11px] text-paper/70 ${className}`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-center gap-2 text-center sm:justify-between sm:text-left">
          <span className="flex items-center gap-2">
            <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-[#e0b374]" />
            <span>
              <span className="font-semibold text-paper/90">Educational tool.</span>{' '}
              Not a diagnosis, treatment plan, or prescription.
            </span>
          </span>
          <span className="hidden text-paper/45 sm:inline">
            Talk to a clinician about your results.
          </span>
        </div>
      </aside>
    );
  }

  if (variant === 'compact') {
    return (
      <div
        role="note"
        aria-label="Medical disclaimer note"
        className={`flex items-start gap-2.5 rounded-md border border-line bg-paper p-3 text-xs text-ink-soft ${className}`}
      >
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-ink">Note:</strong> This explanation
          is for education. It is not a diagnosis and does not replace a consultation.
        </p>
      </div>
    );
  }

  if (variant === 'callout') {
    return (
      <div
        role="region"
        aria-label="Safety notice"
        className={`rounded-lg border border-attention/30 bg-attention-soft/70 p-4 text-attention ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-semibold">Read this as context, not care</h4>
            <p className="leading-relaxed text-attention/85">
              MedVision helps you understand laboratory terms. It does not decide
              whether surgery is needed, prescribe medication, or give a definitive
              verdict.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="region"
      aria-label="Medical disclaimer"
      className={`rounded-lg border border-line bg-surface p-5 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="shrink-0 rounded-md bg-accent-soft p-2.5 text-accent-deep">
          <Stethoscope className="h-5 w-5" />
        </div>
        <div className="space-y-2 text-xs text-ink-soft sm:text-sm">
          <h4 className="font-display text-lg tracking-tight text-ink">
            Not medical advice
          </h4>
          <p className="leading-relaxed">
            This tool explains what your lab values mean. It does not establish a
            doctor-patient relationship or replace your clinician&apos;s reading of the
            report.
          </p>
          <ul className="list-disc space-y-1 pl-5 text-xs leading-relaxed text-muted">
            <li>It does not diagnose a condition.</li>
            <li>It does not recommend or adjust medication.</li>
            <li>It cannot say whether a procedure or surgery is needed.</li>
            <li>Do not start, stop, or change treatment based on this summary.</li>
          </ul>
          {showDoctorNote && (
            <p className="pt-1 text-xs font-medium text-accent-deep">
              Bring these notes to your treating clinician.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
