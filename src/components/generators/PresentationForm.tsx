import { Field, Segmented, inputCls } from "./shared";

export type PresentationFormValues = {
  topic: string;
  subtopic: string;
  duration: number;
  difficulty: "Easy" | "Medium" | "Hard";
  materialFile?: { name: string; size: number };
};

export default function PresentationForm({
  values,
  onChange,
}: {
  values: PresentationFormValues;
  onChange: (v: PresentationFormValues) => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Topic">
        <input
          className={inputCls}
          value={values.topic}
          onChange={(e) => onChange({ ...values, topic: e.target.value })}
          placeholder="e.g. Photosynthesis"
        />
      </Field>
      <Field label="Sub-topic">
        <input
          className={inputCls}
          value={values.subtopic}
          onChange={(e) => onChange({ ...values, subtopic: e.target.value })}
          placeholder="e.g. Light-dependent reactions"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Class duration (min)">
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
        <Field label="Difficulty">
          <Segmented
            options={["Easy", "Medium", "Hard"] as const}
            value={values.difficulty}
            onChange={(v) => onChange({ ...values, difficulty: v })}
          />
        </Field>
      </div>

      <Field
        label="Reference material"
        hint="Optional. Filename + size sent to AI for tone/content hints."
      >
        <label className="block border border-dashed border-navy/20 rounded-xl px-4 py-3 cursor-pointer text-sm hover:bg-navy/5 transition">
          <input
            type="file"
            accept=".pdf,.docx,.pptx,.txt"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) {
                onChange({
                  ...values,
                  materialFile: { name: f.name, size: f.size },
                });
              }
            }}
          />
          {values.materialFile ? (
            <span className="text-purple font-semibold">
              📎 {values.materialFile.name} ·{" "}
              {(values.materialFile.size / 1024).toFixed(1)} KB
            </span>
          ) : (
            <span className="text-navy/50">
              Click to upload .pdf · .docx · .pptx · .txt
            </span>
          )}
        </label>
      </Field>
    </div>
  );
}
