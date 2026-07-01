import { Info } from "lucide-react";
import { badgeLegend } from "@/lib/scoring";

const dotColor: Record<string, string> = {
  green: "bg-status-green",
  orange: "bg-status-orange",
  red: "bg-status-red",
};

export default function BadgeLegend() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-navy">
        <Info className="h-4 w-4 text-brand" />
        Badge Legend
      </div>
      <ul className="mt-3 space-y-2.5 text-sm text-text-muted">
        {badgeLegend.map((item) => (
          <li key={item.status} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${dotColor[item.status]}`} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}