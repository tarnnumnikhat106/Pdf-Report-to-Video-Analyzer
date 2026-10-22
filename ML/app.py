import os
import sys
import json
import joblib
import pandas as pd
import requests
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)
BACKEND_DIR = os.path.join(PARENT_DIR, "backend")
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

try:
    from llama_service import query_llama_medical_advisor, check_ollama_status
except ImportError:
    # Inline fallback if imported outside repository structure
    def check_ollama_status():
        return {"available": False, "has_model": False}
    def query_llama_medical_advisor(ml_json, timeout_seconds=45):
        return {
            "overview": "Clinical analysis completed.",
            "risk_level": ml_json.get("status", "Normal"),
            "connect_to_doctor": ml_json.get("status") == "High Risk",
            "doctor_urgency": "Immediate" if ml_json.get("status") == "High Risk" else "Routine",
            "doctor_message": "Please consult a doctor for verification." if ml_json.get("status") == "High Risk" else "Routine follow-up.",
            "recommended_doctor_specialty": "General Physician",
            "questions_for_doctor": ["Are these results within expected limits?"],
            "diet_guidance": {
                "recommended_foods": ["Fresh fruits", "Leafy vegetables", "Lean proteins"],
                "foods_to_avoid": ["Ultra-processed foods", "Excessive sodium"],
                "hydration_and_habits": ["Drink 2-3L water daily"],
                "key_nutrients": ["Essential vitamins", "Minerals"]
            }
        }

app = FastAPI(
    title="Multi-Category Medical Diagnostic & Llama 3.2 Advisor API",
    description="CBC, LFT & KFT ML Risk Prediction with Meta Llama 3.2 Dietary Guidance and Physician Escalation"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Models with resilient absolute paths
CBC_MODEL_PATH = os.path.join(BASE_DIR, 'cbc_model.pkl')
LFT_MODEL_PATH = os.path.join(BASE_DIR, 'lft_model.pkl')
KFT_MODEL_PATH = os.path.join(BASE_DIR, 'kft_model.pkl')

cbc_model = joblib.load(CBC_MODEL_PATH) if os.path.exists(CBC_MODEL_PATH) else None
lft_model = joblib.load(LFT_MODEL_PATH) if os.path.exists(LFT_MODEL_PATH) else None
kft_model = joblib.load(KFT_MODEL_PATH) if os.path.exists(KFT_MODEL_PATH) else None


# 1. CBC Input Schema
class CBCInput(BaseModel):
    Age: int = 35
    Gender: int = 1         # 0: Male, 1: Female
    Hemoglobin: float = 12.5
    Platelet_Count: float = 220000.0
    White_Blood_Cells: float = 6500.0
    Red_Blood_Cells: float = 4.5
    MCV: float = 85.0
    MCH: float = 29.0
    MCHC: float = 33.0


# 2. LFT Input Schema
class LFTInput(BaseModel):
    age: int = 40
    gender: int = 1         # 1: Male, 0: Female
    tot_bilirubin: float = 0.9
    direct_bilirubin: float = 0.2
    tot_proteins: float = 7.1
    albumin: float = 4.0
    ag_ratio: float = 1.2
    sgpt: float = 28.0      # ALT
    sgot: float = 25.0      # AST
    alkphos: float = 180.0


# 3. KFT Input Schema
class KFTInput(BaseModel):
    id: float = 1.0
    age: float = 45.0
    bp: float = 80.0
    sg: float = 1.020
    al: float = 0.0
    su: float = 0.0
    rbc: float = 0.0
    pc: float = 0.0
    pcc: float = 0.0
    ba: float = 0.0
    bgr: float = 110.0
    bu: float = 36.0
    sc: float = 1.1
    sod: float = 138.0
    pot: float = 4.3
    hemo: float = 13.5
    pcv: float = 42.0
    wc: float = 7200.0
    rc: float = 4.8
    htn: float = 0.0
    dm: float = 0.0
    cad: float = 0.0
    appet: float = 0.0
    pe: float = 0.0
    ane: float = 0.0


class GenericDiagnosticRequest(BaseModel):
    test_type: str = "CBC" # "CBC", "LFT", "KFT"
    data: Dict[str, Any]
    include_llama_advice: bool = True


@app.get("/")
def home():
    return {
        "message": "Multi-Category Medical Diagnostic API (CBC, LFT, KFT) + Llama 3.2 is running!",
        "ollama_status": check_ollama_status(),
        "models_loaded": {
            "cbc": cbc_model is not None,
            "lft": lft_model is not None,
            "kft": kft_model is not None
        }
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "ollama": check_ollama_status(),
        "cbc_model": cbc_model is not None,
        "lft_model": lft_model is not None,
        "kft_model": kft_model is not None
    }


@app.post("/predict-cbc")
def predict_cbc(data: CBCInput, advise: bool = Query(False, description="Feed ML output to Llama 3.2")):
    input_dict = data.model_dump()
    input_df = pd.DataFrame([input_dict])
    
    if cbc_model:
        prediction = int(cbc_model.predict(input_df)[0])
        risk_percentage = round(float(cbc_model.predict_proba(input_df)[0][1]) * 100, 2)
    else:
        # Rule fallback if model not loaded
        hb = input_dict.get('Hemoglobin', 13.0)
        gender = input_dict.get('Gender', 0)
        is_low = (gender == 0 and hb < 13.5) or (gender == 1 and hb < 12.0)
        prediction = 1 if is_low else 0
        risk_percentage = 85.0 if is_low else 12.0

    status = "High Risk" if prediction == 1 else "Normal"
    
    ml_output = {
        "test_type": "CBC",
        "prediction": prediction,
        "status": status,
        "risk_percentage": f"{risk_percentage}%",
        "input_features": input_dict
    }

    if advise:
        llama_output = query_llama_medical_advisor(ml_output)
        return {
            "ml_output": ml_output,
            "llama_guidance": llama_output
        }

    return ml_output


@app.post("/predict-lft")
def predict_lft(data: LFTInput, advise: bool = Query(False, description="Feed ML output to Llama 3.2")):
    input_dict = data.model_dump()
    input_df = pd.DataFrame([input_dict])
    
    if lft_model:
        prediction = int(lft_model.predict(input_df)[0])
        risk_percentage = round(float(lft_model.predict_proba(input_df)[0][1]) * 100, 2)
    else:
        is_high = input_dict.get('tot_bilirubin', 0) > 1.2 or input_dict.get('sgpt', 0) > 50
        prediction = 1 if is_high else 0
        risk_percentage = 82.0 if is_high else 15.0

    status = "High Risk" if prediction == 1 else "Normal"
    
    ml_output = {
        "test_type": "LFT",
        "prediction": prediction,
        "status": status,
        "risk_percentage": f"{risk_percentage}%",
        "input_features": input_dict
    }

    if advise:
        llama_output = query_llama_medical_advisor(ml_output)
        return {
            "ml_output": ml_output,
            "llama_guidance": llama_output
        }

    return ml_output


@app.post("/predict-kft")
def predict_kft(data: KFTInput, advise: bool = Query(False, description="Feed ML output to Llama 3.2")):
    input_dict = data.model_dump()
    input_df = pd.DataFrame([input_dict])
    
    if kft_model:
        prediction = int(kft_model.predict(input_df)[0])
        risk_percentage = round(float(kft_model.predict_proba(input_df)[0][1]) * 100, 2)
    else:
        is_high = input_dict.get('sc', 1.0) > 1.4 or input_dict.get('bu', 30.0) > 50.0
        prediction = 1 if is_high else 0
        risk_percentage = 88.0 if is_high else 10.0

    status = "High Risk" if prediction == 1 else "Normal"
    
    ml_output = {
        "test_type": "KFT",
        "prediction": prediction,
        "status": status,
        "risk_percentage": f"{risk_percentage}%",
        "input_features": input_dict
    }

    if advise:
        llama_output = query_llama_medical_advisor(ml_output)
        return {
            "ml_output": ml_output,
            "llama_guidance": llama_output
        }

    return ml_output


@app.post("/predict-and-advise")
def predict_and_advise(request: GenericDiagnosticRequest):
    """
    Unified Endpoint:
    1. Runs ML model for CBC, LFT, or KFT
    2. Generates clean ML JSON output
    3. Feeds ML JSON directly into Llama 3.2
    4. Returns dietary guidance + High Risk Connect-to-Doctor warnings
    """
    test_type = request.test_type.upper()
    data = request.data
    
    if test_type == "CBC":
        cbc_data = CBCInput(**{k: v for k, v in data.items() if k in CBCInput.model_fields})
        return predict_cbc(cbc_data, advise=request.include_llama_advice)
    elif test_type == "LFT":
        lft_data = LFTInput(**{k: v for k, v in data.items() if k in LFTInput.model_fields})
        return predict_lft(lft_data, advise=request.include_llama_advice)
    elif test_type == "KFT":
        kft_data = KFTInput(**{k: v for k, v in data.items() if k in KFTInput.model_fields})
        return predict_kft(kft_data, advise=request.include_llama_advice)
    else:
        # Default to CBC
        cbc_data = CBCInput()
        return predict_cbc(cbc_data, advise=request.include_llama_advice)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8001, reload=True)