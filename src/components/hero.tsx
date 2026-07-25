"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * LungIllustration — a hand-drawn SVG of a pair of lungs that gently
 * "breathes" (scale + opacity pulse on a ~4.2s cycle, matched to the CSS
 * keyframes in globals.css). This is the page's signature visual: it
 * grounds the abstract "risk prediction" concept in the literal organ
 * the model reasons about.
 */
function LungIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute size-72 rounded-full bg-primary/20 blur-3xl animate-breathe-glow sm:size-96" />
      <svg
        viewBox="0 0 320 320"
        className="relative size-64 animate-breathe sm:size-80"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lungGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        {/* Trachea */}
        <rect x="150" y="40" width="20" height="55" rx="10" fill="url(#lungGradient)" opacity="0.9" />
        {/* Left lobe */}
        <path
          d="M150 90 C 90 90, 55 140, 55 200 C 55 250, 85 275, 110 265 C 130 257, 135 230, 140 205 C 145 175, 148 130, 150 90 Z"
          fill="url(#lungGradient)"
        />
        {/* Right lobe */}
        <path
          d="M170 90 C 230 90, 265 140, 265 200 C 265 250, 235 275, 210 265 C 190 257, 185 230, 180 205 C 175 175, 172 130, 170 90 Z"
          fill="url(#lungGradient)"
          opacity="0.92"
        />
        {/* Bronchi detail */}
        <path
          d="M150 100 C 120 120, 100 150, 90 190 M170 100 C 200 120, 220 150, 230 190"
          stroke="white"
          strokeOpacity="0.35"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* Emerald "healthy alveoli" accent dots */}
        <circle cx="100" cy="215" r="5" fill="#10b981" opacity="0.9" />
        <circle cx="122" cy="240" r="4" fill="#10b981" opacity="0.7" />
        <circle cx="220" cy="215" r="5" fill="#10b981" opacity="0.9" />
        <circle cx="198" cy="240" r="4" fill="#10b981" opacity="0.7" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            Random Forest &middot; GridSearchCV &middot; SHAP Explainable AI
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Sistem Prediksi Risiko{" "}
            <span className="text-primary">Kanker Paru-Paru</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Sistem ini menggunakan algoritma Machine Learning Random Forest untuk
            membantu melakukan prediksi risiko kanker paru-paru berdasarkan
            karakteristik pasien.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link href="/prediction">
                Mulai Analisis <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">
                <BookOpen className="size-4" /> Pelajari Model
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <LungIllustration />
        </motion.div>
      </div>
    </section>
  );
}
