import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layers } from 'lucide-react';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoGeneratorModal from '../components/video/VideoGeneratorModal';
import Disclaimer from '../components/common/Disclaimer';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import Card from '../components/common/Card';
import { getReport } from '../services/api';
import { useToast } from '../context/ToastContext';
import { formatReportName } from '../utils/format';

export default function VideoExplanationPage() {
  const { reportId = 'MR-001' } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [videoData, setVideoData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    getReport(reportId)
      .then((rep) => {
        if (!isMounted) return;
        setReport(rep);
        setVideoData(rep?.videoData || null);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching report for video:', err);
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [reportId]);

  const handleVideoGenerationComplete = async () => {
    try {
      const refreshed = await getReport(reportId);
      setReport(refreshed);
      setVideoData(refreshed?.videoData || null);
      addToast('Educational video generated successfully!', 'success');
    } catch (err) {
      console.error('Could not refresh the generated video:', err);
      addToast('The video was generated, but the page could not refresh. Reload to view it.', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <LoadingState title="Loading video explanation..." />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <EmptyState
          title="Report Not Found"
          description="Could not locate the requested medical report to generate a video."
          actionText="Upload Report"
          onAction={() => navigate('/upload')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Navigation and Report Context Strip */}
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={`/analysis/${reportId}`}
          className="inline-flex items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-ink sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to analysis dashboard</span>
        </Link>
        <div className="flex items-center gap-2.5 text-xs text-muted">
          <span className="font-medium text-ink-soft">{formatReportName(report.reportName, reportId)}</span>
          <span aria-hidden="true" className="text-line">·</span>
          <span className="font-mono">{report.date}</span>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Video walkthrough
        </p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
          Educational video explanation
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          A chapter-by-chapter walkthrough of your findings, reference ranges, and the questions worth raising with your physician.
        </p>
      </div>

      {/* Video Player Container */}
      <VideoPlayer
        key={videoData?.videoUrl || 'fallback'}
        videoData={videoData || report.videoData}
        reportName={report.reportName}
        onGenerateNew={() => setIsVideoModalOpen(true)}
      />

      {/* Video Generation Pipeline Architecture Note */}
      <Card padding="p-6" className="space-y-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent-deep">
            <Layers className="h-4 w-4" />
          </span>
          <h2 className="font-display text-xl text-ink">How this video is made</h2>
        </div>
        <p className="text-sm leading-relaxed text-muted">
          When the Python backend is running, the walkthrough is assembled in four stages.
        </p>
        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-4">
          <div className="rounded-md border border-line bg-paper/60 p-4">
            <span className="block font-semibold text-ink">1. Clinical LLM prompt</span>
            <span className="mt-1 block leading-relaxed text-muted">Turns the measured values into a plain-language script.</span>
          </div>
          <div className="rounded-md border border-line bg-paper/60 p-4">
            <span className="block font-semibold text-ink">2. Text to speech</span>
            <span className="mt-1 block leading-relaxed text-muted">Synthesizes narration with natural neural voices, plus an offline fallback.</span>
          </div>
          <div className="rounded-md border border-line bg-paper/60 p-4">
            <span className="block font-semibold text-ink">3. Video compositor</span>
            <span className="mt-1 block leading-relaxed text-muted">Builds static chapter slides and joins them with FFmpeg.</span>
          </div>
          <div className="rounded-md border border-line bg-paper/60 p-4">
            <span className="block font-semibold text-ink">4. Delivery</span>
            <span className="mt-1 block leading-relaxed text-muted">Serves the finished MP4 with chapter markers and captions.</span>
          </div>
        </div>
      </Card>

      {/* Mandatory Safety Notice */}
      <Disclaimer variant="card" />

      {/* Video Generator Modal */}
      <VideoGeneratorModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        reportId={report.reportId}
        reportName={report.reportName}
        onCompleted={handleVideoGenerationComplete}
      />

    </div>
  );
}
