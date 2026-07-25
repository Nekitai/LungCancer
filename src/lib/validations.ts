import { z } from "zod";

const binary = z.enum(["0", "1"], {
  errorMap: () => ({ message: "Wajib dipilih" }),
});

export const patientFormSchema = z.object({
  age: z.coerce
    .number({ invalid_type_error: "Usia wajib diisi" })
    .int("Usia harus berupa angka bulat")
    .min(1, "Usia minimal 1 tahun")
    .max(120, "Usia maksimal 120 tahun"),
  gender: z.enum(["0", "1"], { errorMap: () => ({ message: "Pilih jenis kelamin" }) }),
  smoking: binary,
  fingerDiscoloration: binary,
  mentalStress: binary,
  exposureToPollution: binary,
  longTermIllness: binary,
  energyLevel: z.coerce
    .number({ invalid_type_error: "Tingkat energi wajib diisi" })
    .min(0, "Minimal 0")
    .max(100, "Maksimal 100"),
  immuneWeakness: binary,
  breathingIssue: binary,
  alcoholConsumption: binary,
  throatDiscomfort: binary,
  oxygenSaturation: z.coerce
    .number({ invalid_type_error: "Saturasi oksigen wajib diisi" })
    .min(50, "Nilai tidak wajar (minimal 50%)")
    .max(100, "Maksimal 100%"),
  chestTightness: binary,
  familyHistory: binary,
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;

export const patientFormDefaultValues: Partial<PatientFormValues> = {
  energyLevel: 55,
  oxygenSaturation: 96,
};
