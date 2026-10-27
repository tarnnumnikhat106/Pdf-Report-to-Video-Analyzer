import React, { useState } from 'react';
import {
  FileSearch,
  BookOpen,
  HelpCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Copy
} from 'lucide-react';
import Modal from '../common/Modal';
import SeverityBadge from '../common/SeverityBadge';
import Disclaimer from '../common/Disclaimer';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

export default function FindingDetailModal({
  isOpen,
  onClose,
  finding,
}) {
  const { addToast } = useToast();
  const [openSections, setOpenSections] = useState({
    whatFound: true,
    termMeaning: true,
    whyItMatters: true,
    doctorQuestions: true,
    biologicalContext: false,
  });

  if (!finding) return null;

  const toggleSection = (sectionKey) => {
    setOpenSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const handleCopyQuestions = () => {
    if (!finding.doctorDiscussionPoints || finding.doctorDiscussionPoints.length === 0) return;
    const questionsText = finding.doctorDiscussionPoints
      .map((q, i) => `${i + 1}. ${q}`)
      .join('\n');
    
    navigator.clipboard.writeText(`Questions for Dr regarding ${finding.name}:\n\n${questionsText}`);
    addToast('Discussion questions copied to clipboard', 'success');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={finding.name}
      subtitle={`Detailed Educational Breakdown • ${finding.category || 'Laboratory Analysis'}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Top Summary Header Strip */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Reported Finding
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 font-mono">
                  {finding.value}
                </span>
                <span className="text-sm font-semibold text-slate-700">
                  {finding.unit}
                </span>
              </div>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Reference Interval
            </span>
            <span className="text-sm font-bold text-slate-800 font-mono">
              {finding.referenceRange}
            </span>
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
              Attention Level
            </span>
            <SeverityBadge status={finding.status} size="md" />
          </div>
        </div>

        {/* Section 1: What was found? */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('whatFound')}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/70 hover:bg-slate-100/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <FileSearch className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">
                1. What was found?
              </h3>
            </div>
            {openSections.whatFound ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          {openSections.whatFound && (
            <div className="p-5 border-t border-slate-100 space-y-2 text-sm text-slate-700 leading-relaxed">
              <p className="font-medium text-slate-900">
                {finding.technicalSummary || finding.simpleExplanation}
              </p>
              <p className="text-slate-600">
                {finding.detailedDescription || finding.simpleExplanation}
              </p>
            </div>
          )}
        </div>

        {/* Section 2: What does this term mean? */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('termMeaning')}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/70 hover:bg-slate-100/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">
                2. What does this term mean?
              </h3>
            </div>
            {openSections.termMeaning ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          {openSections.termMeaning && (
            <div className="p-5 border-t border-slate-100 space-y-2 text-sm text-slate-600 leading-relaxed">
              <p>
                {finding.simpleExplanation}
              </p>
              {finding.biologicalContext && (
                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <strong>Biological role:</strong> {finding.biologicalContext}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Why can it matter? */}
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
          <button
            type="button"
            onClick={() => toggleSection('whyItMatters')}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/70 hover:bg-slate-100/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                3. Why can it matter?
              </h3>
            </div>
            {openSections.whyItMatters ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
          </button>
          {openSections.whyItMatters && (
            <div className="p-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
              <p>
                {finding.whyItMatters || "Understanding this parameter helps evaluate trends over time and contextualize how metabolic and organ functions interact with daily wellness."}
              </p>
            </div>
          )}
        </div>

        {/* Section 4: What should the user discuss with a doctor? */}
        <div className="border border-blue-200 rounded-xl overflow-hidden bg-blue-50/20">
          <button
            type="button"
            onClick={() => toggleSection('doctorQuestions')}
            className="w-full flex items-center justify-between px-5 py-4 bg-blue-50/80 hover:bg-blue-100/60 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4 text-blue-700" />
              <h3 className="text-sm font-bold text-blue-900">
                4. What should you discuss with your doctor?
              </h3>
            </div>
            {openSections.doctorQuestions ? <ChevronUp className="w-4 h-4 text-blue-700" /> : <ChevronDown className="w-4 h-4 text-blue-700" />}
          </button>
          {openSections.doctorQuestions && (
            <div className="p-5 border-t border-blue-100 space-y-4">
              <p className="text-xs text-slate-600">
                These prepared questions can make your next medical appointment more productive:
              </p>
              <ul className="space-y-2.5">
                {finding.doctorDiscussionPoints && finding.doctorDiscussionPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-blue-100">
                    <span className="font-semibold text-blue-700 shrink-0">{index + 1}.</span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyQuestions}
                  icon={Copy}
                  className="text-xs"
                >
                  Copy Questions for Doctor
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Section 5: Biological Context & Reference Factors (Optional Expandable) */}
        {finding.biologicalContext && (
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <button
              type="button"
              onClick={() => toggleSection('biologicalContext')}
              className="w-full flex items-center justify-between px-5 py-4 bg-slate-50/70 hover:bg-slate-100/60 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-slate-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  5. Additional Biological Context
                </h3>
              </div>
              {openSections.biologicalContext ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
            </button>
            {openSections.biologicalContext && (
              <div className="p-5 border-t border-slate-100 text-sm text-slate-600 leading-relaxed">
                <p>{finding.biologicalContext}</p>
              </div>
            )}
          </div>
        )}

        {/* Mandatory Educational Disclaimer */}
        <Disclaimer variant="compact" />
      </div>
    </Modal>
  );
}
