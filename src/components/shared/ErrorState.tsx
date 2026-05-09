import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  message = "Something broke — try again.",
  detail,
  onRetry,
}: {
  message?: string;
  detail?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-950/40 rounded-2xl p-5 flex gap-3 animate-fade-up">
      <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-bold text-red-700 dark:text-red-300">{message}</p>
        {detail && (
          <p className="text-xs text-ss-ink-500 dark:text-ss-ink-300 mt-1 break-words">
            {detail}
          </p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-red-700 dark:text-red-300 hover:underline"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        )}
      </div>
    </div>
  );
}
