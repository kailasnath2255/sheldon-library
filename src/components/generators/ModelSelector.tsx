import { Cpu } from "lucide-react";
import { MODEL_CHOICES } from "@/lib/models";

export default function ModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-purple/10 text-purple flex items-center justify-center">
          <Cpu className="w-4 h-4" strokeWidth={2.2} />
        </div>
        <h3 className="font-display font-bold text-navy">AI Engine</h3>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {MODEL_CHOICES.map((m) => {
          const active = value === m.id;
          return (
            <button
              key={m.id || "auto"}
              type="button"
              onClick={() => onChange(m.id)}
              className={`text-left p-3 rounded-xl border transition ${
                active
                  ? "bg-purple/5 border-purple shadow-sm"
                  : "bg-white border-navy/15 hover:bg-navy/5"
              }`}
              aria-pressed={active}
            >
              <div className={`text-sm font-bold ${active ? "text-purple" : "text-navy"}`}>
                {m.label}
              </div>
              <div className="text-[11px] text-navy/60 leading-snug mt-0.5">
                {m.hint}
              </div>
            </button>
          );
        })}
      </div>
      <p className="text-[11px] text-navy/50 mt-3 italic">
        Open-source backup runs automatically if the primary engine fails.
      </p>
    </div>
  );
}
