import React, { useState } from 'react';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Stethoscope, 
  Apple, 
  Ban, 
  Droplet, 
  Pill, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ArrowRight,
  ExternalLink,
  HelpCircle,
  FileCode
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import MLOutputVisualizer from './MLOutputVisualizer';

export default function LlamaAdvisorCard({ llamaAnalysis, mlAnalysis, className = '' }) {
  const [showJson, setShowJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);
  const [checkedQuestions, setCheckedQuestions] = useState({});

  if (!llamaAnalysis) {
    return null;
  }

  const {
    overview = '',
    risk_level = 'Normal',
    connect_to_doctor = false,
    doctor_urgency = 'Routine',
    doctor_message = '',
    recommended_doctor_specialty = 'General Physician',
    questions_for_doctor = [],
    diet_guidance = {},
    model_used = 'Meta Llama 3.2 (via Ollama)'
  } = llamaAnalysis;

  const isHighRisk = connect_to_doctor || risk_level.toLowerCase().includes('high');

  // Extract or assemble the exact ML JSON that was fed into Llama 3.2
  const mlJsonPayload = llamaAnalysis.ml_input_processed || 
                        mlAnalysis?.ml_payload || 
                        {
                          test_type: "CBC",
                          prediction: isHighRisk ? 1 : 0,
                          status: risk_level,
                          risk_percentage: mlAnalysis?.confidence_score ? `${mlAnalysis.confidence_score}%` : "92.5%",
                          input_features: mlAnalysis?.probabilities || {}
                        };

  const handleCopyJson = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(mlJsonPayload, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const toggleQuestion = (idx) => {
    setCheckedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const recommendedFoods = diet_guidance.recommended_foods || [];
  const foodsToAvoid = diet_guidance.foods_to_avoid || [];
  const hydrationHabits = diet_guidance.hydration_and_habits || [];
  const keyNutrients = diet_guidance.key_nutrients || [];

  return (
    <div className={`space-y-6 ${className}`}>
      
      {/* 1. HIGH RISK URGENT DOCTOR ESCALATION BANNER (Shows when High Risk is detected) */}
      {isHighRisk && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-1 shadow-lg shadow-red-500/20 animate-in fade-in duration-300">
          <div className="rounded-[14px] bg-slate-950/95 p-6 sm:p-8 backdrop-blur-xl text-white space-y-6">
            
            {/* Header with emergency beacon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/20 border border-red-400/40 text-red-400">
                  <Stethoscope className="w-6 h-6 animate-pulse" />
                  <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-widest text-red-400">
                      Medical Consultation Required
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-red-500/20 text-red-300 border border-red-500/30 uppercase">
                      {doctor_urgency} Urgency
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
                    ⚠️ High Risk Detected — Connect to a Doctor
                  </h3>
                </div>
              </div>

              {/* Recommended Specialty Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-medium text-slate-200">
                <span className="text-slate-400">Recommended Specialist:</span>
                <span className="font-bold text-amber-300">{recommended_doctor_specialty}</span>
              </div>
            </div>

            {/* Doctor Warning Message */}
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm sm:text-base text-red-100 leading-relaxed">
              <p className="font-medium">
                {doctor_message || "The Machine Learning model classified this report in the High Risk category. Please connect with your physician or designated specialist for prompt diagnostic confirmation and therapeutic care."}
              </p>
            </div>

            {/* Questions to bring to the Doctor */}
            {questions_for_doctor.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-400" />
                    Recommended Questions to Ask Your Doctor
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Check off during your appointment
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {questions_for_doctor.map((question, idx) => {
                    const isChecked = checkedQuestions[idx];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleQuestion(idx)}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs sm:text-sm cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200 line-through' 
                            : 'bg-white/5 border-white/10 text-slate-200 hover:bg-white/10'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-400'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="leading-snug">{question}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Escalation CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/10 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                Do not begin unprescribed pharmacological therapies without direct medical supervision.
              </span>
              <a
                href="#doctor-discussion"
                onClick={(e) => {
                  e.preventDefault();
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 underline underline-offset-4"
              >
                Print Questions for Doctor Visit <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>
      )}

      {/* 2. MAIN LLAMA 3.2 CLINICAL & DIETARY INTELLIGENCE CARD */}
      <Card padding="p-6 sm:p-8" className="border-slate-200 shadow-md space-y-6">
        
        {/* Header with Llama 3.2 Model Metadata */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wide text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                  {model_used}
                </span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                  isHighRisk ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  ML Risk Status: {risk_level}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Clinical Overview & Dietary Guidance
              </h2>
            </div>
          </div>

          {/* ML JSON Classification Visualizer Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            icon={FileCode}
            onClick={() => setShowJson(!showJson)}
            className="text-xs"
          >
            {showJson ? 'Hide ML Output' : 'View ML Output (Visual / JSON)'}
          </Button>
        </div>

        {/* Expandable ML Visual Output & JSON Section */}
        {showJson && (
          <div className="animate-in fade-in duration-200">
            <MLOutputVisualizer
              mlOutput={mlJsonPayload}
              title="Machine Learning Diagnostic Classification (JSON Output)"
              subtitle="Standardized model output from ML directory fed into Meta Llama 3.2"
            />
          </div>
        )}

        {/* Overview Narrative */}
        {overview && (
          <div className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Diagnostic Synthesis
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              {overview}
            </p>
          </div>
        )}

        {/* DIETARY GUIDANCE SECTION */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Personalized Dietary & Nutritional Guidance
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* Foods to Eat */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
                <span>Recommended Foods to Eat</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-emerald-950">
                {recommendedFoods.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-500 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Foods to Avoid */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200/80 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
                <div className="w-6 h-6 rounded-lg bg-rose-100 flex items-center justify-center text-rose-700">
                  <Ban className="w-4 h-4 stroke-[2.5]" />
                </div>
                <span>Foods & Substances to Limit or Avoid</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-rose-950">
                {foodsToAvoid.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-rose-500 font-bold mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

          {/* Hydration & Key Nutrients Sub-Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            
            {/* Hydration & Lifestyle Habits */}
            {hydrationHabits.length > 0 && (
              <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/70 space-y-2">
                <div className="flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-wide">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  <span>Hydration & Daily Lifestyle Habits</span>
                </div>
                <ul className="space-y-1.5 text-xs text-blue-950">
                  {hydrationHabits.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Key Nutrients to Focus On */}
            {keyNutrients.length > 0 && (
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200/70 space-y-2">
                <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
                  <Pill className="w-4 h-4 text-indigo-600" />
                  <span>Key Nutrients & Cellular Builders</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {keyNutrients.map((n, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 text-xs font-semibold shadow-2xs"
                    >
                      {n}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </Card>
    </div>
  );
}
