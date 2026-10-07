import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SeverityBadge({ status = 'normal', size = 'md', showIcon = true, className = '' }) {
  const normalizedStatus = String(status).toLowerCase();

  const configs = {
    normal: {
      label: 'Normal',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      icon: CheckCircle2,
      dot: 'bg-emerald-500',
    },
    attention: {
      label: 'Attention',
      bg: 'bg-amber-50 text-amber-800 border-amber-200/90',
      icon: AlertTriangle,
      dot: 'bg-amber-500',
    },
    important: {
      label: 'Important',
      bg: 'bg-rose-50 text-rose-800 border-rose-200/90',
      icon: AlertCircle,
      dot: 'bg-rose-500',
    },
  };

  const current = configs[normalizedStatus] || configs.normal;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold tracking-wide uppercase',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${current.bg} ${sizeClasses[size] || sizeClasses.md} ${className}`}
    >
      {showIcon ? (
        <Icon className={`${iconSizes[size] || iconSizes.md} shrink-0`} />
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`} />
      )}
      <span>{current.label}</span>
    </span>
  );
}
