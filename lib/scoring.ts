import { BadgeStatus } from "@/types/audit";

export function scoreStatus(score: number): BadgeStatus {
  if (score > 80) return "green";
  if (score >= 50) return "orange";
  return "red";
}

export function loadTimeStatus(seconds: number): BadgeStatus {
  if (seconds < 3) return "green";
  if (seconds <= 6) return "orange";
  return "red";
}

export function booleanStatus(value: boolean): BadgeStatus {
  return value ? "green" : "red";
}

/** Mobile-friendly check can be inconclusive (bot-protected sites, timeouts). */
export function mobileFriendlyStatus(value: boolean | null): BadgeStatus {
  if (value === null) return "unknown";
  return value ? "green" : "red";
}

export const badgeLabel: Record<BadgeStatus, string> = {
  green: "Green",
  orange: "Orange",
  red: "Red",
  unknown: "Unknown",
};

export const badgeLegend: { status: BadgeStatus; label: string }[] = [
  { status: "green", label: "Healthy" },
  { status: "orange", label: "Needs work" },
  { status: "red", label: "Critical" },
];