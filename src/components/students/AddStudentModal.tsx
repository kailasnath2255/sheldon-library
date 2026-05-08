import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { Country, NewStudent } from "@/lib/types";
import { pickAvatarColor } from "@/lib/mockData";

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

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-navy/15 bg-white text-navy placeholder-navy/40 focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition";

  return (
    <div
      className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="add-student-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="add-student-title" className="font-display text-2xl font-extrabold text-navy">
            Add a student
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-navy/5"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-navy/60" />
          </button>
        </div>

        <form
          className="space-y-3"
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
          <label className="block">
            <span className="pill bg-navy/5 text-navy/70">Name</span>
            <input
              required
              className={`mt-1 ${inputCls}`}
              value={form.name}
              placeholder="e.g. Maya Patel"
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="pill bg-navy/5 text-navy/70">Grade</span>
              <select
                className={`mt-1 ${inputCls}`}
                value={form.grade}
                onChange={(e) => setForm((f) => ({ ...f, grade: Number(e.target.value) }))}
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="pill bg-navy/5 text-navy/70">Country</span>
              <select
                className={`mt-1 ${inputCls}`}
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
            </label>
          </div>

          <label className="block">
            <span className="pill bg-navy/5 text-navy/70">Subject</span>
            <input
              className={`mt-1 ${inputCls}`}
              value={form.subject}
              placeholder="Maths · English · Science…"
              onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
            />
          </label>

          <label className="block">
            <span className="pill bg-navy/5 text-navy/70">Parent email (optional)</span>
            <input
              type="email"
              className={`mt-1 ${inputCls}`}
              value={form.parentEmail ?? ""}
              placeholder="parent@example.com"
              onChange={(e) =>
                setForm((f) => ({ ...f, parentEmail: e.target.value || undefined }))
              }
            />
          </label>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 rounded-xl border border-navy/20 text-navy font-semibold hover:bg-navy/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!form.name.trim() || submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 active:scale-[0.98] disabled:opacity-50 transition"
            >
              {submitting ? "Saving…" : "Add student"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
