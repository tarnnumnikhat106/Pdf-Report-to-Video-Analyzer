import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  UploadCloud, 
  Cpu, 
  FileText, 
  Video, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  Activity, 
  LineChart, 
  BookOpen, 
  History as HistoryIcon,
  Stethoscope,
  Eye,
  Sliders,
  Play
} from 'lucide-react';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import SeverityBadge from '../components/common/SeverityBadge';
import Disclaimer from '../components/common/Disclaimer';

export default function LandingPage() {
  const navigate = useNavigate();

  const howItWorksSteps = [
    {
      number: "01",
      title: "Upload Report",
      description: "Securely upload your medical report as a PDF, JPG, or PNG document directly through our encrypted portal.",
      icon: UploadCloud,
    },
    {
      number: "02",
      title: "AI Extracts Information",
      description: "OCR and biomedical entity extraction detect tests, numerical values, units, and reference ranges.",
      icon: Cpu,
    },
    {
      number: "03",
      title: "Findings Are Explained",
      description: "Dense clinical terminology is translated into plain, empathetic language with clear context.",
      icon: FileText,
    },
    {
      number: "04",
      title: "Generate Video",
      description: "Produce a multi-modal narrated video walkthrough that visually breaks down what to discuss with your doctor.",
      icon: Video,
    },
  ];

  const keyFeatures = [
    {
      title: "Smart Report Analysis",
      desc: "Instant parsing of blood work, metabolic panels, and lipid profiles into structured digital insights.",
      icon: Activity,
    },
    {
      title: "Abnormal Finding Detection",
      desc: "Clear visual flags for values falling outside typical reference intervals, categorized by attention priority.",
      icon: AlertTriangle,
    },
    {
      title: "Medical Term Simplification",
      desc: "Plain-language definitions for complex terms like Ferritin, MCV, Non-HDL, and Creatinine.",
      icon: BookOpen,
    },
    {
      title: "AI-Powered Explanations",
      desc: "Structured breakdowns explaining biological context, dietary factors, and lifestyle relevance.",
      icon: Sparkles,
    },
    {
      title: "Visual Report Insights",
      desc: "Interactive range gauges and comparison bars so you can see where your numbers sit relative to healthy baselines.",
      icon: LineChart,
    },
    {
      title: "Educational Video Generation",
      desc: "Automated video presentations with synced chapters, captions, and synthesized narration.",
      icon: Video,
    },
    {
      title: "Analysis History",
      desc: "Search, filter, and review your previous analyses anytime to monitor health literacy over time.",
      icon: HistoryIcon,
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* Hero Section */}
      <section className="relative pt-8 sm:pt-16 pb-12 overflow-hidden">
        {/* Subtle decorative radial background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-radial from-blue-100/60 to-transparent -z-10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Next-Generation Patient Literacy & Decision Support</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Understand Your Medical Report <span className="text-blue-600">with AI</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                MedVision AI transforms complex medical reports into clear, easy-to-understand explanations and visual learning experiences.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Link to="/upload" className="w-full sm:w-auto">
                  <Button
                    variant="primary"
                    size="lg"
                    icon={ArrowRight}
                    iconPosition="right"
                    className="w-full sm:w-auto shadow-md shadow-blue-500/20"
                  >
                    Analyze My Report
                  </Button>
                </Link>
                <Link to="/about" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    How It Works
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Educational Decision Support
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  PDF, JPG & PNG Ingestion
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-indigo-600" />
                  Automated Video Explanations
                </span>
              </div>
            </div>

            {/* Right Column: Interactive Medical/AI Preview Card */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl blur-sm opacity-25" />

                <Card className="relative bg-white shadow-xl border-slate-200/80 overflow-hidden" padding="p-6">
                  {/* Mock Report Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                          AI Medical Analysis
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">
                          Complete Blood Count (CBC)
                        </h4>
                      </div>
                    </div>
                    <SeverityBadge status="attention" size="sm" />
                  </div>

                  {/* Sample Parameter 1: Attention */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/70 mb-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Hemoglobin (Hb)</span>
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        9.2 g/dL (Low)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Carries oxygen to organs and muscles. Result is below the standard range (12.0 - 15.5 g/dL).
                    </p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full w-[35%]" />
                    </div>
                  </div>

                  {/* Sample Parameter 2: Normal */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">White Blood Cells (WBC)</span>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        6.8 x10^3/µL (Normal)
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      Immune system defenders. Perfectly centered within the healthy physiological band.
                    </p>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-[60%]" />
                    </div>
                  </div>

                  {/* Multimedia Video Preview Ribbon */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0">
                        <Play className="w-4 h-4 ml-0.5 fill-white" />
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">Educational Video Ready</div>
                        <div className="text-[10px] text-slate-400">2m 45s • Spoken Explainer</div>
                      </div>
                    </div>
                    <Link to="/video/MR-001">
                      <span className="text-xs text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2">
                        Preview
                      </span>
                    </Link>
                  </div>
                </Card>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
            Step-by-Step Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            A reliable 4-step pipeline that takes your raw medical report and creates an intuitive learning experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorksSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="relative group border-slate-200/90 hover:border-blue-300 transition-all" padding="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-blue-200 font-mono transition-colors">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="bg-slate-100/70 py-16 sm:py-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              System Capabilities
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 mb-3">
              Key Features
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Designed from the ground up for clarity, medical safety, and patient empowerment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {keyFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety & Medical Boundary Disclaimer Callout */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Disclaimer variant="card" />
      </section>

      {/* Bottom CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to analyze your medical report?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Upload your PDF or image to extract findings, view plain-language definitions, and generate an educational video explanation.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/upload')}
                icon={ArrowRight}
                iconPosition="right"
                className="shadow-lg shadow-blue-500/20"
              >
                Start Report Analysis
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
