export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-xs text-text-muted sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-navy">Audit Digital Express</p>
          <p>Agency-grade website audits, generated in seconds.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#new-audit" className="transition-colors hover:text-navy">
            New Audit
          </a>
          <span>Powered by PageSpeed</span>
          <span>© 2026 Audit Digital Express. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}