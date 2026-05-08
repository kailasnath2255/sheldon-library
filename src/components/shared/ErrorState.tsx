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
    <div className="border-l-4 border-coral bg-coral/5 rounded-xl p-5 flex gap-3 animate-fade-up">
      <AlertCircle className="w-5 h-5 text-coral shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-coral">{message}</p>
        {detail && (
          <p className="text-xs text-navy/60 mt-1 break-words">{detail}</p>
        )}
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-coral hover:underline"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        )}
      </div>
    </div>
  );
}
