import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import FileUploader from '../components/report/FileUploader';
import Disclaimer from '../components/common/Disclaimer';
import { uploadReport } from '../services/api';
import { useToast } from '../context/ToastContext';

const steps = [
  {
    title: 'Read the document',
    body: 'Text and values are pulled from the PDF or image. A straight, well-lit scan reads best.',
  },
  {
    title: 'Mark the ranges',
    body: 'Each result is compared with the reference interval printed on the report.',
  },
  {
    title: 'Explain the findings',
    body: 'You get a plain-language note for each value, plus questions to raise with a clinician.',
  },
];

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

      addToast('Report uploaded. Opening the analysis…', 'success');

      const reportId = response.reportId || 'MR-001';
      setTimeout(() => {
        navigate(`/analysis-loading/${reportId}`);
      }, 400);
    } catch (err) {
      console.error('Upload failed:', err);
      setUploadError(err.message || 'The report could not be uploaded. Try again.');
      addToast('Upload failed.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSelectSample = (sampleReportId) => {
    addToast(`Opening sample report ${sampleReportId}…`, 'info');
    navigate(`/analysis-loading/${sampleReportId}`);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="max-w-2xl">
        <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Upload
        </p>
        <h1 className="mt-4 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Upload a lab report.
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          PDF, JPG, JPEG, or PNG up to 15 MB. We read the values and reference
          ranges, then show the findings in plain language.
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-accent" />
          Educational use only. Not a diagnosis.
        </p>
      </header>

      <div className="mt-10 rounded-lg border border-line bg-surface p-6 sm:p-8">
        <FileUploader
          onSubmit={handleUploadSubmit}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          error={uploadError}
          onClearError={() => setUploadError(null)}
          onSelectSample={handleSelectSample}
        />
      </div>

      <section className="mt-14 border-t border-line pt-8">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          What happens next
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title}>
              <span className="font-mono text-[11px] text-muted">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-ink">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <Disclaimer variant="callout" />
      </div>
    </div>
  );
}
