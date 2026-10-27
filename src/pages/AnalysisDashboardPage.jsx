import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Video, 
  Printer, 
  Play,
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck,
  Activity, 
  ArrowRight,
  Share2
} from 'lucide-react';
import StatCard from '../components/common/StatCard';
import SummaryCard from '../components/report/SummaryCard';
import LlamaAdvisorCard from '../components/report/LlamaAdvisorCard';
import DietChatSection from '../components/report/DietChatSection';
import FindingCard from '../components/report/FindingCard';
import FindingDetailModal from '../components/report/FindingDetailModal';
import VideoGeneratorModal from '../components/video/VideoGeneratorModal';
import Disclaimer from '../components/common/Disclaimer';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { getReport } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatReportName } from '../utils/format';

export default function AnalysisDashboardPage() {
  const { reportId = 'MR-001' } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'attention' | 'normal' | 'important'
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Modals state
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getReport(reportId)
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching report:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reportId]);

  // Smooth scroll to ML Overview section if redirected with #ml-overview
  useEffect(() => {
    if (!isLoading && report) {
      if (window.location.hash === '#ml-overview') {
        const scrollTimer = setTimeout(() => {
          const el = document.getElementById('ml-overview');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 200);
        return () => clearTimeout(scrollTimer);
      }
    }
  }, [isLoading, report]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <LoadingState 
          title="Loading Report Analysis..." 
          subtitle="Fetching extracted parameters, reference ranges, and simplified explanations."
        />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Report Not Found"
          description="Could not locate the requested medical report. Please check the ID or upload a new file."
          actionText="Upload Report"
          onAction={() => navigate('/upload')}
        />
      </div>
    );
  }

  // Derive categories
  const categories = ['all', ...new Set((report.findings || []).map(f => f.category).filter(Boolean))];

  // Filter findings
  const filteredFindings = (report.findings || []).filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (f.simpleExplanation && f.simpleExplanation.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'attention'
      ? (f.status === 'attention' || f.status === 'important')
      : f.status === statusFilter;

    const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleOpenFindingDetail = (finding) => {
    setSelectedFinding(finding);
    setIsDetailModalOpen(true);
  };

  const handlePrintSummary = () => {
    window.print();
  };

  const handleShareDashboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Dashboard link copied to clipboard', 'success');
    }
  };

  const attentionFindingsCount = (report.findings || []).filter(f => f.status === 'attention' || f.status === 'important').length;
  const normalFindingsCount = (report.findings || []).filter(f => f.status === 'normal').length;

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="border-b border-line pb-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
              <span className="text-accent-deep">{report.reportType || 'Laboratory diagnostics'}</span>
              <span aria-hidden="true" className="h-3 w-px bg-line" />
              <span className="font-mono normal-case tracking-normal">ID {report.reportId}</span>
            </div>

            <h1 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              {formatReportName(report.reportName)}
            </h1>

            <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
              {report.laboratory && <span>{report.laboratory}</span>}
              {report.laboratory && <span aria-hidden="true" className="text-line">·</span>}
              <span>Analyzed {report.date}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="primary"
              size="md"
              icon={Video}
              onClick={() => setIsVideoModalOpen(true)}
            >
              Generate video
            </Button>

            <Link to={`/video/${report.reportId}`}>
              <Button variant="outline" size="md" icon={Play}>
                Watch
              </Button>
            </Link>

            <div className="hidden sm:inline-flex">
              <Button
                variant="ghost"
                size="md"
                icon={Printer}
                onClick={handlePrintSummary}
              >
                Print
              </Button>
            </div>

            <Button
              variant="ghost"
              size="md"
              icon={Share2}
              onClick={handleShareDashboard}
              aria-label="Copy dashboard link"
              className="px-2.5"
            />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Findings"
            value={report.findings?.length || 0}
            subtitle="Parameters read from the report"
            icon={Activity}
          />
          <StatCard
            title="Outside range"
            value={attentionFindingsCount}
            subtitle="Values to review with a clinician"
            icon={AlertTriangle}
          />
          <StatCard
            title="In range"
            value={normalFindingsCount}
            subtitle="Within the printed reference interval"
            icon={CheckCircle2}
          />
          <StatCard
            title="Report status"
            value="Complete"
            subtitle="Findings summarized"
            icon={ShieldCheck}
          />
        </div>
      </header>

      {/* Report Summary Card ("Your Report in Simple Language") */}
      <SummaryCard
        summary={report.summary}
        reportName={report.reportName}
        attentionCount={attentionFindingsCount}
        normalCount={normalFindingsCount}
        onGenerateVideo={() => navigate(`/video/${report.reportId}`)}
      />

      {/* ML Clinical Overview & Guidance Section (Anchor: #ml-overview) */}
      <div id="ml-overview" className="scroll-mt-8 space-y-8">
        {/* Llama 3.2 Clinical & Dietary Advisor + Connect to Doctor Alert */}
        <LlamaAdvisorCard
          llamaAnalysis={report.llamaAnalysis}
          mlAnalysis={report.mlAnalysis}
        />

        {/* Clinical Dietary & Nutrition Consultation Chat */}
        <DietChatSection
          reportContext={{
            condition: report.reportType || report.reportName || "Laboratory Diagnostics",
            risk_level: report.llamaAnalysis?.risk_level || (report.mlAnalysis?.ml_payload?.status || (attentionFindingsCount > 0 ? "Requires Attention" : "Normal")),
            biomarkers: (report.findings || []).reduce((acc, f) => {
              acc[f.name] = `${f.value} ${f.unit || ''} (Ref: ${f.referenceRange || 'N/A'}) [${f.status || 'normal'}]`;
              return acc;
            }, {}),
            summary: report.summary
          }}
        />
      </div>

      {/* Findings Section */}
      <div className="space-y-6">
        
        {/* Section Header with Filters & Search */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-display text-2xl tracking-tight text-ink">
              Findings
            </h2>
            <p className="mt-1 text-sm text-muted">
              Every value from the report, with its range and a plain-language note.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests"
                className="w-full rounded-md border border-line bg-surface py-1.5 pl-9 pr-3 text-xs text-ink placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 sm:text-sm"
              />
            </div>

            <div className="flex items-center gap-0.5 rounded-md border border-line bg-paper-deep p-0.5">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-surface text-ink'
                    : 'text-muted hover:text-ink'
                }`}
              >
                All ({report.findings?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('attention')}
                className={`rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === 'attention'
                    ? 'bg-attention-soft text-attention'
                    : 'text-muted hover:text-ink'
                }`}
              >
                Review ({attentionFindingsCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('normal')}
                className={`rounded-sm px-2.5 py-1 text-xs font-medium transition-colors ${
                  statusFilter === 'normal'
                    ? 'bg-accent-soft text-accent-deep'
                    : 'text-muted hover:text-ink'
                }`}
              >
                In range ({normalFindingsCount})
              </button>
            </div>
          </div>
        </div>

        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="shrink-0 font-medium text-muted">Category</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 rounded-md px-3 py-1 font-medium capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-accent text-surface'
                    : 'border border-line bg-surface text-muted hover:text-ink'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Findings Grid */}
        {filteredFindings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFindings.map((finding) => (
              <FindingCard
                key={finding.id}
                finding={finding}
                onLearnMore={handleOpenFindingDetail}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No matching findings"
            description="No parameters match your active search or filter selection. Try adjusting your query."
            actionText="Clear Filters"
            onAction={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setSelectedCategory('all');
            }}
          />
        )}
      </div>

      {/* Video Generation Callout Bar */}
      <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-line bg-paper-deep/60 p-6 sm:flex-row">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-display text-xl tracking-tight text-ink">
            One more pass, as a video.
          </h3>
          <p className="max-w-xl text-sm leading-relaxed text-muted">
            A chaptered walkthrough of this report: the findings, what they measure,
            and questions to ask.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={ArrowRight}
          iconPosition="right"
          onClick={() => navigate(`/video/${report.reportId}`)}
          className="shrink-0"
        >
          Watch the walkthrough
        </Button>
      </div>

      {/* Mandatory Medical Safety Disclaimer */}
      <Disclaimer variant="card" />

      {/* Modals */}
      <FindingDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        finding={selectedFinding}
        reportName={report.reportName}
      />

      <VideoGeneratorModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        reportId={report.reportId}
        reportName={report.reportName}
        onCompleted={() => {
          setIsVideoModalOpen(false);
          navigate(`/video/${report.reportId}`);
        }}
      />

    </div>
  );
}
