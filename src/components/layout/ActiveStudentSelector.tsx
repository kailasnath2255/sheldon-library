import { useStore } from "@/store/useStore";
import { ChevronDown, UserCircle2 } from "lucide-react";

export default function ActiveStudentSelector() {
  const { students, activeStudentId, setActiveStudent } = useStore();

  if (!students.length) {
    return (
      <div className="text-sm text-navy/60">
        No students yet — add one in <span className="font-semibold">Students</span>.
      </div>
    );
  }

  const active = students.find((s) => s.id === activeStudentId) ?? students[0];

  return (
    <div className="flex items-center gap-3">
      <p className="pill bg-navy/5 text-navy/70 hidden sm:inline-flex">
        Active Student
      </p>
      <div className="relative">
        <select
          value={active.id}
          onChange={(e) => setActiveStudent(e.target.value)}
          className="appearance-none pl-10 pr-9 py-2 rounded-xl border border-navy/15 bg-white text-navy font-semibold text-sm focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none cursor-pointer"
          aria-label="Select active student"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · Grade {s.grade} · {s.subject}
            </option>
          ))}
        </select>
        <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple pointer-events-none" />
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/50 pointer-events-none" />
      </div>
    </div>
  );
}
