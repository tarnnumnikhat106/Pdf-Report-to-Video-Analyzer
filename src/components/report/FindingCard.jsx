import React from 'react';
import { ChevronRight, ArrowUpRight, ArrowDownRight, Check, Activity, Info } from 'lucide-react';
import Card from '../common/Card';
import SeverityBadge from '../common/SeverityBadge';
import Button from '../common/Button';

export default function FindingCard({
  finding,
  onLearnMore,
}) {
  const {
    name,
    category,
    value,
    unit,
    referenceRange,
    minRef,
    maxRef,
    status = 'normal',
    severityLevel = 'NORMAL',
    simpleExplanation,
  } = finding;

  // Calculate visual position on a scale if minRef and maxRef are available
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
    normal: 'border-slate-200 hover:border-emerald-300',
    attention: 'border-amber-200 bg-amber-50/15 hover:border-amber-400',
    important: 'border-rose-200 bg-rose-50/20 hover:border-rose-400',
  };

  return (
    <Card 
      className={`transition-all duration-200 hover:shadow-md flex flex-col justify-between ${
        borderStyles[status] || borderStyles.normal
      }`}
      padding="p-5 sm:p-6"
    >
      <div className="space-y-4">
        {/* Header Row: Category, Name, Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            {category && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                {category}
              </span>
            )}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              {name}
            </h3>
          </div>
          <SeverityBadge status={status} size="sm" />
        </div>

        {/* Value and Reference Range Container */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
              Reported Value
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-slate-900 tracking-tight font-mono">
                {value}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {unit}
              </span>
              {isBelow && (
                <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded ml-1">
                  <ArrowDownRight className="w-3.5 h-3.5" /> Low
                </span>
              )}
              {isAbove && (
                <span className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded ml-1">
                  <ArrowUpRight className="w-3.5 h-3.5" /> High
                </span>
              )}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-0.5">
              Reference Range
            </span>
            <span className="text-xs font-semibold text-slate-700 font-mono">
              {referenceRange}
            </span>
          </div>
        </div>

        {/* Mini Range Visualizer Bar */}
        {typeof minRef === 'number' && typeof maxRef === 'number' && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>Low</span>
              <span className="text-emerald-700 font-semibold">Standard Reference Target</span>
              <span>High</span>
            </div>
            <div className="relative h-2 rounded-full bg-slate-200 overflow-hidden">
              {/* Target normal band in center */}
              <div className="absolute top-0 bottom-0 left-[30%] right-[30%] bg-emerald-100 border-x border-emerald-300" />
              {/* Marker pin */}
              <div 
                className={`absolute top-0 bottom-0 w-2.5 rounded-full -ml-1 transition-all ${
                  status === 'normal' 
                    ? 'bg-emerald-600 ring-2 ring-emerald-200' 
                    : status === 'important'
                    ? 'bg-rose-600 ring-2 ring-rose-200'
                    : 'bg-amber-600 ring-2 ring-amber-200'
                }`}
                style={{ left: `${gaugePositionPercent}%` }}
                title={`Reported: ${value} ${unit}`}
              />
            </div>
          </div>
        )}

        {/* Patient Simple Explanation */}
        <div className="pt-1">
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {simpleExplanation}
          </p>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Info className="w-3.5 h-3.5" /> Educational context
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onLearnMore && onLearnMore(finding)}
          icon={ChevronRight}
          iconPosition="right"
          className="hover:border-blue-400 hover:text-blue-700"
        >
          Learn More
        </Button>
      </div>
    </Card>
  );
}
