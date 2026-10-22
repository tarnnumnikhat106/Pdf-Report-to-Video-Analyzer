import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Activity, 
  Stethoscope, 
  Cpu, 
  ArrowRight, 
  Check, 
  Copy, 
  AlertTriangle, 
  Apple, 
  Ban, 
  Droplet, 
  Pill, 
  RotateCcw,
  Sliders,
  CheckCircle2,
  FileCode,
  ShieldCheck,
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
  const [copiedJson, setCopiedJson] = useState(false);
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

  const handleCopyJson = () => {
    if (result?.ml_output && navigator.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(result.ml_output, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    }
  };

  const currentConfig = TEST_CONFIGS[activeTest];
  const mlOutput = result?.ml_output;
  const llamaGuidance = result?.llama_guidance;
  const isHighRisk = llamaGuidance?.connect_to_doctor || mlOutput?.status?.toLowerCase().includes('high');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>ML Models & Meta Llama 3.2 Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Interactive ML Diagnostic & Dietary Advisor
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Run trained scikit-learn models from the <code className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-xs text-indigo-700">ML/</code> folder to produce a diagnostic JSON, automatically feed it into <span className="font-semibold text-slate-800">Llama 3.2</span>, and receive clinical diet guidance with high-risk doctor escalation.
          </p>
        </div>

        {/* System Connectivity Indicator */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <span>Llama 3.2 (Ollama)</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-slate-500 text-[11px]">
              {mlSystemStatus?.ollama?.available ? 'Connected to local Ollama' : 'Active & Ready'}
            </p>
          </div>
        </div>
      </div>

      {/* Test Selector Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200/90 max-w-md">
        {Object.keys(TEST_CONFIGS).map((tKey) => {
          const cfg = TEST_CONFIGS[tKey];
          const isActive = activeTest === tKey;
          return (
            <button
              key={tKey}
              type="button"
              onClick={() => handleTestTypeChange(tKey)}
              className={`flex-1 min-w-[100px] py-2 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                isActive
                  ? 'bg-white text-indigo-700 shadow-xs scale-[1.02]'
                  : 'text-slate-600 hover:text-slate-900'
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
          <Card padding="p-6 sm:p-7" className="border-slate-200 shadow-sm space-y-6">
            
            {/* Form Title & Presets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {currentConfig.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {currentConfig.description}
                  </p>
                </div>
              </div>

              {/* Quick Preset Buttons */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Quick Load Clinical Presets:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('highRisk')}
                    className="p-2.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100/70 text-red-700 text-xs font-bold text-left transition-colors flex items-center justify-between"
                  >
                    <span>High Risk Preset</span>
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleLoadPreset('normal')}
                    className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 hover:bg-emerald-100/70 text-emerald-700 text-xs font-bold text-left transition-colors flex items-center justify-between"
                  >
                    <span>Normal Preset</span>
                    <Check className="w-3.5 h-3.5 shrink-0 text-emerald-500" />
                  </button>
                </div>
              </div>
            </div>

            {/* Input Controls */}
            <div className="space-y-4 pt-2 border-t border-slate-100 max-h-[460px] overflow-y-auto pr-1">
              {currentConfig.features.map((feat) => {
                const val = formData[feat.key] ?? '';
                return (
                  <div key={feat.key} className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70">
                    <div className="flex items-center justify-between text-xs">
                      <label htmlFor={feat.key} className="font-semibold text-slate-700">
                        {feat.label}
                      </label>
                      <span className="font-mono font-bold text-indigo-700">
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
                      className="w-full px-3 py-1.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
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
              className="w-full justify-center bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20 py-3"
            >
              {isRunning ? 'Running ML & Llama 3.2...' : 'Run ML Model & Generate Llama 3.2 Guidance'}
            </Button>
          </Card>
        </div>

        {/* Right Column: Real-Time Results & Llama 3.2 Output */}
        <div className="lg:col-span-7 space-y-6">
          
          {!result && !isRunning && (
            <Card padding="p-10" className="border-slate-200 border-dashed text-center space-y-4 bg-slate-50/50">
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 mx-auto flex items-center justify-center">
                <Cpu className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">
                  Ready to Run Diagnostic Pipeline
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Click the button on the left to pass these biomarkers into the trained ML model, extract the output JSON, and feed it into Meta Llama 3.2.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                icon={Sparkles}
                onClick={handleRunPipeline}
                className="mt-2"
              >
                Run Test with Current Values
              </Button>
            </Card>
          )}

          {isRunning && (
            <Card padding="p-10" className="border-slate-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white mx-auto flex items-center justify-center animate-spin">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Executing ML Classifier & Llama 3.2 Reasoner
                </h4>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Generating classification probability, synthesizing dietary recommendations, and formatting physician escalation rules...
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
                <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-700 text-white shadow-lg shadow-red-500/25 space-y-5 animate-pulse-subtle">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/15 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white shrink-0">
                        <Stethoscope className="w-6 h-6 animate-bounce" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-200">
                          High Risk Detected
                        </span>
                        <h3 className="text-xl font-black tracking-tight text-white">
                          ⚠️ Connect to a Doctor Immediately
                        </h3>
                      </div>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold text-amber-200 border border-white/20">
                      Specialist: {llamaGuidance?.recommended_doctor_specialty || "Specialist Physician"}
                    </div>
                  </div>

                  <p className="text-sm sm:text-base font-medium text-white/95 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/10">
                    {llamaGuidance?.doctor_message || "The ML analysis indicated high clinical risk. Immediate professional evaluation is strongly advised."}
                  </p>

                  {/* Doctor Questions Checklist */}
                  {llamaGuidance?.questions_for_doctor?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-200">
                        Questions for Your Doctor Visit:
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-100">
                        {llamaGuidance.questions_for_doctor.map((q, idx) => (
                          <li key={idx} className="flex items-start gap-2 bg-white/10 p-2.5 rounded-lg border border-white/10">
                            <span className="text-amber-300 font-bold mt-0.5">•</span>
                            <span>{q}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 4: LLAMA 3.2 OVERVIEW & DIETARY GUIDANCE */}
              <Card padding="p-6 sm:p-7" className="border-slate-200 shadow-sm space-y-6">
                
                {/* Llama 3.2 Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900">
                        Step 2: Llama 3.2 Medical & Dietary Advice
                      </h4>
                      <p className="text-xs text-slate-500">
                        Synthesized by {llamaGuidance?.model_used || "Meta Llama 3.2"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Overview */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 leading-relaxed">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Clinical Overview
                  </h5>
                  {llamaGuidance?.overview}
                </div>

                {/* Dietary Guidance 2-Column Grid */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                    <Apple className="w-4 h-4 text-emerald-600" />
                    <span>Evidence-Based Diet Guidance</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Foods to Eat */}
                    <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Recommended Foods</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-emerald-950">
                        {llamaGuidance?.diet_guidance?.recommended_foods?.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Foods to Avoid */}
                    <div className="p-4 rounded-xl bg-rose-50/70 border border-rose-200 space-y-2">
                      <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                        <Ban className="w-3.5 h-3.5 text-rose-600" />
                        <span>Foods to Avoid / Limit</span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-rose-950">
                        {llamaGuidance?.diet_guidance?.foods_to_avoid?.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-rose-500 font-bold">•</span>
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
