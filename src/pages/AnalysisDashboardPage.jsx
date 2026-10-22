import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  Search, 
  Filter, 
  Video, 
  Download, 
  Printer, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  ArrowRight,
  Share2,
  ChevronRight
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                {report.reportType || "Laboratory Diagnostics"}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ID: {report.reportId}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Medical Report Analysis
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-500 flex flex-wrap items-center gap-y-1 gap-x-4 pt-1">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <FileText className="w-4 h-4 text-slate-400" />
                {report.reportName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Analyzed on {report.date}
              </span>
              {report.laboratory && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    {report.laboratory}
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={Video}
              onClick={() => setIsVideoModalOpen(true)}
              className="shadow-sm shadow-blue-500/20"
            >
              Generate Video
            </Button>

            <Link to={`/video/${report.reportId}`}>
              <Button
                variant="outline"
                size="md"
                icon={Sparkles}
              >
                Watch Video
              </Button>
            </Link>

            <Button
              variant="outline"
              size="md"
              icon={Printer}
              onClick={handlePrintSummary}
              className="hidden sm:inline-flex"
            >
              Print
            </Button>

            <Button
              variant="outline"
              size="md"
              icon={Share2}
              onClick={handleShareDashboard}
              title="Share"
            />
          </div>
        </div>

        {/* Top Metric Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Findings"
            value={report.findings?.length || 0}
            subtitle="Parameters analyzed across report"
            icon={Activity}
            colorScheme="blue"
          />
          <StatCard
            title="Requires Attention"
            value={attentionFindingsCount}
            subtitle="Values outside reference interval"
            icon={AlertTriangle}
            colorScheme={attentionFindingsCount > 0 ? "amber" : "emerald"}
          />
          <StatCard
            title="Normal Parameters"
            value={normalFindingsCount}
            subtitle="Within standard healthy baseline"
            icon={CheckCircle2}
            colorScheme="emerald"
          />
          <StatCard
            title="Review Status"
            value="Complete"
            subtitle="Laboratory findings summarized"
            icon={ShieldCheck}
            colorScheme="slate"
          />
        </div>
      </div>

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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Report Findings & Parameters
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select any parameter to review its biological significance and questions for your doctor.
            </p>
          </div>

          {/* Filter and Search Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative min-w-[200px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parameter..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({report.findings?.length || 0})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('attention')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === 'attention'
                    ? 'bg-amber-100 text-amber-900 shadow-xs'
                    : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                Attention ({attentionFindingsCount})
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('normal')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                  statusFilter === 'normal'
                    ? 'bg-emerald-100 text-emerald-900 shadow-xs'
                    : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                Normal ({normalFindingsCount})
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills if multiple exist */}
        {categories.length > 2 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-medium shrink-0">Category:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-colors shrink-0 capitalize ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat}
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
      <div className="p-6 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Video className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base sm:text-lg">
              Want a spoken video explanation of this report?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Our multi-modal generator synthesizes an educational walkthrough covering your specific lab ranges and doctor discussion questions.
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
          Watch Video Explanation
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
