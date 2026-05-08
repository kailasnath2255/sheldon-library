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
    <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-navy text-lg shrink-0"
          style={{ backgroundColor: student.avatarColor }}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-bold text-navy text-lg leading-tight truncate">
            {student.name}
          </h3>
          <p className="text-sm text-navy/60 mt-0.5">
            Grade {student.grade} · {student.country}
          </p>
        </div>
      </div>

      <div className="space-y-1.5 text-sm text-navy/70">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple/70" />
          <span>{student.subject}</span>
        </div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal/80" />
          <span>{student.country}</span>
        </div>
        {student.parentEmail && (
          <div className="flex items-center gap-2 truncate">
            <Mail className="w-4 h-4 text-gold" />
            <span className="truncate">{student.parentEmail}</span>
          </div>
        )}
      </div>

      <div className="pt-2 mt-auto flex justify-end">
        <button
          onClick={() => onRemove(student)}
          className="px-3 py-1.5 rounded-xl bg-coral/10 text-coral font-semibold hover:bg-coral/20 transition inline-flex items-center gap-1.5 text-sm"
          aria-label={`Remove ${student.name}`}
        >
          <Trash2 className="w-4 h-4" /> Remove
        </button>
      </div>
    </div>
  );
}
