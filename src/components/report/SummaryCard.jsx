import React from 'react';
import { ArrowRight } from 'lucide-react';
import Button from '../common/Button';

export default function SummaryCard({
  summary,
  reportName,
  attentionCount = 0,
  normalCount = 0,
  onGenerateVideo,
}) {
  return (
    <div className="rounded-lg bg-ink p-6 text-paper sm:p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-paper/45">
            Summary
          </p>
          <h2 className="mt-2 font-display text-2xl tracking-tight sm:text-3xl">
            What this report says
          </h2>
          {reportName && (
            <p className="mt-1 text-xs text-paper/45">{reportName}</p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-paper/55">
          {attentionCount > 0 && (
            <span>
              <strong className="font-mono font-medium text-paper">{attentionCount}</strong>{' '}
              to review
            </span>
          )}
          <span>
            <strong className="font-mono font-medium text-paper">{normalCount}</strong>{' '}
            in range
          </span>
        </div>
      </div>

      <p className="mt-5 max-w-3xl text-sm leading-relaxed text-paper/75 sm:text-base">
        {summary}
      </p>

      <div className="mt-6 flex flex-col gap-3 border-t border-paper/15 pt-4 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between">
        <span>Written for a conversation with your clinician.</span>

        {onGenerateVideo && (
          <Button
            variant="inverse"
            size="sm"
            onClick={onGenerateVideo}
            icon={ArrowRight}
            iconPosition="right"
          >
            Watch the walkthrough
          </Button>
        )}
      </div>
    </div>
  );
}
