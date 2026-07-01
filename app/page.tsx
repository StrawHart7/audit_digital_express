"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/audit/Hero";
import AuditForm from "@/components/audit/AuditForm";
import AuditResults from "@/components/audit/AuditResults";
import Spinner from "@/components/ui/Spinner";
import ErrorBanner from "@/components/ui/ErrorBanner";
import { AuditResult } from "@/types/audit";

export default function Home() {
  const [result, setResult] = useState<AuditResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [lastSubmission, setLastSubmission] = useState<{ url: string; companyName: string } | null>(null);

  async function runAudit(url: string, companyName: string) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastSubmission({ url, companyName });

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, companyName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong while running the audit.");
      }

      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDownloadPdf() {
    if (!result) return;
    setIsGeneratingPdf(true);

    try {
      const [{ pdf }, { default: AuditReportPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/audit/AuditReportPDF"),
      ]);

      const blob = await pdf(<AuditReportPDF result={result} />).toBlob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${result.companyName.trim().replace(/\s+/g, "-").toLowerCase()}-audit-report.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError("Could not generate the PDF. Please try again.");
    } finally {
      setIsGeneratingPdf(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero>
          <AuditForm onSubmit={runAudit} isLoading={isLoading} />
        </Hero>

        {(isLoading || error) && (
          <div className="px-6 pb-14">
            {isLoading && <Spinner />}
            {error && !isLoading && (
              <ErrorBanner
                message={error}
                onRetry={lastSubmission ? () => runAudit(lastSubmission.url, lastSubmission.companyName) : undefined}
              />
            )}
          </div>
        )}

        {result && !isLoading && (
          <AuditResults result={result} onDownloadPdf={handleDownloadPdf} isGeneratingPdf={isGeneratingPdf} />
        )}
      </main>
      <Footer />
    </div>
  );
}