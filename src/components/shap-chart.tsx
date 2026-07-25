"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface ShapChartProps {
  topFeatures: string[];
}

/**
 * SHAP only tells us the ranking of top contributing features via the API
 * contract (`top_features: string[]`), not per-feature magnitudes, so we
 * render relative importance bars (longest = most influential) rather than
 * fabricating precise SHAP values the backend didn't return.
 */
export function ShapChart({ topFeatures }: ShapChartProps) {
  const data = topFeatures.map((name, i) => ({
    name,
    importance: topFeatures.length - i,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Faktor yang Mempengaruhi Prediksi</CardTitle>
        <CardDescription>
          Fitur diurutkan berdasarkan kontribusi terhadap hasil prediksi (SHAP).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 12, right: 24 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={150}
                tick={{ fontSize: 12, fill: "var(--color-muted)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "var(--color-primary)", opacity: 0.05 }}
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--color-border)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="importance" radius={[0, 8, 8, 0]} barSize={18}>
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === 0 ? "var(--color-primary)" : "var(--color-accent)"}
                    fillOpacity={index === 0 ? 1 : 0.75 - index * 0.08}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
