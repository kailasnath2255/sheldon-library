import type { ReactNode } from "react";

export const inputCls =
  "w-full px-4 py-3 rounded-2xl border-2 border-ss-ink-900 dark:border-white/40 bg-white dark:bg-deep-bg text-ss-ink-900 dark:text-white placeholder-ss-ink-400 focus:ring-4 focus:ring-ss-orange-500/25 outline-none transition";

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
    <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
      {label}
    </span>
    <div className="mt-1.5">{children}</div>
    {hint && <p className="text-xs text-ss-ink-500 dark:text-ss-ink-400 mt-1.5">{hint}</p>}
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
  <div className="inline-flex rounded-2xl bg-soft-cream dark:bg-deep-cream/40 border-2 border-ss-ink-900 dark:border-white/40 p-1 gap-1 w-full">
    {options.map((opt) => {
      const active = opt === value;
      return (
        <button
          type="button"
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 px-3 py-2 rounded-xl text-sm font-bold transition ${
            active
              ? "bg-ss-orange-500 text-white shadow-brand"
              : "text-ss-ink-700 dark:text-ss-ink-200 hover:bg-white/60 dark:hover:bg-white/10"
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
      className={`relative inline-flex w-11 h-6 rounded-full transition border-2 border-ss-ink-900 dark:border-white/40 ${
        on ? "bg-ss-orange-500" : "bg-ss-ink-200 dark:bg-deep-border"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white dark:bg-deep-surface shadow transition-transform ${
          on ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </span>
    <span className="text-sm font-semibold text-ss-ink-900 dark:text-white">{label}</span>
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
    <div className="border-2 border-ss-ink-900 dark:border-white/40 bg-white dark:bg-deep-bg rounded-2xl px-2 py-2 flex flex-wrap gap-1.5 min-h-[48px] focus-within:ring-4 focus-within:ring-ss-orange-500/25">
      {values.map((v) => (
        <span
          key={v}
          className="inline-flex items-center gap-1 bg-soft-cream dark:bg-deep-cream/40 text-ss-orange-700 dark:text-ss-orange-300 text-xs font-bold px-2.5 py-1 rounded-full border border-ss-ink-900/30 dark:border-white/30"
        >
          {v}
          <button
            type="button"
            className="hover:text-red-500 text-ss-orange-700 dark:text-ss-orange-300"
            onClick={() => onChange(values.filter((x) => x !== v))}
            aria-label={`Remove ${v}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        className="flex-1 min-w-[120px] outline-none text-sm py-1 px-1 bg-transparent text-ss-ink-900 dark:text-white placeholder-ss-ink-400"
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
