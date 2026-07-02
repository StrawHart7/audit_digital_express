import { LucideIcon } from "lucide-react";
import { BadgeStatus } from "@/types/audit";
import { badgeLabel } from "@/lib/scoring";

const statusBg: Record<BadgeStatus, string> = {
  green: "bg-status-green",
  orange: "bg-status-orange",
  red: "bg-status-red",
  unknown: "bg-status-unknown",
};

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  status: BadgeStatus;
}

export default function MetricCard({ icon: Icon, label, value, status }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center justify-between text-xs font-medium text-text-muted">
        <span>{label}</span>
        <Icon className="h-4 w-4 text-brand" />
      </div>
      <p className="mt-2 text-2xl font-bold text-navy">{value}</p>
      <span
        className={`mt-3 flex w-full items-center justify-center rounded-full py-1.5 text-xs font-semibold text-white ${statusBg[status]}`}
      >
        {badgeLabel[status]}
      </span>
    </div>
  );
}