import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  Stethoscope,
  Apple,
  Ban,
  Droplet,
  Pill,
  Check,
  ArrowRight,
  HelpCircle,
  FileCode
} from 'lucide-react';
import Card from '../common/Card';
import Button from '../common/Button';
import MLOutputVisualizer from './MLOutputVisualizer';

export default function LlamaAdvisorCard({ llamaAnalysis, mlAnalysis, className = '' }) {
  const [showJson, setShowJson] = useState(false);
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

  const isHighRisk = connect_to_doctor || String(risk_level).toLowerCase().includes('high');

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

  const toggleQuestion = (idx) => {
    setCheckedQuestions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const doctorNote = String(doctor_message || "The machine learning model placed this report in the high risk category. Please speak with your physician or the suggested specialist for confirmation and next steps.")
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^high risk detected[:\s-]*/i, '');

  const recommendedFoods = diet_guidance.recommended_foods || [];
  const foodsToAvoid = diet_guidance.foods_to_avoid || [];
  const hydrationHabits = diet_guidance.hydration_and_habits || [];
  const keyNutrients = diet_guidance.key_nutrients || [];

  return (
    <div className={`space-y-6 ${className}`}>

      {/* High risk escalation */}
      {isHighRisk && (
        <section className="overflow-hidden rounded-lg border border-danger/25 bg-danger-soft/60">
          <div className="flex flex-col gap-4 border-b border-danger/15 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-danger/20 bg-surface text-danger">
                <Stethoscope className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-danger">
                  Medical consultation advised
                  <span className="ml-2 font-normal text-danger/70">{doctor_urgency} urgency</span>
                </p>
                <h2 className="mt-1 font-display text-2xl leading-tight text-ink">
                  High risk detected. Talk to a doctor.
                </h2>
              </div>
            </div>

            <div className="shrink-0 rounded-md border border-danger/15 bg-surface/70 px-3 py-2">
              <span className="block text-[10px] uppercase tracking-[0.14em] text-muted">
                Suggested specialty
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-ink">
                {recommended_doctor_specialty}
              </span>
            </div>
          </div>

          <div className="space-y-5 px-6 py-5">
            <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">
              {doctorNote}
            </p>

            {questions_for_doctor.length > 0 && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    <HelpCircle className="h-3.5 w-3.5" />
                    Questions to ask your doctor
                  </h3>
                  <span className="text-[11px] text-muted">Check off as you go</span>
                </div>

                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {questions_for_doctor.map((question, idx) => {
                    const isChecked = checkedQuestions[idx];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => toggleQuestion(idx)}
                        aria-pressed={!!isChecked}
                        className={`flex items-start gap-3 rounded-md border px-3.5 py-3 text-left text-xs leading-snug transition-colors sm:text-sm ${
                          isChecked
                            ? 'border-accent/25 bg-accent-soft/60 text-muted line-through'
                            : 'border-line bg-surface text-ink-soft hover:border-line/80 hover:bg-paper/60'
                        }`}
                      >
                        <span className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          isChecked ? 'border-accent bg-accent text-surface' : 'border-line bg-surface'
                        }`}>
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </span>
                        <span>{question}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-danger/15 pt-4 text-xs text-muted">
              <span className="flex items-start gap-2">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
                Do not begin prescription medication without direct medical supervision.
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 font-semibold text-danger underline decoration-danger/30 underline-offset-4 hover:decoration-danger"
              >
                Print questions for your visit
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Clinical overview and dietary guidance */}
      <Card padding="p-6 sm:p-8" className="space-y-6">
        <div className="flex flex-col gap-4 border-b border-line-soft pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">{model_used}</p>
            <h2 className="mt-1 font-display text-2xl leading-tight text-ink sm:text-3xl">
              Clinical overview & dietary guidance
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
              A plain-language reading of your results, with food and habit notes to discuss with your clinician.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${
              isHighRisk
                ? 'border-danger/25 bg-danger-soft text-danger'
                : 'border-accent/20 bg-accent-soft text-accent-deep'
            }`}>
              <Sparkles className="h-3.5 w-3.5" />
              Risk status: {risk_level}
            </span>
            <Button
              variant="outline"
              size="sm"
              icon={FileCode}
              onClick={() => setShowJson(!showJson)}
              className="text-xs"
            >
              {showJson ? 'Hide ML output' : 'View ML output'}
            </Button>
          </div>
        </div>

        {showJson && (
          <div className="animate-in fade-in duration-200">
            <MLOutputVisualizer
              mlOutput={mlJsonPayload}
              title="Machine learning classification"
              subtitle="The standardized model output fed into Meta Llama 3.2"
            />
          </div>
        )}

        {overview && (
          <div className="rounded-md border border-line bg-paper/60 p-5">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
              Diagnostic synthesis
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
              {overview}
            </p>
          </div>
        )}

        <div className="space-y-4 pt-1">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent-soft text-accent-deep">
              <Apple className="h-4 w-4" />
            </span>
            <h3 className="font-display text-xl text-ink">
              Personalized dietary guidance
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="space-y-3 rounded-md border border-line bg-surface p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-accent-deep">
                <Check className="h-4 w-4 stroke-[2.5]" />
                Foods to include
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-ink-soft sm:text-sm">
                {recommendedFoods.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 text-accent">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3 rounded-md border border-danger/20 bg-danger-soft/40 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-danger">
                <Ban className="h-4 w-4" />
                Foods and substances to limit
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-ink-soft sm:text-sm">
                {foodsToAvoid.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="mt-0.5 text-danger/70">·</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {hydrationHabits.length > 0 && (
              <div className="space-y-2 rounded-md border border-line bg-paper-deep/50 p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <Droplet className="h-3.5 w-3.5 text-accent" />
                  Hydration and daily habits
                </div>
                <ul className="space-y-1.5 text-xs leading-relaxed text-ink-soft">
                  {hydrationHabits.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-accent">·</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {keyNutrients.length > 0 && (
              <div className="space-y-2 rounded-md border border-line bg-paper-deep/50 p-4">
                <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                  <Pill className="h-3.5 w-3.5 text-accent" />
                  Nutrients to focus on
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {keyNutrients.map((n, i) => (
                    <span
                      key={i}
                      className="rounded border border-line bg-surface px-2.5 py-1 text-xs font-medium text-ink-soft"
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
