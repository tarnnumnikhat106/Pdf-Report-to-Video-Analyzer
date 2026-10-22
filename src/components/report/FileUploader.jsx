import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  FileImage, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ArrowRight,
  Sparkles,
  Info
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
          className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? 'border-blue-500 bg-blue-50/70 scale-[0.99]'
              : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/80 bg-white'
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
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
              isDragging ? 'bg-blue-600 text-white' : 'bg-blue-50 text-blue-600 border border-blue-100'
            }`}>
              <UploadCloud className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              Upload Your Medical Report
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Drag & drop your report here, or <span className="text-blue-600 font-semibold underline underline-offset-2">browse files</span>
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500 bg-slate-100/80 py-1.5 px-3 rounded-full border border-slate-200">
              <span className="font-medium text-slate-700">Supported:</span>
              <span>PDF, JPG, JPEG, PNG</span>
              <span className="text-slate-300">•</span>
              <span>Max: {MAX_FILE_SIZE_MB} MB</span>
            </div>
          </div>
        </div>
      ) : (
        /* Selected File Card */
        <Card className="bg-slate-50/70 border-blue-200" padding="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-500/20">
                {selectedFile.type.includes('pdf') || selectedFile.name.endsWith('.pdf') ? (
                  <FileText className="w-6 h-6" />
                ) : (
                  <FileImage className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-semibold text-slate-900 truncate max-w-xs sm:max-w-md">
                    {selectedFile.name}
                  </h4>
                  <span className="text-xs uppercase px-2 py-0.5 rounded font-mono font-medium bg-blue-100 text-blue-800">
                    {selectedFile.name.split('.').pop()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>Size: {formatFileSize(selectedFile.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Validated Format
                  </span>
                </div>
              </div>
            </div>

            {!isUploading && (
              <button
                onClick={handleRemoveFile}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
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
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Uploading document to ingestion pipeline...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Row */}
          {!isUploading && (
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleTriggerBrowse}
                className="text-xs text-slate-600 hover:text-blue-600 underline underline-offset-2"
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
                Analyze Report
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Error Message Box */}
      {displayError && (
        <div 
          role="alert"
          className="flex items-start gap-3 p-4 rounded-xl border border-rose-200 bg-rose-50/80 text-rose-800 text-sm animate-in fade-in"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-rose-900">Upload Validation Error</p>
            <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{displayError}</p>
          </div>
          <button 
            onClick={() => {
              setValidationError(null);
              if (onClearError) onClearError();
            }}
            className="text-rose-500 hover:text-rose-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Evaluator / Demo Sample Reports Selector */}
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Or Test Immediately with Realistic Sample Medical Reports
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onSelectSample && onSelectSample('MR-001')}
            className="text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 transition-all text-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 group-hover:text-blue-700">Complete Blood Count (CBC)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">PDF</span>
            </div>
            <p className="text-slate-500 line-clamp-2">Anemia indicators, Hemoglobin 9.2 g/dL, Ferritin & MCV findings</p>
          </button>

          <button
            type="button"
            onClick={() => onSelectSample && onSelectSample('MR-002')}
            className="text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 transition-all text-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 group-hover:text-blue-700">Lipid & Heart Panel</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">PDF</span>
            </div>
            <p className="text-slate-500 line-clamp-2">LDL Cholesterol 156 mg/dL, Triglycerides, Non-HDL risk review</p>
          </button>

          <button
            type="button"
            onClick={() => onSelectSample && onSelectSample('MR-003')}
            className="text-left p-3.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/40 transition-all text-xs group"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-slate-800 group-hover:text-blue-700">Metabolic Panel (CMP)</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">PDF</span>
            </div>
            <p className="text-slate-500 line-clamp-2">Fasting Glucose 114 mg/dL, HbA1c 5.9%, Kidney & Liver clearance</p>
          </button>
        </div>
      </div>
    </div>
  );
}
