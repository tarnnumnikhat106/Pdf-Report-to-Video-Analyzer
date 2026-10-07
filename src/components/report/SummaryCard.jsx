import React from 'react';
import { Sparkles, MessageSquareHeart, HelpCircle, ArrowRight } from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';

export default function SummaryCard({
  summary,
  reportName,
  attentionCount = 0,
  normalCount = 0,
  onGenerateVideo,
}) {
  return (
    <Card className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white border-0 shadow-lg relative overflow-hidden" padding="p-6 sm:p-8">
      {/* Decorative ambient subtle background glow */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-blue-300">
                AI Synthesis
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Your Report in Simple Language
              </h2>
            </div>
          </div>

          {/* Quick counts pill */}
          <div className="flex items-center gap-2 text-xs">
            {attentionCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/30 font-medium">
                {attentionCount} {attentionCount === 1 ? 'Finding' : 'Findings'} to Review
              </span>
            )}
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-medium">
              {normalCount} Normal
            </span>
          </div>
        </div>

        {/* Synthesis Body */}
        <div className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs">
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
            {summary}
          </p>
        </div>

        {/* Footer Guidance */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <MessageSquareHeart className="w-4 h-4 text-blue-300 shrink-0" />
            <span>
              Prepared for your discussion with a healthcare provider.
            </span>
          </div>

          {onGenerateVideo && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateVideo}
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30"
              icon={ArrowRight}
              iconPosition="right"
            >
              Watch Video Explanation
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
