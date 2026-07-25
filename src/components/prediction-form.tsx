"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { patientFormSchema, patientFormDefaultValues, type PatientFormValues } from "@/lib/validations";
import { predictLungCancerRisk, PredictionApiError } from "@/services/api";
import type { PredictResponse } from "@/types/prediction";

interface YesNoField {
  name: keyof PatientFormValues;
  label: string;
  hint?: string;
}

const YES_NO_FIELDS: YesNoField[] = [
  { name: "smoking", label: "Merokok" },
  { name: "fingerDiscoloration", label: "Perubahan Warna Jari" },
  { name: "mentalStress", label: "Stres Mental" },
  { name: "exposureToPollution", label: "Paparan Polusi Udara" },
  { name: "longTermIllness", label: "Penyakit Jangka Panjang" },
  { name: "immuneWeakness", label: "Kelemahan Sistem Imun" },
  { name: "breathingIssue", label: "Gangguan Pernapasan" },
  { name: "alcoholConsumption", label: "Konsumsi Alkohol" },
  { name: "throatDiscomfort", label: "Ketidaknyamanan Tenggorokan" },
  { name: "chestTightness", label: "Sesak di Dada" },
  { name: "familyHistory", label: "Riwayat Keluarga Kanker Paru" },
];

interface PredictionFormProps {
  onResult: (result: PredictResponse) => void;
}

export function PredictionForm({ onResult }: PredictionFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patientFormDefaultValues,
    mode: "onBlur",
  });

  async function onSubmit(values: PatientFormValues) {
    setIsSubmitting(true);
    try {
      const result = await predictLungCancerRisk(values);
      onResult(result);
      toast.success("Analisis selesai", {
        description: `Hasil prediksi: ${result.prediction}`,
      });
    } catch (err) {
      const message =
        err instanceof PredictionApiError ? err.message : "Terjadi kesalahan tak terduga.";
      toast.error("Gagal melakukan analisis", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Form Analisis Pasien</CardTitle>
        <CardDescription>
          Lengkapi data berikut untuk memperoleh hasil prediksi.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
          {/* Basic info */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Usia (tahun)</Label>
              <Input
                id="age"
                type="number"
                placeholder="cth. 58"
                {...register("age")}
              />
              {errors.age && <p className="text-xs text-risk">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <RadioGroup
                    className="flex gap-6 pt-1"
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="1" id="gender-male" /> Laki-laki
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <RadioGroupItem value="0" id="gender-female" /> Perempuan
                    </label>
                  </RadioGroup>
                )}
              />
              {errors.gender && <p className="text-xs text-risk">{errors.gender.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="energyLevel">Tingkat Energi (skor 0-100)</Label>
              <Input
                id="energyLevel"
                type="number"
                step="0.1"
                placeholder="cth. 55"
                {...register("energyLevel")}
              />
              {errors.energyLevel && (
                <p className="text-xs text-risk">{errors.energyLevel.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="oxygenSaturation">Saturasi Oksigen — SpO2 (%)</Label>
              <Input
                id="oxygenSaturation"
                type="number"
                step="0.1"
                placeholder="cth. 96"
                {...register("oxygenSaturation")}
              />
              {errors.oxygenSaturation && (
                <p className="text-xs text-risk">{errors.oxygenSaturation.message}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Yes/No clinical indicators */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {YES_NO_FIELDS.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: controllerField }) => (
                    <Select
                      value={controllerField.value as string}
                      onValueChange={controllerField.onChange}
                    >
                      <SelectTrigger id={field.name}>
                        <SelectValue placeholder="Pilih..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ya</SelectItem>
                        <SelectItem value="0">Tidak</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors[field.name] && (
                  <p className="text-xs text-risk">{errors[field.name]?.message as string}</p>
                )}
              </div>
            ))}
          </div>

          <motion.div whileTap={{ scale: 0.98 }}>
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Menganalisis...
                </>
              ) : (
                <>
                  <Sparkles className="size-4" /> Analisis Sekarang
                </>
              )}
            </Button>
          </motion.div>
        </form>
      </CardContent>
    </Card>
  );
}
