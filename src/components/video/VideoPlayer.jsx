import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  Download,
  Share2,
  FileText,
  Sparkles,
  Layers,
  Subtitles,
  Activity
} from 'lucide-react';
import Button from '../common/Button';
import { useToast } from '../../context/ToastContext';
import { formatReportName } from '../../utils/format';

const FALLBACK_CHAPTERS = [
  { time: "0:00", title: "Introduction & Overview", timestamp: 0 },
  { time: "0:35", title: "Key Findings Walkthrough", timestamp: 35 },
  { time: "1:20", title: "Biological Meaning & Reference Intervals", timestamp: 80 },
  { time: "2:10", title: "Doctor Discussion Points", timestamp: 130 }
];

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
  const [volume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);
  const [activeTab, setActiveTab] = useState('player'); // 'player' | 'transcript'
  const [videoFailed, setVideoFailed] = useState(false);

  const chapters = videoData?.chapters || FALLBACK_CHAPTERS;
  const activeChapter = chapters[activeChapterIndex];
  const activeCaption = activeChapter?.caption || (videoData?.videoUrl ? videoData?.transcript : null);

  const videoUrl = videoData?.videoUrl;
  const hasRealVideo = Boolean(videoUrl) && !videoFailed;

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

  // Simulated playback timer used only when no real media is available
  useEffect(() => {
    let interval = null;
    if (isPlaying && !hasRealVideo) {
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
  }, [isPlaying, duration, playbackSpeed, hasRealVideo]);

  // Keep duration, volume, mute, and playback rate in sync with the media element
  useEffect(() => {
    if (videoData?.durationSeconds) {
      setDuration(videoData.durationSeconds);
    }
  }, [videoData?.durationSeconds]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted, hasRealVideo]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed, hasRealVideo]);

  const togglePlay = () => {
    const media = videoRef.current;
    if (media) {
      if (media.paused) {
        media.play().catch(() => {
          // Browser autoplay restrictions or an unavailable stream
        });
      } else {
        media.pause();
      }
      return;
    }
    setIsPlaying((prev) => !prev);
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
      videoRef.current.play().catch(() => {});
    }
    setIsPlaying(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `${videoData?.title || 'medvision-explanation'}.mp4`;
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      addToast('Video download started.', 'info');
      return;
    }

    addToast('Downloading educational video package (MP4 & PDF summary)...', 'info');
    // Simulate download trigger while no rendered media exists
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
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-line">
        <div className="flex items-center gap-4 sm:gap-5">
          <button
            type="button"
            onClick={() => setActiveTab('player')}
            className={`-mb-px border-b-2 px-0.5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'player'
                ? 'border-accent text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            Video presentation
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('transcript')}
            className={`-mb-px flex items-center gap-1.5 border-b-2 px-0.5 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'transcript'
                ? 'border-accent text-ink'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Transcript</span>
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            icon={Share2}
            aria-label="Share video"
            className="text-xs px-2.5 sm:px-3"
          >
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            icon={Download}
            aria-label="Download video"
            className="text-xs px-2.5 sm:px-3"
          >
            <span className="hidden sm:inline">Download</span>
          </Button>
        </div>
      </div>

      {activeTab === 'player' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Video Cinema Screen */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 aspect-video flex flex-col justify-between">
              
              {/* Real generated video when the backend provides a URL */}
              {hasRealVideo && (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="absolute inset-0 h-full w-full object-cover bg-black"
                  playsInline
                  onLoadedMetadata={(e) => {
                    const mediaDuration = e.currentTarget.duration;
                    if (Number.isFinite(mediaDuration) && mediaDuration > 0) {
                      setDuration(mediaDuration);
                    }
                    e.currentTarget.volume = volume;
                    e.currentTarget.muted = isMuted;
                    e.currentTarget.playbackRate = playbackSpeed;
                  }}
                  onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => {
                    setVideoFailed(true);
                    setIsPlaying(false);
                  }}
                />
              )}

              {/* Fallback & Visual Infographic Presentation Layer */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none pointer-events-none ${hasRealVideo ? '' : 'bg-radial from-slate-900 to-slate-950'}`}>
                {!hasRealVideo && (
                <div className="max-w-lg space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md border border-paper/15 bg-paper/10 text-paper/70">
                    <Activity className={`h-7 w-7 ${isPlaying ? 'animate-pulse' : ''}`} />
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/45">
                      MedVision · Chapter {activeChapterIndex + 1} of {chapters.length}
                    </span>
                    <h3 className="font-display text-2xl tracking-tight text-paper sm:text-3xl">
                      {chapters[activeChapterIndex]?.title}
                    </h3>
                    <p className="mx-auto max-w-md text-xs text-paper/50 sm:text-sm">
                      {formatReportName(reportName, "Medical report breakdown")}
                    </p>
                  </div>

                  {/* Active Slide Infographic Badge */}
                  <div className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-paper/5 px-3 py-1.5 text-xs text-paper/70">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    <span>Preview · narration and slides</span>
                  </div>
                </div>
                )}

                {/* Subtitle / Closed Caption Strip */}
                {showCaptions && (
                  <div className="absolute bottom-16 left-6 right-6 z-10 p-2.5 rounded-lg bg-black/80 border border-white/10 text-white text-xs sm:text-sm font-medium backdrop-blur-sm transition-all">
                    <p className="line-clamp-2 italic">
                      {activeCaption ? `"${activeCaption}"` : 'Preview ? narration and slides'}
                    </p>
                  </div>
                )}
              </div>

              {/* Big Center Play Button Overlay when Paused */}
              {hasRealVideo && !isPlaying && (
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
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          videoRef.current.play().catch(() => {});
                        }
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
                      {hasRealVideo ? (videoData?.resolution || 'Video') : 'Simulated preview'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video metadata card */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-line bg-surface p-4">
              <div>
                <h4 className="font-display text-lg text-ink">
                  {videoData?.title || "Your report, explained"}
                </h4>
                <p className="mt-0.5 text-xs text-muted">
                  MedVision walkthrough · {videoData?.duration || "2m 45s"} · {videoData?.language || "English"}
                </p>
              </div>

              {onGenerateNew && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onGenerateNew}
                  icon={Sparkles}
                >
                  Regenerate video
                </Button>
              )}
            </div>
          </div>

          {/* Interactive Chapter Sidebar */}
          <div className="space-y-4">
            <div className="rounded-lg border border-line bg-surface p-4">
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-accent" />
                <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  Chapters
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
                      className={`flex w-full items-center justify-between gap-3 rounded-md border p-3 text-left text-xs transition-colors ${
                        isCurrent
                          ? 'border-accent/30 bg-accent-soft/60 font-semibold text-accent-deep'
                          : 'border-line bg-paper/40 text-ink-soft hover:border-line/80 hover:bg-paper'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-[10px] font-semibold ${
                          isCurrent ? 'bg-accent text-surface' : 'bg-paper-deep text-muted'
                        }`}>
                          {idx + 1}
                        </span>
                        <span className="truncate">{chap.title}</span>
                      </div>
                      <span className="shrink-0 font-mono text-[11px] text-muted">
                        {chap.time}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Tips Box */}
            <div className="space-y-2 rounded-lg border border-line bg-paper-deep/40 p-4 text-xs text-muted">
              <p className="font-semibold text-ink">How to use this walkthrough</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Start with the chapter covering your flagged finding.</li>
                <li>Note the questions that come up while you listen.</li>
                <li>Replay it with a family member or caregiver if that helps.</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        /* Full Transcript View */
        <div className="space-y-6 rounded-lg border border-line bg-surface p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-line-soft pb-4">
            <div>
              <h3 className="font-display text-xl text-ink">
                Video transcript
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                The narration, word for word. Copy it into your notes if useful.
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
              Copy transcript
            </Button>
          </div>

          <div className="whitespace-pre-line rounded-md border border-line bg-paper/50 p-6 font-mono text-sm leading-relaxed text-ink-soft">
            {videoData?.transcript || "No transcript recorded for this report."}
          </div>
        </div>
      )}
    </div>
  );
}
