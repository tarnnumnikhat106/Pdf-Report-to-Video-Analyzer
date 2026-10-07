import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Video, 
  Sparkles, 
  FileText, 
  Download, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Globe, 
  Layers,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import VideoPlayer from '../components/video/VideoPlayer';
import VideoGeneratorModal from '../components/video/VideoGeneratorModal';
import Disclaimer from '../components/common/Disclaimer';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { getReport, generateVideo } from '../services/api';
import { useToast } from '../context/ToastContext';

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
      const result = await generateVideo(reportId);
      if (result?.video) {
        setVideoData(result.video);
      }
      addToast('Educational video generated successfully!', 'success');
    } catch (err) {
      console.error(err);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to={`/analysis/${reportId}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Analysis Dashboard</span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="font-medium text-slate-700">{report.reportName}</span>
          <span>•</span>
          <span className="font-mono">{report.date}</span>
        </div>
      </div>

      {/* Page Title & Subtitle */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Multi-Modal AI Synthesis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Educational Video Explanation
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          Watch a chapter-by-chapter audiovisual walkthrough summarizing your report findings, reference ranges, and proactive questions to discuss with your physician.
        </p>
      </div>

      {/* Video Player Container */}
      <VideoPlayer
        videoData={videoData || report.videoData}
        reportName={report.reportName}
        onGenerateNew={() => setIsVideoModalOpen(true)}
      />

      {/* Video Generation Pipeline Architecture Note */}
      <Card padding="p-6" className="bg-slate-50/70 border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-slate-800">
          <Layers className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-bold uppercase tracking-wider">
            Backend Video Generation Architecture
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          In production with the Python backend, this video is programmatically compiled through a pipeline consisting of:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">1. Clinical LLM Prompt</span>
            <span className="text-slate-500">Extracts lab metrics into plain-language dialogue script.</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">2. Text-to-Speech (TTS)</span>
            <span className="text-slate-500">Synthesizes calm, empathetic audio narration in MP3/WAV.</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">3. Dynamic Video Compositor</span>
            <span className="text-slate-500">Assembles gauge charts and parameter slides via MoviePy / FFmpeg.</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-slate-200">
            <span className="font-bold text-slate-900 block mb-0.5">4. Encrypted Streaming</span>
            <span className="text-slate-500">Serves secure 1080p stream with synchronized WebVTT captions.</span>
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
