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
        aria-label="Medical Disclaimer"
        className={`bg-slate-900 text-slate-200 py-2.5 px-4 text-xs font-medium border-b border-slate-800 ${className}`}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Educational Tool Only:</strong> MedVision AI does not provide medical diagnoses, treatment plans, or clinical prescriptions.
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">
            Always consult a licensed physician regarding your test results.
          </span>
        </div>
      </aside>
    );
  }

  if (variant === 'compact') {
    return (
      <div 
        role="note"
        aria-label="Medical Disclaimer Note"
        className={`flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 ${className}`}
      >
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Notice:</strong> This explanation is generated for patient education and health literacy. It is not a clinical diagnosis and cannot replace a doctor's consultation.
        </p>
      </div>
    );
  }

  if (variant === 'callout') {
    return (
      <div 
        role="region"
        aria-label="Safety and Clinical Notice"
        className={`rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-amber-900 ${className}`}
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h4 className="font-semibold text-amber-900">Important Medical Safety Boundary</h4>
            <p className="text-amber-800/90 leading-relaxed">
              MedVision AI assists in understanding complex laboratory terminology. The system does not determine whether surgery is required, prescribe medications, predict cures, or provide a definitive medical verdict.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default 'card' presentation
  return (
    <div 
      role="region"
      aria-label="Clinical Decision Support Disclaimer"
      className={`rounded-xl border border-blue-100 bg-blue-50/60 p-5 ${className}`}
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 shrink-0">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="space-y-2 text-xs sm:text-sm text-slate-700">
          <h4 className="font-semibold text-slate-900 text-base">
            Medical Disclaimer & Clinical Decision Support Notice
          </h4>
          <p className="leading-relaxed text-slate-600">
            MedVision AI is an educational analysis system designed to promote patient health literacy and facilitate informed dialogues between patients and healthcare providers.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs">
            <li>It does <strong>not</strong> establish a physician-patient relationship.</li>
            <li>It does <strong>not</strong> recommend or prescribe medications.</li>
            <li>It cannot evaluate whether a procedure or surgery is indicated.</li>
            <li>Never alter, pause, or start medications based on this automated summary.</li>
          </ul>
          {showDoctorNote && (
            <p className="pt-1 text-xs font-medium text-blue-900">
              Please share these findings and discussion points directly with your treating physician.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
