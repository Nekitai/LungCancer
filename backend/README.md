# AI LungCare — Prediction API

FastAPI service that loads the joblib bundle saved by Cell 9 of
`modelGPrediksi_Kanker_Paru_RF_GridSearchCV_XAI.ipynb` and serves it at `POST /predict`.

This has been smoke-tested end-to-end (model load → predict_proba → SHAP top-features)
with a synthetic bundle matching your real schema; drop in your actual `.pkl` and it
will work the same way, no code changes needed, **as long as your bundle was saved
with the same structure**:

```python
model_bundle = {
    "model": best_rf,               # the fitted RandomForestClassifier
    "feature_names": X.columns.tolist(),
    "best_params": best_rf.get_params(),
}
joblib.dump(model_bundle, "best_rf_lung_cancer_model.pkl")
```

## Setup

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate   # optional but recommended
pip install -r requirements.txt

# Copy the model file you already saved from the notebook here:
cp /path/to/your/best_rf_lung_cancer_model.pkl model/

uvicorn main:app --reload --port 8000
```

Then check:

```bash
curl http://localhost:8000/health
# {"status":"ok","model_path":".../model/best_rf_lung_cancer_model.pkl"}
```

## Configuration (environment variables)

| Variable          | Default                                   | Purpose                                   |
|-------------------|--------------------------------------------|--------------------------------------------|
| `MODEL_PATH`      | `./model/best_rf_lung_cancer_model.pkl`    | Where to load the joblib bundle from       |
| `ALLOWED_ORIGINS` | `http://localhost:3000`                    | Comma-separated CORS origins for the frontend |

Example for production:

```bash
export MODEL_PATH=/srv/models/best_rf_lung_cancer_model.pkl
export ALLOWED_ORIGINS=https://your-frontend-domain.com
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Connecting the Next.js frontend

In the frontend's `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

The frontend already sends the exact field names/order this API expects
(see `src/services/api.ts` → `buildPredictPayload`), including the
auto-derived `stress_immune` interaction field — no extra mapping needed.

## Notes / assumptions to double-check against your real model

- **Column order**: the API reindexes the incoming request into
  `bundle["feature_names"]` order before calling `predict`, so it doesn't
  matter what order scikit-learn originally saw them in during training —
  as long as `feature_names` in your bundle is accurate (it's set directly
  from `X.columns.tolist()` in the notebook, so it should be).
- **Risk threshold**: `"High Risk"` is assigned when `P(class 1) >= 0.5`.
  Adjust the threshold in `main.py` → `predict()` if your intended decision
  boundary differs.
- **SHAP**: recomputed per-request with `TreeExplainer` (fast for tree
  models). `top_features` returns the 5 features with the largest
  `abs(SHAP value)` for that specific patient — i.e. a genuine local
  explanation, not the model's global feature importance.
