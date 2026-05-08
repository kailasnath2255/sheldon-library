import type { ReactNode } from "react";

export const inputCls =
  "w-full px-4 py-3 rounded-xl border border-navy/15 bg-white text-navy placeholder-navy/40 focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition";

export const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) => (
  <label className="block">
    <span className="pill bg-navy/5 text-navy/70">{label}</span>
    <div className="mt-1.5">{children}</div>
    {hint && <p className="text-xs text-navy/50 mt-1.5">{hint}</p>}
  </label>
);

export const Segmented = <T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) => (
  <div className="inline-flex rounded-xl border border-navy/15 bg-white p-1 gap-1 w-full">
    {options.map((opt) => {
      const active = opt === value;
      return (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition ${
            active
              ? "bg-purple text-white shadow-sm"
              : "text-navy/70 hover:bg-navy/5"
          }`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

export const Toggle = ({
  on,
  onChange,
  label,
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={() => onChange(!on)}
    className="flex items-center gap-3"
    aria-pressed={on}
  >
    <span
      className={`relative inline-flex w-11 h-6 rounded-full transition ${
        on ? "bg-purple" : "bg-navy/20"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </span>
    <span className="text-sm font-semibold text-navy">{label}</span>
  </button>
);

export const TagInput = ({
  values,
  onChange,
  placeholder,
}: {
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) => {
  return (
    <div className="border border-navy/15 bg-white rounded-xl px-2 py-2 flex flex-wrap gap-1.5 min-h-[48px] focus-within:border-purple focus-within:ring-2 focus-within:ring-purple/20">
      {values.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1 bg-purple/10 text-purple text-xs font-bold px-2.5 py-1 rounded-full"
        >
          {v}
          <button
            type="button"
            className="hover:text-coral text-purple/70"
            onClick={() => onChange(values.filter((x) => x !== v))}
            aria-label={`Remove ${v}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[120px] outline-none text-sm py-1 px-1 placeholder-navy/40"
        placeholder={placeholder ?? "Type and press Enter"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const v = (e.currentTarget.value || "").trim();
            if (v && !values.includes(v)) onChange([...values, v]);
            e.currentTarget.value = "";
          } else if (
            e.key === "Backspace" &&
            !e.currentTarget.value &&
            values.length
          ) {
            onChange(values.slice(0, -1));
          }
        }}
      />
    </div>
  );
};
