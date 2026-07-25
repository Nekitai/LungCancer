/**
 * Payload sent to POST /predict.
 *
 * Field set mirrors the 16 features the Random Forest model was actually
 * trained on (see `modelG...RF_GridSearchCV_XAI.ipynb`), NOT the generic
 * "yellow fingers / peer pressure" survey dataset. `stressImmune` is an
 * engineered interaction feature discovered during EDA (correlated with
 * MENTAL_STRESS x IMMUNE_WEAKNESS) and is computed automatically rather
 * than asked of the patient directly, since it isn't something a person
 * can self-report.
 */
export interface PatientInput {
  age: number;
  gender: 0 | 1; // 1 = Laki-laki, 0 = Perempuan
  smoking: 0 | 1;
  fingerDiscoloration: 0 | 1;
  mentalStress: 0 | 1;
  exposureToPollution: 0 | 1;
  longTermIllness: 0 | 1;
  energyLevel: number; // continuous score, ~0-100
  immuneWeakness: 0 | 1;
  breathingIssue: 0 | 1;
  alcoholConsumption: 0 | 1;
  throatDiscomfort: 0 | 1;
  oxygenSaturation: number; // SpO2 %, continuous ~85-100
  chestTightness: 0 | 1;
  familyHistory: 0 | 1;
}

/** Full payload including the auto-derived interaction feature. */
export interface PredictRequestPayload {
  age: number;
  gender: 0 | 1;
  smoking: 0 | 1;
  finger_discoloration: 0 | 1;
  mental_stress: 0 | 1;
  exposure_to_pollution: 0 | 1;
  long_term_illness: 0 | 1;
  energy_level: number;
  immune_weakness: 0 | 1;
  breathing_issue: 0 | 1;
  alcohol_consumption: 0 | 1;
  throat_discomfort: 0 | 1;
  oxygen_saturation: number;
  chest_tightness: 0 | 1;
  family_history: 0 | 1;
  stress_immune: 0 | 1;
}

export type RiskLabel = "High Risk" | "Low Risk";

export interface PredictResponse {
  prediction: RiskLabel;
  confidence: number; // 0-100
  probability_positive: number; // 0-1
  probability_negative: number; // 0-1
  top_features: string[];
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  rocAuc: number;
}
