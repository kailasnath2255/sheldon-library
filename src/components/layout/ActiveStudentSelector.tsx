import { useStore } from "@/store/useStore";
import { ChevronDown, UserCircle2 } from "lucide-react";

export default function ActiveStudentSelector() {
  const { students, activeStudentId, setActiveStudent } = useStore();

  if (!students.length) {
    return (
      <div className="text-sm text-ss-ink-500 dark:text-ss-ink-300 px-4 py-2.5 rounded-full ss-card">
        No students yet — add one
      </div>
    );
  }

  const active = students.find((s) => s.id === activeStudentId) ?? students[0];

  return (
    <div className="relative inline-flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-full ss-card hover:shadow-soft-lg transition duration-300">
      {/* Avatar circle */}
      <div className="w-9 h-9 rounded-full bg-soft-cream dark:bg-deep-cream flex items-center justify-center shrink-0">
        <UserCircle2 className="w-5 h-5 text-ss-orange-500" strokeWidth={2.2} />
      </div>

      <div className="flex flex-col leading-tight pr-7">
        <span className="text-[9px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-400">
          Active Student
        </span>
        <span className="text-sm font-bold text-ss-ink-900 dark:text-white truncate max-w-[200px]">
          {active.name}
        </span>
      </div>

      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ss-ink-500 dark:text-ss-ink-400 pointer-events-none" />

      {/* Hidden but functional select overlay */}
      <select
        value={active.id}
        onChange={(e) => setActiveStudent(e.target.value)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Select active student"
      >
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} · Grade {s.grade} · {s.subject}
          </option>
        ))}
      </select>
    </div>
  );
}
