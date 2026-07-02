export type BadgeStatus = "green" | "orange" | "red" | "unknown";

export interface AuditMetrics {
  performanceScore: number; // 0-100
  seoScore: number; // 0-100
  httpsActive: boolean;
  mobileFriendly: boolean | null;
  /** Lab data (First Contentful Paint), in seconds — not CrUX field data. */
  loadTimeSeconds: number;
}

export interface AuditResult {
  companyName: string;
  url: string;
  /** ISO 8601 date string */
  auditDate: string;
  metrics: AuditMetrics;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
}

export interface AuditRequestBody {
  url: string;
  companyName: string;
}

export interface AuditApiResponse {
  result?: AuditResult;
  error?: string;
}