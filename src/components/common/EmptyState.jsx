import React from 'react';
import { FileSearch, PlusCircle } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = "No reports found",
  description = "No medical reports match your search criteria. Try modifying your filters or upload a new report.",
  icon: Icon = FileSearch,
  actionText = "Upload Report",
  onAction,
  className = "",
}) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={PlusCircle} variant="outline" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
}
