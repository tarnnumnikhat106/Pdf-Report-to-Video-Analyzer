import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch, BookOpen, HelpCircle, Stethoscope, Copy, Info } from 'lucide-react';
import Card from '../components/common/Card';
import SeverityBadge from '../components/common/SeverityBadge';
import Disclaimer from '../components/common/Disclaimer';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { getReport } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatReportName } from '../utils/format';

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
      <div className="flex items-center justify-between gap-3 border-b border-line pb-4">
        <Link
          to={`/analysis/${reportId}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-ink sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to report</span>
        </Link>
        <span className="truncate text-xs text-muted">
          {formatReportName(report?.reportName, reportId)}
        </span>
      </div>

      {/* Main Finding Overview Header */}
      <Card padding="p-6 sm:p-8" className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-line-soft pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              {finding.category || "Clinical parameter"}
            </span>
            <h1 className="mt-1 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              {finding.name}
            </h1>
          </div>
          <SeverityBadge status={finding.status} size="lg" />
        </div>

        {/* Value and Reference Range Highlight Bar */}
        <div className="grid grid-cols-1 gap-4 rounded-md border border-line bg-paper/60 p-4 sm:grid-cols-2">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Reported value
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-3xl font-semibold text-ink">
                {finding.value}
              </span>
              <span className="text-sm font-medium text-ink-soft">
                {finding.unit}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
              Reference interval
            </span>
            <div className="mt-1 font-mono text-lg text-ink-soft">
              {finding.referenceRange}
            </div>
          </div>
        </div>

        {/* Section 1: What was found? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-accent-deep">
            <FileSearch className="h-5 w-5" />
            <h3 className="font-display text-lg text-ink">What was found</h3>
          </div>
          <p className="rounded-md border border-line bg-paper/50 p-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            {finding.technicalSummary || finding.simpleExplanation}
          </p>
        </div>

        {/* Section 2: What does this term mean? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-accent-deep">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-display text-lg text-ink">What the term means</h3>
          </div>
          <p className="rounded-md border border-line bg-paper/50 p-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            {finding.detailedDescription || finding.simpleExplanation}
          </p>
        </div>

        {/* Section 3: Why can it matter? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-attention">
            <HelpCircle className="h-5 w-5" />
            <h3 className="font-display text-lg text-ink">Why it can matter</h3>
          </div>
          <p className="rounded-md border border-line bg-paper/50 p-4 text-sm leading-relaxed text-ink-soft sm:text-base">
            {finding.whyItMatters || "Tracking parameter trends helps evaluate overall metabolic function and ensures lifestyle choices support long-term wellness."}
          </p>
        </div>

        {/* Section 4: What should the user discuss with a doctor? */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-accent-deep">
              <Stethoscope className="h-5 w-5" />
              <h3 className="font-display text-lg text-ink">
                What to discuss with your doctor
              </h3>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Copy}
              onClick={handleCopyQuestions}
              className="text-xs"
            >
              Copy questions
            </Button>
          </div>

          <div className="space-y-2.5">
            {finding.doctorDiscussionPoints && finding.doctorDiscussionPoints.map((point, idx) => (
              <div key={idx} className="flex items-start gap-3 rounded-md border border-line bg-surface p-3.5 text-sm text-ink-soft">
                <span className="shrink-0 font-mono text-xs text-accent">{String(idx + 1).padStart(2, '0')}</span>
                <span className="leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Additional Biological Context */}
        {finding.biologicalContext && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-muted">
              <Info className="h-5 w-5" />
              <h3 className="font-display text-lg text-ink">Biological context</h3>
            </div>
            <p className="rounded-md border border-line bg-paper/50 p-4 text-sm leading-relaxed text-muted">
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
