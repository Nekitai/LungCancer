import { Cpu, Database, Eye, Server, ArrowDown } from "lucide-react";
import { ModelCard } from "@/components/model-card";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { MODEL_METRICS } from "@/lib/constants";

const MODEL_CARDS = [
  {
    icon: Cpu,
    title: "Algorithm",
    description:
      "Random Forest Classifier, di-tuning menggunakan GridSearchCV (5-fold cross-validation, scoring ROC-AUC) di atas 108 kombinasi hyperparameter.",
  },
  {
    icon: Database,
    title: "Feature Selection",
    description:
      "16 fitur klinis terpilih dari dataset tabular 5.000 pasien, setelah menghapus fitur redundan (korelasi tinggi) berdasarkan analisis VIF.",
  },
  {
    icon: Eye,
    title: "Explainability",
    description:
      "SHAP TreeExplainer digunakan untuk mengukur kontribusi tiap fitur secara global (beeswarm, bar) maupun lokal per pasien (waterfall).",
  },
  {
    icon: Server,
    title: "Deployment",
    description:
      "Model disimpan sebagai artefak .pkl (joblib) dan disajikan melalui REST API Python yang dipanggil aplikasi ini melalui endpoint /predict.",
  },
];

const FEATURE_GLOSSARY = [
  { name: "AGE", label: "Usia pasien (tahun)" },
  { name: "GENDER", label: "Jenis kelamin" },
  { name: "SMOKING", label: "Riwayat merokok" },
  { name: "FINGER_DISCOLORATION", label: "Perubahan warna jari" },
  { name: "MENTAL_STRESS", label: "Tingkat stres mental" },
  { name: "EXPOSURE_TO_POLLUTION", label: "Paparan polusi udara" },
  { name: "LONG_TERM_ILLNESS", label: "Penyakit jangka panjang" },
  { name: "ENERGY_LEVEL", label: "Skor tingkat energi (kontinu, 0-100)" },
  { name: "IMMUNE_WEAKNESS", label: "Kelemahan sistem imun" },
  { name: "BREATHING_ISSUE", label: "Gangguan pernapasan" },
  { name: "ALCOHOL_CONSUMPTION", label: "Konsumsi alkohol" },
  { name: "THROAT_DISCOMFORT", label: "Ketidaknyamanan tenggorokan" },
  { name: "OXYGEN_SATURATION", label: "Saturasi oksigen / SpO2 (%, kontinu)" },
  { name: "CHEST_TIGHTNESS", label: "Sesak di dada" },
  { name: "FAMILY_HISTORY", label: "Riwayat keluarga kanker paru" },
  {
    name: "STRESS_IMMUNE",
    label: "Fitur turunan: interaksi stres mental × kelemahan imun (dihitung otomatis, tidak diinput manual)",
  },
];

export default function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Tentang Model
        </h1>
        <p className="mt-3 text-muted">
          Detail arsitektur, performa, dan cara kerja model prediksi risiko kanker
          paru-paru.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MODEL_CARDS.map((card) => (
          <ModelCard key={card.title} {...card} />
        ))}
      </div>

      {/* Architecture diagram */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Arsitektur Sistem</CardTitle>
          <CardDescription>Alur data dari input pengguna hingga hasil prediksi.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2">
            {["Frontend (Next.js)", "REST API (/predict)", "Machine Learning Model (Random Forest)", "Prediction + SHAP Explanation"].map(
              (step, i, arr) => (
                <div key={step} className="flex flex-col items-center gap-2">
                  <div className="w-full max-w-sm rounded-xl border border-border bg-primary/5 px-5 py-3 text-center text-sm font-medium">
                    {step}
                  </div>
                  {i < arr.length - 1 && <ArrowDown className="size-4 text-muted-foreground" />}
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Performa Model</CardTitle>
          <CardDescription>Diukur pada 1.000 data uji (20% held-out split).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Object.entries({
              Accuracy: MODEL_METRICS.accuracy,
              Precision: MODEL_METRICS.precision,
              Recall: MODEL_METRICS.recall,
              "ROC AUC": MODEL_METRICS.rocAuc,
            }).map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border p-4 text-center">
                <p className="font-mono-data text-2xl font-semibold text-primary">
                  {(value * 100).toFixed(2)}%
                </p>
                <p className="mt-1 text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Feature glossary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Daftar Fitur Model</CardTitle>
          <CardDescription>
            16 fitur yang digunakan model untuk melakukan prediksi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {FEATURE_GLOSSARY.map((f) => (
              <AccordionItem key={f.name} value={f.name}>
                <AccordionTrigger>{f.name}</AccordionTrigger>
                <AccordionContent>{f.label}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}
