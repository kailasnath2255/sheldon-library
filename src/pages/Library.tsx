import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, X, Search, ArrowDownUp, SlidersHorizontal } from "lucide-react";
import PageHero from "@/components/shared/PageHero";
import EmptyState from "@/components/shared/EmptyState";
import TypePill from "@/components/shared/TypePill";
import QuizRenderer from "@/components/renderers/QuizRenderer";
import WorksheetRenderer from "@/components/renderers/WorksheetRenderer";
import LessonPlanRenderer from "@/components/renderers/LessonPlanRenderer";
import PresentationRenderer from "@/components/renderers/PresentationRenderer";
import GameRenderer from "@/components/renderers/GameRenderer";
import { useStore } from "@/store/useStore";
import type { LibraryItem, LibraryItemType } from "@/lib/types";
import { formatRelative } from "@/lib/format";

const TYPE_FILTERS: { key: LibraryItemType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "diagnostic", label: "Diagnostic" },
  { key: "assessment", label: "Assessment" },
  { key: "worksheet", label: "Worksheet" },
  { key: "lesson_plan", label: "Lesson Plan" },
  { key: "presentation", label: "Presentation" },
  { key: "game", label: "Games" },
];

type SortKey = "newest" | "oldest" | "title-asc" | "title-desc" | "type";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "title-asc", label: "Title (A → Z)" },
  { value: "title-desc", label: "Title (Z → A)" },
  { value: "type", label: "By type" },
];

export default function Library() {
  const { libraryItems, students } = useStore();
  const [filter, setFilter] = useState<(typeof TYPE_FILTERS)[number]["key"]>("all");
  const [params, setParams] = useSearchParams();
  const openId = params.get("id");
  const [openItem, setOpenItem] = useState<LibraryItem | null>(null);

  // New filter state
  const [search, setSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState<string>("all");
  const [gradeFilter, setGradeFilter] = useState<string>("all"); // "all" | "1".."12"
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!openId) {
      setOpenItem(null);
      return;
    }
    const found = libraryItems.find((li) => li.id === openId) ?? null;
    setOpenItem(found);
  }, [openId, libraryItems]);

  // Derive available grades/subjects from students that have library items
  const studentById = useMemo(() => {
    const map = new Map<string, (typeof students)[number]>();
    students.forEach((s) => map.set(s.id, s));
    return map;
  }, [students]);

  const availableGrades = useMemo(() => {
    const grades = new Set<number>();
    libraryItems.forEach((it) => {
      const s = studentById.get(it.studentId);
      if (s) grades.add(s.grade);
    });
    return Array.from(grades).sort((a, b) => a - b);
  }, [libraryItems, studentById]);

  const availableSubjects = useMemo(() => {
    const subjects = new Set<string>();
    libraryItems.forEach((it) => {
      const s = studentById.get(it.studentId);
      if (s && s.subject) subjects.add(s.subject);
    });
    return Array.from(subjects).sort();
  }, [libraryItems, studentById]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return libraryItems
      .filter((it) => filter === "all" || it.type === filter)
      .filter((it) => {
        if (studentFilter === "all") return true;
        return it.studentId === studentFilter;
      })
      .filter((it) => {
        if (gradeFilter === "all") return true;
        const s = studentById.get(it.studentId);
        return s?.grade === Number(gradeFilter);
      })
      .filter((it) => {
        if (subjectFilter === "all") return true;
        const s = studentById.get(it.studentId);
        return s?.subject === subjectFilter;
      })
      .filter((it) => {
        if (!q) return true;
        const studentName = studentById.get(it.studentId)?.name ?? "";
        return (
          it.title.toLowerCase().includes(q) ||
          studentName.toLowerCase().includes(q) ||
          it.type.toLowerCase().includes(q)
        );
      });
  }, [libraryItems, filter, studentFilter, gradeFilter, subjectFilter, search, studentById]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case "newest":
        return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
      case "oldest":
        return arr.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt));
      case "title-asc":
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return arr.sort((a, b) => b.title.localeCompare(a.title));
      case "type":
        return arr.sort((a, b) => a.type.localeCompare(b.type));
      default:
        return arr;
    }
  }, [filtered, sortBy]);

  const close = () => {
    const np = new URLSearchParams(params);
    np.delete("id");
    setParams(np, { replace: true });
  };

  const open = (id: string) => {
    const np = new URLSearchParams(params);
    np.set("id", id);
    setParams(np, { replace: true });
  };

  const studentName = (id: string) => studentById.get(id)?.name ?? "—";

  const activeFilterCount =
    (filter !== "all" ? 1 : 0) +
    (studentFilter !== "all" ? 1 : 0) +
    (gradeFilter !== "all" ? 1 : 0) +
    (subjectFilter !== "all" ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const clearAll = () => {
    setFilter("all");
    setStudentFilter("all");
    setGradeFilter("all");
    setSubjectFilter("all");
    setSearch("");
  };

  const selectCls =
    "px-3 py-2 rounded-xl border border-navy/15 bg-white text-navy text-sm focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none";

  return (
    <div>
      <PageHero
        title="Library"
        subtitle="Every artifact you've generated — search, filter, and reopen any of them."
      />

      {/* Search bar */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/40 pointer-events-none" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, student, or type…"
          className="w-full pl-11 pr-10 py-3 rounded-xl border border-navy/15 bg-white text-navy placeholder-navy/40 focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition"
          aria-label="Search library"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-navy/5 text-navy/60"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Type chips + sort + advanced filters toggle */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {TYPE_FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition ${
                  active
                    ? "bg-purple text-white border-purple"
                    : "bg-white text-navy border-navy/15 hover:bg-navy/5"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Sort */}
          <div className="relative inline-flex items-center">
            <ArrowDownUp className="absolute left-3 w-4 h-4 text-navy/50 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className={`${selectCls} pl-9 pr-8 cursor-pointer appearance-none`}
              aria-label="Sort by"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setShowFilters((s) => !s)}
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition ${
              showFilters
                ? "bg-purple text-white border-purple"
                : "bg-white text-navy border-navy/15 hover:bg-navy/5"
            }`}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  showFilters ? "bg-white/30 text-white" : "bg-purple text-white"
                }`}
              >
                {activeFilterCount}
              </span>
            )}
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              className="text-sm font-semibold text-coral hover:underline ml-auto sm:ml-0"
            >
              Clear all
            </button>
          )}

          <span className="ml-auto text-sm text-navy/60">
            {sorted.length} {sorted.length === 1 ? "item" : "items"}
          </span>
        </div>

        {/* Advanced filter panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-4 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-up">
            <label className="block">
              <span className="pill bg-navy/5 text-navy/70">Student</span>
              <select
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
                className={`mt-1.5 ${selectCls} w-full`}
              >
                <option value="all">All students</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="pill bg-navy/5 text-navy/70">Grade</span>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className={`mt-1.5 ${selectCls} w-full`}
                disabled={availableGrades.length === 0}
              >
                <option value="all">All grades</option>
                {availableGrades.map((g) => (
                  <option key={g} value={g}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="pill bg-navy/5 text-navy/70">Subject</span>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className={`mt-1.5 ${selectCls} w-full`}
                disabled={availableSubjects.length === 0}
              >
                <option value="all">All subjects</option>
                {availableSubjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          title={
            activeFilterCount > 0
              ? "No items match these filters."
              : "Nothing here yet — generate one to start your library."
          }
          message={
            activeFilterCount > 0
              ? "Try clearing some filters or change the search query."
              : "Head to Generate, pick a tool, and create your first artifact."
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sorted.map((item) => {
            const s = studentById.get(item.studentId);
            return (
              <button
                key={item.id}
                onClick={() => open(item.id)}
                className="text-left bg-white rounded-2xl shadow-soft border border-navy/5 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                <TypePill type={item.type} />
                <p className="font-display font-bold text-navy mt-3 line-clamp-2">
                  {item.title}
                </p>
                <div className="mt-2 text-xs text-navy/60 flex items-center flex-wrap gap-x-2 gap-y-1">
                  <span>{studentName(item.studentId)}</span>
                  {s && (
                    <>
                      <span>·</span>
                      <span>Grade {s.grade}</span>
                      {s.subject && (
                        <>
                          <span>·</span>
                          <span>{s.subject}</span>
                        </>
                      )}
                    </>
                  )}
                  <span>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelative(item.createdAt)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {openItem && (
        <div
          className="fixed inset-0 z-40 bg-navy/40 backdrop-blur-sm flex items-stretch sm:items-center justify-center p-2 sm:p-6"
          onClick={close}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col"
          >
            <header className="px-5 py-4 border-b border-navy/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <TypePill type={openItem.type} />
                <h3 className="font-display font-bold text-navy truncate">
                  {openItem.title}
                </h3>
              </div>
              <button
                onClick={close}
                className="p-1 rounded hover:bg-navy/5"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-navy/60" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-5 lg:p-6">
              <RenderedItem item={openItem} studentName={studentName(openItem.studentId)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const RenderedItem = ({
  item,
  studentName,
}: {
  item: LibraryItem;
  studentName: string;
}) => {
  switch (item.type) {
    case "diagnostic":
      return (
        <QuizRenderer mode="diagnostic" questions={item.payload.questions} />
      );
    case "assessment":
      return (
        <QuizRenderer mode="assessment" questions={item.payload.questions} />
      );
    case "worksheet":
      return <WorksheetRenderer data={item.payload} studentName={studentName} />;
    case "lesson_plan":
      return (
        <LessonPlanRenderer
          data={item.payload}
          studentName={studentName}
        />
      );
    case "presentation":
      return <PresentationRenderer data={item.payload} />;
    case "game":
      return <GameRenderer data={item.payload} />;
    default:
      return (
        <pre className="text-xs text-navy/70 whitespace-pre-wrap">
          {JSON.stringify(item.payload, null, 2)}
        </pre>
      );
  }
};
