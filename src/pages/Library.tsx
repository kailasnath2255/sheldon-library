import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Clock, X } from "lucide-react";
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

const FILTERS: { key: LibraryItemType | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "diagnostic", label: "Diagnostic" },
  { key: "assessment", label: "Assessment" },
  { key: "worksheet", label: "Worksheet" },
  { key: "lesson_plan", label: "Lesson Plan" },
  { key: "presentation", label: "Presentation" },
  { key: "game", label: "Games" },
];

export default function Library() {
  const { libraryItems, students } = useStore();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const [params, setParams] = useSearchParams();
  const openId = params.get("id");
  const [openItem, setOpenItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    if (!openId) {
      setOpenItem(null);
      return;
    }
    const found = libraryItems.find((li) => li.id === openId) ?? null;
    setOpenItem(found);
  }, [openId, libraryItems]);

  const items = useMemo(
    () =>
      libraryItems.filter((li) =>
        filter === "all" ? true : li.type === filter
      ),
    [libraryItems, filter]
  );

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

  const studentName = (id: string) =>
    students.find((s) => s.id === id)?.name ?? "—";

  return (
    <div>
      <PageHero
        title="Library"
        subtitle="Every artifact you've generated, organised by type."
      />

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {FILTERS.map((f) => {
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

      {items.length === 0 ? (
        <EmptyState
          title="Nothing here yet — generate one to start your library."
          message="Head to Generate, pick a tool, and create your first artifact."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => open(item.id)}
              className="text-left bg-white rounded-2xl shadow-soft border border-navy/5 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <TypePill type={item.type} />
              <p className="font-display font-bold text-navy mt-3 line-clamp-2">
                {item.title}
              </p>
              <div className="mt-2 text-xs text-navy/60 flex items-center gap-2">
                <span>{studentName(item.studentId)}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatRelative(item.createdAt)}
                </span>
              </div>
            </button>
          ))}
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
