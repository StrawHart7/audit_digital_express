import { AuditMetrics } from "@/types/audit";

const PAGESPEED_ENDPOINT =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

// PageSpeed can take 15-30s on a cold analysis; give it real headroom.
const TIMEOUT_MS = 45_000;

interface LighthouseCategoryResult {
  score: number | null;
}

interface LighthouseAuditResult {
  score: number | null;
  numericValue?: number;
}

interface PageSpeedApiResponse {
  lighthouseResult?: {
    categories: {
      performance?: LighthouseCategoryResult;
      seo?: LighthouseCategoryResult;
      accessibility?: LighthouseCategoryResult;
      "best-practices"?: LighthouseCategoryResult;
    };
    audits: {
      "is-on-https"?: LighthouseAuditResult;
      "first-contentful-paint"?: LighthouseAuditResult;
      viewport?: LighthouseAuditResult;
    };
  };
  error?: {
    code: number;
    message: string;
  };
}

export class PageSpeedError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "PageSpeedError";
    this.status = status;
  }
}

function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Fallback for the "mobile-friendly" check. Lighthouse 13 (rolled out to
 * PSI in Oct 2025) reorganized legacy audits and the "viewport" audit is
 * not always present in the response anymore. When that happens, we check
 * the page's HTML directly instead of silently assuming "not mobile-friendly".
 */
async function detectViewportMetaTag(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; AuditDigitalExpressBot/1.0; +https://audit-digital-express.example)",
      },
    });
    clearTimeout(timeoutId);
    if (!res.ok) return false;
    const html = await res.text();
    return /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
  } catch {
    return false;
  }
}

/**
 * Calls the Google PageSpeed Insights API (strategy=mobile) and extracts
 * exactly the fields the audit report needs.
 */
export async function runPageSpeedAudit(rawUrl: string): Promise<AuditMetrics> {
  const apiKey = process.env.PAGESPEED_API_KEY;
  if (!apiKey) {
    throw new PageSpeedError(
      "Server misconfiguration: PAGESPEED_API_KEY is not set.",
      500
    );
  }

  const targetUrl = normalizeUrl(rawUrl);

  const params = new URLSearchParams({
    url: targetUrl,
    key: apiKey,
    strategy: "mobile",
  });
  for (const category of ["performance", "seo", "accessibility", "best-practices"]) {
    params.append("category", category);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${PAGESPEED_ENDPOINT}?${params.toString()}`, {
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new PageSpeedError(
        "The audit timed out. The target site may be slow to respond — please try again.",
        504
      );
    }
    throw new PageSpeedError(
      "Could not reach the Google PageSpeed Insights API. Check your connection and try again.",
      502
    );
  } finally {
    clearTimeout(timeoutId);
  }

  let data: PageSpeedApiResponse;
  try {
    data = await response.json();
  } catch {
    throw new PageSpeedError(
      "PageSpeed Insights returned an unreadable response. Please try again.",
      502
    );
  }

  if (!response.ok || data.error) {
    const message =
      data.error?.message ||
      "PageSpeed Insights could not analyze this URL. Make sure it's a valid, publicly accessible website.";
    throw new PageSpeedError(message, response.status || 502);
  }

  const lighthouse = data.lighthouseResult;
  if (!lighthouse) {
    throw new PageSpeedError(
      "PageSpeed Insights returned no Lighthouse data for this URL.",
      502
    );
  }

  const performanceScore = Math.round(
    (lighthouse.categories.performance?.score ?? 0) * 100
  );
  const seoScore = Math.round((lighthouse.categories.seo?.score ?? 0) * 100);
  const httpsActive = (lighthouse.audits["is-on-https"]?.score ?? 0) === 1;

  const viewportScore = lighthouse.audits["viewport"]?.score;
  const mobileFriendly =
    viewportScore === 1
      ? true
      : viewportScore === 0
      ? false
      : await detectViewportMetaTag(targetUrl); // audit absent/null -> fallback direct

  const fcpMs = lighthouse.audits["first-contentful-paint"]?.numericValue ?? 0;
  const loadTimeSeconds = fcpMs / 1000;

  return {
    performanceScore,
    seoScore,
    httpsActive,
    mobileFriendly,
    loadTimeSeconds,
  };
}