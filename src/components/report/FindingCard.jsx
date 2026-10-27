import React from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import Card from '../common/Card';
import SeverityBadge from '../common/SeverityBadge';
import Button from '../common/Button';

export default function FindingCard({ finding, onLearnMore }) {
  const {
    name,
    category,
    value,
    unit,
    referenceRange,
    minRef,
    maxRef,
    status = 'normal',
    simpleExplanation,
  } = finding;

  let gaugePositionPercent = 50;
  let isBelow = false;
  let isAbove = false;

  if (typeof minRef === 'number' && typeof maxRef === 'number' && typeof value === 'number') {
    const rangeSpan = maxRef - minRef;
    if (value < minRef) {
      isBelow = true;
      gaugePositionPercent = Math.max(10, 30 - ((minRef - value) / rangeSpan) * 20);
    } else if (value > maxRef) {
      isAbove = true;
      gaugePositionPercent = Math.min(90, 70 + ((value - maxRef) / rangeSpan) * 20);
    } else {
      gaugePositionPercent = 30 + ((value - minRef) / rangeSpan) * 40;
    }
  }

  const borderStyles = {
    normal: 'border-line hover:border-accent/40',
    attention: 'border-attention/30 bg-attention-soft/20 hover:border-attention/60',
    important: 'border-danger/30 bg-danger-soft/25 hover:border-danger/60',
  };

  const markerStyles = {
    normal: 'bg-accent ring-2 ring-accent/20',
    attention: 'bg-attention ring-2 ring-attention/20',
    important: 'bg-danger ring-2 ring-danger/20',
  };

  return (
    <Card
      className={`flex flex-col justify-between transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-32px_rgba(28,27,24,0.5)] ${
        borderStyles[status] || borderStyles.normal
      }`}
      padding="p-5 sm:p-6"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            {category && (
              <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
                {category}
              </span>
            )}
            <h3 className="text-base font-semibold tracking-tight text-ink sm:text-lg">
              {name}
            </h3>
          </div>
          <SeverityBadge status={status} size="sm" />
        </div>

        <div className="flex items-center justify-between gap-4 rounded-md border border-line bg-paper p-3.5">
          <div>
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
              Reported value
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-semibold tracking-tight text-ink">
                {value}
              </span>
              <span className="text-xs font-medium text-muted">{unit}</span>
              {isBelow && (
                <span className="ml-1 inline-flex items-center rounded-sm bg-attention-soft px-1.5 py-0.5 text-[11px] font-medium text-attention">
                  <ArrowDownRight className="h-3.5 w-3.5" /> Low
                </span>
              )}
              {isAbove && (
                <span className="ml-1 inline-flex items-center rounded-sm bg-attention-soft px-1.5 py-0.5 text-[11px] font-medium text-attention">
                  <ArrowUpRight className="h-3.5 w-3.5" /> High
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-muted">
              Reference range
            </span>
            <span className="font-mono text-xs font-medium text-ink-soft">
              {referenceRange}
            </span>
          </div>
        </div>

        {typeof minRef === 'number' && typeof maxRef === 'number' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-medium text-muted">
              <span>Low</span>
              <span className="text-accent-deep">In range</span>
              <span>High</span>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-line-soft">
              <div className="absolute inset-y-0 left-[30%] right-[30%] border-x border-accent/25 bg-accent/15" />
              <div
                className={`absolute top-0 bottom-0 -ml-1 w-2 rounded-full transition-all ${
                  markerStyles[status] || markerStyles.normal
                }`}
                style={{ left: `${gaugePositionPercent}%` }}
                title={`Reported: ${value} ${unit}`}
              />
            </div>
          </div>
        )}

        <div className="pt-1">
          <p className="text-xs leading-relaxed text-ink-soft sm:text-sm">
            {simpleExplanation}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line-soft pt-4">
        <span className="flex items-center gap-1 text-[11px] font-medium text-muted">
          <Info className="h-3.5 w-3.5" /> Educational context
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLearnMore && onLearnMore(finding)}
          icon={ChevronRight}
          iconPosition="right"
          className="hover:border-accent/40 hover:text-accent"
        >
          Details
        </Button>
      </div>
    </Card>
  );
}
