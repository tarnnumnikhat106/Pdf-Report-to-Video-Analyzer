import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Stethoscope,
  Cpu,
  Check,
  AlertTriangle,
  Apple,
  Ban,
  Droplet,
  Pill,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Disclaimer from '../components/common/Disclaimer';
import MLOutputVisualizer from '../components/report/MLOutputVisualizer';
import DietChatSection from '../components/report/DietChatSection';
import { predictAndAdvise, getMLStatus } from '../services/api';
import { useToast } from '../context/ToastContext';

// Default parameter configurations and high-risk vs normal presets
const TEST_CONFIGS = {
  CBC: {
    title: "Complete Blood Count (CBC)",
    category: "Hematology & Anemia Detection",
    description: "Evaluates red blood cell lines, hemoglobin oxygenation, and immune cellular counts.",
    features: [
      { key: "Age", label: "Patient Age", min: 1, max: 100, step: 1, unit: "yrs" },
      { key: "Gender", label: "Biological Sex (0: Male, 1: Female)", min: 0, max: 1, step: 1, unit: "" },
      { key: "Hemoglobin", label: "Hemoglobin (Hb)", min: 5.0, max: 20.0, step: 0.1, unit: "g/dL" },
      { key: "Platelet_Count", label: "Platelet Count", min: 50000, max: 600000, step: 5000, unit: "/µL" },
      { key: "White_Blood_Cells", label: "White Blood Cells (WBC)", min: 2000, max: 25000, step: 100, unit: "/µL" },
      { key: "Red_Blood_Cells", label: "Red Blood Cells (RBC)", min: 2.0, max: 7.0, step: 0.1, unit: "x10^6/µL" },
      { key: "MCV", label: "Mean Corpuscular Volume (MCV)", min: 50.0, max: 120.0, step: 0.5, unit: "fL" },
      { key: "MCH", label: "Mean Corpuscular Hemoglobin", min: 15.0, max: 40.0, step: 0.5, unit: "pg" },
      { key: "MCHC", label: "MCHC Concentration", min: 20.0, max: 40.0, step: 0.5, unit: "g/dL" },
    ],
    presets: {
      highRisk: {
        name: "⚠️ High Risk (Microcytic Anemia)",
        values: {
          Age: 35,
          Gender: 1,
          Hemoglobin: 8.9,
          Platelet_Count: 215000,
          White_Blood_Cells: 6400,
          Red_Blood_Cells: 3.7,
          MCV: 71.5,
          MCH: 23.5,
          MCHC: 29.5
        }
      },
      normal: {
        name: "✅ Normal (Healthy Blood Count)",
        values: {
          Age: 32,
          Gender: 0,
          Hemoglobin: 14.8,
          Platelet_Count: 245000,
          White_Blood_Cells: 6800,
          Red_Blood_Cells: 4.8,
          MCV: 88.5,
          MCH: 29.8,
          MCHC: 33.5
        }
      }
    }
  },
  LFT: {
    title: "Liver Function Test (LFT)",
    category: "Hepatic Health & Enzyme Clearance",
    description: "Evaluates transaminases (ALT/AST), total bilirubin, and liver synthetic protein markers.",
    features: [
      { key: "age", label: "Patient Age", min: 1, max: 100, step: 1, unit: "yrs" },
      { key: "gender", label: "Biological Sex (1: Male, 0: Female)", min: 0, max: 1, step: 1, unit: "" },
      { key: "tot_bilirubin", label: "Total Bilirubin", min: 0.1, max: 15.0, step: 0.1, unit: "mg/dL" },
      { key: "direct_bilirubin", label: "Direct Bilirubin", min: 0.05, max: 8.0, step: 0.05, unit: "mg/dL" },
      { key: "tot_proteins", label: "Total Serum Proteins", min: 3.0, max: 12.0, step: 0.1, unit: "g/dL" },
      { key: "albumin", label: "Serum Albumin", min: 1.5, max: 6.0, step: 0.1, unit: "g/dL" },
      { key: "ag_ratio", label: "Albumin / Globulin Ratio", min: 0.2, max: 3.0, step: 0.05, unit: "" },
      { key: "sgpt", label: "ALT / SGPT Transaminase", min: 5, max: 350, step: 1, unit: "U/L" },
      { key: "sgot", label: "AST / SGOT Transaminase", min: 5, max: 350, step: 1, unit: "U/L" },
      { key: "alkphos", label: "Alkaline Phosphatase (ALP)", min: 50, max: 800, step: 5, unit: "U/L" },
    ],
    presets: {
      highRisk: {
        name: "⚠️ High Risk (Hepatic Cellular Stress)",
        values: {
          age: 46,
          gender: 1,
          tot_bilirubin: 2.8,
          direct_bilirubin: 1.4,
          tot_proteins: 6.2,
          albumin: 3.1,
          ag_ratio: 0.85,
          sgpt: 92.0,
          sgot: 78.0,
          alkphos: 290.0
        }
      },
      normal: {
        name: "✅ Normal (Healthy Liver Enzymes)",
        values: {
          age: 38,
          gender: 0,
          tot_bilirubin: 0.7,
          direct_bilirubin: 0.2,
          tot_proteins: 7.2,
          albumin: 4.3,
          ag_ratio: 1.4,
          sgpt: 22.0,
          sgot: 20.0,
          alkphos: 160.0
        }
      }
    }
  },
  KFT: {
    title: "Kidney Function Test (KFT / CKD)",
    category: "Renal Filtration & Electrolyte Dynamics",
    description: "Evaluates serum creatinine, blood urea nitrogen, urine specific gravity, and renal risk.",
    features: [
      { key: "age", label: "Patient Age", min: 1, max: 100, step: 1, unit: "yrs" },
      { key: "bp", label: "Blood Pressure (Diastolic)", min: 50, max: 140, step: 1, unit: "mmHg" },
      { key: "sc", label: "Serum Creatinine", min: 0.4, max: 12.0, step: 0.1, unit: "mg/dL" },
      { key: "bu", label: "Blood Urea Nitrogen (BUN)", min: 5, max: 150, step: 1, unit: "mg/dL" },
      { key: "bgr", label: "Blood Glucose Random", min: 50, max: 400, step: 2, unit: "mg/dL" },
      { key: "sod", label: "Serum Sodium", min: 115, max: 160, step: 0.5, unit: "mEq/L" },
      { key: "pot", label: "Serum Potassium", min: 2.5, max: 7.5, step: 0.1, unit: "mEq/L" },
      { key: "hemo", label: "Hemoglobin (Renal synthesis)", min: 4.0, max: 18.0, step: 0.1, unit: "g/dL" },
      { key: "pcv", label: "Packed Cell Volume (PCV)", min: 15, max: 60, step: 1, unit: "%" },
      { key: "sg", label: "Urine Specific Gravity", min: 1.005, max: 1.030, step: 0.005, unit: "" },
    ],
    presets: {
      highRisk: {
        name: "⚠️ High Risk (Renal Strain / CKD)",
        values: {
          id: 1,
          age: 58,
          bp: 90,
          sg: 1.010,
          al: 2,
          su: 1,
          rbc: 0,
          pc: 1,
          pcc: 0,
          ba: 0,
          bgr: 185,
          bu: 68,
          sc: 3.2,
          sod: 131,
          pot: 5.4,
          hemo: 9.8,
          pcv: 29,
          wc: 8400,
          rc: 3.4,
          htn: 1,
          dm: 1,
          cad: 0,
          appet: 1,
          pe: 1,
          ane: 1
        }
      },
      normal: {
        name: "✅ Normal (Healthy Kidney Baseline)",
        values: {
          id: 1,
          age: 34,
          bp: 75,
          sg: 1.020,
          al: 0,
          su: 0,
          rbc: 0,
          pc: 0,
          pcc: 0,
          ba: 0,
          bgr: 95,
          bu: 24,
          sc: 0.9,
          sod: 140,
          pot: 4.2,
          hemo: 14.2,
          pcv: 44,
          wc: 6900,
          rc: 4.9,
          htn: 0,
          dm: 0,
          cad: 0,
          appet: 0,
          pe: 0,
          ane: 0
        }
      }
    }
  }
};

export default function MLDiagnosticPage() {
  const { addToast } = useToast();
  const [activeTest, setActiveTest] = useState('CBC');
  const [formData, setFormData] = useState(TEST_CONFIGS.CBC.presets.highRisk.values);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [mlSystemStatus, setMlSystemStatus] = useState(null);

  // Check backend and Ollama status on mount
  useEffect(() => {
    getMLStatus().then(status => {
      setMlSystemStatus(status);
    }).catch(err => {
      console.warn("Status check:", err);
    });
  }, []);

  // When changing test type, load its high-risk preset by default to clearly demonstrate doctor warning
  const handleTestTypeChange = (testType) => {
    setActiveTest(testType);
    setFormData(TEST_CONFIGS[testType].presets.highRisk.values);
    setResult(null);
  };

  const handleInputChange = (key, val) => {
    setFormData(prev => ({
      ...prev,
      [key]: parseFloat(val) || val
    }));
  };

  const handleLoadPreset = (presetKey) => {
    const preset = TEST_CONFIGS[activeTest].presets[presetKey];
    if (preset) {
      setFormData(preset.values);
      addToast(`Loaded preset: ${preset.name}`, 'info');
    }
  };

  const handleRunPipeline = async () => {
    setIsRunning(true);
    setResult(null);

    try {
      const output = await predictAndAdvise(activeTest, formData, true);
      setResult(output);
      addToast('ML classification complete. Llama 3.2 guidance generated!', 'success');
    } catch (err) {
      console.error('Pipeline error:', err);
      addToast('Failed to run diagnostic pipeline.', 'error');
    } finally {
      setIsRunning(false);
    }
  };

  const currentConfig = TEST_CONFIGS[activeTest];
  const mlOutput = result?.ml_output;
  const llamaGuidance = result?.llama_guidance;
  const isHighRisk = llamaGuidance?.connect_to_doctor || String(mlOutput?.status || '').toLowerCase().includes('high');
  const doctorNote = String(llamaGuidance?.doctor_message || 'The model placed this panel in the high risk category. Prompt professional evaluation is advised.')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .replace(/^high risk detected[:\s-]*/i, '');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-6 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
            <Cpu className="h-3.5 w-3.5" />
            Model laboratory
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-ink sm:text-4xl">
            Diagnostic lab
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
            Run the trained scikit-learn models on a set of blood values, then read Llama 3.2's plain-language guidance and dietary notes. High-risk results surface questions for a clinician.
          </p>
        </div>

        {/* System Connectivity Indicator */}
        <div className="flex items-center gap-3 rounded-md border border-line bg-surface p-3.5">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
            mlSystemStatus?.ollama?.available
              ? 'bg-accent-soft text-accent-deep'
              : 'bg-attention-soft text-attention'
          }`}>
            {mlSystemStatus?.ollama?.available
              ? <CheckCircle2 className="h-5 w-5" />
              : <AlertTriangle className="h-5 w-5" />}
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-semibold text-ink">
              <span>Llama 3.2 (Ollama)</span>
              <span className={`h-2 w-2 rounded-full ${
                mlSystemStatus?.ollama?.available ? 'bg-accent' : 'bg-attention'
              }`} />
            </div>
            <p className="mt-0.5 text-[11px] text-muted">
              {mlSystemStatus?.ollama?.available ? 'Connected locally' : 'Using sample guidance'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Selector Navigation Tabs */}
      <div className="flex max-w-md flex-wrap items-center gap-1 rounded-md border border-line bg-paper-deep p-1">
        {Object.keys(TEST_CONFIGS).map((tKey) => {
          const isActive = activeTest === tKey;
          return (
            <button
              key={tKey}
              type="button"
              onClick={() => handleTestTypeChange(tKey)}
              className={`min-w-[100px] flex-1 rounded px-4 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                isActive
                  ? 'bg-surface text-accent-deep shadow-xs'
                  : 'text-muted hover:text-ink'
              }`}
            >
              {tKey} Test
            </button>
          );
        })}
      </div>

      {/* Main Grid: Parameters on Left, Live Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Parameter Form & Preset Loader */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="p-6 sm:p-7" className="space-y-6">
            
            {/* Form Title & Presets */}
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl text-ink">
                  {currentConfig.title}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {currentConfig.description}
                </p>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                  Sample values
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('highRisk')}
                    className="flex items-center justify-between rounded-md border border-danger/20 bg-danger-soft/60 p-2.5 text-left text-xs font-semibold text-danger transition-colors hover:border-danger/40"
                  >
                    <span>High risk</span>
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('normal')}
                    className="flex items-center justify-between rounded-md border border-accent/20 bg-accent-soft/60 p-2.5 text-left text-xs font-semibold text-accent-deep transition-colors hover:border-accent/40"
                  >
                    <span>In range</span>
                    <Check className="h-3.5 w-3.5 shrink-0" />
                  </button>
                </div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="max-h-[460px] space-y-3 overflow-y-auto border-t border-line-soft pt-4 pr-1">
              {currentConfig.features.map((feat) => {
                const val = formData[feat.key] ?? '';
                return (
                  <div key={feat.key} className="space-y-1.5 rounded-md border border-line-soft bg-paper/60 p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <label htmlFor={feat.key} className="font-medium text-ink-soft">
                        {feat.label}
                      </label>
                      <span className="shrink-0 font-mono text-[11px] text-muted">
                        {val} {feat.unit}
                      </span>
                    </div>
                    <input
                      id={feat.key}
                      type="number"
                      step={feat.step}
                      min={feat.min}
                      max={feat.max}
                      value={val}
                      onChange={(e) => handleInputChange(feat.key, e.target.value)}
                      className="w-full rounded border border-line bg-surface px-3 py-1.5 font-mono text-xs focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/25 sm:text-sm"
                    />
                  </div>
                );
              })}
            </div>

            {/* Action Run Button */}
            <Button
              variant="primary"
              size="lg"
              icon={Sparkles}
              onClick={handleRunPipeline}
              isLoading={isRunning}
              className="w-full justify-center py-3"
            >
              {isRunning ? 'Running the model...' : 'Run model and generate guidance'}
            </Button>
          </Card>
        </div>

        {/* Right Column: Real-Time Results & Llama 3.2 Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {!result && !isRunning && (
            <Card padding="p-10" className="space-y-4 border-dashed bg-paper/50 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-accent-soft text-accent-deep">
                <Cpu className="h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-xl text-ink">Ready when you are</h2>
                <p className="mx-auto max-w-md text-sm leading-relaxed text-muted">
                  Run the current values through the model to see the classification, then read Llama's guidance on diet and next steps.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Sparkles}
                onClick={handleRunPipeline}
                className="mt-2"
              >
                Run with current values
              </Button>
            </Card>
          )}

          {isRunning && (
            <Card padding="p-10" className="space-y-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-accent-soft text-accent-deep">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-display text-xl text-ink">Reading the values</h2>
                <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted">
                  Classifying the panel, drafting dietary notes, and preparing questions for a clinician if needed.
                </p>
              </div>
            </Card>
          )}

          {result && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* STEP 1 & 2: VISUAL ML OUTPUT FROM ML FOLDER */}
              <MLOutputVisualizer
                mlOutput={mlOutput}
                title={`Step 1: Output from ML Folder (${activeTest} Random Forest Classifier)`}
                subtitle="Clean standardized model classification fed into Meta Llama 3.2"
              />

              {/* STEP 3: HIGH RISK DOCTOR ALERT (MANDATORY IF HIGH RISK) */}
              {isHighRisk && (
                <div className="space-y-5 rounded-lg border border-danger/25 bg-danger-soft/60 p-6 sm:p-7">
                  <div className="flex flex-col gap-3 border-b border-danger/15 pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-danger/20 bg-surface text-danger">
                        <Stethoscope className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-danger">
                          High risk detected
                        </p>
                        <h2 className="mt-0.5 font-display text-2xl text-ink">
                          Talk to a doctor.
                        </h2>
                      </div>
                    </div>

                    <div className="rounded-md border border-danger/15 bg-surface/70 px-3 py-2 text-xs">
                      <span className="block text-[10px] uppercase tracking-[0.14em] text-muted">Suggested specialty</span>
                      <span className="mt-0.5 block font-semibold text-ink">
                        {llamaGuidance?.recommended_doctor_specialty || "Specialist physician"}
                      </span>
                    </div>
                  </div>

                  <p className="rounded-md border border-danger/15 bg-surface/70 p-4 text-sm leading-relaxed text-ink-soft">
                    {doctorNote}
                  </p>

                  {/* Doctor Questions Checklist */}
                  {llamaGuidance?.questions_for_doctor?.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                        Questions for your doctor
                      </h3>
                      <ul className="space-y-1.5 text-xs text-ink-soft">
                        {llamaGuidance.questions_for_doctor.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2 rounded-md border border-line bg-surface px-3 py-2.5">
                            <span className="mt-0.5 text-danger">·</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: LLAMA 3.2 OVERVIEW & DIETARY GUIDANCE */}
              <Card padding="p-6 sm:p-7" className="space-y-6">
                
                {/* Llama 3.2 Header */}
                <div className="flex items-center justify-between border-b border-line-soft pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent-soft text-accent-deep">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="font-display text-xl text-ink">
                        Guidance from Llama 3.2
                      </h2>
                      <p className="mt-0.5 text-xs text-muted">
                        {llamaGuidance?.model_used || "Meta Llama 3.2"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="rounded-md border border-line bg-paper/60 p-4 text-sm leading-relaxed text-ink-soft">
                  <h3 className="mb-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                    Clinical overview
                  </h3>
                  {llamaGuidance?.overview}
                </div>

                {/* Dietary Guidance 2-Column Grid */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Apple className="h-4 w-4 text-accent" />
                    <span>Dietary notes</span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    
                    {/* Foods to Eat */}
                    <div className="space-y-2 rounded-md border border-line bg-surface p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent-deep">
                        <Check className="h-3.5 w-3.5" />
                        <span>Foods to include</span>
                      </div>
                      <ul className="space-y-1.5 text-xs leading-relaxed text-ink-soft">
                        {llamaGuidance?.diet_guidance?.recommended_foods?.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-accent">·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Foods to Avoid */}
                    <div className="space-y-2 rounded-md border border-danger/20 bg-danger-soft/40 p-4">
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-danger">
                        <Ban className="h-3.5 w-3.5" />
                        <span>Foods to limit</span>
                      </div>
                      <ul className="space-y-1.5 text-xs leading-relaxed text-ink-soft">
                        {llamaGuidance?.diet_guidance?.foods_to_avoid?.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-danger/70">·</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                  {/* Hydration & Key Nutrients */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    {llamaGuidance?.diet_guidance?.hydration_and_habits?.length > 0 && (
                      <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-950 space-y-1">
                        <span className="font-bold text-blue-900 flex items-center gap-1.5">
                          <Droplet className="w-3.5 h-3.5 text-blue-600" />
                          Hydration & Daily Habits:
                        </span>
                        <ul className="space-y-1 pl-1">
                          {llamaGuidance.diet_guidance.hydration_and_habits.map((h, i) => (
                            <li key={i}>• {h}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {llamaGuidance?.diet_guidance?.key_nutrients?.length > 0 && (
                      <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 space-y-1">
                        <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                          <Pill className="w-3.5 h-3.5 text-indigo-600" />
                          Key Nutrients:
                        </span>
                        <div className="flex flex-wrap gap-1 pt-1">
                          {llamaGuidance.diet_guidance.key_nutrients.map((n, i) => (
                            <span key={i} className="px-2 py-0.5 bg-white border border-indigo-200 rounded text-[11px] font-semibold text-indigo-900">
                              {n}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>

              </Card>

              {/* STEP 5: INTERACTIVE AI DIETARY & FOOD ADVICE CHAT */}
              <DietChatSection
                reportContext={{
                  condition: `${activeTest} (${TEST_CONFIGS[activeTest]?.title || activeTest})`,
                  risk_level: mlOutput?.status,
                  biomarkers: formData,
                  overview: llamaGuidance?.overview
                }}
              />
            </div>
          )}

        </div>

      </div>

      {/* Standard Medical Disclaimer */}
      <Disclaimer variant="callout" />
    </div>
  );
}
