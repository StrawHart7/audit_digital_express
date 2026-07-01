import { Zap } from "lucide-react";

const navLinks: { label: string; href: string; external?: boolean }[] = [
  { label: "New Audit", href: "#new-audit" },
  { label: "Metrics", href: "#audit-results" },
  { label: "Recommendations", href: "#recommendations" },
  {
    label: "About PageSpeed",
    href: "https://developers.google.com/speed/pagespeed/insights/",
    external: true,
  },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-navy text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#new-audit" className="flex items-center gap-2 font-semibold">
          <Zap className="h-4 w-4 text-brand" strokeWidth={2.5} />
          <span>Audit Digital Express</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/75 sm:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}