import { Lightbulb } from "lucide-react";
import { Recommendation } from "@/types/audit";

export default function Recommendations({ items }: { items: Recommendation[] }) {
  return (
    <div id="recommendations" className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center gap-2 text-base font-semibold text-navy">
        <Lightbulb className="h-5 w-5 text-brand" />
        Recommendations
      </div>
      <ul className="mt-4 space-y-4">
        {items.map((item) => (
          <li key={item.id}>
            <p className="text-sm font-semibold text-brand">{item.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{item.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}