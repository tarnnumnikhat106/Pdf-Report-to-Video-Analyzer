import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  ShieldCheck, 
  Lock, 
  FileCheck2, 
  AlertTriangle, 
  Info, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import FileUploader from '../components/report/FileUploader';
import Disclaimer from '../components/common/Disclaimer';
import Card from '../components/common/Card';
import { uploadReport } from '../services/api';
import { useToast } from '../context/ToastContext';

export default function UploadPage() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleUploadSubmit = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const response = await uploadReport(file, (progress) => {
        setUploadProgress(progress);
      });

      addToast('Report uploaded successfully. Launching analysis pipeline...', 'success');
      
      // Navigate to the analysis loading transition page with the reportId
      const reportId = response.reportId || 'MR-001';
      setTimeout(() => {
        navigate(`/analysis-loading/${reportId}`);
      }, 400);

    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'Failed to upload report document. Please try again.');
      addToast('Upload encountered an error.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectSample = (sampleReportId) => {
    addToast(`Loading sample clinical report (${sampleReportId})...`, 'info');
    navigate(`/analysis-loading/${sampleReportId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
          <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />
          <span>Laboratory Report Upload & Review</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Upload Your Medical Report
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
          Provide your laboratory blood work or diagnostic panel in PDF or image format to review your findings, doctor questions, and dietary guidance.
        </p>
      </div>

      {/* Main Upload Area */}
      <Card padding="p-6 sm:p-8" className="border-slate-200 shadow-md">
        <FileUploader
          onSubmit={handleUploadSubmit}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          error={uploadError}
          onClearError={() => setUploadError(null)}
          onSelectSample={handleSelectSample}
        />
      </Card>

      {/* Security & Privacy Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Encrypted Transport</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Files are processed over secure SSL connections without persistent public storage.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <FileCheck2 className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Clean OCR Parsing</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Accepts high-resolution scans and digital PDF laboratory outputs from major providers.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/90 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Educational Scope</h4>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
              Intended to support patient literacy and prepare talking points for your doctor.
            </p>
          </div>
        </div>
      </div>

      {/* Mandatory Disclaimer */}
      <Disclaimer variant="callout" />
    </div>
  );
}
