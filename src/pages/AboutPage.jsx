import React from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu,
  FileText,
  ArrowDown,
  Layers,
  Database,
  Sparkles,
  Video,
  Server,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Disclaimer from '../components/common/Disclaimer';

export default function AboutPage() {
  const pipelineStages = [
    {
      step: 1,
      title: "Report Upload",
      tech: "FastAPI multipart/form-data & File Validation",
      desc: "User submits medical lab panels in PDF, JPG, or PNG format. Files are strictly sanitized, verified for integrity, and passed to document stream parsers.",
      icon: FileText,
      color: "blue",
    },
    {
      step: 2,
      title: "OCR / Document Processing",
      tech: "Tesseract OCR / PaddleOCR / PyMuPDF",
      desc: "Extracts raw textual strings and bounding-box layout coordinates from rasterized scans or digital vector PDFs, normalizing table grids and headers.",
      icon: Layers,
      color: "indigo",
    },
    {
      step: 3,
      title: "Medical Information Extraction",
      tech: "Biomedical NER / BioBERT / Med-SpaCy",
      desc: "Identifies clinical named entities: test names (e.g. Hemoglobin, LDL), reported numerical values, measurement units (g/dL, mg/dL), and reference intervals.",
      icon: Cpu,
      color: "emerald",
    },
    {
      step: 4,
      title: "AI/ML Analysis",
      tech: "Python, Pandas, NumPy, Scikit-learn",
      desc: "Compares observed patient values against standardized biological reference distributions. Categorizes findings into Normal, Attention, and Important without diagnosing diseases.",
      icon: Database,
      color: "amber",
    },
    {
      step: 5,
      title: "Simple Explanation",
      tech: "Clinical NLP & Controlled LLM Prompt Engineering",
      desc: "Converts medical jargon into clear, plain-language patient explanations, highlighting biological mechanisms and generating targeted questions for the doctor.",
      icon: Sparkles,
      color: "purple",
    },
    {
      step: 6,
      title: "Video Generation",
      tech: "FFmpeg & Neural TTS Narration",
      desc: "Programmatically compiles structured slides, parameter gauges, and synchronized speech into a high-definition, chaptered educational video explanation.",
      icon: Video,
      color: "rose",
    },
  ];

  const backendTechStack = [
    { name: "Python 3.11+", role: "Core backend language & scientific computing environment" },
    { name: "FastAPI / Flask", role: "High-performance asynchronous REST API endpoints" },
    { name: "Pandas & NumPy", role: "Dataframe manipulation, unit conversion & vector operations" },
    { name: "Scikit-learn", role: "Statistical boundary classification & outlier detection" },
    { name: "PyMuPDF & Tesseract", role: "Document parsing, table reconstruction, and OCR" },
    { name: "BioBERT / Clinical NLP", role: "Biomedical named entity recognition (NER)" },
    { name: "FFmpeg", role: "Static slide rendering, encoding, and audio synchronization" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Page Header */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          <BookOpen className="h-3.5 w-3.5" />
          How it works
        </p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink">
          How MedVision reads a report
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          The path from an uploaded PDF to a plain-language summary and an educational video, with a person in the loop at every clinical decision.
        </p>
      </div>

      {/* Visual Pipeline Flow */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="font-display text-2xl text-ink">
            The six-stage pipeline
          </h2>
          <p className="mt-1 text-sm text-muted">
            From raw document to an interactive walkthrough.
          </p>
        </div>

        <div className="space-y-3 relative">
          {pipelineStages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <React.Fragment key={stage.step}>
                <Card padding="p-5 sm:p-6" className="border-slate-200 hover:border-blue-300 transition-all">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-accent-soft/60 text-accent-deep">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <span className="font-mono text-[11px] font-medium text-accent">
                            STAGE {String(stage.step).padStart(2, '0')}
                          </span>
                          <h3 className="font-display text-lg text-ink sm:text-xl">
                            {stage.title}
                          </h3>
                        </div>
                        <p className="font-mono text-[11px] text-muted">
                          {stage.tech}
                        </p>
                        <p className="pt-1 text-sm leading-relaxed text-ink-soft">
                          {stage.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Arrow Connector */}
                {idx < pipelineStages.length - 1 && (
                  <div className="flex justify-center py-0.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-paper-deep text-muted">
                      <ArrowDown className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* AI/ML Backend Architecture Specification */}
      <Card padding="p-6 sm:p-8" className="space-y-6 bg-paper-deep/40">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-accent-soft p-2.5 text-accent-deep">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-xl text-ink">
              How the backend is put together
            </h3>
            <p className="text-xs text-muted">
              Designed for clean integration with a FastAPI / Flask microservice.
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          The MedVision AI frontend communicates with a Python backend using standard REST endpoints (`/api/reports/upload`, `/api/reports/:id/analyze`, `/api/reports/:id/video`). The backend leverage the following scientific computing packages:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {backendTechStack.map((tech, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-0.5">
              <span className="text-xs font-bold text-blue-700 font-mono">{tech.name}</span>
              <p className="text-xs text-slate-600">{tech.role}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 leading-relaxed">
          <strong>Scientific Integrity Notice:</strong> We do not publish simulated or unverified model accuracy percentages (e.g., claiming "99.8% diagnostic precision"). The pipeline operates as an educational interpreter rather than an autonomous clinical practitioner.
        </div>
      </Card>

      {/* Mandatory Disclaimer */}
      <Disclaimer variant="card" />

      {/* Bottom CTA */}
      <div className="text-center pt-4">
        <Link to="/upload">
          <Button variant="primary" size="lg" icon={ArrowRight} iconPosition="right">
            Try MedVision AI with a Report
          </Button>
        </Link>
      </div>

    </div>
  );
}
