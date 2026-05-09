import { useNavigate } from "react-router-dom";
import { ArrowRight, type LucideIcon } from "lucide-react";

type Props = {
  tool: string;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  bgClass: string;
};

export default function GeneratorCard({ tool, title, subtitle, icon: Icon, bgClass }: Props) {
  const nav = useNavigate();
  return (
    <button
      onClick={() => nav(`/generate?tool=${tool}`)}
      className={`${bgClass} dark:bg-deep-surface rounded-3xl p-6 text-left transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-soft-lg group ss-edge w-full`}
      aria-label={`Open ${title} generator`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-deep-bg backdrop-blur flex items-center justify-center text-ss-ink-900 dark:text-white shadow-soft transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]">
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
        <div className="w-9 h-9 rounded-full bg-white/60 dark:bg-deep-bg flex items-center justify-center transition-all duration-300 group-hover:bg-ss-orange-500 group-hover:rotate-[-45deg]">
          <ArrowRight className="w-4 h-4 text-ss-ink-900 dark:text-white group-hover:text-white transition-colors" />
        </div>
      </div>
      <h3 className="font-display text-xl md:text-2xl font-extrabold text-ss-ink-900 dark:text-white leading-tight">
        {title}
      </h3>
      <p className="text-sm text-ss-ink-700 dark:text-ss-ink-300 mt-1.5">{subtitle}</p>
      <div className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-ss-ink-900 dark:text-white">
        Launch
        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
