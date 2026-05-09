import { Trash2, Mail, Globe, BookOpen } from "lucide-react";
import type { Student } from "@/lib/types";

export default function StudentCard({
  student,
  onRemove,
}: {
  student: Student;
  onRemove: (s: Student) => void;
}) {
  const initials = student.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="bg-white dark:bg-deep-surface rounded-3xl shadow-soft ss-edge p-5 flex flex-col gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg group">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-ss-orange-500 text-lg shrink-0 bg-soft-cream dark:bg-deep-cream border-2 border-ss-ink-900 dark:border-white/50 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-[-3deg]">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-400">
            Student
          </p>
          <h3 className="font-display font-extrabold text-ss-ink-900 dark:text-white text-xl leading-tight truncate mt-0.5">
            {student.name}
          </h3>
          <p className="text-sm text-ss-ink-500 dark:text-ss-ink-300 mt-0.5">
            Grade {student.grade} · {student.country}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-ss-ink-700 dark:text-ss-ink-200">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-ss-orange-500" />
          <span>{student.subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-ss-accent-teal" />
          <span>{student.country}</span>
        </div>
        {student.parentEmail && (
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-4 h-4 text-amber-500" />
            <span className="truncate">{student.parentEmail}</span>
          </div>
        )}
      </div>

      <div className="pt-2 mt-auto flex justify-end">
        <button
          onClick={() => onRemove(student)}
          className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-300 font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 transition inline-flex items-center gap-1.5 text-sm"
          aria-label={`Remove ${student.name}`}
        >
          <Trash2 className="w-4 h-4" /> Remove
        </button>
      </div>
    </div>
  );
}
