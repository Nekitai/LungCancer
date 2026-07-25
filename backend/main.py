"""
FastAPI backend that serves the Random Forest model saved by
`modelGPrediksi_Kanker_Paru_RF_GridSearchCV_XAI.ipynb` (Cell 9, joblib bundle
containing "model", "feature_names", "best_params").

Run:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Expects the .pkl file at MODEL_PATH (default: ./model/best_rf_lung_cancer_model.pkl).
Copy the file you already saved from the notebook into backend/model/, or set
MODEL_PATH to wherever it lives.
"""

import os
import logging
from typing import Literal

import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai-lungcare-api")

MODEL_PATH = os.environ.get(
    "MODEL_PATH", os.path.join(os.path.dirname(__file__), "model", "best_rf_lung_cancer_model.pkl")
)

# Comma-separated list of allowed origins, e.g. "http://localhost:3000,https://myapp.com"
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app = FastAPI(
    title="AI LungCare Prediction API",
    description="Serves the GridSearchCV-tuned Random Forest lung cancer risk model.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------------------------
# Load model bundle once at startup
# --------------------------------------------------------------------------
model = None
feature_names: list[str] = []
explainer = None


@app.on_event("startup")
def load_model() -> None:
    global model, feature_names, explainer

    if not os.path.exists(MODEL_PATH):
        logger.warning(
            "Model file not found at %s. Copy your saved best_rf_lung_cancer_model.pkl "
            "there, or set the MODEL_PATH environment variable.",
            MODEL_PATH,
        )
        return

    bundle = joblib.load(MODEL_PATH)
    model = bundle["model"]
    feature_names = bundle["feature_names"]
    explainer = shap.TreeExplainer(model)
    logger.info("Model loaded from %s. Features (%d): %s", MODEL_PATH, len(feature_names), feature_names)


# --------------------------------------------------------------------------
# Request / response schemas — field names match src/services/api.ts on the
# Next.js frontend exactly.
# --------------------------------------------------------------------------
Binary = Literal[0, 1]


class PredictRequest(BaseModel):
    age: int = Field(..., ge=1, le=120)
    gender: Binary
    smoking: Binary
    finger_discoloration: Binary
    mental_stress: Binary
    exposure_to_pollution: Binary
    long_term_illness: Binary
    energy_level: float = Field(..., ge=0, le=100)
    immune_weakness: Binary
    breathing_issue: Binary
    alcohol_consumption: Binary
    throat_discomfort: Binary
    oxygen_saturation: float = Field(..., ge=50, le=100)
    chest_tightness: Binary
    family_history: Binary
    stress_immune: Binary


class PredictResponse(BaseModel):
    prediction: Literal["High Risk", "Low Risk"]
    confidence: float
    probability_positive: float
    probability_negative: float
    top_features: list[str]


# Maps incoming snake_case payload fields to the uppercase column names the
# model was actually trained on (X.columns in the notebook).
FIELD_TO_COLUMN = {
    "age": "AGE",
    "gender": "GENDER",
    "smoking": "SMOKING",
    "finger_discoloration": "FINGER_DISCOLORATION",
    "mental_stress": "MENTAL_STRESS",
    "exposure_to_pollution": "EXPOSURE_TO_POLLUTION",
    "long_term_illness": "LONG_TERM_ILLNESS",
    "energy_level": "ENERGY_LEVEL",
    "immune_weakness": "IMMUNE_WEAKNESS",
    "breathing_issue": "BREATHING_ISSUE",
    "alcohol_consumption": "ALCOHOL_CONSUMPTION",
    "throat_discomfort": "THROAT_DISCOMFORT",
    "oxygen_saturation": "OXYGEN_SATURATION",
    "chest_tightness": "CHEST_TIGHTNESS",
    "family_history": "FAMILY_HISTORY",
    "stress_immune": "STRESS_IMMUNE",
}

# Human-readable labels for the SHAP top_features list returned to the UI.
DISPLAY_NAME = {
    "AGE": "Age",
    "GENDER": "Gender",
    "SMOKING": "Smoking",
    "FINGER_DISCOLORATION": "Finger Discoloration",
    "MENTAL_STRESS": "Mental Stress",
    "EXPOSURE_TO_POLLUTION": "Exposure To Pollution",
    "LONG_TERM_ILLNESS": "Long Term Illness",
    "ENERGY_LEVEL": "Energy Level",
    "IMMUNE_WEAKNESS": "Immune Weakness",
    "BREATHING_ISSUE": "Breathing Issue",
    "ALCOHOL_CONSUMPTION": "Alcohol Consumption",
    "THROAT_DISCOMFORT": "Throat Discomfort",
    "OXYGEN_SATURATION": "Oxygen Saturation",
    "CHEST_TIGHTNESS": "Chest Tightness",
    "FAMILY_HISTORY": "Family History",
    "STRESS_IMMUNE": "Stress-Immune Interaction",
}


@app.get("/health")
def health():
    return {"status": "ok" if model is not None else "model_not_loaded", "model_path": MODEL_PATH}


@app.post("/predict", response_model=PredictResponse)
def predict(payload: PredictRequest):
    if model is None:
        raise HTTPException(
            status_code=503,
            detail=f"Model belum dimuat. Pastikan file model ada di {MODEL_PATH}.",
        )

    row = {FIELD_TO_COLUMN[key]: value for key, value in payload.model_dump().items()}
    # Order columns exactly as the model expects (bundle["feature_names"]).
    X_new = pd.DataFrame([row])[feature_names]

    proba = model.predict_proba(X_new)[0]  # [P(class 0), P(class 1)]
    prob_negative, prob_positive = float(proba[0]), float(proba[1])
    prediction: Literal["High Risk", "Low Risk"] = "High Risk" if prob_positive >= 0.5 else "Low Risk"
    confidence = max(prob_positive, prob_negative) * 100

    # Local SHAP explanation for this single patient.
    shap_values = explainer.shap_values(X_new, check_additivity=False)
    # TreeExplainer on a binary classifier RF may return a 3D array
    # (n_samples, n_features, n_classes) or a list [class0, class1].
    if isinstance(shap_values, list):
        values = shap_values[1][0]
    elif np.ndim(shap_values) == 3:
        values = shap_values[0, :, 1]
    else:
        values = shap_values[0]

    ranked = sorted(zip(feature_names, values), key=lambda pair: abs(pair[1]), reverse=True)
    top_features = [DISPLAY_NAME.get(name, name) for name, _ in ranked[:5]]

    return PredictResponse(
        prediction=prediction,
        confidence=round(confidence, 2),
        probability_positive=round(prob_positive, 4),
        probability_negative=round(prob_negative, 4),
        top_features=top_features,
    )
