import React from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export default function SeverityBadge({ status = 'normal', size = 'md', showIcon = true, className = '' }) {
  const normalizedStatus = String(status).toLowerCase();

  const configs = {
    normal: {
      label: 'In range',
      bg: 'bg-accent-soft text-accent-deep border-accent/20',
      icon: CheckCircle2,
      dot: 'bg-accent',
    },
    attention: {
      label: 'Review',
      bg: 'bg-attention-soft text-attention border-attention/25',
      icon: AlertTriangle,
      dot: 'bg-attention',
    },
    important: {
      label: 'Discuss',
      bg: 'bg-danger-soft text-danger border-danger/25',
      icon: AlertCircle,
      dot: 'bg-danger',
    },
  };

  const current = configs[normalizedStatus] || configs.normal;
  const Icon = current.icon;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-medium',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md border ${current.bg} ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
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
