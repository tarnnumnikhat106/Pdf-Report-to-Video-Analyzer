"""
MedVision AI - Sample Clinical Blood Report PDF Generator
----------------------------------------------------------
Generates realistic medical PDF test reports (digital blood panels)
with clean clinical text and tables for testing OCR/PDF extraction,
ML inference, and video generation.

Generated Files:
  - backend/data/sample_anemia_report.pdf
  - backend/data/sample_normal_report.pdf
  - backend/data/sample_infection_report.pdf
"""

import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.backends.backend_pdf import PdfPages

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data")
os.makedirs(DATA_DIR, exist_ok=True)

REPORTS_CONFIG = [
    {
        "filename": "sample_anemia_report.pdf",
        "title": "METROPOLITAN CLINICAL LABORATORIES",
        "patient": "Jane Doe | Age: 42 | Gender: Female | Date: 2026-03-24",
        "doctor": "Referring Physician: Dr. Elena Rostova, MD",
        "test_name": "COMPLETE BLOOD COUNT (CBC) & IRON PANEL",
        "rows": [
            ("Hemoglobin (Hb)", "9.2", "g/dL", "12.0 - 15.5", "LOW (Attention)"),
            ("Red Blood Cells (RBC)", "3.8", "x10^6/uL", "4.0 - 5.2", "LOW"),
            ("Hematocrit (Hct)", "29.5", "%", "36.0 - 46.0", "LOW"),
            ("MCV", "74.0", "fL", "80.0 - 100.0", "LOW (Microcytic)"),
            ("MCH", "23.2", "pg", "27.0 - 33.0", "LOW (Hypochromic)"),
            ("RDW", "16.8", "%", "11.5 - 14.5", "HIGH (Anisocytosis)"),
            ("White Blood Cells (WBC)", "6.8", "x10^3/uL", "4.5 - 11.0", "NORMAL"),
            ("Platelet Count (PLT)", "270.0", "x10^3/uL", "150 - 450", "NORMAL"),
            ("Serum Ferritin", "14.0", "ng/mL", "20.0 - 200.0", "LOW (Attention)"),
            ("Fasting Glucose", "88.0", "mg/dL", "70.0 - 99.0", "NORMAL"),
        ]
    },
    {
        "filename": "sample_normal_report.pdf",
        "title": "METROPOLITAN CLINICAL LABORATORIES",
        "patient": "Robert Smith | Age: 36 | Gender: Male | Date: 2026-03-25",
        "doctor": "Referring Physician: Dr. Marcus Vance, MD",
        "test_name": "ROUTINE ANNUAL HEALTH PANEL (CBC + CMP)",
        "rows": [
            ("Hemoglobin (Hb)", "14.5", "g/dL", "13.5 - 17.5", "NORMAL"),
            ("Red Blood Cells (RBC)", "4.9", "x10^6/uL", "4.3 - 5.9", "NORMAL"),
            ("Hematocrit (Hct)", "43.5", "%", "41.0 - 53.0", "NORMAL"),
            ("MCV", "89.0", "fL", "80.0 - 100.0", "NORMAL"),
            ("MCH", "30.0", "pg", "27.0 - 33.0", "NORMAL"),
            ("RDW", "12.5", "%", "11.5 - 14.5", "NORMAL"),
            ("White Blood Cells (WBC)", "7.2", "x10^3/uL", "4.5 - 11.0", "NORMAL"),
            ("Platelet Count (PLT)", "240.0", "x10^3/uL", "150 - 450", "NORMAL"),
            ("Serum Ferritin", "110.0", "ng/mL", "30.0 - 300.0", "NORMAL"),
            ("Fasting Glucose", "86.0", "mg/dL", "70.0 - 99.0", "NORMAL"),
        ]
    },
    {
        "filename": "sample_infection_report.pdf",
        "title": "METROPOLITAN CLINICAL LABORATORIES",
        "patient": "Sarah Connor | Age: 29 | Gender: Female | Date: 2026-03-26",
        "doctor": "Referring Physician: Dr. A. Verma, MD",
        "test_name": "ACUTE HEMATOLOGY & INFLAMMATORY SCREEN",
        "rows": [
            ("Hemoglobin (Hb)", "13.2", "g/dL", "12.0 - 15.5", "NORMAL"),
            ("Red Blood Cells (RBC)", "4.5", "x10^6/uL", "4.0 - 5.2", "NORMAL"),
            ("Hematocrit (Hct)", "39.8", "%", "36.0 - 46.0", "NORMAL"),
            ("MCV", "88.5", "fL", "80.0 - 100.0", "NORMAL"),
            ("MCH", "29.5", "pg", "27.0 - 33.0", "NORMAL"),
            ("RDW", "13.0", "%", "11.5 - 14.5", "NORMAL"),
            ("White Blood Cells (WBC)", "15.4", "x10^3/uL", "4.5 - 11.0", "HIGH (Leukocytosis)"),
            ("Platelet Count (PLT)", "385.0", "x10^3/uL", "150 - 450", "ELEVATED (Reactive)"),
            ("Serum Ferritin", "175.0", "ng/mL", "20.0 - 200.0", "NORMAL (Reactive)"),
            ("Fasting Glucose", "92.0", "mg/dL", "70.0 - 99.0", "NORMAL"),
        ]
    }
]

def create_pdf_report(cfg):
    output_path = os.path.join(DATA_DIR, cfg["filename"])
    with PdfPages(output_path) as pdf:
        fig, ax = plt.subplots(figsize=(8.5, 11))
        ax.axis('off')

        # Header Section
        ax.text(0.05, 0.94, cfg["title"], fontsize=14, weight='bold', color='#1e3a8a')
        ax.text(0.05, 0.91, "Accredited Clinical Diagnostics • CLIA / CAP Certified", fontsize=9, color='#64748b')
        ax.plot([0.05, 0.95], [0.895, 0.895], color='#cbd5e1', lw=1.5)

        # Patient Info Box
        ax.text(0.05, 0.86, f"Patient: {cfg['patient']}", fontsize=10, weight='semibold', color='#0f172a')
        ax.text(0.05, 0.83, cfg["doctor"], fontsize=9, color='#334155')
        ax.text(0.05, 0.80, f"Panel: {cfg['test_name']}", fontsize=10, weight='bold', color='#2563eb')
        ax.plot([0.05, 0.95], [0.78, 0.78], color='#cbd5e1', lw=1)

        # Table Headers
        headers = ["Test Name", "Result", "Units", "Reference Range", "Flag / Status"]
        col_x = [0.05, 0.38, 0.48, 0.62, 0.80]
        y = 0.74

        for x_pos, head in zip(col_x, headers):
            ax.text(x_pos, y, head, fontsize=9.5, weight='bold', color='#1e293b')
        ax.plot([0.05, 0.95], [y - 0.015, y - 0.015], color='#94a3b8', lw=1)

        # Table Rows
        y -= 0.05
        for row in cfg["rows"]:
            test_name, result, units, ref, status = row
            is_flagged = "LOW" in status or "HIGH" in status
            row_color = '#b91c1c' if is_flagged else '#1e293b'

            ax.text(col_x[0], y, test_name, fontsize=9, color='#0f172a')
            ax.text(col_x[1], y, result, fontsize=9, weight='bold', color=row_color)
            ax.text(col_x[2], y, units, fontsize=8.5, color='#475569')
            ax.text(col_x[3], y, ref, fontsize=8.5, color='#475569')
            ax.text(col_x[4], y, status, fontsize=8.5, weight='semibold', color=row_color)

            y -= 0.04

        # Footer Notes
        ax.plot([0.05, 0.95], [0.20, 0.20], color='#e2e8f0', lw=1)
        ax.text(0.05, 0.17, "CLINICAL INTERPRETATION NOTE:", fontsize=9, weight='bold', color='#334155')
        ax.text(0.05, 0.14, "Values outside reference ranges should be evaluated in context of patient clinical history.", fontsize=8.5, color='#64748b')
        ax.text(0.05, 0.11, "Electronically signed by Laboratory Director. Generated for MedVision AI testing.", fontsize=8, color='#94a3b8')

        pdf.savefig(fig, bbox_inches='tight')
        plt.close(fig)

    print(f"Generated sample medical report: {output_path}")

def generate_all_samples():
    print("=" * 60)
    print("MedVision AI: Generating Sample Medical Blood Report PDFs")
    print("=" * 60)
    for cfg in REPORTS_CONFIG:
        create_pdf_report(cfg)
    print("=" * 60)

if __name__ == "__main__":
    generate_all_samples()
