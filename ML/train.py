import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. Dataset Load Karein
df = pd.read_csv('cbc_data.csv')

# 2. Gender Mapping
if 'Gender' in df.columns:
    df['Gender'] = df['Gender'].map({'Male': 0, 'Female': 1})

# 3. Target Labeling (Medical Standards ke mutabiq Anemia / Risk Prediction)
# Agar Hemoglobin kam hai toh Risk (1), warna Normal (0)
def check_risk(row):
    hb = row['Hemoglobin']
    gender = row['Gender'] # 0: Male, 1: Female
    if gender == 0 and hb < 13.5:
        return 1
    elif gender == 1 and hb < 12.0:
        return 1
    return 0

df['Target_Risk'] = df.apply(check_risk, axis=1)

# 4. Features (X) aur Target (y) set karein
X = df.drop(columns=['Target_Risk'])
y = df['Target_Risk']

# 5. Train-Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. Model Train Karein
model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

# 7. Accuracy Check Karein
y_pred = model.predict(X_test)
acc = accuracy_score(y_test, y_pred)
print(f"Model Training Complete! Accuracy: {acc * 100:.2f}%")

# 8. Model Save Karein taaki future me use kar sakein
joblib.dump(model, 'cbc_model.pkl')
print("Model saved successfully as 'cbc_model.pkl'!")