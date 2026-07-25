import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6 lg:px-8">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-white">
          <Activity className="size-4" />
        </span>
        <p className="font-display text-sm font-semibold">Lung Cancer</p>
        <p className="max-w-md text-xs leading-relaxed text-muted">
          Universitas Teknologi AKBA Makassar &middot; Teknik Informatika
          <br />
          Machine Learning Lung Cancer Prediction
        </p>
        <p className="text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} Lungcancer. Untuk tujuan riset &amp; edukasi,
          bukan pengganti diagnosis medis.
        </p>
      </div>
    </footer>
  );
}
