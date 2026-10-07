import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Stethoscope, 
  FileWarning, 
  UserCheck, 
  Info,
  HeartPulse
} from 'lucide-react';
import Card from '../components/common/Card';
import Disclaimer from '../components/common/Disclaimer';

export default function PrivacySafetyPage() {
  const safetyPrinciples = [
    {
      title: "Educational & Information Scope Only",
      desc: "MedVision AI is created exclusively to improve health literacy, demystify clinical abbreviations, and help patients formulate insightful questions for their consultations. It does not replace a clinical examination or professional medical judgment.",
      icon: Stethoscope,
      accent: "text-blue-600 bg-blue-50 border-blue-200",
    },
    {
      title: "Sensitive Medical Data Awareness",
      desc: "Medical reports contain deeply personal protected health information (PHI), including names, dates of birth, clinical observations, and diagnosis histories. Treat these documents with care and ensure you only upload reports that belong to you or for which you have explicit legal consent.",
      icon: Lock,
      accent: "text-amber-600 bg-amber-50 border-amber-200",
    },
    {
      title: "AI Limitations & Potential Errors",
      desc: "Artificial intelligence systems, optical character recognition (OCR) engines, and natural language models are probabilistic. They can misread blurred scans, overlook subtle handwritten notes, or miss patient-specific co-morbidities. Always cross-verify critical numbers against your physical printed lab sheets.",
      icon: AlertTriangle,
      accent: "text-rose-600 bg-rose-50 border-rose-200",
    },
    {
      title: "Treatment Decisions Lie with Healthcare Professionals",
      desc: "Never alter, stop, or initiate prescription medications, dosage schedules, dietary restrictions, or medical procedures based on an AI-generated explanation. Only a licensed physician or specialist who understands your complete medical history can make diagnostic and therapeutic decisions.",
      icon: HeartPulse,
      accent: "text-emerald-600 bg-emerald-50 border-emerald-200",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      
      {/* Page Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Patient Trust & Ethical AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Privacy, Safety & Clinical Boundaries
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Clear disclosures regarding patient data handling, machine learning boundaries, and responsible health decision support.
        </p>
      </div>

      {/* Safety Principles Grid */}
      <div className="space-y-4">
        {safetyPrinciples.map((item, idx) => {
          const Icon = item.icon;
          return (
            <Card key={idx} padding="p-6" className="border-slate-200 space-y-3">
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl border shrink-0 ${item.accent}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Regulatory Compliance & Storage Transparency */}
      <Card padding="p-6 sm:p-8" className="border-slate-200 bg-slate-50/70 space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold">
          <Info className="w-5 h-5 text-blue-600" />
          <h2 className="text-base">Compliance Disclosure & Data Handling</h2>
        </div>
        
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In this developmental demonstration environment:
        </p>

        <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <li>
            <strong>No Unnecessary LocalStorage PHI:</strong> We refrain from storing sensitive patient identifiers in insecure browser caches or public browser storage.
          </li>
          <li>
            <strong>Realistic Regulatory Transparency:</strong> We do not make premature claims of HIPAA, GDPR, or SOC2 certification until formal third-party clinical compliance audits and business associate agreements (BAAs) are executed on the production cloud backend.
          </li>
          <li>
            <strong>Ephemeral Ingestion:</strong> Files uploaded in demo mode are processed ephemerally for session analysis and are not cataloged into public machine learning training datasets.
          </li>
        </ul>
      </Card>

      {/* Safety Banner */}
      <Disclaimer variant="callout" />

    </div>
  );
}
