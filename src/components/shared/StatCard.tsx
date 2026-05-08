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
  purple: "bg-purple/10 text-purple",
  teal: "bg-teal/10 text-teal",
  gold: "bg-gold/15 text-[#8a6d00]",
  coral: "bg-coral/10 text-coral",
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
    <div className="bg-white rounded-2xl shadow-soft p-6 border border-navy/5 flex flex-col justify-between min-h-[160px]">
      <div className="flex items-start justify-between">
        <p className="pill bg-navy/5 text-navy/70">{label}</p>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${ACCENT[accent]}`}>
            <Icon className="w-5 h-5" strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div>
        <div className="font-display text-4xl font-extrabold text-navy mt-3">
          {value}
        </div>
        {hint && <p className="text-sm text-navy/60 mt-1">{hint}</p>}
      </div>
      {href && (
        <Link
          to={href}
          className="text-sm font-semibold text-purple inline-flex items-center gap-1 mt-3 hover:gap-2 transition-all"
        >
          {hrefLabel ?? "Open"} <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
