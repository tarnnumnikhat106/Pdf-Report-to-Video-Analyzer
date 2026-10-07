import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  colorScheme = 'blue', // 'blue' | 'emerald' | 'amber' | 'slate' | 'rose'
  className = '',
}) {
  const schemeStyles = {
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
      valueColor: 'text-slate-900',
    },
    emerald: {
      iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
      valueColor: 'text-emerald-700',
    },
    amber: {
      iconBg: 'bg-amber-50 text-amber-600 border border-amber-100',
      valueColor: 'text-amber-800',
    },
    rose: {
      iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
      valueColor: 'text-rose-700',
    },
    slate: {
      iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
      valueColor: 'text-slate-900',
    },
  };

  const scheme = schemeStyles[colorScheme] || schemeStyles.blue;

  return (
    <Card className={`relative overflow-hidden ${className}`} padding="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl sm:text-3xl font-bold tracking-tight ${scheme.valueColor}`}>
              {value}
            </span>
            {trend && (
              <span className="text-xs text-slate-500 font-medium">
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 pt-0.5 leading-snug">
              {subtitle}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl shrink-0 ${scheme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </Card>
  );
}
