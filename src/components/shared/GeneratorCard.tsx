import { useNavigate } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

type Props = {
  tool: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  bgClass: string; // e.g. "bg-card-diagnostic"
};

export default function GeneratorCard({
  tool,
  title,
  subtitle,
  icon: Icon,
  bgClass,
}: Props) {
  const nav = useNavigate();
  return (
    <button
      onClick={() => nav(`/generate?tool=${tool}`)}
      className={`${bgClass} rounded-2xl p-5 sm:p-6 text-left hover:scale-[1.02] hover:shadow-lg transition-all group border border-navy/5 w-full`}
      aria-label={`Open ${title} generator`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-xl bg-white/70 backdrop-blur flex items-center justify-center text-navy">
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
        <ArrowRight className="w-5 h-5 text-navy/60 group-hover:translate-x-1 transition" />
      </div>
      <h3 className="font-display text-xl font-bold text-navy">{title}</h3>
      <p className="text-sm text-navy/70 mt-1">{subtitle}</p>
      <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-navy">
        Launch
        <ArrowRight className="w-4 h-4" />
      </div>
    </button>
  );
}
