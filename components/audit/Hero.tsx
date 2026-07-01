import { Zap } from "lucide-react";
import { ReactNode } from "react";

export default function Hero({ children }: { children: ReactNode }) {
  return (
    <section id="new-audit" className="mx-auto max-w-3xl px-6 pb-14 pt-16 text-center">
      <div className="mx-auto flex h-40 w-24 items-center justify-center rounded-full bg-surface-muted">
        <Zap className="h-8 w-8 text-brand" strokeWidth={2} />
      </div>

      <h1 className="mt-8 text-3xl font-bold text-navy sm:text-4xl">
        Agency-Grade Website Audits in Seconds
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-text-muted sm:text-base">
        Enter any business website and generate a polished, downloadable
        performance report with color-coded metrics and actionable
        recommendations.
      </p>

      <div className="mt-8">{children}</div>
    </section>
  );
}