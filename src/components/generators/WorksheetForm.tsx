import { Field, Segmented, inputCls } from "./shared";

export const WORKSHEET_SECTIONS = [
  "MCQs",
  "Fill in the blanks",
  "Match the following",
  "Short answers",
  "Choose the correct option",
  "Find the error",
  "Sentence making",
  "Sorting game",
  "Creative challenges",
  "Passage",
  "Comprehension",
];

export type WorksheetFormValues = {
  topic: string;
  subtopic: string;
  type: "Homework" | "Classwork";
  sections: string[];
};

export default function WorksheetForm({
  values,
  onChange,
}: {
  values: WorksheetFormValues;
  onChange: (v: WorksheetFormValues) => void;
}) {
  const toggle = (section: string) => {
    const next = values.sections.includes(section)
      ? values.sections.filter((s) => s !== section)
      : [...values.sections, section];
    onChange({ ...values, sections: next });
  };
  return (
    <div className="space-y-4">
      <Field label="Topic">
        <input
          className={inputCls}
          value={values.topic}
          placeholder="e.g. Fractions"
          onChange={(e) => onChange({ ...values, topic: e.target.value })}
        />
      </Field>
      <Field label="Sub-topic">
        <input
          className={inputCls}
          value={values.subtopic}
          placeholder="e.g. Adding & subtracting"
          onChange={(e) => onChange({ ...values, subtopic: e.target.value })}
        />
      </Field>
      <Field label="Type">
        <Segmented
          options={["Homework", "Classwork"] as const}
          value={values.type}
          onChange={(v) => onChange({ ...values, type: v })}
        />
      </Field>
      <Field label="Sections" hint="Pick at least one.">
        <div className="grid grid-cols-2 gap-1.5">
          {WORKSHEET_SECTIONS.map((s) => {
            const on = values.sections.includes(s);
            return (
              <button
                key={s}
                type="button"
                onClick={() => toggle(s)}
                className={`text-left text-sm px-3 py-2 rounded-lg border transition ${
                  on
                    ? "bg-purple/10 border-purple/40 text-purple font-semibold"
                    : "bg-white border-navy/15 text-navy/70 hover:bg-navy/5"
                }`}
              >
                {on ? "✓ " : ""}
                {s}
              </button>
            );
          })}
        </div>
      </Field>
    </div>
  );
}
