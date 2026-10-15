import joblib
import pandas as pd

# 1. Saved model ko load karein
model = joblib.load('cbc_model.pkl')
print("Model successfully loaded for testing!\n")

# 2. Ek sample patient ka data banayein (Testing ke liye)
sample_patient = pd.DataFrame({
    'Age': [35],
    'Gender': [1],          # 1 for Female
    'Hemoglobin': [13],   # Low (< 12.0 for female)
    'Platelet_Count': [210000],
    'White_Blood_Cells': [6100],
    'Red_Blood_Cells': [5],
    'MCV': [78],
    'MCH': [26],
    'MCHC': [31]
})

# 3. Model se prediction aur probability karwayein
prediction = model.predict(sample_patient)
probability = model.predict_proba(sample_patient)
risk_percentage = probability[0][1] * 100

# 4. Result print karein
print("Patient Data:")
print(sample_patient)

if prediction[0] == 1:
    print(f"\nResult: ⚠️ High Risk / Potential Anemia")
    print(f"Risk Likelihood: {risk_percentage:.2f}% (Consult a doctor for confirmation)")
else:
    print(f"\nResult: ✅ Normal Report")
    print(f"Risk Likelihood: {risk_percentage:.2f}%")