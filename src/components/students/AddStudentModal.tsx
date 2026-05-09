import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Country, NewStudent } from "@/lib/types";
import { pickAvatarColor } from "@/lib/mockData";
import { inputCls, Field } from "@/components/generators/shared";
import Button from "@/components/shared/Button";

const COUNTRIES: Country[] = ["UK", "Australia", "India", "USA", "Singapore", "NZ"];

export default function AddStudentModal({
  open,
  onClose,
  onSave,
  defaultIndex = 0,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (s: NewStudent) => Promise<void>;
  defaultIndex?: number;
}) {
  const [form, setForm] = useState<NewStudent>({
    name: "",
    grade: 5,
    country: "UK",
    subject: "Maths",
    parentEmail: "",
    avatarColor: pickAvatarColor(defaultIndex),
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm({
      name: "",
      grade: 5,
      country: "UK",
      subject: "Maths",
      parentEmail: "",
      avatarColor: pickAvatarColor(defaultIndex),
    });
  }, [open, defaultIndex]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-ss-ink-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-student-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-deep-surface rounded-3xl ss-edge shadow-soft-lg w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="eyebrow">New student</p>
            <h2 id="add-student-title" className="font-display text-2xl font-extrabold text-ss-ink-900 dark:text-white mt-1">
              Add a student
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-ss-ink-100 dark:hover:bg-deep-border transition"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-ss-ink-500 dark:text-ss-ink-300" />
          </button>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            setSubmitting(true);
            try {
              await onSave(form);
              onClose();
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <Field label="Name">
            <input
              required
              className={inputCls}
              value={form.name}
              placeholder="e.g. Maya Patel"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Grade">
              <select
                className={inputCls}
                value={form.grade}
                onChange={(e) => setForm((f) => ({ ...f, grade: Number(e.target.value) }))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Country">
              <select
                className={inputCls}
                value={form.country}
                onChange={(e) =>
                  setForm((f) => ({ ...f, country: e.target.value as Country }))
                }
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Subject">
            <input
              className={inputCls}
              value={form.subject}
              placeholder="Maths · English · Science…"
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
          </Field>

          <Field label="Parent email (optional)">
            <input
              type="email"
              className={inputCls}
              value={form.parentEmail ?? ""}
              placeholder="parent@example.com"
              onChange={(e) =>
                setForm((f) => ({ ...f, parentEmail: e.target.value || undefined }))
              }
            />
          </Field>

          <div className="flex items-center gap-2 pt-3">
            <Button type="button" variant="secondary" size="md" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!form.name.trim() || submitting}
              className="flex-1"
            >
              {submitting ? "Saving…" : "Add student"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
