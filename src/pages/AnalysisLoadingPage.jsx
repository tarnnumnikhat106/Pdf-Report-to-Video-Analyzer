import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Activity, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';
import Card from '../components/common/Card';
import ProgressSteps from '../components/report/ProgressSteps';
import Disclaimer from '../components/common/Disclaimer';
import { PIPELINE_STEPS } from '../services/mockData';
import { analyzeReport } from '../services/api';

export default function AnalysisLoadingPage() {
  const { reportId = 'MR-001' } = useParams();
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Initiate AI backend analysis call in background
    analyzeReport(reportId).catch((err) => {
      console.warn("Background analysis query:", err);
    });

    // Step-by-step realistic animation interval
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PIPELINE_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          setIsFinished(true);
          return prev;
        }
      });
    }, 950);

    return () => clearInterval(stepInterval);
  }, [reportId]);

  // Navigate once finished after brief pause directly to ML Overview section
  useEffect(() => {
    if (isFinished) {
      const navTimer = setTimeout(() => {
        navigate(`/analysis/${reportId}#ml-overview`);
      }, 700);
      return () => clearTimeout(navTimer);
    }
  }, [isFinished, navigate, reportId]);

  const progressPercent = Math.min(
    100,
    Math.round(((currentStepIndex + 1) / PIPELINE_STEPS.length) * 100)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mb-2 animate-bounce">
          <Activity className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Analyzing Medical Report
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          Extracting laboratory parameters, evaluating standard reference ranges, and generating clinical guidance.
        </p>
      </div>

      {/* Progress Card */}
      <Card padding="p-6 sm:p-8" className="border-slate-200 shadow-md space-y-6">
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Processing Laboratory Findings</span>
            <span className="font-mono text-blue-700">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Step-by-step indicator */}
        <div className="py-2">
          <ProgressSteps
            steps={PIPELINE_STEPS}
            currentStepIndex={currentStepIndex}
            isComplete={isFinished}
          />
        </div>

        {/* Informational note */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>System Boundary:</strong> MedVision AI identifies numerical values and normal reference intervals to improve health literacy. It does not replace a clinical physician's diagnostic evaluation.
          </p>
        </div>
      </Card>

      <Disclaimer variant="compact" />
    </div>
  );
}
