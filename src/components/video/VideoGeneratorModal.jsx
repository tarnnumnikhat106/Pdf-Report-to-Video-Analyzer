import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Loader2, 
  Sparkles, 
  Film, 
  Mic, 
  FileText, 
  Layers, 
  Video,
  ArrowRight
} from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const VIDEO_GENERATION_STAGES = [
  { id: 'script', label: 'Preparing script', desc: 'Translating clinical terminology into patient-friendly dialogue', icon: FileText },
  { id: 'explanation', label: 'Creating explanation', desc: 'Synthesizing anatomical context and discussion questions', icon: Sparkles },
  { id: 'voice', label: 'Generating voice', desc: 'Synthesizing natural, empathetic audio narration', icon: Mic },
  { id: 'visuals', label: 'Building visuals', desc: 'Rendering interactive parameter charts and gauge overlays', icon: Layers },
  { id: 'finalize', label: 'Finalizing video', desc: 'Encoding 1080p video stream and chapter markers', icon: Film }
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

  useEffect(() => {
    let timer = null;
    if (isOpen && !isDone && isGenerating) {
      if (currentStageIndex < VIDEO_GENERATION_STAGES.length - 1) {
        timer = setTimeout(() => {
          setCurrentStageIndex(prev => prev + 1);
        }, 1100);
      } else {
        timer = setTimeout(() => {
          setIsDone(true);
          setIsGenerating(false);
        }, 900);
      }
    }
    return () => clearTimeout(timer);
  }, [isOpen, isGenerating, currentStageIndex, isDone]);

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setCurrentStageIndex(0);
    setIsDone(false);
  };

  const handleViewVideo = () => {
    onClose();
    if (onCompleted) {
      onCompleted();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={isGenerating ? () => {} : onClose}
      title="AI Educational Video Generator"
      subtitle={`Synthesizing personalized video explainer for ${reportName || 'Medical Report'}`}
      maxWidth="max-w-xl"
      showClose={!isGenerating}
    >
      <div className="space-y-6">
        {!isGenerating && !isDone ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto shadow-sm">
              <Video className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                Generate Educational Video
              </h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                Transform your complex report into an animated, spoken walkthrough tailored for you to review before your physician visit.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800">What will be generated:</div>
              <ul className="list-disc pl-4 space-y-1 text-slate-500">
                <li>Chaptered breakdown of abnormal vs normal findings</li>
                <li>Clear explanations of laboratory reference ranges</li>
                <li>Actionable questions tailored for your doctor</li>
              </ul>
            </div>

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleStartGeneration}
                icon={Sparkles}
                className="w-full sm:w-auto"
              >
                Start Video Generation
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Generation Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>
                  {isDone
                    ? 'Video Generation Complete'
                    : `Step ${currentStageIndex + 1} of ${VIDEO_GENERATION_STAGES.length}: ${VIDEO_GENERATION_STAGES[currentStageIndex]?.label}`}
                </span>
                <span>
                  {isDone ? '100%' : `${Math.round(((currentStageIndex + 1) / VIDEO_GENERATION_STAGES.length) * 100)}%`}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-500 rounded-full"
                  style={{
                    width: isDone ? '100%' : `${((currentStageIndex + 1) / VIDEO_GENERATION_STAGES.length) * 100}%`
                  }}
                />
              </div>
            </div>

            {/* Stages Checklist */}
            <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              {VIDEO_GENERATION_STAGES.map((stage, idx) => {
                const isPassed = isDone || idx < currentStageIndex;
                const isCurrent = !isDone && idx === currentStageIndex;
                const Icon = stage.icon;

                return (
                  <div
                    key={stage.id}
                    className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                      isCurrent
                        ? 'bg-blue-50/90 border border-blue-200'
                        : isPassed
                        ? 'bg-white/80 border border-slate-100'
                        : 'opacity-40'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isPassed ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : isCurrent ? (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center animate-spin">
                          <Loader2 className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-blue-900' : isPassed ? 'text-slate-900' : 'text-slate-500'}`}>
                          {stage.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {stage.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Completion CTA */}
            {isDone && (
              <div className="pt-2 animate-in fade-in slide-in-from-bottom-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleViewVideo}
                  icon={ArrowRight}
                  iconPosition="right"
                  className="w-full justify-center"
                >
                  Watch Video Explanation
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
