from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd

app = FastAPI(title="Multi-Category Medical Diagnostic API", description="CBC, LFT & KFT Risk Prediction")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Teeno models load karein
cbc_model = joblib.load('cbc_model.pkl')
lft_model = joblib.load('lft_model.pkl')
kft_model = joblib.load('kft_model.pkl')

# 1. CBC Input Schema
class CBCInput(BaseModel):
    Age: int
    Gender: int
    Hemoglobin: float
    Platelet_Count: float
    White_Blood_Cells: float
    Red_Blood_Cells: float
    MCV: float
    MCH: float
    MCHC: float

# 2. LFT Input Schema
class LFTInput(BaseModel):
    age: int
    gender: int
    tot_bilirubin: float
    direct_bilirubin: float
    tot_proteins: float
    albumin: float
    ag_ratio: float
    sgpt: float
    sgot: float
    alkphos: float

# 3. KFT Input Schema (CKD dataset columns ke mutabiq)
class KFTInput(BaseModel):
    id: float
    age: float
    bp: float
    sg: float
    al: float
    su: float
    rbc: float
    pc: float
    pcc: float
    ba: float
    bgr: float
    bu: float
    sc: float
    sod: float
    pot: float
    hemo: float
    pcv: float
    wc: float
    rc: float
    htn: float
    dm: float
    cad: float
    appet: float
    pe: float
    ane: float

@app.get("/")
def home():
    return {"message": "Multi-Category Medical Diagnostic API (CBC, LFT, KFT) is running!"}

@app.post("/predict-cbc")
def predict_cbc(data: CBCInput):
    input_df = pd.DataFrame([data.model_dump()])
    prediction = int(cbc_model.predict(input_df)[0])
    risk_percentage = round(float(cbc_model.predict_proba(input_df)[0][1]) * 100, 2)
    status = "High Risk" if prediction == 1 else "Normal"
    
    return {
        "test_type": "CBC",
        "prediction": prediction,
        "status": status,
        "risk_percentage": f"{risk_percentage}%"
    }

@app.post("/predict-lft")
def predict_lft(data: LFTInput):
    input_df = pd.DataFrame([data.model_dump()])
    prediction = int(lft_model.predict(input_df)[0])
    risk_percentage = round(float(lft_model.predict_proba(input_df)[0][1]) * 100, 2)
    status = "High Risk" if prediction == 1 else "Normal"
    
    return {
        "test_type": "LFT",
        "prediction": prediction,
        "status": status,
        "risk_percentage": f"{risk_percentage}%"
    }

@app.post("/predict-kft")
def predict_kft(data: KFTInput):
    input_df = pd.DataFrame([data.model_dump()])
    prediction = int(kft_model.predict(input_df)[0])
    risk_percentage = round(float(kft_model.predict_proba(input_df)[0][1]) * 100, 2)
    status = "High Risk" if prediction == 1 else "Normal"
    
    return {
        "test_type": "KFT",
        "prediction": prediction,
        "status": status,
        "risk_percentage": f"{risk_percentage}%"
    }