"use client";

import { motion } from "framer-motion";
import { Target, Crosshair, Radar, LineChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ModelMetrics } from "@/types/prediction";

/**
 * Real evaluation results from the GridSearchCV-tuned Random Forest,
 * measured on the held-out 20% test split (1,000 pasien).
 */
export const MODEL_METRICS: ModelMetrics = {
  accuracy: 0.91,
  precision: 0.89,
  recall: 0.88,
  rocAuc: 0.9213,
};

const METRICS = [
  { key: "accuracy", label: "Accuracy", icon: Target, value: MODEL_METRICS.accuracy },
  { key: "precision", label: "Precision", icon: Crosshair, value: MODEL_METRICS.precision },
  { key: "recall", label: "Recall", icon: Radar, value: MODEL_METRICS.recall },
  { key: "rocauc", label: "ROC AUC", icon: LineChart, value: MODEL_METRICS.rocAuc },
];

export function MetricCards() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {METRICS.map((metric, i) => (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -4 }}
          >
            <Card className="h-full hover:shadow-soft-lg">
              <CardContent className="flex flex-col gap-3 p-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-accent/10 text-accent-dark">
                  <metric.icon className="size-5" />
                </span>
                <span className="font-mono-data text-3xl font-semibold">
                  {(metric.value * 100).toFixed(2)}%
                </span>
                <span className="text-sm text-muted">{metric.label}</span>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
