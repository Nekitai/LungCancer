"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Stethoscope } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { CircularProgress } from "@/components/ui/circular-progress";
import { ShapChart } from "@/components/shap-chart";
import type { PredictResponse } from "@/types/prediction";

interface PredictionResultProps {
  result: PredictResponse;
}

export function PredictionResult({ result }: PredictionResultProps) {
  const isHighRisk = result.prediction === "High Risk";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto w-full max-w-3xl space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Hasil Prediksi</CardTitle>
            <CardDescription>Berdasarkan data pasien yang dimasukkan</CardDescription>
          </div>
          <Badge variant={isHighRisk ? "risk" : "accent"} className="text-sm">
            {isHighRisk ? (
              <AlertTriangle className="size-3.5" />
            ) : (
              <CheckCircle2 className="size-3.5" />
            )}
            {result.prediction === "High Risk" ? "Risiko Tinggi" : "Risiko Rendah"}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
            <CircularProgress
              value={result.confidence}
              colorClassName={isHighRisk ? "stroke-risk" : "stroke-accent"}
              label="Tingkat Keyakinan"
            />

            <div className="w-full max-w-xs space-y-4">
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted">Probabilitas Positif</span>
                  <span className="font-mono-data font-medium">
                    {(result.probability_positive * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={result.probability_positive * 100}
                  indicatorClassName="bg-risk"
                />
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-sm">
                  <span className="text-muted">Probabilitas Negatif</span>
                  <span className="font-mono-data font-medium">
                    {(result.probability_negative * 100).toFixed(1)}%
                  </span>
                </div>
                <Progress
                  value={result.probability_negative * 100}
                  indicatorClassName="bg-accent"
                />
              </div>
            </div>
          </div>

          <Alert variant="warning">
            <Stethoscope />
            <AlertTitle>Disclaimer Medis</AlertTitle>
            <AlertDescription>
              Hasil analisis ini merupakan prediksi berbasis Machine Learning dan tidak
              dapat menggantikan diagnosis dokter. Selalu konsultasikan hasil dengan
              tenaga medis profesional.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <ShapChart topFeatures={result.top_features} />
    </motion.div>
  );
}
