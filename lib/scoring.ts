import { BadgeStatus } from "@/types/audit";

/**
 * Performance / SEO scores (0-100):
 *  > 80  -> green
 *  50-80 -> orange
 *  < 50  -> red
 */
export function scoreStatus(score: number): BadgeStatus {
  if (score > 80) return "green";
  if (score >= 50) return "orange";
  return "red";
}

/**
 * Page load time (seconds, First Contentful Paint):
 *  < 3s   -> green
 *  3-6s   -> orange
 *  > 6s   -> red
 */
export function loadTimeStatus(seconds: number): BadgeStatus {
  if (seconds < 3) return "green";
  if (seconds <= 6) return "orange";
  return "red";
}

/** Boolean checks (HTTPS, Mobile-Friendly): pass -> green, fail -> red. */
export function booleanStatus(value: boolean): BadgeStatus {
  return value ? "green" : "red";
}

export const badgeLabel: Record<BadgeStatus, string> = {
  green: "Green",
  orange: "Orange",
  red: "Red",
};

export const badgeLegend: { status: BadgeStatus; label: string }[] = [
  { status: "green", label: "Healthy" },
  { status: "orange", label: "Needs work" },
  { status: "red", label: "Critical" },
];