import React, { useState, useEffect, useRef } from 'react';
import {
  Check,
  Loader2,
  Sparkles,
  Film,
  Mic,
  FileText,
  Layers,
  Video,
  ArrowRight,
  AlertCircle,
  RotateCcw,
  Languages,
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { generateVideo, getVideoStatus } from '../../services/api';

const VIDEO_GENERATION_STAGES = [
  { id: 'script', label: 'Preparing script', desc: 'Turns the measured values into plain-language narration', icon: FileText },
  { id: 'explanation', label: 'Structuring explanation', desc: 'Orders the cover, findings, and doctor questions', icon: Sparkles },
  { id: 'voice', label: 'Generating voice', desc: 'Synthesizes narration with a natural neural voice', icon: Mic },
  { id: 'visuals', label: 'Rendering slides', desc: 'Draws one clear slide per idea, in native resolution', icon: Layers },
  { id: 'finalize', label: 'Finalizing video', desc: 'Joins the slides into a lightweight MP4', icon: Film },
];

const POLL_INTERVAL_MS = 1800;

const NARRATION_LANGUAGES = [
  { id: 'en', label: 'English', hint: 'Warm, conversational voice' },
  { id: 'hi', label: 'Hinglish', hint: 'हिन्दी + everyday English' },
];

export default function VideoGeneratorModal({
  isOpen,
  onClose,
  reportId,
  reportName,
  onCompleted,
}) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');
  const [narrationLanguage, setNarrationLanguage] = useState('en');
  const stoppedRef = useRef(false);
  const pollTimerRef = useRef(null);

  const clearPollTimer = () => {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      clearPollTimer();
    };
  }, []);

  const resetState = () => {
    stoppedRef.current = true;
    clearPollTimer();
    setIsGenerating(false);
    setIsDone(false);
    setProgress(0);
    setCurrentStageIndex(0);
    setStatusMessage('');
    setError('');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const completeGeneration = (message = 'Your video is ready.') => {
    if (stoppedRef.current) return;
    clearPollTimer();
    setProgress(100);
    setCurrentStageIndex(VIDEO_GENERATION_STAGES.length - 1);
    setStatusMessage(message);
    setIsGenerating(false);
    setIsDone(true);
  };

  const pollGeneration = async () => {
    if (stoppedRef.current) return;

    try {
      const status = await getVideoStatus(reportId);
      if (stoppedRef.current) return;

      if (status?.status === 'completed') {
        completeGeneration(status.message || 'Your video is ready.');
        return;
      }

      if (status?.status === 'failed' || status?.status === 'error') {
        setError(status.message || 'Video generation failed. Please try again.');
        setIsGenerating(false);
        return;
      }

      if (typeof status?.progress === 'number') {
        setProgress(Math.max(0, Math.min(99, status.progress)));
      }
      if (typeof status?.stage_index === 'number') {
        setCurrentStageIndex(Math.max(0, Math.min(VIDEO_GENERATION_STAGES.length - 1, status.stage_index)));
      }
      if (status?.message) {
        setStatusMessage(status.message);
      }

      pollTimerRef.current = setTimeout(pollGeneration, POLL_INTERVAL_MS);
    } catch (err) {
      console.warn('Video status poll failed; retrying.', err);
      if (!stoppedRef.current) {
        pollTimerRef.current = setTimeout(pollGeneration, POLL_INTERVAL_MS);
      }
    }
  };

  const handleStartGeneration = async () => {
    if (!reportId) {
      setError('This report is missing an ID, so the video cannot be generated.');
      return;
    }

    stoppedRef.current = false;
    clearPollTimer();
    setError('');
    setStatusMessage('Submitting the report...');
    setProgress(2);
    setCurrentStageIndex(0);
    setIsDone(false);
    setIsGenerating(true);

    try {
      const started = await generateVideo(reportId, {
        quality: 'low',
        language: narrationLanguage === 'hi' ? 'Hinglish' : 'English',
        narrationLanguage,
        detailLevel: 'standard',
      });

      if (stoppedRef.current) return;

      if (started?.status === 'completed') {
        completeGeneration('Your video is ready.');
        return;
      }

      setStatusMessage(started?.message || 'Preparing the narration script...');
      setProgress(6);
      pollTimerRef.current = setTimeout(pollGeneration, POLL_INTERVAL_MS);
    } catch (err) {
      console.error('Video generation could not be started:', err);
      setError('Could not start video generation. Check that the backend is running and try again.');
      setIsGenerating(false);
    }
  };

  const handleViewVideo = () => {
    handleClose();
    if (onCompleted) {
      onCompleted();
    }
  };

  const displayedProgress = isDone ? 100 : progress;

  return (
    <Modal
      isOpen={isOpen}
      onClose={isGenerating ? () => {} : handleClose}
      title="Educational video"
      subtitle={`A narrated walkthrough for ${reportName || 'this report'}`}
      maxWidth="max-w-xl"
      showClose={!isGenerating}
    >
      <div className="space-y-6">
        {!isGenerating && !isDone && !error ? (
          <div className="space-y-5 py-2">
            <div className="flex items-start gap-3 rounded-lg border border-line bg-paper/60 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-accent-deep">
                <Video className="h-5 w-5" />
              </span>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-ink">Low-power narrated slideshow</h3>
                <p className="text-sm leading-relaxed text-muted">
                  Static slides, natural neural narration, and a lightweight MP4. No heavy animation or cloud video rendering.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  <Languages className="h-3.5 w-3.5" />
                  Narration language
                </p>
                <span className="text-[11px] text-muted">Natural neural voice</span>
              </div>
              <div role="group" aria-label="Narration language" className="grid grid-cols-2 gap-2">
                {NARRATION_LANGUAGES.map((option) => {
                  const selected = narrationLanguage === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setNarrationLanguage(option.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        selected
                          ? 'border-accent/40 bg-accent-soft/70 text-ink'
                          : 'border-line bg-surface text-ink-soft hover:border-ink/20'
                      }`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold">{option.label}</span>
                        {selected && (
                          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent text-surface">
                            <Check className="h-2.5 w-2.5 stroke-[3]" />
                          </span>
                        )}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">{option.hint}</span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[11px] leading-relaxed text-muted">
                The voice speaks directly to you, using "you" and "your". Hinglish uses Swara and mixes everyday English into Hindi, the way people normally talk.
              </p>
            </div>

            <ul className="space-y-2 text-sm text-muted">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>One idea per slide, with your value and its reference range.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Direct, second-person narration that speaks to you, plus a full transcript.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Questions to bring to your doctor, ready to replay.</span>
              </li>
            </ul>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartGeneration}
              icon={Sparkles}
              className="w-full justify-center"
            >
              Generate video
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {error ? (
              <div className="space-y-4 rounded-lg border border-danger/20 bg-danger-soft/60 p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-ink">Video generation stopped</p>
                    <p className="text-sm leading-relaxed text-muted">{error}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button variant="primary" size="sm" onClick={handleStartGeneration} icon={RotateCcw}>
                    Try again
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleClose}>
                    Close
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-4 text-xs font-medium text-ink-soft">
                    <span>
                      {isDone
                        ? 'Video ready'
                        : `Step ${currentStageIndex + 1} of ${VIDEO_GENERATION_STAGES.length}: ${VIDEO_GENERATION_STAGES[currentStageIndex]?.label}`}
                    </span>
                    <span className="font-mono text-muted">{displayedProgress}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-line/60">
                    <div
                      className="h-full rounded-full bg-accent transition-all duration-700"
                      style={{ width: `${displayedProgress}%` }}
                    />
                  </div>
                  <p className="text-xs leading-relaxed text-muted" aria-live="polite">
                    {isDone ? statusMessage || 'Your video is ready.' : statusMessage || VIDEO_GENERATION_STAGES[currentStageIndex]?.desc}
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border border-line bg-paper/60 p-3">
                  {VIDEO_GENERATION_STAGES.map((stage, idx) => {
                    const isPassed = isDone || idx < currentStageIndex;
                    const isCurrent = !isDone && idx === currentStageIndex;

                    return (
                      <div
                        key={stage.id}
                        className={`flex items-start gap-3 rounded-md p-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-surface border border-line'
                            : isPassed
                            ? 'bg-transparent'
                            : 'opacity-40'
                        }`}
                      >
                        <div className="mt-0.5">
                          {isPassed ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-surface">
                              <Check className="h-3 w-3 stroke-[3]" />
                            </span>
                          ) : isCurrent ? (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
                              <Loader2 className="h-3 w-3 animate-spin" />
                            </span>
                          ) : (
                            <span className="block h-5 w-5 rounded-full border border-line bg-surface" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold ${isCurrent ? 'text-ink' : 'text-ink-soft'}`}>
                            {stage.label}
                          </p>
                          <p className="text-[11px] leading-relaxed text-muted">{stage.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {isDone && (
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handleViewVideo}
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full justify-center"
                  >
                    Watch video
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
