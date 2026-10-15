import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. KFT Dataset load karein
df = pd.read_csv('kft_data.csv')
print("Columns in KFT dataset:", df.columns.tolist())

# Dataset me missing values ya '?' ko handle karein
df = df.replace('?', np.nan)

# Target column standard CKD dataset me 'classification' hota hai (Values: 'ckd', 'notckd', etc.)
target_col = 'classification' if 'classification' in df.columns else df.columns[-1]

# Text categories ko clean karein aur target ko binary (1: High Risk/CKD, 0: Normal) me map karein
df[target_col] = df[target_col].astype(str).str.strip().str.lower()
df[target_col] = df[target_col].apply(lambda x: 1 if 'ckd' in x and 'not' not in x else 0)

# Non-numeric columns ko handle karne ke liye ya toh drop karein ya numbers me convert karein
# Yahan hum numeric columns ko extract kar rahe hain ya basic cleaning kar rahe hain
for col in df.columns:
    if col != target_col:
        df[col] = pd.to_numeric(df[col], errors='coerce')

# Missing values ko median se fill karein
df = df.fillna(df.median(numeric_only=True))

# 2. Features aur Target split
X = df.drop(columns=[target_col])
y = df[target_col]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Model Training
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 4. Evaluate aur Save
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Real KFT Model Trained Successfully! Accuracy: {round(accuracy * 100, 2)}%")

joblib.dump(model, 'kft_model.pkl')
print("Model saved successfully as 'kft_model.pkl'")