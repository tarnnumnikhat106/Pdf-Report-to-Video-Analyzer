"""
MedVision AI - Llama 3.2 Clinical & Dietary Intelligence Engine
==============================================================
Feeds structured machine learning diagnostic JSON outputs (CBC, LFT, KFT)
into Meta's Llama 3.2 model running locally via Ollama.

Extracts:
1. Clinical Overview (plain-English summary of diagnostic results)
2. Dietary Guidance (beneficial foods, foods to avoid, key nutrients, hydration)
3. Physician Escalation (if High Risk: prominent "Connect to Doctor" alert, urgency, questions)
"""

import os
import json
import requests
from typing import Dict, Any, Optional

from llm_provider import chat_completion, get_status as get_llm_status, is_configured, parse_json_object

OLLAMA_BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
LLAMA_MODEL_NAME = os.environ.get("LLAMA_MODEL_NAME", "llama3.2")


def check_ollama_status() -> Dict[str, Any]:
    """Checks if Ollama is accessible and verifies if llama3.2 is available."""
    try:
        res = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=3)
        if res.status_code == 200:
            models_data = res.json().get("models", [])
            model_names = [m.get("name", "") for m in models_data]
            has_llama = any(LLAMA_MODEL_NAME in name for name in model_names)
            return {
                "available": True,
                "has_model": has_llama,
                "model_name": LLAMA_MODEL_NAME,
                "installed_models": model_names
            }
    except Exception as e:
        return {
            "available": False,
            "has_model": False,
            "model_name": LLAMA_MODEL_NAME,
            "error": str(e)
        }
    return {"available": False, "has_model": False, "model_name": LLAMA_MODEL_NAME}


def build_clinical_prompt(ml_output_json: Dict[str, Any]) -> str:
    """Constructs a strict clinical prompt for Llama 3.2 based on ML output JSON."""
    test_type = ml_output_json.get("test_type", "CBC")
    status = ml_output_json.get("status", "Normal")
    risk_pct = ml_output_json.get("risk_percentage", "N/A")
    features = ml_output_json.get("input_features", ml_output_json.get("parameters", {}))

    return f"""You are an expert clinical medical advisor and clinical nutritionist.
Analyze the following Machine Learning diagnostic output generated from patient laboratory data:

```json
{json.dumps(ml_output_json, indent=2)}
```

Context:
- Test Category: {test_type}
- Diagnostic Risk Status: {status}
- Statistical Risk Score: {risk_pct}
- Patient Biomarkers: {json.dumps(features)}

CRITICAL INSTRUCTIONS:
1. OVERVIEW: Provide a clear, empathetic, 2-3 sentence overview explaining what this result and risk score indicate for the patient's health.
2. DIETARY GUIDANCE: Provide clear, evidence-based nutrition recommendations:
   - "recommended_foods": 4-6 specific beneficial foods tailored directly to this condition (e.g., iron-rich foods for anemia/CBC, antioxidant & liver-protective foods for LFT, low-potassium/low-sodium kidney-safe foods for KFT).
   - "foods_to_avoid": 3-5 specific foods, drinks, or substances that worsen this condition.
   - "hydration_and_habits": 3 practical daily hydration or lifestyle steps.
   - "key_nutrients": 3-4 vital vitamins, minerals, or nutrients relevant here.
3. CONNECT TO DOCTOR (MANDATORY IF HIGH RISK):
   - If status is "High Risk": "connect_to_doctor" MUST be true.
   - "doctor_urgency": Set to "Immediate" (for critical or acute indicators) or "Urgent" or "Routine".
   - "doctor_message": Explicit warning statement strongly urging the patient to connect with a qualified physician or specialist for proper diagnosis and treatment.
   - "recommended_doctor_specialty": Name the exact medical specialist (e.g. "Hematologist", "Gastroenterologist / Hepatologist", "Nephrologist", or "General Physician").
   - "questions_for_doctor": Provide 3-4 precise, intelligent questions the patient should bring to their doctor appointment.

Respond ONLY with a valid JSON object matching this exact schema:
{{
  "overview": "string",
  "risk_level": "{status}",
  "connect_to_doctor": {str(status.lower() == "high risk").lower()},
  "doctor_urgency": "Immediate" | "Urgent" | "Routine",
  "doctor_message": "string",
  "recommended_doctor_specialty": "string",
  "questions_for_doctor": ["question 1", "question 2", "question 3"],
  "diet_guidance": {{
    "recommended_foods": ["food 1", "food 2", "food 3", "food 4"],
    "foods_to_avoid": ["avoid 1", "avoid 2", "avoid 3"],
    "hydration_and_habits": ["habit 1", "habit 2"],
    "key_nutrients": ["nutrient 1", "nutrient 2"]
  }}
}}
Do NOT output markdown code fences (```json), output only the raw JSON string."""


def generate_video_script(report_data: Dict[str, Any], language: str = "en", timeout_seconds: int = 60) -> Optional[Dict[str, Any]]:
    """Uses the configured API provider to write the narration for the slide video."""
    if not is_configured():
        return None

    findings = report_data.get("findings") or []
    attention = [f for f in findings if f.get("status") == "attention"]
    normal = [f for f in findings if f.get("status") == "normal"]
    llama = report_data.get("llamaAnalysis") or {}

    hindi = str(language or "").strip().lower() in {"hi", "hindi", "हिन्दी", "हिंदी", "hinglish"}
    language_name = (
        "natural Hinglish: conversational Hindi written in Devanagari, mixed with common English words "
        "transliterated into Devanagari"
        if hindi
        else "English"
    )
    direct_address = (
        "Address the viewer directly as 'आप'. Sound like a friendly Indian clinician talking casually, "
        "not like a textbook. Use everyday Hinglish and avoid pure or Sanskritized Hindi. Keep familiar "
        "English words such as रिपोर्ट, वैल्यू, नॉर्मल रेंज, डॉक्टर, टेस्ट, रिज़ल्ट, लाइफस्टाइल, and डाइट. "
        "Say 'नॉर्मल रेंज' instead of 'सामान्य सीमा', and 'डॉक्टर' instead of 'चिकित्सक'."
        if hindi
        else "Address the viewer directly as 'you' and 'your'. Keep the tone warm, calm, and conversational, "
        "as if you are sitting beside them explaining their report. Use contractions and short sentences."
    )
    script_language_rule = (
        "- Even though the JSON template is in English, write every narration and question value in Devanagari Hinglish. Keep finding names exactly as given.\n"
        "- Example tone: \"नमस्ते! चलिए आपकी रिपोर्ट को समझते हैं। आपका हीमोग्लोबिन 9.4 g/dL है, जो नॉर्मल रेंज से कम है।\"\n"
        if hindi
        else ""
    )

    payload = {
        "report_name": report_data.get("reportName", "Lab report"),
        "summary": report_data.get("summary", ""),
        "attention_findings": [
            {
                "name": f.get("name"),
                "value": f.get("value"),
                "unit": f.get("unit"),
                "referenceRange": f.get("referenceRange"),
                "simpleExplanation": f.get("simpleExplanation"),
                "whyItMatters": f.get("whyItMatters"),
            }
            for f in attention[:3]
        ],
        "normal_findings": [
            {"name": f.get("name"), "value": f.get("value"), "unit": f.get("unit")}
            for f in normal[:5]
        ],
        "doctor_questions": (llama.get("questions_for_doctor") or [])[:3],
    }

    prompt = f"""Write narration for a short educational lab-report video.
Use ONLY the values and facts in this JSON. Do not diagnose, do not prescribe, and do not invent numbers.
Write every narration and question in {language_name}. Use plain, everyday language. Be calm and non-alarming.
{direct_address}

Input:
{json.dumps(payload, indent=2)}

Return ONLY this JSON object:
{{
  "cover_narration": "2-3 warm sentences that speak directly to the viewer, say this is their report walkthrough, and state how many of their values need review.",
  "finding_narrations": [
    {{"name": "exact finding name from input", "narration": "2-3 sentences: say what their value was, compare it with their reference range, then explain what it means for them in plain language. Speak to them, not about them."}}
  ],
  "next_narration": "1-2 sentences inviting the viewer to bring the questions to their clinician.",
  "questions": ["3 practical questions the viewer can ask a clinician, based only on the supplied findings"]
}}

Rules:
{script_language_rule}- Include one finding_narrations item for each attention_finding, in the same order.
- If there are no attention findings, finding_narrations may be empty and cover_narration should say the measured values are in range.
- Do not mention a condition as confirmed. Use phrases such as "may be linked to" or "can be seen with".
- Do not add markdown fences or text outside the JSON object.
- Keep every narration item to 3 sentences or fewer so it fits a short slide."""

    try:
        result = chat_completion(
            [
                {
                    "role": "system",
                    "content": (
                        "You write careful, warm patient education scripts that speak directly to the viewer. "
                        "You never diagnose or prescribe. Return only valid JSON."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            json_mode=True,
            temperature=0.3,
            max_tokens=2200 if hindi else 1500,
            timeout=max(timeout_seconds, 45),
        )
        if not result:
            return None
        parsed = parse_json_object(result["content"])
        if not isinstance(parsed.get("finding_narrations"), list):
            parsed["finding_narrations"] = []
        if not isinstance(parsed.get("questions"), list):
            parsed["questions"] = []
        parsed["_model_used"] = f"{get_llm_status().get('provider_label') or 'LLM'} ? {result.get('model', 'model')}"
        return parsed
    except Exception as exc:
        print(f"[Video Script] External LLM note: {type(exc).__name__}. Using the built-in script.")
        return None


def generate_fallback_advice(ml_output_json: Dict[str, Any]) -> Dict[str, Any]:
    """High-quality clinical fallback if Llama 3.2 is temporarily unreachable."""
    test_type = ml_output_json.get("test_type", "CBC").upper()
    status = ml_output_json.get("status", "Normal")
    is_high_risk = "high" in status.lower() or ml_output_json.get("prediction", 0) == 1

    if test_type == "CBC":
        if is_high_risk:
            return {
                "overview": "The machine learning blood analysis indicates an abnormal hematological profile consistent with anemia or iron reserve depletion. Red blood cell indices and hemoglobin levels fall outside standard physiological boundaries.",
                "risk_level": "High Risk",
                "connect_to_doctor": True,
                "doctor_urgency": "Immediate",
                "doctor_message": "⚠️ High Risk Detected: Please connect with a Hematologist or primary care physician promptly. Clinical evaluation is needed to determine the etiology of low hemoglobin and initiate targeted therapy.",
                "recommended_doctor_specialty": "Hematologist / Internal Medicine",
                "questions_for_doctor": [
                    "What specific type of anemia do my red blood cell indices indicate?",
                    "Are serum ferritin, transferrin saturation, and vitamin B12 tests needed?",
                    "Should I begin therapeutic iron supplementation or receive dietary intervention?",
                    "Is there evidence of occult blood loss that requires investigation?"
                ],
                "diet_guidance": {
                    "recommended_foods": [
                        "Iron-rich foods: Lean red meats, poultry, and egg yolks (heme iron)",
                        "Plant-based iron: Spinach, cooked lentils, chickpeas, and fortified whole grains",
                        "Vitamin C enhancers: Bell peppers, oranges, lemons, and strawberries to multiply iron uptake",
                        "Folate & B12: Dark leafy greens, asparagus, avocados, and fortified nutritional yeast"
                    ],
                    "foods_to_avoid": [
                        "Black tea, green tea, and coffee within 2 hours of meals (tannins inhibit iron absorption)",
                        "Excessive calcium or dairy supplements taken simultaneously with iron-rich meals",
                        "Ultra-processed snack foods that lack essential micronutrients",
                        "High-phytate bran products consumed in large quantities at main meals"
                    ],
                    "hydration_and_habits": [
                        "Drink 2.5 to 3 liters of water daily to maintain plasma volume and circulation",
                        "Pair plant-based iron sources with citrus or vitamin C rich ingredients in every meal",
                        "Avoid rigorous strenuous exercise until hemoglobin levels are clinically reviewed"
                    ],
                    "key_nutrients": ["Bioavailable Iron", "Vitamin C (Ascorbic Acid)", "Vitamin B12", "Folic Acid"]
                },
                "model_used": "Llama 3.2 Clinical Engine (Clinical Rule Fallback)"
            }
        else:
            return {
                "overview": "All Complete Blood Count parameters are balanced within standard healthy intervals. The ML model detected no acute hematological abnormalities, reflecting stable oxygen transport and immune reserves.",
                "risk_level": "Normal",
                "connect_to_doctor": False,
                "doctor_urgency": "Routine",
                "doctor_message": "Your blood counts are currently in the normal reference range. Continue routine annual preventive health screenings.",
                "recommended_doctor_specialty": "General Physician",
                "questions_for_doctor": [
                    "Are there any specific blood markers you recommend monitoring annually?",
                    "Does my current diet provide adequate micronutrients for active lifestyle needs?"
                ],
                "diet_guidance": {
                    "recommended_foods": [
                        "Balanced proteins: Fish, lean poultry, legumes, and eggs",
                        "Rainbow vegetables: Cruciferous vegetables, carrots, bell peppers, and beets",
                        "Whole grains: Quinoa, oats, brown rice, and whole wheat",
                        "Healthy fats: Olive oil, walnuts, chia seeds, and avocados"
                    ],
                    "foods_to_avoid": [
                        "Excessive refined sugars and sweetened beverages",
                        "Heavy trans fats and heavily deep-fried foods"
                    ],
                    "hydration_and_habits": [
                        "Maintain steady hydration with 2 to 2.5 liters of clean water daily",
                        "Engage in 150 minutes of moderate aerobic exercise weekly",
                        "Maintain consistent sleep hygiene for optimal cellular regeneration"
                    ],
                    "key_nutrients": ["Balanced Protein", "Dietary Fiber", "Antioxidants", "B-Complex Vitamins"]
                },
                "model_used": "Llama 3.2 Clinical Engine (Clinical Rule Fallback)"
            }

    elif test_type == "LFT":
        if is_high_risk:
            return {
                "overview": "The ML diagnostic classifier has identified markers indicative of hepatic cellular stress or elevated liver transaminases (SGOT/SGPT or Bilirubin). Further medical assessment is required.",
                "risk_level": "High Risk",
                "connect_to_doctor": True,
                "doctor_urgency": "Immediate",
                "doctor_message": "⚠️ High Risk Detected: Please connect with a Gastroenterologist or Hepatologist. Elevated liver enzymes necessitate formal evaluation to exclude hepatic inflammation, fatty liver, or biliary obstruction.",
                "recommended_doctor_specialty": "Gastroenterologist / Hepatologist",
                "questions_for_doctor": [
                    "What is the most likely cause of my elevated transaminases or bilirubin?",
                    "Should we perform an abdominal ultrasound or viral hepatitis panel?",
                    "Are any of my current medications or supplements placing strain on my liver?",
                    "What lifestyle and dietary changes are crucial to reverse this enzyme trend?"
                ],
                "diet_guidance": {
                    "recommended_foods": [
                        "Cruciferous vegetables: Broccoli, Brussels sprouts, cabbage (rich in glutathione precursors)",
                        "Antioxidant berries: Blueberries, blackberries, and pomegranate",
                        "Hepato-protective drinks: Unsweetened filtered coffee and green tea",
                        "Lean proteins: Tofu, lentils, skinless chicken, and steamed white fish"
                    ],
                    "foods_to_avoid": [
                        "Alcohol in all forms (must be strictly eliminated during liver recovery)",
                        "High-fructose corn syrup, soda, and refined pastries (primary contributors to hepatic steatosis)",
                        "Deep-fried foods, saturated animal fats, and hydrogenated oils",
                        "Unprescribed herbal supplements or excessive acetaminophen (Tylenol)"
                    ],
                    "hydration_and_habits": [
                        "Drink 2.5 to 3 liters of water to support detoxification pathways",
                        "Practice portion control to gradually reduce visceral liver adiposity",
                        "Aim for 30 minutes of daily brisk walking to enhance insulin sensitivity"
                    ],
                    "key_nutrients": ["Glutathione Precursors", "Vitamin E", "Omega-3 Fatty Acids", "Choline"]
                },
                "model_used": "Llama 3.2 Clinical Engine (Clinical Rule Fallback)"
            }
        else:
            return {
                "overview": "Liver function tests demonstrate healthy hepatic enzyme levels, stable bilirubin clearance, and normal protein synthesis capacity.",
                "risk_level": "Normal",
                "connect_to_doctor": False,
                "doctor_urgency": "Routine",
                "doctor_message": "Your liver enzymes and synthetic functions are within healthy parameters. Maintain your healthy nutritional habits.",
                "recommended_doctor_specialty": "General Physician",
                "questions_for_doctor": [
                    "Are my liver values optimal for my current lifestyle?",
                    "How often should an annual metabolic panel be re-checked?"
                ],
                "diet_guidance": {
                    "recommended_foods": [
                        "Fresh seasonal vegetables and high-fiber plant foods",
                        "Omega-3 sources: Salmon, flaxseeds, and walnuts",
                        "Antioxidant-rich herbs: Turmeric, garlic, and cilantro"
                    ],
                    "foods_to_avoid": [
                        "Excessive alcohol consumption",
                        "Highly processed fast foods with trans fatty acids"
                    ],
                    "hydration_and_habits": [
                        "Stay well-hydrated throughout the day",
                        "Maintain a stable, healthy body weight"
                    ],
                    "key_nutrients": ["Dietary Fiber", "Antioxidants", "Healthy Unsaturated Fats"]
                },
                "model_used": "Llama 3.2 Clinical Engine (Clinical Rule Fallback)"
            }

    else: # KFT (Kidney Function Test)
        if is_high_risk:
            return {
                "overview": "The machine learning algorithm detected patterns characteristic of reduced renal filtration efficiency or elevated creatinine/blood urea nitrogen, indicating elevated renal risk.",
                "risk_level": "High Risk",
                "connect_to_doctor": True,
                "doctor_urgency": "Immediate",
                "doctor_message": "⚠️ High Risk Detected: Please connect with a Nephrologist immediately. Prompt clinical staging of renal function, blood pressure optimization, and urine protein testing are essential.",
                "recommended_doctor_specialty": "Nephrologist",
                "questions_for_doctor": [
                    "What is my estimated Glomerular Filtration Rate (eGFR) and CKD stage?",
                    "Do I require a 24-hour urine protein or urine albumin-to-creatinine ratio (uACR)?",
                    "How strictly should I manage my blood pressure to protect my kidneys?",
                    "Do I need specific limits on sodium, potassium, or phosphorus intake?"
                ],
                "diet_guidance": {
                    "recommended_foods": [
                        "Low-sodium fresh foods: Apples, berries, grapes, cabbage, and cauliflower",
                        "Kidney-safe grains: White rice, refined sourdough, and bulgur (lower in phosphorus)",
                        "Controlled healthy proteins: Egg whites, moderate portions of poultry",
                        "Flavor enhancers without salt: Garlic, lemon juice, onion powder, and fresh herbs"
                    ],
                    "foods_to_avoid": [
                        "High-sodium processed meats, canned soups, pickles, and salty snacks",
                        "NSAID pain relievers (ibuprofen/naproxen) which impair renal blood flow",
                        "Excessive high-potassium foods (bananas, potatoes, tomatoes) if advised by nephrologist",
                        "Dark sodas, colas, and processed cheeses (rich in highly absorbable phosphate additives)"
                    ],
                    "hydration_and_habits": [
                        "Follow precise fluid guidance from your nephrologist (avoid both dehydration and overhydration)",
                        "Monitor and record your blood pressure morning and evening",
                        "Avoid non-prescribed health store supplements or protein powders"
                    ],
                    "key_nutrients": ["Controlled Sodium (<2000mg/day)", "Monitored Potassium", "Monitored Phosphorus"]
                },
                "model_used": "Llama 3.2 Clinical Engine (Clinical Rule Fallback)"
            }
        else:
            return {
                "overview": "Renal markers including creatinine, electrolytes, and urea nitrogen remain well-balanced within the normal physiological range, indicating preserved filtration capacity.",
                "risk_level": "Normal",
                "connect_to_doctor": False,
                "doctor_urgency": "Routine",
                "doctor_message": "Kidney parameters indicate normal function. Maintain adequate daily hydration and moderate salt intake.",
                "recommended_doctor_specialty": "General Physician",
                "questions_for_doctor": [
                    "Is my hydration level optimal for my kidneys?",
                    "Are my blood pressure readings keeping my renal vessels protected?"
                ],
                "diet_guidance": {
                    "recommended_foods": [
                        "High water-content fruits and vegetables: Cucumbers, watermelon, celery",
                        "Wholesome plant proteins and balanced meals",
                        "Herbal teas and fresh filtered water"
                    ],
                    "foods_to_avoid": [
                        "Extreme sodium intake (>3000mg/day)",
                        "Excessive energy drinks or high-dose NSAID overuse"
                    ],
                    "hydration_and_habits": [
                        "Drink 2 to 2.5 liters of water spaced evenly across the day",
                        "Keep active to support healthy blood pressure regulation"
                    ],
                    "key_nutrients": ["Balanced Electrolytes", "Adequate Hydration", "Natural Dietary Fiber"]
                },
                "model_used": "Llama 3.2 Clinical Engine (Clinical Rule Fallback)"
            }


def _apply_high_risk_safety(parsed: Dict[str, Any], is_high_risk: bool) -> Dict[str, Any]:
    if is_high_risk:
        parsed["connect_to_doctor"] = True
        parsed["risk_level"] = "High Risk"
        if not parsed.get("doctor_message") or len(str(parsed.get("doctor_message", ""))) < 10:
            parsed["doctor_message"] = "High Risk Detected: Please connect with a qualified physician or specialist promptly for clinical diagnosis and guidance."
        if not parsed.get("doctor_urgency"):
            parsed["doctor_urgency"] = "Immediate"
    return parsed


def query_llama_medical_advisor(ml_output_json: Dict[str, Any], timeout_seconds: int = 40) -> Dict[str, Any]:
    """
    Feeds the ML diagnostic JSON output into the configured LLM, then Ollama.
    Returns structured clinical overview, dietary guidance, and doctor escalation.
    """
    status = ml_output_json.get("status", "Normal")
    is_high_risk = "high" in status.lower() or ml_output_json.get("prediction", 0) == 1

    prompt = build_clinical_prompt(ml_output_json)

    if is_configured():
        try:
            external = chat_completion(
                [
                    {
                        "role": "system",
                        "content": "You are a careful clinical education assistant. You explain laboratory results in plain language. You never diagnose or prescribe. Return only valid JSON.",
                    },
                    {"role": "user", "content": prompt},
                ],
                json_mode=True,
                temperature=0.2,
                max_tokens=1500,
                timeout=max(timeout_seconds, 45),
            )
            if external:
                parsed = parse_json_object(external["content"])
                parsed = _apply_high_risk_safety(parsed, is_high_risk)
                label = get_llm_status().get("provider_label") or external.get("provider", "LLM")
                parsed["model_used"] = f"{label} ? {external.get('model', 'model')} (API)"
                parsed["ml_input_processed"] = ml_output_json
                return parsed
        except Exception as exc:
            print(f"[Llama Advisor] External LLM note: {type(exc).__name__}. Trying Ollama.")

    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": LLAMA_MODEL_NAME,
                "prompt": prompt,
                "format": "json",
                "stream": False,
                "options": {
                    "temperature": 0.2,
                    "top_p": 0.9,
                    "num_predict": 1024
                }
            },
            headers={"Content-Type": "application/json"},
            timeout=timeout_seconds
        )

        if response.status_code == 200:
            result = response.json()
            raw_text = result.get("response", "").strip()

            # Clean markdown code blocks if Llama added any
            if raw_text.startswith("```"):
                raw_text = raw_text.split("```")[1]
                if raw_text.startswith("json"):
                    raw_text = raw_text[4:]
                raw_text = raw_text.strip()

            parsed = json.loads(raw_text)

            # Enforce High Risk safety rule strictly
            parsed = _apply_high_risk_safety(parsed, is_high_risk)
            parsed["model_used"] = f"Meta Llama 3.2 (via Ollama)"
            parsed["ml_input_processed"] = ml_output_json
            return parsed

    except Exception as e:
        print(f"[Llama Advisor] Warning: Ollama Llama 3.2 call encountered: {e}. Utilizing clinical fallback.")

    # Fallback with identical contract
    fallback = generate_fallback_advice(ml_output_json)
    fallback["ml_input_processed"] = ml_output_json
    return fallback


def chat_with_diet_advisor(
    user_message: str,
    conversation_history: list = None,
    report_context: Dict[str, Any] = None,
    timeout_seconds: int = 40
) -> Dict[str, Any]:
    """
    Interactive dietary chat with Meta Llama 3.2.
    Allows patients to ask questions, resolve doubts about specific foods,
    request customized meal ideas, and clarify dietary recommendations tailored to their lab results.
    """
    if conversation_history is None:
        conversation_history = []
    if report_context is None:
        report_context = {}

    condition = report_context.get("condition") or report_context.get("reportType") or "General Health Panel"
    risk_level = report_context.get("risk_level") or report_context.get("status") or "Normal"
    biomarkers = report_context.get("biomarkers") or report_context.get("input_features") or {}
    summary = report_context.get("summary") or ""

    system_prompt = f"""You are a friendly, highly knowledgeable Clinical AI Dietitian and Medical Nutrition Advisor powered by Meta Llama 3.2.
The patient is asking you for advice, clarifications, or doubts regarding foods, meals, snacks, or drinks.

Patient Lab Context:
- Diagnostic Condition / Panel: {condition}
- Risk Level: {risk_level}
- Key Laboratory Biomarkers: {json.dumps(biomarkers)}
- Clinical Context: {summary}

Guidelines for Your Answers:
1. Provide practical, clear, and empathetic nutritional guidance tailored directly to their specific laboratory findings (e.g., iron bio-availability and absorption for anemia, transaminase burden for liver health, filtration/electrolyte considerations for kidney health).
2. If asked whether a specific food (e.g. spinach, coffee, eggs, milk, bananas, red meat) is safe or good, explain WHY based on their lab results, and provide healthy preparation tips.
3. If they ask for meal ideas or snacks, suggest appetizing, realistic, and nutrient-dense combinations.
4. If their risk status is High Risk, include a brief reassuring reminder to also review these dietary steps with their treating physician.
5. Use clean formatting with concise bullet points where helpful."""

    messages = [{"role": "system", "content": system_prompt}]

    # Append recent conversation history (up to last 8 messages)
    for msg in conversation_history[-8:]:
        role = msg.get("role", "user")
        content = msg.get("content", "")
        if role in ["user", "assistant"]:
            messages.append({"role": role, "content": content})

    # Append current message
    messages.append({"role": "user", "content": user_message})

    if is_configured():
        try:
            external = chat_completion(
                messages,
                temperature=0.4,
                max_tokens=700,
                timeout=max(timeout_seconds, 45),
            )
            if external:
                label = get_llm_status().get("provider_label") or external.get("provider", "LLM")
                return {
                    "reply": external["content"],
                    "model_used": f"{label} ? {external.get('model', 'model')} (API)",
                    "success": True,
                }
        except Exception as exc:
            print(f"[Llama Chat] External LLM note: {type(exc).__name__}. Trying Ollama.")

    try:
        response = requests.post(
            f"{OLLAMA_BASE_URL}/api/chat",
            json={
                "model": LLAMA_MODEL_NAME,
                "messages": messages,
                "stream": False,
                "options": {
                    "temperature": 0.4,
                    "top_p": 0.9,
                    "num_predict": 700
                }
            },
            headers={"Content-Type": "application/json"},
            timeout=timeout_seconds
        )

        if response.status_code == 200:
            result = response.json()
            reply_text = result.get("message", {}).get("content", "").strip()
            if reply_text:
                return {
                    "reply": reply_text,
                    "model_used": "Meta Llama 3.2 (via Ollama)",
                    "success": True
                }

    except Exception as e:
        print(f"[Llama Chat] Ollama call note: {e}. Utilizing clinical fallback response.")

    # High-quality contextual fallback
    fallback_replies = {
        "iron": "To boost iron intake effectively, focus on heme iron (lean meats, poultry) which absorbs at 2-3x the rate of plant iron. For plant sources (spinach, lentils, beans), always pair them with vitamin C (citrus, bell peppers) to multiply absorption, and avoid drinking tea or coffee within 2 hours of meals.",
        "coffee": "Coffee and black tea contain polyphenols and tannins that bind to minerals like iron, reducing absorption by up to 60%. If your report shows low hemoglobin or anemia, enjoy your coffee between meals rather than with breakfast or main meals.",
        "kidney": "For kidney health, prioritizing fresh whole foods while limiting excess sodium (under 2,000 mg/day) and processed meats is key. Stay moderately hydrated without overdoing fluid intake, and consult your nephrologist before taking high-dose protein or electrolyte supplements.",
        "liver": "For liver recovery, focus on antioxidant-rich berries, cruciferous vegetables (broccoli, cabbage), and lean plant proteins. Avoid alcohol completely, and minimize high-fructose corn syrup and deep-fried saturated fats."
    }

    low_msg = user_message.lower()
    chosen_reply = "Based on your clinical markers, focus on balanced whole foods rich in essential micronutrients, maintain adequate daily hydration, and pair iron or nutrient-dense ingredients with fresh vitamin C boosters while avoiding ultra-processed items."
    for kw, resp in fallback_replies.items():
        if kw in low_msg:
            chosen_reply = resp
            break

    return {
        "reply": chosen_reply,
        "model_used": "Llama 3.2 Clinical Engine (Fast Response)",
        "success": True
    }
