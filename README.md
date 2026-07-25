# AI LungCare — Sistem Prediksi Risiko Kanker Paru-Paru

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui-style
components for a lung cancer risk prediction dashboard.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then set NEXT_PUBLIC_API_URL to your model API
npm run dev
```

Open http://localhost:3000.

## Important: field set matches your actual trained model

Your original build brief listed survey-style fields (yellow fingers, peer pressure,
anxiety, chest pain, coughing, shortness of breath, swallowing difficulty). Those
belong to a different, commonly-used Kaggle dataset — **not** the model actually
trained in `modelGPrediksi_Kanker_Paru_RF_GridSearchCV_XAI.ipynb`.

This app's form and `/predict` payload instead match the **16 real features** the
notebook's Random Forest was trained on:

`AGE, GENDER, SMOKING, FINGER_DISCOLORATION, MENTAL_STRESS, EXPOSURE_TO_POLLUTION,
LONG_TERM_ILLNESS, ENERGY_LEVEL, IMMUNE_WEAKNESS, BREATHING_ISSUE,
ALCOHOL_CONSUMPTION, THROAT_DISCOMFORT, OXYGEN_SATURATION, CHEST_TIGHTNESS,
FAMILY_HISTORY, STRESS_IMMUNE`

Two implementation notes worth knowing about before wiring up your real backend:

1. **`STRESS_IMMUNE`** is an engineered interaction feature (flagged in the notebook's
   own EDA as correlated with `MENTAL_STRESS` × `IMMUNE_WEAKNESS`), not something a
   patient can self-report. The frontend computes it automatically
   (`src/services/api.ts` → `deriveStressImmune`) as `1` only when both
   `MENTAL_STRESS` and `IMMUNE_WEAKNESS` are `1`. Adjust this function if your
   backend derives it differently.
2. **`GENDER` encoding** (0/1) wasn't documented in the notebook's dataset, so the
   form assumes `1 = Laki-laki`, `0 = Perempuan`. Double check this matches how
   the training data was actually encoded, and flip `src/components/prediction-form.tsx`
   if not.

Model performance figures shown on the Home and About pages
(Accuracy 91%, Precision 89%, Recall 88%, ROC AUC 0.9213) are the real numbers
from the notebook's test-set evaluation — update `src/components/metric-cards.tsx`
if you retrain.

## API contract

`POST {NEXT_PUBLIC_API_URL}/predict`

```json
{
  "age": 58,
  "gender": 1,
  "smoking": 1,
  "finger_discoloration": 0,
  "mental_stress": 1,
  "exposure_to_pollution": 1,
  "long_term_illness": 0,
  "energy_level": 55.2,
  "immune_weakness": 0,
  "breathing_issue": 1,
  "alcohol_consumption": 0,
  "throat_discomfort": 1,
  "oxygen_saturation": 95.2,
  "chest_tightness": 0,
  "family_history": 0,
  "stress_immune": 0
}
```

Expected response:

```json
{
  "prediction": "High Risk",
  "confidence": 96.4,
  "probability_positive": 0.964,
  "probability_negative": 0.036,
  "top_features": ["Smoking", "Family History", "Age", "Oxygen Saturation"]
}
```

## Project structure

```
src/
├── app/
│   ├── page.tsx              # Home
│   ├── prediction/page.tsx   # Prediction form + result
│   ├── about/page.tsx        # Model details
│   └── layout.tsx
├── components/
│   ├── navbar.tsx, hero.tsx, footer.tsx
│   ├── prediction-form.tsx, prediction-result.tsx, shap-chart.tsx
│   ├── metric-cards.tsx, model-card.tsx
│   └── ui/                   # shadcn-style primitives
├── services/api.ts           # Axios client + payload mapping
├── lib/{utils,validations}.ts
└── types/prediction.ts
```
