import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  RotateCcw, 
  Download, 
  Share2, 
  FileText, 
  Sparkles,
  Layers,
  CheckCircle2,
  Subtitles,
  Activity
} from 'lucide-react';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';

export default function VideoPlayer({
  videoData,
  reportName,
  onGenerateNew,
}) {
  const { addToast } = useToast();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(videoData?.durationSeconds || 165);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'transcript'

  const chapters = videoData?.chapters || [
    { time: "0:00", title: "Introduction & Overview", timestamp: 0 },
    { time: "0:35", title: "Key Findings Walkthrough", timestamp: 35 },
    { time: "1:20", title: "Biological Meaning & Reference Intervals", timestamp: 80 },
    { time: "2:10", title: "Doctor Discussion Points", timestamp: 130 }
  ];

  // Sync chapters with current time
  useEffect(() => {
    let currentIdx = 0;
    for (let i = 0; i < chapters.length; i++) {
      if (currentTime >= chapters[i].timestamp) {
        currentIdx = i;
      }
    }
    setActiveChapterIndex(currentIdx);
  }, [currentTime, chapters]);

  // Simulated video playback timer if video tag isn't native or paused
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1 * playbackSpeed;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, playbackSpeed]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {
          // Fallback if browser autoplays restriction
        });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const jumpToChapter = (timestamp) => {
    setCurrentTime(timestamp);
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
    }
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownload = () => {
    addToast('Downloading educational video package (MP4 & PDF summary)...', 'info');
    // Simulate download trigger
    setTimeout(() => {
      addToast('Download completed successfully.', 'success');
    }, 1500);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast('Shareable video link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher for Player vs Full Script */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('player')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
              activeTab === 'player'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Video Presentation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transcript')}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'transcript'
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Full Script & Transcript</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            icon={Share2}
            className="text-xs"
          >
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            icon={Download}
            className="text-xs"
          >
            Download
          </Button>
        </div>
      </div>

      {activeTab === 'player' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Cinema Screen */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 aspect-video flex flex-col justify-between">
              
              {/* Fallback & Visual Infographic Presentation Layer */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none bg-radial from-slate-900 to-slate-950">
                <div className="space-y-4 max-w-lg">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/30 border border-blue-500/40 text-blue-300 flex items-center justify-center mx-auto shadow-lg shadow-blue-500/20">
                    <Activity className={`w-7 h-7 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </div>
                  
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold tracking-widest text-blue-400 uppercase">
                      MedVision AI • Chapter {activeChapterIndex + 1} of {chapters.length}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {chapters[activeChapterIndex]?.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto line-clamp-2">
                      {reportName || "Medical Report Clinical Breakdown"}
                    </p>
                  </div>

                  {/* Active Slide Infographic Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs text-white backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AI Narration & Visual Explainer</span>
                  </div>
                </div>

                {/* Subtitle / Closed Caption Strip */}
                {showCaptions && (
                  <div className="absolute bottom-16 left-6 right-6 p-2.5 rounded-lg bg-black/80 border border-white/10 text-white text-xs sm:text-sm font-medium backdrop-blur-sm transition-all">
                    <p className="line-clamp-2 italic">
                      "{chapters[activeChapterIndex]?.title}: Converting dense clinical terminology into transparent, physician-ready discussion points."
                    </p>
                  </div>
                )}
              </div>

              {/* Big Center Play Button Overlay when Paused */}
              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/20 transition-all group z-10"
                  aria-label="Play video"
                >
                  <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 ml-1 fill-white" />
                  </div>
                </button>
              )}

              {/* Video Bottom Control Bar */}
              <div className="relative z-20 mt-auto bg-gradient-to-t from-black via-black/80 to-transparent p-4 space-y-2">
                {/* Scrubbing Timeline */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-300 min-w-[35px]">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min="0"
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2 transition-all"
                    aria-label="Video seek slider"
                  />
                  <span className="text-xs font-mono text-slate-400 min-w-[35px]">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Button controls */}
                <div className="flex items-center justify-between text-white text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-1.5 hover:text-blue-400 transition-colors"
                      aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTime(0);
                        setIsPlaying(true);
                      }}
                      className="p-1.5 hover:text-blue-400 transition-colors"
                      title="Restart"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1.5 hover:text-blue-400 transition-colors"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowCaptions(!showCaptions)}
                      className={`p-1.5 transition-colors rounded ${showCaptions ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
                      title="Toggle Captions"
                    >
                      <Subtitles className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Speed Selector */}
                    <div className="flex items-center gap-1 bg-white/10 rounded-md px-1.5 py-0.5">
                      {[1, 1.25, 1.5].map((spd) => (
                        <button
                          key={spd}
                          type="button"
                          onClick={() => setPlaybackSpeed(spd)}
                          className={`px-1.5 py-0.5 text-[11px] rounded transition-colors ${
                            playbackSpeed === spd ? 'bg-blue-600 text-white font-bold' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>

                    <span className="text-[11px] text-slate-400 hidden sm:inline">
                      1080p HD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video metadata card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  {videoData?.title || "Your Medical Report Explained"}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generated with MedVision Multi-Modal Pipeline • Duration: {videoData?.duration || "2m 45s"} • Language: {videoData?.language || "English"}
                </p>
              </div>

              {onGenerateNew && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerateNew}
                  icon={Sparkles}
                >
                  Regenerate Video
                </Button>
              )}
            </div>
          </div>

          {/* Interactive Chapter Sidebar */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Interactive Chapters
                </h4>
              </div>
              <div className="space-y-2">
                {chapters.map((chap, idx) => {
                  const isCurrent = idx === activeChapterIndex;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => jumpToChapter(chap.timestamp)}
                      className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'bg-blue-50/80 border-blue-300 text-blue-900 font-semibold'
                          : 'bg-slate-50/60 border-slate-200/80 text-slate-700 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                          isCurrent ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="truncate">{chap.title}</span>
                      </div>
                      <span className="font-mono text-slate-400 text-[11px] shrink-0">
                        {chap.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
              <p className="font-semibold text-slate-900">How to use this video:</p>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Watch the chapter covering your specific attention findings.</li>
                <li>Write down questions generated during the discussion points segment.</li>
                <li>Play this explanation for family members or caregivers to enhance clarity.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Full Transcript View */
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Complete Video Narration Script
              </h3>
              <p className="text-xs text-slate-500">
                Verbatim transcript generated from AI natural language simplification.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={() => {
                navigator.clipboard.writeText(videoData?.transcript || '');
                addToast('Transcript copied to clipboard', 'success');
              }}
            >
              Copy Script
            </Button>
          </div>

          <div className="prose prose-slate max-w-none text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-6 rounded-xl border border-slate-200/80 font-mono">
            {videoData?.transcript || "No transcript recorded for this report."}
          </div>
        </div>
      )}
    </div>
  );
}
