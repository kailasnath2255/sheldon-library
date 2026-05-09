import { Cpu, Sparkles, Shield } from "lucide-react";
import { modelsForTool } from "@/lib/models";

export default function ModelSelector({
  value,
  onChange,
  compact = false,
  tool = null,
}: {
  value: string;
  onChange: (id: string) => void;
  compact?: boolean;
  tool?: string | null;
}) {
  const choices = modelsForTool(tool);

  return (
    <div
      className={
        compact
          ? "bg-white rounded-2xl shadow-soft border border-navy/5 p-4"
          : "bg-white rounded-2xl shadow-soft border border-navy/5 p-5"
      }
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-purple/10 text-purple flex items-center justify-center">
          <Cpu className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-navy text-sm leading-tight">AI Engine</h3>
          <p className="text-[11px] text-navy/50 leading-tight">
            Pick the brain that powers this generation.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {choices.map((m) => {
          const active = value === m.id;
          const isPrimary = m.id === "claude";
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`relative flex-1 min-w-[110px] text-left px-3 py-2 rounded-xl border text-sm font-semibold transition ${
                active
                  ? "bg-purple text-white border-purple shadow-sm"
                  : "bg-white text-navy border-navy/15 hover:bg-navy/5"
              }`}
              aria-pressed={active}
            >
              {isPrimary && !active && (
                <span className="absolute -top-1.5 -right-1.5 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple text-white text-[9px] font-bold tracking-wide shadow-sm">
                  <Sparkles className="w-2.5 h-2.5" strokeWidth={2.5} />
                  BEST
                </span>
              )}
              <div className="font-bold leading-tight">{m.label}</div>
              <div
                className={`text-[10px] font-medium leading-tight mt-0.5 ${
                  active ? "text-white/85" : "text-navy/55"
                }`}
              >
                {m.hint}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-3 flex items-start gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple/5 via-navy/5 to-purple/5 border border-navy/5">
        <Shield className="w-3.5 h-3.5 text-purple shrink-0 mt-0.5" strokeWidth={2.2} />
        <p className="text-[11px] text-navy/65 leading-snug">
          <span className="font-semibold text-navy/80">Auto-fallback enabled.</span>{" "}
          If your pick fails, Sheldon instantly switches to the backup tier — your generation never breaks.
        </p>
      </div>
    </div>
  );
}
