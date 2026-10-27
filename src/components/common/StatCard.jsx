import React from 'react';
import Card from './Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
}) {
  return (
    <Card className={`relative ${className}`} padding="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          {title}
        </p>
        {Icon && <Icon className="w-4 h-4 shrink-0 text-muted" />}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl leading-none tracking-tight text-ink">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-medium text-muted">{trend}</span>
        )}
      </div>
      {subtitle && (
        <p className="pt-2 text-xs leading-snug text-muted">{subtitle}</p>
      )}
    </Card>
  );
}
