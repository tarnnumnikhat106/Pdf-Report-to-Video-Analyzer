/**
 * MedVision AI - Realistic Medical Mock Data
 * 
 * Clinically reviewed sample reports designed for educational visualization.
 * IMPORTANT: This data is for educational demonstration only and does NOT constitute medical advice.
 */

export const MOCK_REPORTS = [
  {
    reportId: "MR-001",
    reportName: "CBC_Comprehensive_Blood_Panel.pdf",
    patientInitials: "J.D.",
    patientAge: 42,
    patientGender: "Female",
    date: "2026-03-24",
    laboratory: "Metropolitan Clinical Laboratories",
    doctor: "Dr. Elena Rostova, MD",
    reportType: "Hematology & Iron Panel",
    summary: "The laboratory evaluation indicates mild microcytic anemia, highlighted by low Hemoglobin (9.2 g/dL) and reduced Ferritin reserves. Platelet and white blood cell lines remain within expected homeostatic limits. These findings suggest depleted iron availability and warrant an informed clinical discussion regarding dietary intake, absorption, and potential sources of blood loss.",
    attentionCount: 3,
    normalCount: 5,
    findings: [
      {
        id: "f-01",
        name: "Hemoglobin (Hb)",
        category: "Complete Blood Count",
        value: 9.2,
        unit: "g/dL",
        referenceRange: "12.0 - 15.5 g/dL",
        minRef: 12.0,
        maxRef: 15.5,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Decreased circulating hemoglobin concentration consistent with moderate anemia.",
        simpleExplanation: "Hemoglobin is the essential iron-rich protein inside red blood cells that transports oxygen from your lungs to the rest of your body. Your value is below the reference range.",
        detailedDescription: "Hemoglobin gives blood its red color and binds to oxygen molecules so they can be distributed to muscles, organs, and brain tissue. When levels dip below normal, tissues may receive slightly less oxygen, potentially causing mild fatigue or reduced physical stamina.",
        whyItMatters: "Persistent low hemoglobin can lead to shortness of breath during exertion, dizziness, cold hands and feet, or pale skin. Identifying why it is low helps address the root cause early.",
        doctorDiscussionPoints: [
          "Could my diet or iron intake be contributing to this hemoglobin level?",
          "Are additional tests such as serum iron, TIBC, or vitamin B12 indicated?",
          "Should we investigate any potential sources of chronic blood loss, such as heavy menstrual cycles or gastrointestinal causes?",
          "Is oral iron supplementation or dietary modification appropriate for my situation?"
        ],
        biologicalContext: "Normal levels fluctuate slightly based on hydration status, altitude, and sex. Women typically have slightly lower reference intervals than men due to periodic menstruation."
      },
      {
        id: "f-02",
        name: "Serum Ferritin",
        category: "Iron Studies",
        value: 14,
        unit: "ng/mL",
        referenceRange: "20 - 200 ng/mL",
        minRef: 20,
        maxRef: 200,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Depleted intracellular iron storage protein levels indicating iron deficiency.",
        simpleExplanation: "Ferritin is the body's primary storage form of iron. A low level shows that your body's backup iron reserves are running low.",
        detailedDescription: "Think of ferritin as your body's iron savings account. While circulating iron is what you spend day-to-day, ferritin reflects the reserve supply in your liver and bone marrow. When reserves drop low, the body struggles to manufacture new hemoglobin.",
        whyItMatters: "Ferritin is one of the earliest and most sensitive indicators of iron deficiency, often dropping before hemoglobin noticeably falls.",
        doctorDiscussionPoints: [
          "Would iron supplements be recommended, and what formulation causes minimal stomach upset?",
          "When should we retest ferritin to confirm that reserves are rebuilding?",
          "Are there dietary pairings (like taking Vitamin C with meals) that could help my iron absorption?"
        ],
        biologicalContext: "Ferritin is also an acute phase reactant, meaning inflammation can artificially raise it. In this report, the low level provides clear evidence of depleted stores."
      },
      {
        id: "f-03",
        name: "Mean Corpuscular Volume (MCV)",
        category: "Red Blood Cell Indices",
        value: 74,
        unit: "fL",
        referenceRange: "80 - 100 fL",
        minRef: 80,
        maxRef: 100,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Microcytosis observed: average red blood cell size is smaller than typical reference values.",
        simpleExplanation: "MCV measures the average size of your red blood cells. A value of 74 fL means your red blood cells are somewhat smaller than usual.",
        detailedDescription: "When bone marrow lacks sufficient iron building blocks, newly synthesized red blood cells are smaller (microcytic) and contain less hemoglobin. This explains why the cell volume index is reduced.",
        whyItMatters: "Together with low hemoglobin and ferritin, microcytic cells typically confirm microcytic anemia, helping clinicians distinguish this from other anemia types like B12 deficiency.",
        doctorDiscussionPoints: [
          "Does this microcytic pattern align with iron deficiency or are there genetic traits like thalassemia minor to consider?",
          "How long does it usually take for cell size to normalize once treatment begins?"
        ],
        biologicalContext: "Red blood cells live for approximately 120 days, so MCV changes gradually over a span of several months."
      },
      {
        id: "f-04",
        name: "White Blood Cell Count (WBC)",
        category: "Complete Blood Count",
        value: 6.8,
        unit: "x10^3/µL",
        referenceRange: "4.5 - 11.0 x10^3/µL",
        minRef: 4.5,
        maxRef: 11.0,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Total leukocyte enumeration within normal baseline physiological parameters.",
        simpleExplanation: "White blood cells are your immune system's primary defenders against infections. Your count is comfortably within the normal range.",
        detailedDescription: "Your WBC level reflects the active presence of immune cells (neutrophils, lymphocytes, monocytes, eosinophils, and basophils) circulating throughout your vascular system.",
        whyItMatters: "A normal count indicates no acute systemic bacterial infection, viral surge, or severe immune suppression at the time of sampling.",
        doctorDiscussionPoints: [
          "The white blood cell count appears stable; does this indicate my immune response is performing normally?"
        ],
        biologicalContext: "Counts can transiently rise after rigorous exercise or acute psychological stress, but your current value shows a tranquil, healthy baseline."
      },
      {
        id: "f-05",
        name: "Platelet Count",
        category: "Complete Blood Count",
        value: 265,
        unit: "x10^3/µL",
        referenceRange: "150 - 450 x10^3/µL",
        minRef: 150,
        maxRef: 450,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Thrombocyte concentration is within expected reference bounds.",
        simpleExplanation: "Platelets are tiny cell fragments that help your blood clot when you have a cut or injury. Your level is well-balanced.",
        detailedDescription: "Platelets gather at sites of blood vessel damage, forming an initial plug and releasing chemical signals to facilitate normal clotting and tissue repair.",
        whyItMatters: "Having a stable platelet count ensures standard clotting function without heightened risk of spontaneous bruising or abnormal clot formation.",
        doctorDiscussionPoints: [
          "Normal platelet count indicates normal primary clotting mechanics."
        ],
        biologicalContext: "Formed in the bone marrow by megakaryocytes, platelets circulate for 7-10 days before being filtered by the spleen."
      },
      {
        id: "f-06",
        name: "Red Blood Cell Count (RBC)",
        category: "Complete Blood Count",
        value: 4.1,
        unit: "x10^6/µL",
        referenceRange: "4.0 - 5.2 x10^6/µL",
        minRef: 4.0,
        maxRef: 5.2,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Total erythrocyte count is in the lower tier of the reference interval.",
        simpleExplanation: "The total number of red blood cells circulating in your bloodstream is within the standard healthy bracket.",
        detailedDescription: "Even though cell size and hemoglobin content are reduced, the absolute number of cells produced by your bone marrow remains inside the baseline range.",
        whyItMatters: "This suggests your marrow is actively producing cells, but the cells simply lack sufficient iron fuel to fill up completely.",
        doctorDiscussionPoints: [
          "Is the lower-end RBC count expected alongside the reduced hemoglobin?"
        ],
        biologicalContext: "Erythropoietin (EPO), produced by the kidneys, signals marrow to maintain this count in response to oxygen sensor feedback."
      },
      {
        id: "f-07",
        name: "Hematocrit (Hct)",
        category: "Complete Blood Count",
        value: 30.5,
        unit: "%",
        referenceRange: "36.0 - 46.0 %",
        minRef: 36.0,
        maxRef: 46.0,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Packed cell volume is reduced proportional to erythrocyte hemoglobin content.",
        simpleExplanation: "Hematocrit measures the percentage of your blood volume made up of red blood cells. Your value is below standard reference range.",
        detailedDescription: "In healthy blood, roughly 36% to 46% of the liquid volume is composed of cellular red blood cells. At 30.5%, the ratio indicates that your blood is more liquid than standard.",
        whyItMatters: "Tracks closely with hemoglobin, reinforcing the evaluation of low oxygen-carrying capacity.",
        doctorDiscussionPoints: [
          "How will tracking hematocrit alongside hemoglobin help monitor recovery over coming months?"
        ],
        biologicalContext: "Often approximates 3 times the hemoglobin level; here 9.2 x 3 ≈ 27.6-30%, aligning neatly with standard clinical physiology."
      },
      {
        id: "f-08",
        name: "Red Cell Distribution Width (RDW)",
        category: "Red Blood Cell Indices",
        value: 15.8,
        unit: "%",
        referenceRange: "11.5 - 14.5 %",
        minRef: 11.5,
        maxRef: 14.5,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Elevated anisocytosis: wider variability in red blood cell volume than typical.",
        simpleExplanation: "RDW measures variation in cell sizes. A higher score means your bloodstream contains a mixture of older regular cells and newer smaller cells.",
        detailedDescription: "When iron availability gradually diminishes, newer cells emerge smaller than older cells, creating size disparities that elevate the RDW marker.",
        whyItMatters: "Elevated RDW is an important physiological clue that the cell size change is recent and evolving, common in nutritional iron deficiency.",
        doctorDiscussionPoints: [
          "Does this elevated RDW support nutritional iron deficiency over genetic cell variations?"
        ],
        biologicalContext: "Clinicians use the combination of low MCV and high RDW to distinguish iron deficiency from conditions like beta-thalassemia trait."
      }
    ],
    videoData: {
      title: "Understanding Your CBC & Iron Panel Analysis",
      duration: "2m 45s",
      durationSeconds: 165,
      language: "English",
      resolution: "1080p Full HD",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      chapters: [
        { time: "0:00", title: "Introduction & Overview", timestamp: 0 },
        { time: "0:35", title: "Hemoglobin & Oxygen Transport", timestamp: 35 },
        { time: "1:15", title: "Ferritin & Iron Stores", timestamp: 75 },
        { time: "1:55", title: "Healthy Immune Baseline (WBC & Platelets)", timestamp: 115 },
        { time: "2:20", title: "Next Steps & Doctor Discussion", timestamp: 140 }
      ],
      transcript: `Welcome to your MedVision AI educational report overview. Today we are walking through your complete blood count and iron panel results from March 24, 2026.

First, your report highlights that your overall immune defense—your white blood cells—and your blood clotting fragments—your platelets—are completely normal. This indicates strong foundational health and stable marrow function.

However, three related findings highlight an area requiring attention: Hemoglobin, Ferritin, and MCV. 

Hemoglobin was reported at 9.2 grams per deciliter, which is below the standard reference range of 12 to 15.5. Hemoglobin acts as the molecular shuttle carrying oxygen from your lungs to your muscles and organs.

Your Ferritin level was recorded at 14 nanograms per milliliter. Ferritin acts like an iron savings account. When ferritin reserves run low, the body struggles to synthesize new hemoglobin, and the newly formed cells become smaller in size, which is reflected in your MCV of 74.

Important note: This educational video is designed to empower your consultation, not provide a diagnosis. Please schedule a follow-up with your physician to discuss potential dietary adjustments, iron supplementation, or further diagnostic evaluations.`
    }
  },
  {
    reportId: "MR-002",
    reportName: "Lipid_Cardiovascular_Screening.pdf",
    patientInitials: "M.K.",
    patientAge: 51,
    patientGender: "Male",
    date: "2026-03-20",
    laboratory: "Apex Diagnostic Laboratories",
    doctor: "Dr. Marcus Vance, FACC",
    reportType: "Cardiovascular Lipid Profile",
    summary: "Lipid evaluation indicates moderate elevation in total cholesterol (238 mg/dL) and LDL cholesterol (156 mg/dL), alongside borderline-elevated triglycerides (178 mg/dL). HDL protective cholesterol remains in the standard target range (48 mg/dL). These findings suggest an opportunity to discuss cardiovascular risk reduction, heart-healthy nutrition, and lifestyle optimization.",
    attentionCount: 3,
    normalCount: 3,
    findings: [
      {
        id: "f-11",
        name: "LDL Cholesterol (Calculated)",
        category: "Lipid Panel",
        value: 156,
        unit: "mg/dL",
        referenceRange: "< 100 mg/dL (Optimal)",
        minRef: 0,
        maxRef: 100,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Elevated low-density lipoprotein cholesterol above primary prevention targets.",
        simpleExplanation: "Often called 'bad cholesterol', LDL carries cholesterol particles through your arteries. Your level is elevated above the optimal threshold.",
        detailedDescription: "Elevated LDL particles can slowly accumulate along arterial walls over years, forming deposits known as plaque. Plaque narrowing can reduce arterial flexibility.",
        whyItMatters: "Managing LDL is one of the most well-studied ways to reduce long-term risk of cardiovascular events.",
        doctorDiscussionPoints: [
          "What is my personalized 10-year cardiovascular risk score based on my age, blood pressure, and this LDL level?",
          "Would a dietary approach focusing on soluble fiber and reduced saturated fat be the first step, or are medications indicated?",
          "Should we consider an ApoB test or a Coronary Artery Calcium (CAC) scan?"
        ],
        biologicalContext: "Target levels vary significantly based on whether a patient has diabetes, smoking history, or hypertension."
      },
      {
        id: "f-12",
        name: "Total Cholesterol",
        category: "Lipid Panel",
        value: 238,
        unit: "mg/dL",
        referenceRange: "< 200 mg/dL",
        minRef: 100,
        maxRef: 200,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Hypercholesterolemia observed; reflects composite sum of HDL, LDL, and VLDL fractions.",
        simpleExplanation: "Total cholesterol is an overall measure of all the cholesterol types circulating in your blood.",
        detailedDescription: "This score combines your LDL, HDL, and a fraction of your triglycerides. It provides a broad bird's-eye view of circulating lipids.",
        whyItMatters: "Helps assess overall lipid transport balance when viewed in ratio with protective HDL.",
        doctorDiscussionPoints: [
          "How does my total-to-HDL cholesterol ratio look compared to standard recommendations?"
        ],
        biologicalContext: "Synthesized mainly by the liver (about 75-80%), with dietary sources providing the remainder."
      },
      {
        id: "f-13",
        name: "Triglycerides",
        category: "Lipid Panel",
        value: 178,
        unit: "mg/dL",
        referenceRange: "< 150 mg/dL",
        minRef: 50,
        maxRef: 150,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Borderline hypertriglyceridemia, frequently linked with carbohydrate intake or metabolic clearance.",
        simpleExplanation: "Triglycerides are the main type of fat in your bloodstream. Your level is in the borderline-elevated zone.",
        detailedDescription: "Any excess calories from carbohydrates, sugars, or alcohol that your body doesn't burn immediately get converted into triglycerides and stored in fat cells.",
        whyItMatters: "Mild elevations often respond quickly to dietary changes, aerobic activity, and limiting refined carbohydrates.",
        doctorDiscussionPoints: [
          "Could modest weight management or reducing refined sugar intake help bring this below 150 mg/dL?",
          "Was the 12-hour fasting window observed sufficiently before this blood draw?"
        ],
        biologicalContext: "Highly sensitive to recent meals and alcohol consumption within the 24-48 hours before testing."
      },
      {
        id: "f-14",
        name: "HDL Cholesterol",
        category: "Lipid Panel",
        value: 48,
        unit: "mg/dL",
        referenceRange: "> 40 mg/dL (Male target)",
        minRef: 40,
        maxRef: 80,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "High-density lipoprotein level meets minimum protective reference standards.",
        simpleExplanation: "Often called 'good cholesterol', HDL helps scavenge excess cholesterol from your bloodstream and carry it back to your liver.",
        detailedDescription: "Higher HDL is generally protective because it assists in reverse cholesterol transport, clearing lipid particles from peripheral tissues.",
        whyItMatters: "Your HDL is within target, giving you natural protective assistance.",
        doctorDiscussionPoints: [
          "Could regular aerobic exercise help increase my HDL even higher?"
        ],
        biologicalContext: "Physical endurance activities and heart-healthy dietary fats like olive oil and omega-3s tend to boost HDL."
      },
      {
        id: "f-15",
        name: "Non-HDL Cholesterol",
        category: "Lipid Panel",
        value: 190,
        unit: "mg/dL",
        referenceRange: "< 130 mg/dL",
        minRef: 0,
        maxRef: 130,
        status: "important",
        severityLevel: "IMPORTANT",
        technicalSummary: "Elevated atherogenic cholesterol burden (Total minus HDL).",
        simpleExplanation: "Non-HDL captures all cholesterol that can contribute to arterial plaque. This is elevated above the recommended guideline.",
        detailedDescription: "Non-HDL combines LDL, VLDL, and intermediate lipoproteins, accounting for every atherogenic particle in your circulation.",
        whyItMatters: "Many cardiology societies consider Non-HDL an even more reliable predictor than LDL alone.",
        doctorDiscussionPoints: [
          "Should non-HDL be our primary target for lifestyle or therapeutic reduction?"
        ],
        biologicalContext: "Requires no special fasting calculation, making it robust against triglyceride fluctuations."
      },
      {
        id: "f-16",
        name: "High-Sensitivity CRP (hs-CRP)",
        category: "Inflammatory Biomarkers",
        value: 1.2,
        unit: "mg/L",
        referenceRange: "< 2.0 mg/L (Average risk)",
        minRef: 0,
        maxRef: 2.0,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Vascular inflammatory index within standard baseline parameters.",
        simpleExplanation: "hs-CRP measures low-grade inflammation in your blood vessels. Your level is reassuringly normal.",
        detailedDescription: "Indicates that there is no major active systemic or vascular inflammatory surge affecting your cardiovascular system.",
        whyItMatters: "Provides reassurance that vascular inflammation is not currently accelerating plaque instability.",
        doctorDiscussionPoints: [
          "Reassuring normal inflammatory index."
        ],
        biologicalContext: "Produced by the liver in response to cytokines; acute infections can cause temporary spikes."
      }
    ],
    videoData: {
      title: "Understanding Your Lipid & Cardiovascular Screening",
      duration: "3m 10s",
      durationSeconds: 190,
      language: "English",
      resolution: "1080p Full HD",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      chapters: [
        { time: "0:00", title: "Introduction to Lipid Health", timestamp: 0 },
        { time: "0:45", title: "LDL vs HDL Explained", timestamp: 45 },
        { time: "1:30", title: "Triglycerides & Dietary Factors", timestamp: 90 },
        { time: "2:15", title: "Non-HDL Cardiovascular Score", timestamp: 135 },
        { time: "2:45", title: "Discussion Points for Your Doctor", timestamp: 165 }
      ],
      transcript: `Hello and welcome to your MedVision AI educational breakdown of your Cardiovascular Lipid Panel from March 20, 2026.

Your results show that your HDL—the protective, good cholesterol—is in a favorable spot at 48 milligrams per deciliter, and your inflammatory marker hs-CRP is reassuringly low at 1.2.

However, your report identified elevated levels for LDL cholesterol (156 mg/dL) and Non-HDL cholesterol (190 mg/dL), alongside borderline triglycerides at 178 mg/dL.

LDL particles act as the delivery trucks for cholesterol in the body. When levels exceed optimal reference thresholds, these particles can slowly adhere to blood vessel walls over time.

Triglycerides represent energy stored from recent nutrition, and mild elevations often respond quickly to adjustments in carbohydrate intake, aerobic exercise, and healthy dietary fats.

Remember, cholesterol numbers should always be evaluated in context with your age, family history, and blood pressure. We recommend bringing these specific discussion points to your next appointment with your physician.`
    }
  },
  {
    reportId: "MR-003",
    reportName: "Metabolic_Panel_CMP_Report.pdf",
    patientInitials: "R.S.",
    patientAge: 58,
    patientGender: "Female",
    date: "2026-03-15",
    laboratory: "BioHealth Regional Diagnostics",
    doctor: "Dr. Sarah Chen, MD",
    reportType: "Comprehensive Metabolic Panel (CMP)",
    summary: "Comprehensive metabolic assessment reveals slightly elevated Fasting Glucose (114 mg/dL) and HbA1c (5.9%), consistent with prediabetes screening criteria. Renal and hepatic markers, including Creatinine (0.85 mg/dL), eGFR (>90 mL/min), and ALT (22 U/L), reflect robust kidney and liver function.",
    attentionCount: 2,
    normalCount: 6,
    findings: [
      {
        id: "f-21",
        name: "Fasting Blood Glucose",
        category: "Carbohydrate Metabolism",
        value: 114,
        unit: "mg/dL",
        referenceRange: "70 - 99 mg/dL",
        minRef: 70,
        maxRef: 99,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Impaired fasting glucose detected; exceeds physiological normative threshold.",
        simpleExplanation: "Blood glucose measures sugar concentration in your bloodstream after fasting. Your level is mildly above the normal cutoff.",
        detailedDescription: "After overnight fasting, insulin typically regulates glucose between 70 and 99 mg/dL. A reading between 100 and 125 mg/dL falls in the impaired fasting glucose (prediabetes) range.",
        whyItMatters: "Mild elevations give you an early heads-up to adopt simple nutritional and lifestyle habits before blood sugars rise further.",
        doctorDiscussionPoints: [
          "Does this finding confirm early insulin resistance or prediabetes?",
          "Would consultation with a registered dietitian or diabetes educator be beneficial?",
          "How often should we monitor fasting glucose and HbA1c?"
        ],
        biologicalContext: "Can fluctuate with acute stress, poor sleep, or morning cortisol surges (the dawn phenomenon)."
      },
      {
        id: "f-22",
        name: "Hemoglobin A1c (HbA1c)",
        category: "Carbohydrate Metabolism",
        value: 5.9,
        unit: "%",
        referenceRange: "< 5.7 % (Normal)",
        minRef: 4.0,
        maxRef: 5.7,
        status: "attention",
        severityLevel: "ATTENTION",
        technicalSummary: "Glycated hemoglobin fraction elevated into the prediabetic range (5.7% - 6.4%).",
        simpleExplanation: "HbA1c reflects your average blood sugar levels over the past 2 to 3 months. 5.9% is in the prediabetes category.",
        detailedDescription: "Sugar in your bloodstream gradually attaches to hemoglobin proteins in red blood cells. Because cells live roughly 90 to 120 days, HbA1c provides a steady three-month average.",
        whyItMatters: "Unlike a single fasting glucose test, HbA1c cannot be fooled by what you ate the previous night, making it an excellent long-term tracker.",
        doctorDiscussionPoints: [
          "What realistic target should we set for my 6-month HbA1c retest?",
          "What specific physical activities have been most effective for improving insulin sensitivity?"
        ],
        biologicalContext: "Values of 5.7% to 6.4% signify prediabetes; values 6.5% and above require formal clinical diagnostic confirmation."
      },
      {
        id: "f-23",
        name: "Serum Creatinine",
        category: "Kidney Function",
        value: 0.85,
        unit: "mg/dL",
        referenceRange: "0.55 - 1.02 mg/dL",
        minRef: 0.55,
        maxRef: 1.02,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Glomerular filtration byproduct in normal physiological balance.",
        simpleExplanation: "Creatinine is a natural muscle breakdown waste product filtered out by your kidneys. Your result shows healthy kidney filtration.",
        detailedDescription: "Healthy kidneys filter almost all creatinine out of your blood into urine. Normal creatinine indicates strong filtration capacity.",
        whyItMatters: "Reassures you that your kidneys are performing their vital cleansing role effectively.",
        doctorDiscussionPoints: [
          "Creatinine indicates healthy baseline renal filtration."
        ],
        biologicalContext: "Influenced by muscle mass and hydration; stable values over time are a cornerstone of preventive wellness."
      },
      {
        id: "f-24",
        name: "Estimated GFR (eGFR)",
        category: "Kidney Function",
        value: 94,
        unit: "mL/min/1.73m²",
        referenceRange: "> 60 mL/min/1.73m²",
        minRef: 60,
        maxRef: 120,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Calculated renal clearance efficiency denotes optimal filtration.",
        simpleExplanation: "eGFR estimates how efficiently your kidneys filter waste per minute. A score of 94 represents optimal kidney performance.",
        detailedDescription: "Values above 90 indicate excellent, stage-1 kidney health with full filtration capacity.",
        whyItMatters: "Confirming strong kidney function is especially important when evaluating blood sugar patterns.",
        doctorDiscussionPoints: [
          "Excellent kidney clearance confirmed."
        ],
        biologicalContext: "Calculated using creatinine, age, and biological sex via standardized equations."
      },
      {
        id: "f-25",
        name: "Alanine Aminotransferase (ALT)",
        category: "Liver Function",
        value: 22,
        unit: "U/L",
        referenceRange: "7 - 35 U/L",
        minRef: 7,
        maxRef: 35,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Hepatocellular enzyme level within healthy standard limits.",
        simpleExplanation: "ALT is an enzyme found inside liver cells. Your normal level suggests no acute liver cell irritation.",
        detailedDescription: "When liver cells face stress or inflammation, they leak ALT into the bloodstream. A normal number shows intact cellular integrity.",
        whyItMatters: "Demonstrates healthy liver metabolism without signs of fatty liver stress.",
        doctorDiscussionPoints: [
          "Liver enzymes are within target."
        ],
        biologicalContext: "Often paired with AST to assess overall liver and muscle metabolic balance."
      },
      {
        id: "f-26",
        name: "Serum Sodium (Na)",
        category: "Electrolyte Balance",
        value: 140,
        unit: "mmol/L",
        referenceRange: "135 - 145 mmol/L",
        minRef: 135,
        maxRef: 145,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Electrolyte homeostasis maintained within narrow physiological band.",
        simpleExplanation: "Sodium helps maintain fluid balance, nerve signaling, and blood pressure. Your level is well-balanced.",
        detailedDescription: "Crucial for cellular osmotic pressure and electrical conduction across nerve membranes.",
        whyItMatters: "Confirms proper hydration and systemic electrolyte homeostasis.",
        doctorDiscussionPoints: [
          "Electrolytes are well balanced."
        ],
        biologicalContext: "Tightly regulated by hormones including aldosterone and antidiuretic hormone (ADH)."
      },
      {
        id: "f-27",
        name: "Serum Potassium (K)",
        category: "Electrolyte Balance",
        value: 4.2,
        unit: "mmol/L",
        referenceRange: "3.5 - 5.1 mmol/L",
        minRef: 3.5,
        maxRef: 5.1,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Serum potassium concentration indicates optimal cardiac and muscle polarization.",
        simpleExplanation: "Potassium is essential for normal muscle contractions and steady heart rhythms. Your level is right in the center of the healthy range.",
        detailedDescription: "Even small shifts in potassium can affect muscle excitability, making a balanced result reassuring.",
        whyItMatters: "Confirms healthy cellular electrical conduction.",
        doctorDiscussionPoints: [
          "Cardiac and muscle electrolyte balance is intact."
        ],
        biologicalContext: "Over 98% of total body potassium resides inside cells; blood levels measure the critical circulating remainder."
      },
      {
        id: "f-28",
        name: "Blood Urea Nitrogen (BUN)",
        category: "Kidney Function",
        value: 14,
        unit: "mg/dL",
        referenceRange: "6 - 20 mg/dL",
        minRef: 6,
        maxRef: 20,
        status: "normal",
        severityLevel: "NORMAL",
        technicalSummary: "Protein nitrogen metabolism byproduct is in normal equilibrium.",
        simpleExplanation: "BUN measures nitrogen waste from protein breakdown. Your level is within the standard healthy window.",
        detailedDescription: "Formed in the liver and eliminated by the kidneys, BUN complements creatinine testing.",
        whyItMatters: "Provides dual confirmation of healthy kidney filtration and adequate hydration.",
        doctorDiscussionPoints: [
          "Protein breakdown and excretion are balanced."
        ],
        biologicalContext: "Can vary with dietary protein intake and hydration state."
      }
    ],
    videoData: {
      title: "Understanding Your Comprehensive Metabolic Panel (CMP)",
      duration: "2m 55s",
      durationSeconds: 175,
      language: "English",
      resolution: "1080p Full HD",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      chapters: [
        { time: "0:00", title: "Metabolic Overview", timestamp: 0 },
        { time: "0:40", title: "Kidney & Liver Health (Optimal)", timestamp: 40 },
        { time: "1:20", title: "Fasting Glucose vs HbA1c", timestamp: 80 },
        { time: "2:05", title: "Understanding Prediabetes Signals", timestamp: 125 },
        { time: "2:35", title: "Action Plan with Your Physician", timestamp: 155 }
      ],
      transcript: `Welcome to your MedVision AI educational summary for your Comprehensive Metabolic Panel from March 15, 2026.

We have encouraging news regarding your organ functions: your kidney filtration markers—Creatinine and eGFR—and your liver enzymes are in an optimal, healthy state. Your electrolytes also show stable hydration.

The key area for your awareness centers on blood sugar metabolism. Your fasting glucose was recorded at 114 mg/dL, and your Hemoglobin A1c was reported at 5.9%.

While individual fasting glucose fluctuates day to day, HbA1c captures a three-month rolling average of glucose attached to red blood cells. A value of 5.9% falls into the prediabetes bracket (5.7% to 6.4%).

The positive takeaway is that prediabetes is an early window of opportunity where positive nutritional shifts, walking after meals, and regular physical activity can often help bring numbers back into the standard range.

Please consult your physician to personalize these lifestyle steps and determine an appropriate timeline for your next routine panel.`
    }
  }
];

export const MOCK_HISTORY = [
  {
    reportId: "MR-001",
    reportName: "CBC_Comprehensive_Blood_Panel.pdf",
    date: "2026-03-24",
    laboratory: "Metropolitan Clinical Laboratories",
    reportType: "Complete Blood Count",
    findingsCount: 8,
    attentionCount: 3,
    status: "ATTENTION",
    hasVideo: true
  },
  {
    reportId: "MR-002",
    reportName: "Lipid_Cardiovascular_Screening.pdf",
    date: "2026-03-20",
    laboratory: "Apex Diagnostic Laboratories",
    reportType: "Cardiovascular Lipid Profile",
    findingsCount: 6,
    attentionCount: 3,
    status: "IMPORTANT",
    hasVideo: true
  },
  {
    reportId: "MR-003",
    reportName: "Metabolic_Panel_CMP_Report.pdf",
    date: "2026-03-15",
    laboratory: "BioHealth Regional Diagnostics",
    reportType: "Comprehensive Metabolic Panel",
    findingsCount: 8,
    attentionCount: 2,
    status: "ATTENTION",
    hasVideo: true
  }
];

export const PIPELINE_STEPS = [
  { step: 1, label: "Report uploaded & parsed", description: "PDF/Image securely ingested and verified" },
  { step: 2, label: "Extracting report information", description: "Optical character recognition (OCR) & bounding box extraction" },
  { step: 3, label: "Analyzing medical findings", description: "Biomedical NER, parameter identification & reference intervals" },
  { step: 4, label: "Preparing educational explanation", description: "Synthesizing patient-friendly summaries and discussion points" },
  { step: 5, label: "Preparing visual summary", description: "Generating interactive charts, gauges & video timeline" }
];
