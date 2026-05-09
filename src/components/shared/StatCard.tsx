import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ChevronRight } from "lucide-react";

type Props = {
  label: string;
  value: string;
  hint?: string;
  href?: string;
  hrefLabel?: string;
  icon?: LucideIcon;
  accent?: "purple" | "teal" | "gold" | "coral";
};

const ACCENT: Record<string, string> = {
  purple: "bg-soft-lavender dark:bg-deep-lavender text-ss-accent-purple dark:text-purple-200",
  teal: "bg-soft-mint dark:bg-deep-mint text-emerald-700 dark:text-emerald-200",
  gold: "bg-soft-yellow dark:bg-deep-cream text-amber-700 dark:text-amber-200",
  coral: "bg-soft-rose dark:bg-deep-rose text-pink-700 dark:text-pink-200",
};

export default function StatCard({
  label,
  value,
  hint,
  href,
  hrefLabel,
  icon: Icon,
  accent = "purple",
}: Props) {
  return (
    <div className="bg-white dark:bg-deep-surface rounded-3xl shadow-soft p-6 ss-edge flex flex-col justify-between min-h-[160px] transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <div className="flex items-start justify-between">
        <p className="eyebrow">{label}</p>
        {Icon && (
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${ACCENT[accent]}`}>
            <Icon className="w-5 h-5" strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div>
        <div className="ss-display text-4xl text-ss-ink-900 dark:text-white mt-3">
          {value}
        </div>
        {hint && <p className="text-sm text-ss-ink-500 dark:text-ss-ink-300 mt-1">{hint}</p>}
      </div>
      {href && (
        <Link
          to={href}
          className="group text-sm font-bold text-ss-orange-500 hover:text-ss-orange-600 inline-flex items-center gap-1 mt-3 transition"
        >
          {hrefLabel ?? "Open"}
          <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
