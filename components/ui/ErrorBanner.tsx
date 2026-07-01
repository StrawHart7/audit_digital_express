import { AlertTriangle } from "lucide-react";

interface ErrorBannerProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md items-start gap-3 rounded-xl border border-status-red/30 bg-status-red/5 p-4 text-sm"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-status-red" />
      <div>
        <p className="font-semibold text-status-red">Audit failed</p>
        <p className="mt-1 text-status-red/90">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm font-semibold text-status-red underline underline-offset-2"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
}