export default function Spinner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-2xl border border-border bg-surface p-8 text-center"
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      <p className="text-sm font-semibold text-navy">Running your audit…</p>
      <p className="text-xs text-text-muted">
        This can take up to 30 seconds while PageSpeed Insights analyzes the page.
      </p>
    </div>
  );
}