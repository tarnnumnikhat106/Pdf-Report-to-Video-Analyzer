import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib

# 1. Dataset load karein
df = pd.read_csv('lft_data.csv')
print("Columns in dataset:", df.columns.tolist())

# Missing values drop karein
df = df.dropna()

# 2. Gender column ko numbers me convert karein (Dataset me column 'gender' lowercase hai)
if 'gender' in df.columns:
    # Check karein ki values Male/Female hain ya kuch aur
    df['gender'] = df['gender'].astype(str).str.strip().map({'Male': 1, 'Female': 0, 'male': 1, 'female': 0})
    df['gender'] = df['gender'].fillna(0) # Safety ke liye

# 3. Target column check karein (Is dataset me target 'is_patient' ya 'Dataset' hota hai)
target_col = 'is_patient' if 'is_patient' in df.columns else ('Dataset' if 'Dataset' in df.columns else df.columns[-1])

# Target ko binary (0 aur 1) me set karein
# Agar values 1 aur 2 hain (jaise ILPD me hota hai: 1 for patient, 2 for non-patient)
if df[target_col].max() == 2:
    df[target_col] = df[target_col].map({1: 1, 2: 0})

# 4. Features aur Target split
X = df.drop(columns=[target_col])
y = df[target_col]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 5. Model Training
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 6. Evaluate aur Save
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Real LFT Model Trained Successfully! Accuracy: {round(accuracy * 100, 2)}%")

joblib.dump(model, 'lft_model.pkl')
print("Model saved successfully as 'lft_model.pkl'")