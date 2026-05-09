import { Field, inputCls } from "./shared";
import type { GameStyle } from "@/lib/types";

const STYLES: { value: GameStyle; label: string; hint: string }[] = [
  { value: "sort", label: "Sort", hint: "Drag items into category buckets." },
  { value: "match", label: "Match", hint: "Pair items with their counterparts." },
  { value: "sequence", label: "Sequence", hint: "Order items correctly." },
  { value: "fill-blank", label: "Fill blank", hint: "Drag words into a sentence." },
  { value: "quiz", label: "Quiz", hint: "Tappable card answers." },
];

export type GameFormValues = {
  topic: string;
  subtopic: string;
  gameStyle: GameStyle;
};

export default function GameForm({
  values,
  onChange,
}: {
  values: GameFormValues;
  onChange: (v: GameFormValues) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Topic">
        <input
          className={inputCls}
          value={values.topic}
          onChange={(e) => onChange({ ...values, topic: e.target.value })}
          placeholder="e.g. Verb tenses"
        />
      </Field>
      <Field label="Sub-topic">
        <input
          className={inputCls}
          value={values.subtopic}
          onChange={(e) => onChange({ ...values, subtopic: e.target.value })}
          placeholder="e.g. Past, present, future"
        />
      </Field>
      <Field label="Game style">
        <div className="grid grid-cols-1 gap-2">
          {STYLES.map((s) => {
            const active = values.gameStyle === s.value;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => onChange({ ...values, gameStyle: s.value })}
                className={`text-left px-4 py-3 rounded-xl border transition ${
                  active
                    ? "bg-purple text-white border-purple shadow-sm"
                    : "bg-white dark:bg-deep-surface border-navy/15 hover:bg-navy/5"
                }`}
              >
                <div className="font-semibold text-sm">{s.label}</div>
                <div
                  className={`text-xs ${
                    active ? "text-white/80" : "text-navy/60"
                  }`}
                >
                  {s.hint}
                </div>
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}
