"""
MedVision AI - Clinical Biomarker ML Classifier Training Script
---------------------------------------------------------------
This script builds, trains, and exports a Machine Learning classification model
specifically designed for routine blood panels (CBC + Metabolic tests).

Target Classes:
  0: Normal / Healthy Homeostatic Baseline
  1: Microcytic Anemia (Iron Deficiency Pattern: Low Hb, Low MCV, High RDW, Low Ferritin)
  2: Macrocytic Anemia (Vitamin B12/Folate Pattern: Low Hb, High MCV)
  3: Acute Immune / Inflammatory Surge (High WBC, reactive cell lines)
  4: Metabolic / Glycemic Impairment (Elevated Fasting Glucose / Pre-Diabetes)

Outputs:
  - backend/models/biomarker_classifier.joblib (Trained model + Scaler + Feature mapping)
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, accuracy_score

# Feature column order
FEATURE_NAMES = [
    'hemoglobin',   # g/dL (Normal ~12.0 - 16.0)
    'rbc',          # x10^6/µL (Normal ~4.0 - 5.5)
    'hematocrit',   # % (Normal ~36 - 48)
    'mcv',          # fL (Normal ~80 - 100)
    'mch',          # pg (Normal ~27 - 33)
    'rdw',          # % (Normal ~11.5 - 14.5)
    'wbc',          # x10^3/µL (Normal ~4.5 - 11.0)
    'platelets',    # x10^3/µL (Normal ~150 - 450)
    'ferritin',     # ng/mL (Normal ~20 - 250)
    'glucose',      # mg/dL (Normal ~70 - 99)
]

CLASS_LABELS = {
    0: "Normal Homeostasis",
    1: "Microcytic Iron Deficiency Anemia",
    2: "Macrocytic Anemia Pattern",
    3: "Immune / Leukocyte Surge",
    4: "Metabolic / Glycemic Elevation",
}

def generate_synthetic_clinical_cohort(n_samples_per_class: int = 400, random_seed: int = 42):
    """
    Generates synthetic clinically-realistic biomarker profiles calibrated to 
    standard laboratory reference intervals and pathophysiological distributions.
    """
    np.random.seed(random_seed)
    records = []
    labels = []

    # 1. Normal Cohort (Label 0)
    for _ in range(n_samples_per_class):
        hb = np.random.normal(13.8, 1.0)
        rbc = np.random.normal(4.6, 0.4)
        hct = hb * 3.0 + np.random.normal(0, 1.0)
        mcv = np.random.normal(89.0, 4.0)
        mch = np.random.normal(30.0, 1.5)
        rdw = np.random.normal(12.8, 0.8)
        wbc = np.random.normal(6.8, 1.2)
        plt = np.random.normal(250.0, 45.0)
        ferr = np.random.normal(85.0, 30.0)
        glu = np.random.normal(88.0, 8.0)
        records.append([hb, rbc, hct, mcv, mch, rdw, wbc, plt, ferr, glu])
        labels.append(0)

    # 2. Microcytic Iron Deficiency Anemia (Label 1: Low Hb, Low MCV, High RDW, Low Ferritin)
    for _ in range(n_samples_per_class):
        hb = np.random.normal(9.4, 1.1)
        rbc = np.random.normal(3.9, 0.4)
        hct = hb * 3.1 + np.random.normal(0, 1.2)
        mcv = np.random.normal(73.0, 4.5)  # Microcytic
        mch = np.random.normal(23.0, 2.0)  # Hypochromic
        rdw = np.random.normal(16.5, 1.5)  # Elevated Anisocytosis
        wbc = np.random.normal(6.5, 1.4)
        plt = np.random.normal(310.0, 70.0) # Often mildly reactive
        ferr = np.random.normal(14.0, 6.0)  # Depleted iron reserves (<20)
        glu = np.random.normal(87.0, 9.0)
        records.append([hb, rbc, hct, mcv, mch, rdw, wbc, plt, ferr, glu])
        labels.append(1)

    # 3. Macrocytic Anemia Pattern (Label 2: Low Hb, High MCV > 100)
    for _ in range(n_samples_per_class):
        hb = np.random.normal(9.8, 1.2)
        rbc = np.random.normal(3.2, 0.35)
        hct = hb * 3.0 + np.random.normal(0, 1.0)
        mcv = np.random.normal(108.0, 6.0) # Macrocytic
        mch = np.random.normal(34.0, 2.0)
        rdw = np.random.normal(15.2, 1.2)
        wbc = np.random.normal(5.8, 1.2)
        plt = np.random.normal(210.0, 50.0)
        ferr = np.random.normal(90.0, 40.0)
        glu = np.random.normal(90.0, 10.0)
        records.append([hb, rbc, hct, mcv, mch, rdw, wbc, plt, ferr, glu])
        labels.append(2)

    # 4. Acute Immune / Leukocyte Surge (Label 3: High WBC > 12.0)
    for _ in range(n_samples_per_class):
        hb = np.random.normal(13.2, 1.2)
        rbc = np.random.normal(4.5, 0.4)
        hct = hb * 3.0 + np.random.normal(0, 1.0)
        mcv = np.random.normal(88.0, 4.0)
        mch = np.random.normal(29.5, 1.5)
        rdw = np.random.normal(13.2, 1.0)
        wbc = np.random.normal(14.8, 2.5) # Elevated WBC (>11.0)
        plt = np.random.normal(360.0, 75.0)
        ferr = np.random.normal(160.0, 50.0) # Ferritin is also an acute phase reactant
        glu = np.random.normal(92.0, 11.0)
        records.append([hb, rbc, hct, mcv, mch, rdw, wbc, plt, ferr, glu])
        labels.append(3)

    # 5. Metabolic / Glycemic Elevation (Label 4: Glucose > 115)
    for _ in range(n_samples_per_class):
        hb = np.random.normal(14.0, 1.1)
        rbc = np.random.normal(4.7, 0.4)
        hct = hb * 3.0 + np.random.normal(0, 1.0)
        mcv = np.random.normal(90.0, 4.0)
        mch = np.random.normal(30.0, 1.5)
        rdw = np.random.normal(13.0, 0.9)
        wbc = np.random.normal(7.4, 1.5)
        plt = np.random.normal(260.0, 50.0)
        ferr = np.random.normal(110.0, 45.0)
        glu = np.random.normal(135.0, 22.0) # Impaired fasting glucose / diabetes
        records.append([hb, rbc, hct, mcv, mch, rdw, wbc, plt, ferr, glu])
        labels.append(4)

    df = pd.DataFrame(records, columns=FEATURE_NAMES)
    df['target'] = labels
    return df

def train_and_export():
    print("=" * 60)
    print("MedVision AI: Training Blood Biomarker ML Classifier")
    print("=" * 60)

    # Step 1: Synthesize clinical cohort
    df = generate_synthetic_clinical_cohort(n_samples_per_class=500)
    X = df[FEATURE_NAMES]
    y = df['target']

    print(f"Cohort generated: {len(df)} samples across {len(CLASS_LABELS)} clinical classes.")

    # Step 2: Train/Test Split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    # Step 3: Feature Scaling
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Step 4: Model Training (Random Forest Classifier)
    clf = RandomForestClassifier(
        n_estimators=180,
        max_depth=8,
        min_samples_split=4,
        class_weight='balanced',
        random_state=42,
        n_jobs=-1
    )
    clf.fit(X_train_scaled, y_train)

    # Step 5: Evaluation
    y_pred = clf.predict(X_test_scaled)
    acc = accuracy_score(y_test, y_pred)
    cv_scores = cross_val_score(clf, X_train_scaled, y_train, cv=5)

    print("\n--- Model Evaluation Results ---")
    print(f"Test Set Accuracy: {acc * 100:.2f}%")
    print(f"5-Fold Cross Validation Mean Accuracy: {cv_scores.mean() * 100:.2f}% (+/- {cv_scores.std() * 100:.2f}%)")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=list(CLASS_LABELS.values())))

    # Feature Importance Analysis
    importances = pd.Series(clf.feature_importances_, index=FEATURE_NAMES).sort_values(ascending=False)
    print("Top Feature Importances:")
    for feat, imp in importances.items():
        print(f"  {feat:15s}: {imp * 100:.1f}%")

    # Step 6: Export Artifacts
    os.makedirs(os.path.join(os.path.dirname(__file__), "models"), exist_ok=True)
    model_path = os.path.join(os.path.dirname(__file__), "models", "biomarker_classifier.joblib")

    model_bundle = {
        'model': clf,
        'scaler': scaler,
        'feature_names': FEATURE_NAMES,
        'class_labels': CLASS_LABELS,
        'accuracy': float(acc),
        'version': '1.0.0'
    }

    joblib.dump(model_bundle, model_path)
    print(f"\nTrained model bundle successfully exported to:\n  {model_path}")
    print("=" * 60)
    return model_path

def predict_sample(sample_biomarkers: dict, model_path: str = None) -> dict:
    """
    Runs prediction on a single dictionary of patient biomarkers.
    
    Example input:
      {
        'hemoglobin': 9.2, 'rbc': 3.9, 'hematocrit': 30.0, 'mcv': 74.0,
        'mch': 23.5, 'rdw': 16.2, 'wbc': 6.8, 'platelets': 270.0,
        'ferritin': 14.0, 'glucose': 88.0
      }
    """
    if model_path is None:
        model_path = os.path.join(os.path.dirname(__file__), "models", "biomarker_classifier.joblib")
    
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}. Run train_and_export() first.")
    
    bundle = joblib.load(model_path)
    model = bundle['model']
    scaler = bundle['scaler']
    feature_names = bundle['feature_names']
    class_labels = bundle['class_labels']
    
    # Construct feature vector matching training order
    vector = [sample_biomarkers.get(f, 0.0) for f in feature_names]
    scaled_vector = scaler.transform([vector])
    
    pred_idx = int(model.predict(scaled_vector)[0])
    probabilities = model.predict_proba(scaled_vector)[0]
    
    return {
        "predicted_condition": class_labels[pred_idx],
        "confidence_score": round(float(np.max(probabilities)) * 100, 2),
        "class_probabilities": {
            class_labels[i]: round(float(p) * 100, 2)
            for i, p in enumerate(probabilities)
        }
    }

def run_sample_evaluations():
    """Validates the model against 3 classic clinical test cases."""
    print("\n--- Running Clinical Verification Test Cases ---")
    
    cases = [
        {
            "case_name": "Patient A (Severe Microcytic Anemia)",
            "data": {'hemoglobin': 8.8, 'rbc': 3.4, 'hematocrit': 27.5, 'mcv': 71.0, 'mch': 21.0, 'rdw': 17.5, 'wbc': 6.2, 'platelets': 320.0, 'ferritin': 9.0, 'glucose': 85.0}
        },
        {
            "case_name": "Patient B (Acute Immune / Leukocyte Surge)",
            "data": {'hemoglobin': 13.5, 'rbc': 4.6, 'hematocrit': 41.0, 'mcv': 89.0, 'mch': 30.0, 'rdw': 12.8, 'wbc': 15.6, 'platelets': 380.0, 'ferritin': 180.0, 'glucose': 90.0}
        },
        {
            "case_name": "Patient C (Healthy Normal Baseline)",
            "data": {'hemoglobin': 14.2, 'rbc': 4.8, 'hematocrit': 43.0, 'mcv': 91.0, 'mch': 30.5, 'rdw': 12.5, 'wbc': 6.5, 'platelets': 245.0, 'ferritin': 95.0, 'glucose': 86.0}
        }
    ]
    
    for case in cases:
        result = predict_sample(case["data"])
        print(f"\n[Test] {case['case_name']}")
        print(f"  -> Predicted Condition: {result['predicted_condition']}")
        print(f"  -> Model Confidence:    {result['confidence_score']}%")

if __name__ == "__main__":
    train_and_export()
    run_sample_evaluations()

