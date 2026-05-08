import { Sparkles } from "lucide-react";
import type { ReactNode } from "react";

export default function EmptyState({
  title = "Nothing here yet — add one.",
  message,
  action,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-16 px-6 animate-fade-up">
      <div className="w-16 h-16 rounded-2xl bg-purple/10 text-purple flex items-center justify-center mb-4">
        <Sparkles className="w-7 h-7" />
      </div>
      <h3 className="font-display text-xl font-bold text-navy">{title}</h3>
      {message && <p className="text-sm text-navy/60 mt-1 max-w-sm">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
