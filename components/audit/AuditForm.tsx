"use client";

import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

interface AuditFormProps {
  onSubmit: (url: string, companyName: string) => void;
  isLoading: boolean;
}

export default function AuditForm({ onSubmit, isLoading }: AuditFormProps) {
  const [url, setUrl] = useState("");
  const [companyName, setCompanyName] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!url.trim() || !companyName.trim()) return;
    onSubmit(url.trim(), companyName.trim());
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-left shadow-sm"
    >
      <label htmlFor="url" className="block text-sm font-semibold text-navy">
        Website URL
      </label>
      <input
        id="url"
        name="url"
        type="text"
        inputMode="url"
        autoComplete="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.example.com"
        required
        className="mt-1.5 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-navy placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />

      <label htmlFor="companyName" className="mt-4 block text-sm font-semibold text-navy">
        Company Name
      </label>
      <input
        id="companyName"
        name="companyName"
        type="text"
        autoComplete="organization"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        placeholder="Acme Marketing Co."
        required
        className="mt-1.5 w-full rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm text-navy placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70"
      >
        <Search className="h-4 w-4" />
        {isLoading ? "Analyzing…" : "Generate Report"}
      </button>
    </form>
  );
}