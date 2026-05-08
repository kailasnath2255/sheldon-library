import { Link } from "react-router-dom";
import {
  Stethoscope,
  ClipboardList,
  FileText,
  BookOpen,
  Presentation,
  Gamepad2,
  Users,
  Sparkles,
  Brain,
  Clock,
  ChevronRight,
} from "lucide-react";
import StatCard from "@/components/shared/StatCard";
import GeneratorCard from "@/components/shared/GeneratorCard";
import OwlMascot from "@/components/shared/OwlMascot";
import TypePill from "@/components/shared/TypePill";
import { useStore, useActiveStudent } from "@/store/useStore";
import { formatRelative } from "@/lib/format";

const TOOLS = [
  {
    tool: "diagnostic",
    title: "Diagnostic Test",
    subtitle: "Find the gap fast.",
    icon: Stethoscope,
    bgClass: "bg-card-diagnostic",
  },
  {
    tool: "assessment",
    title: "Assessment",
    subtitle: "Graded, with marks & feedback.",
    icon: ClipboardList,
    bgClass: "bg-card-assessment",
  },
  {
    tool: "worksheet",
    title: "Worksheet",
    subtitle: "Print or share — playful.",
    icon: FileText,
    bgClass: "bg-card-worksheet",
  },
  {
    tool: "lessonplan",
    title: "Lesson Plan",
    subtitle: "60 min, structured.",
    icon: BookOpen,
    bgClass: "bg-card-lessonplan",
  },
  {
    tool: "presentation",
    title: "Presentation",
    subtitle: "Live deck, interactive slides.",
    icon: Presentation,
    bgClass: "bg-card-presentation",
  },
  {
    tool: "games",
    title: "Games & Activities",
    subtitle: "Drag, sort, play, learn.",
    icon: Gamepad2,
    bgClass: "bg-card-games",
  },
] as const;

export default function Dashboard() {
  const { students, libraryItems } = useStore();
  const active = useActiveStudent();
  const recent = libraryItems.slice(0, 6);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="relative bg-white rounded-3xl shadow-soft border border-navy/5 px-6 md:px-10 py-8 overflow-hidden">
        <div className="grid md:grid-cols-[1fr_auto] items-center gap-6">
          <div>
            <p className="pill bg-purple/10 text-purple inline-flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Welcome back
            </p>
            <h1 className="mt-3 font-display text-3xl md:text-5xl font-extrabold tracking-tight text-navy leading-[1.05]">
              Hi, let's build a class-ready plan.
            </h1>
            <p className="mt-3 text-navy/70 max-w-xl">
              Pick a tool below to generate AI-tailored content for{" "}
              <span className="font-bold text-purple">
                {active ? active.name : "a student"}
              </span>
              . Everything saves to your library for the PTM.
            </p>
          </div>
          <div className="hidden md:block animate-fade-up">
            <OwlMascot size={170} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Students"
          value={String(students.length)}
          hint="In your roster"
          icon={Users}
          accent="purple"
          href="/students"
          hrefLabel="Manage roster"
        />
        <StatCard
          label="Library Items"
          value={`${libraryItems.length}+`}
          hint="Generated artifacts"
          icon={BookOpen}
          accent="teal"
          href="/library"
          hrefLabel="Open library"
        />
        <StatCard
          label="AI Engine"
          value="Adaptive"
          hint="Pick a model at generation time"
          icon={Brain}
          accent="gold"
        />
      </section>

      {/* Generator Tools */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-navy">Generator Tools</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <GeneratorCard key={t.tool} {...t} />
          ))}
        </div>
      </section>

      {/* Recently generated */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold text-navy">Recently generated</h2>
          <Link
            to="/library"
            className="text-sm font-semibold text-purple inline-flex items-center gap-1 hover:gap-2 transition-all"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-navy/15 p-10 text-center text-navy/60">
            Nothing here yet — generate one to start your library.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((item) => {
              const studentName =
                students.find((s) => s.id === item.studentId)?.name ?? "—";
              return (
                <Link
                  key={item.id}
                  to={`/library?id=${item.id}`}
                  className="block bg-white rounded-2xl shadow-soft border border-navy/5 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                >
                  <TypePill type={item.type} />
                  <p className="font-display font-bold text-navy mt-3 line-clamp-2">
                    {item.title}
                  </p>
                  <div className="mt-2 text-xs text-navy/60 flex items-center gap-2">
                    <span>{studentName}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelative(item.createdAt)}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
