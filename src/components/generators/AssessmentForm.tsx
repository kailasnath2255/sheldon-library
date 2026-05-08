import { Field, Segmented, TagInput, Toggle, inputCls } from "./shared";

export type AssessmentFormValues = {
  topics: string[];
  subtopics: string[];
  timed: boolean;
  totalTime: number;
  marks: number;
  numQ: number;
  difficulty: "Easy" | "Medium" | "Hard";
};

export default function AssessmentForm({
  values,
  onChange,
}: {
  values: AssessmentFormValues;
  onChange: (v: AssessmentFormValues) => void;
}) {
  const set = (patch: Partial<AssessmentFormValues>) =>
    onChange({ ...values, ...patch });
  return (
    <div className="space-y-4">
      <Field label="Topics" hint="Press enter after each tag.">
        <TagInput
          values={values.topics}
          onChange={(v) => set({ topics: v })}
          placeholder="e.g. Fractions"
        />
      </Field>
      <Field label="Sub-topics">
        <TagInput
          values={values.subtopics}
          onChange={(v) => set({ subtopics: v })}
          placeholder="Addition · Subtraction"
        />
      </Field>

      <div className="flex items-center gap-3">
        <Toggle
          on={values.timed}
          onChange={(v) => set({ timed: v })}
          label="Timed assessment"
        />
        {values.timed && (
          <input
            type="number"
            min={5}
            max={180}
            value={values.totalTime}
            onChange={(e) => set({ totalTime: Number(e.target.value) })}
            className={`${inputCls} max-w-[120px]`}
            aria-label="Total time in minutes"
          />
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Total marks">
          <input
            type="number"
            min={5}
            max={200}
            value={values.marks}
            onChange={(e) => set({ marks: Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
        <Field label="Total questions">
          <input
            type="number"
            min={3}
            max={30}
            value={values.numQ}
            onChange={(e) => set({ numQ: Number(e.target.value) })}
            className={inputCls}
          />
        </Field>
      </div>

      <Field label="Difficulty">
        <Segmented
          options={["Easy", "Medium", "Hard"] as const}
          value={values.difficulty}
          onChange={(v) => set({ difficulty: v })}
        />
      </Field>
    </div>
  );
}
