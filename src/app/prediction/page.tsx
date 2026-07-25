"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { PredictionForm } from "@/components/prediction-form";
import { PredictionResult } from "@/components/prediction-result";
import { Button } from "@/components/ui/button";
import type { PredictResponse } from "@/types/prediction";

export default function PredictionPage() {
  const [result, setResult] = React.useState<PredictResponse | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Analisis Risiko Pasien
        </h1>
        <p className="mt-3 text-muted">
          Masukkan data klinis pasien untuk mendapatkan prediksi risiko kanker
          paru-paru beserta penjelasan faktor pendukungnya.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <PredictionForm onResult={setResult} />
          </motion.div>
        ) : (
          <motion.div key="result" className="space-y-6">
            <PredictionResult result={result} />
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setResult(null)}>
                <RotateCcw className="size-4" /> Analisis Pasien Lain
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
