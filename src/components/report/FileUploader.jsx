import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ArrowRight
} from 'lucide-react';
import Button from '../common/Button';
import Card from '../common/Card';

const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

const ALLOWED_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png'];
const MAX_FILE_SIZE_MB = 15;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export default function FileUploader({
  onFileSelect,
  onSubmit,
  isUploading = false,
  uploadProgress = 0,
  error = null,
  onClearError,
  onSelectSample,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const fileInputRef = useRef(null);

  const validateAndSetFile = (file) => {
    if (onClearError) onClearError();
    setValidationError(null);

    if (!file) {
      setValidationError("Please select a valid medical document to analyze.");
      return false;
    }

    // Check extension and mime
    const ext = file.name.split('.').pop().toLowerCase();
    const isValidExt = ALLOWED_EXTENSIONS.includes(ext);
    const isValidMime = ALLOWED_MIME_TYPES.includes(file.type) || isValidExt;

    if (!isValidExt && !isValidMime) {
      setValidationError(`Unsupported file format ('.${ext}'). Supported formats are PDF, JPG, JPEG, and PNG.`);
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setValidationError(`File size (${sizeMB} MB) exceeds the maximum allowed limit of ${MAX_FILE_SIZE_MB} MB.`);
      return false;
    }

    if (file.size === 0) {
      setValidationError("The selected file is empty. Please choose a valid medical document.");
      return false;
    }

    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
    return true;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndSetFile(file);
    }
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndSetFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onFileSelect) {
      onFileSelect(null);
    }
  };

  const handleTriggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAnalyzeClick = () => {
    if (!selectedFile) {
      setValidationError("Please select or drop a medical report before analyzing.");
      return;
    }
    if (onSubmit) {
      onSubmit(selectedFile);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const displayError = validationError || error;

  return (
    <div className="space-y-6">
      {/* Hidden native input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        onChange={handleInputChange}
        className="hidden"
        id="medical-report-file-input"
        data-testid="file-input"
      />

      {/* Drag & Drop Zone */}
      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerBrowse}
          className={`relative rounded-lg border border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? 'border-accent bg-accent-soft/60 scale-[0.995]'
              : 'border-line bg-paper/40 hover:border-accent/50 hover:bg-paper'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleTriggerBrowse();
            }
          }}
          aria-label="Upload your medical report. Drag and drop file or browse."
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-md transition-colors ${
              isDragging ? 'bg-accent text-surface' : 'border border-accent/15 bg-accent-soft text-accent'
            }`}>
              <UploadCloud className="h-7 w-7" />
            </div>

            <h3 className="mb-1 font-display text-xl tracking-tight text-ink">
              Drop a report here
            </h3>
            <p className="mb-4 text-sm text-muted">
              or <span className="font-medium text-accent underline decoration-accent/30 underline-offset-4">browse files</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 rounded-md border border-line bg-surface px-3 py-1.5 text-xs text-muted">
              <span>PDF, JPG, JPEG, PNG</span>
              <span className="text-line">|</span>
              <span>Up to {MAX_FILE_SIZE_MB} MB</span>
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <Card className="bg-paper/40 border-line" padding="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent text-surface">
                {selectedFile.type.includes('pdf') || selectedFile.name.endsWith('.pdf') ? (
                  <FileText className="w-6 h-6" />
                ) : (
                  <FileImage className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="max-w-xs truncate text-sm font-semibold text-ink sm:max-w-md sm:text-base">
                    {selectedFile.name}
                  </h4>
                  <span className="rounded-sm bg-accent-soft px-2 py-0.5 font-mono text-[10px] font-medium uppercase text-accent-deep">
                    {selectedFile.name.split('.').pop()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted">
                  <span>{formatFileSize(selectedFile.size)}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-medium text-accent-deep">
                    <CheckCircle className="w-3.5 h-3.5" /> Format accepted
                  </span>
                </div>
              </div>
            </div>

            {!isUploading && (
              <button
                onClick={handleRemoveFile}
                className="rounded-md p-1.5 text-muted transition-colors hover:bg-paper-deep hover:text-ink"
                title="Remove file"
                aria-label="Remove selected file"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Upload Progress Bar if in progress */}
          {isUploading && (
            <div className="mt-5 space-y-2">
              <div className="flex justify-between text-xs font-medium text-ink-soft">
                <span>Uploading report…</span>
                <span className="font-mono">{uploadProgress}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-line-soft">
                <div
                  className="h-full rounded-full bg-accent transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Row */}
          {!isUploading && (
            <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-line-soft pt-4 sm:flex-row">
              <button
                type="button"
                onClick={handleTriggerBrowse}
                className="text-xs text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
              >
                Choose a different file
              </button>
              <Button
                variant="primary"
                size="md"
                onClick={handleAnalyzeClick}
                isLoading={isUploading}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Analyze report
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Error Message Box */}
      {displayError && (
        <div 
          role="alert"
          className="flex items-start gap-3 rounded-md border border-danger/25 bg-danger-soft/70 p-4 text-sm text-danger animate-in fade-in"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">That file can’t be used</p>
            <p className="mt-0.5 text-xs leading-relaxed text-danger/85">{displayError}</p>
          </div>
          <button 
            type="button"
            onClick={() => {
              setValidationError(null);
              if (onClearError) onClearError();
            }}
            className="rounded-sm p-1 text-danger/70 transition-colors hover:bg-danger/10 hover:text-danger"
            aria-label="Dismiss upload error"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Evaluator / Demo Sample Reports Selector */}
      <div className="pt-2">
        <div className="mb-3 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-6 bg-line" />
          <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
            Or open a sample report
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onSelectSample && onSelectSample('MR-001')}
            className="text-left p-3.5 rounded-md border border-line bg-surface hover:border-accent/40 hover:bg-paper transition-all text-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink group-hover:text-accent">Complete Blood Count (CBC)</span>
              <span className="rounded-sm bg-paper-deep px-1.5 py-0.5 font-mono text-[10px] text-muted">PDF</span>
            </div>
            <p className="text-muted line-clamp-2">Anemia indicators, Hemoglobin 9.2 g/dL, Ferritin & MCV findings</p>
          </button>

          <button
            type="button"
            onClick={() => onSelectSample && onSelectSample('MR-002')}
            className="text-left p-3.5 rounded-md border border-line bg-surface hover:border-accent/40 hover:bg-paper transition-all text-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink group-hover:text-accent">Lipid & Heart Panel</span>
              <span className="rounded-sm bg-paper-deep px-1.5 py-0.5 font-mono text-[10px] text-muted">PDF</span>
            </div>
            <p className="text-muted line-clamp-2">LDL Cholesterol 156 mg/dL, Triglycerides, Non-HDL risk review</p>
          </button>

          <button
            type="button"
            onClick={() => onSelectSample && onSelectSample('MR-003')}
            className="text-left p-3.5 rounded-md border border-line bg-surface hover:border-accent/40 hover:bg-paper transition-all text-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-ink group-hover:text-accent">Metabolic Panel (CMP)</span>
              <span className="rounded-sm bg-paper-deep px-1.5 py-0.5 font-mono text-[10px] text-muted">PDF</span>
            </div>
            <p className="text-muted line-clamp-2">Fasting Glucose 114 mg/dL, HbA1c 5.9%, Kidney & Liver clearance</p>
          </button>
        </div>
      </div>
    </div>
  );
}
