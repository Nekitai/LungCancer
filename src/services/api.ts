import axios, { AxiosError } from "axios";
import type { PatientFormValues } from "@/lib/validations";
import type { PredictRequestPayload, PredictResponse } from "@/types/prediction";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "/api/backend";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Derives the STRESS_IMMUNE interaction feature automatically. This feature
 * was identified during EDA as an engineered interaction between mental
 * stress and immune weakness rather than a directly self-reportable
 * symptom, so we compute it instead of asking the patient for it.
 */
function deriveStressImmune(values: PatientFormValues): 0 | 1 {
  const bothPresent = values.mentalStress === "1" && values.immuneWeakness === "1";
  return bothPresent ? 1 : 0;
}

export function buildPredictPayload(values: PatientFormValues): PredictRequestPayload {
  return {
    age: Number(values.age),
    gender: Number(values.gender) as 0 | 1,
    smoking: Number(values.smoking) as 0 | 1,
    finger_discoloration: Number(values.fingerDiscoloration) as 0 | 1,
    mental_stress: Number(values.mentalStress) as 0 | 1,
    exposure_to_pollution: Number(values.exposureToPollution) as 0 | 1,
    long_term_illness: Number(values.longTermIllness) as 0 | 1,
    energy_level: Number(values.energyLevel),
    immune_weakness: Number(values.immuneWeakness) as 0 | 1,
    breathing_issue: Number(values.breathingIssue) as 0 | 1,
    alcohol_consumption: Number(values.alcoholConsumption) as 0 | 1,
    throat_discomfort: Number(values.throatDiscomfort) as 0 | 1,
    oxygen_saturation: Number(values.oxygenSaturation),
    chest_tightness: Number(values.chestTightness) as 0 | 1,
    family_history: Number(values.familyHistory) as 0 | 1,
    stress_immune: deriveStressImmune(values),
  };
}

export class PredictionApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = "PredictionApiError";
  }
}

export async function predictLungCancerRisk(
  values: PatientFormValues
): Promise<PredictResponse> {
  const payload = buildPredictPayload(values);

  try {
    const { data } = await apiClient.post<PredictResponse>("/predict", payload);
    return data;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    const message =
      error.response?.data?.message ??
      "Gagal menghubungi server prediksi. Pastikan API model sedang berjalan.";
    throw new PredictionApiError(message, error.response?.status);
  }
}
