import { Info } from "lucide-react";
import { Field } from "./shared";

export type DiagnosticFormValues = {
  goal: "Curriculum Alignment" | "Skill Development" | "Exam Prep";
  numQuestions: number;
};

export default function DiagnosticForm({
  values,
  onChange,
}: {
  values: DiagnosticFormValues;
  onChange: (v: DiagnosticFormValues) => void;
}) {
  const goals: DiagnosticFormValues["goal"][] = [
    "Curriculum Alignment",
    "Skill Development",
    "Exam Prep",
  ];

  return (
    <div className="space-y-4">
      <div className="bg-purple/5 border border-purple/20 rounded-xl p-3 text-sm text-navy/80 flex gap-2">
        <Info className="w-4 h-4 text-purple shrink-0 mt-0.5" />
        <p>
          Diagnostic tests cover the previous year's syllabus to identify gaps. A
          Grade 7 student gets a Grade 6 diagnostic.
        </p>
      </div>

      <Field label="Parent goal">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {goals.map((g) => {
            const active = values.goal === g;
            return (
              <button
                key={g}
                type="button"
                onClick={() => onChange({ ...values, goal: g })}
                className={`px-3 py-3 rounded-xl text-sm font-semibold border transition text-left ${
                  active
                    ? "bg-purple text-white border-purple shadow-sm"
                    : "bg-white text-navy border-navy/15 hover:bg-navy/5"
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Number of questions">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={5}
            max={20}
            step={1}
            value={values.numQuestions}
            onChange={(e) =>
              onChange({ ...values, numQuestions: Number(e.target.value) })
            }
            className="flex-1 accent-purple"
            aria-label="Number of questions"
          />
          <span className="font-display text-2xl font-extrabold text-purple w-12 text-right tabular-nums">
            {values.numQuestions}
          </span>
        </div>
      </Field>
    </div>
  );
}
