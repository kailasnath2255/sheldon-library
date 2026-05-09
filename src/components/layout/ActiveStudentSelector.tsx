import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { Check, ChevronDown, UserCircle2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function ActiveStudentSelector() {
  const { students, activeStudentId, setActiveStudent } = useStore();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onKey);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!students.length) {
    return (
      <div className="text-sm text-ss-ink-500 dark:text-ss-ink-300 px-4 py-2.5 rounded-full ss-card">
        No students yet — add one
      </div>
    );
  }

  const active = students.find((s) => s.id === activeStudentId) ?? students[0];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="inline-flex items-center gap-3 pl-2 pr-9 py-1.5 rounded-full ss-card hover:shadow-soft-lg transition duration-300 cursor-pointer"
      >
        <div className="w-9 h-9 rounded-full bg-soft-cream dark:bg-deep-cream flex items-center justify-center shrink-0 border-2 border-ss-ink-900 dark:border-white/50">
          <UserCircle2 className="w-5 h-5 text-ss-orange-500" strokeWidth={2.2} />
        </div>
        <div className="flex flex-col leading-tight text-left">
          <span className="text-[9px] uppercase tracking-[0.14em] font-bold text-ss-ink-500 dark:text-ss-ink-400">
            Active Student
          </span>
          <span className="text-sm font-bold text-ss-ink-900 dark:text-white truncate max-w-[200px]">
            {active.name}
          </span>
        </div>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ss-ink-500 dark:text-ss-ink-300 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
            role="listbox"
            className="absolute left-0 top-full mt-2 z-50 w-full min-w-[280px] max-h-[60vh] overflow-y-auto bg-white dark:bg-deep-surface ss-edge rounded-2xl shadow-soft-lg p-1.5 scrollbar-thin"
          >
            {students.map((s) => {
              const isActive = s.id === active.id;
              return (
                <li key={s.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      setActiveStudent(s.id);
                      setOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition ${
                      isActive
                        ? "bg-ss-orange-500 text-white"
                        : "hover:bg-soft-cream dark:hover:bg-deep-cream/40 text-ss-ink-900 dark:text-white"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                        isActive
                          ? "bg-white/15 border-white/40"
                          : "bg-soft-cream dark:bg-deep-cream border-ss-ink-900 dark:border-white/50"
                      }`}
                    >
                      <UserCircle2
                        className={`w-4 h-4 ${
                          isActive ? "text-white" : "text-ss-orange-500"
                        }`}
                        strokeWidth={2.2}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${
                          isActive ? "text-white" : "text-ss-ink-900 dark:text-white"
                        }`}
                      >
                        {s.name}
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          isActive
                            ? "text-white/80"
                            : "text-ss-ink-500 dark:text-ss-ink-300"
                        }`}
                      >
                        Grade {s.grade} · {s.subject}
                      </p>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-white shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
