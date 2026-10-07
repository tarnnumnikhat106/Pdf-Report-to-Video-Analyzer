import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  FileSearch, 
  BookOpen, 
  HelpCircle, 
  Stethoscope, 
  Copy, 
  Share2, 
  ChevronRight,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import SeverityBadge from '../components/common/SeverityBadge';
import Disclaimer from '../components/common/Disclaimer';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { getReport } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function FindingDetailsPage() {
  const { reportId = 'MR-001', findingId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [report, setReport] = useState(null);
  const [finding, setFinding] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getReport(reportId)
      .then((rep) => {
        if (!isMounted) return;
        setReport(rep);
        const match = (rep?.findings || []).find((f) => f.id === findingId) || rep?.findings?.[0];
        setFinding(match);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching finding:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reportId, findingId]);

  const handleCopyQuestions = () => {
    if (!finding?.doctorDiscussionPoints) return;
    const text = finding.doctorDiscussionPoints.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(`Questions for Doctor regarding ${finding.name}:\n\n${text}`);
    addToast('Discussion questions copied to clipboard', 'success');
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <LoadingState title="Loading parameter breakdown..." />
      </div>
    );
  }

  if (!finding) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Finding Not Found"
          description="Could not locate this specific laboratory parameter in the active report."
          actionText="Back to Dashboard"
          onAction={() => navigate(`/analysis/${reportId}`)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Navigation Back */}
      <div className="flex items-center justify-between">
        <Link
          to={`/analysis/${reportId}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Report Analysis</span>
        </Link>
        <span className="text-xs text-slate-400 font-mono">
          {report?.reportName || reportId}
        </span>
      </div>

      {/* Main Finding Overview Header */}
      <Card padding="p-6 sm:p-8" className="border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {finding.category || "Clinical Parameter"}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              {finding.name}
            </h1>
          </div>
          <SeverityBadge status={finding.status} size="lg" />
        </div>

        {/* Value and Reference Range Highlight Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <span className="text-xs font-semibold uppercase text-slate-500">
              Reported Laboratory Value
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-black text-slate-900 font-mono">
                {finding.value}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {finding.unit}
              </span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold uppercase text-slate-500">
              Standard Reference Interval
            </span>
            <div className="text-lg font-bold text-slate-800 font-mono mt-1">
              {finding.referenceRange}
            </div>
          </div>
        </div>

        {/* Section 1: What was found? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-blue-700">
            <FileSearch className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">1. What was found?</h3>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {finding.technicalSummary || finding.simpleExplanation}
          </p>
        </div>

        {/* Section 2: What does this term mean? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-indigo-700">
            <BookOpen className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">2. What does this term mean?</h3>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {finding.detailedDescription || finding.simpleExplanation}
          </p>
        </div>

        {/* Section 3: Why can it matter? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-amber-700">
            <HelpCircle className="w-5 h-5" />
            <h3 className="text-base font-bold text-slate-900">3. Why can it matter?</h3>
          </div>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {finding.whyItMatters || "Tracking parameter trends helps evaluate overall metabolic function and ensures lifestyle choices support long-term wellness."}
          </p>
        </div>

        {/* Section 4: What should the user discuss with a doctor? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <Stethoscope className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                4. What should you discuss with your doctor?
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Copy}
              onClick={handleCopyQuestions}
              className="text-xs"
            >
              Copy Questions
            </Button>
          </div>

          <div className="space-y-2.5">
            {finding.doctorDiscussionPoints && finding.doctorDiscussionPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-slate-800 text-sm">
                <span className="font-bold text-blue-700 shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Additional Biological Context */}
        {finding.biologicalContext && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-slate-700">
              <Info className="w-5 h-5 text-slate-500" />
              <h3 className="text-base font-bold text-slate-900">5. Additional Biological Context</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {finding.biologicalContext}
            </p>
          </div>
        )}
      </Card>

      {/* Mandatory Disclaimer */}
      <Disclaimer variant="card" />

    </div>
  );
}
