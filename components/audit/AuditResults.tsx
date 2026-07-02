"use client";

import { Download, Lock, Search, Smartphone, Timer, Zap } from "lucide-react";
import { AuditResult } from "@/types/audit";
import {
  booleanStatus,
  loadTimeStatus,
  scoreStatus,
  mobileFriendlyStatus,
} from "@/lib/scoring";
import { generateRecommendations } from "@/lib/recommendations";
import MetricCard from "./MetricCard";
import BadgeLegend from "./BadgeLegend";
import Recommendations from "./Recommendations";

interface AuditResultsProps {
  result: AuditResult;
  onDownloadPdf: () => void;
  isGeneratingPdf: boolean;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function AuditResults({
  result,
  onDownloadPdf,
  isGeneratingPdf,
}: AuditResultsProps) {
  const { metrics } = result;
  const recommendations = generateRecommendations(metrics);

  return (
    <section id="audit-results" className="mx-auto max-w-6xl px-6 pb-20">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-navy">Audit Results</h2>
          <p className="mt-1 text-sm text-text-muted">
            {result.companyName} · {result.url} · {formatDate(result.auditDate)}
          </p>
        </div>
        <button
          onClick={onDownloadPdf}
          disabled={isGeneratingPdf}
          className="inline-flex items-center gap-2 self-start rounded-lg border border-brand px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <Download className="h-4 w-4" />
          {isGeneratingPdf ? "Generating…" : "Download PDF"}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          icon={Zap}
          label="Performance Score"
          value={`${metrics.performanceScore}`}
          status={scoreStatus(metrics.performanceScore)}
        />
        <MetricCard
          icon={Lock}
          label="HTTPS Active"
          value={metrics.httpsActive ? "Yes" : "No"}
          status={booleanStatus(metrics.httpsActive)}
        />
        <MetricCard
          icon={Smartphone}
          label="Mobile-Friendly"
          value={
            metrics.mobileFriendly === null
              ? "Unknown"
              : metrics.mobileFriendly
                ? "Yes"
                : "No"
          }
          status={mobileFriendlyStatus(metrics.mobileFriendly)}
        />{" "}
        <MetricCard
          icon={Timer}
          label="Page Load Time"
          value={`${metrics.loadTimeSeconds.toFixed(1)}s`}
          status={loadTimeStatus(metrics.loadTimeSeconds)}
        />
        <MetricCard
          icon={Search}
          label="SEO Score"
          value={`${metrics.seoScore}`}
          status={scoreStatus(metrics.seoScore)}
        />
        <BadgeLegend />
      </div>

      <div className="mt-6">
        <Recommendations items={recommendations} />
      </div>
    </section>
  );
}
