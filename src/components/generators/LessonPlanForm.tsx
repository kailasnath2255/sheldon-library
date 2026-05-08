import { Field, inputCls } from "./shared";

export type LessonPlanFormValues = {
  topic: string;
  subtopic: string;
  duration: number;
};

export default function LessonPlanForm({
  values,
  onChange,
}: {
  values: LessonPlanFormValues;
  onChange: (v: LessonPlanFormValues) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Topic">
        <input
          className={inputCls}
          value={values.topic}
          onChange={(e) => onChange({ ...values, topic: e.target.value })}
          placeholder="e.g. Fractions"
        />
      </Field>
      <Field label="Sub-topic">
        <input
          className={inputCls}
          value={values.subtopic}
          onChange={(e) => onChange({ ...values, subtopic: e.target.value })}
          placeholder="e.g. Adding unlike denominators"
        />
      </Field>
      <Field label="Class duration (minutes)">
        <input
          type="number"
          min={20}
          max={180}
          className={inputCls}
          value={values.duration}
          onChange={(e) =>
            onChange({ ...values, duration: Number(e.target.value) })
          }
        />
      </Field>
    </div>
  );
}
