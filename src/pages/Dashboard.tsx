import { Link, useNavigate } from "react-router-dom";
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
  Zap,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import GeneratorCard from "@/components/shared/GeneratorCard";
import OwlMascot from "@/components/shared/OwlMascot";
import TypePill from "@/components/shared/TypePill";
import PastelBlock from "@/components/shared/PastelBlock";
import EyebrowCard from "@/components/shared/EyebrowCard";
import Button from "@/components/shared/Button";
import { useStore, useActiveStudent } from "@/store/useStore";
import { formatRelative } from "@/lib/format";

const TOOLS = [
  { tool: "diagnostic", title: "Diagnostic Test", subtitle: "Find the gap fast.", icon: Stethoscope, bgClass: "bg-card-diagnostic" },
  { tool: "assessment", title: "Assessment", subtitle: "Graded, with marks & feedback.", icon: ClipboardList, bgClass: "bg-card-assessment" },
  { tool: "worksheet", title: "Worksheet", subtitle: "Print or share — playful.", icon: FileText, bgClass: "bg-card-worksheet" },
  { tool: "lessonplan", title: "Lesson Plan", subtitle: "60 min, structured.", icon: BookOpen, bgClass: "bg-card-lessonplan" },
  { tool: "presentation", title: "Presentation", subtitle: "Live deck, interactive slides.", icon: Presentation, bgClass: "bg-card-presentation" },
  { tool: "games", title: "Games & Activities", subtitle: "Drag, sort, play, learn.", icon: Gamepad2, bgClass: "bg-card-games" },
] as const;

export default function Dashboard() {
  const { students, libraryItems } = useStore();
  const active = useActiveStudent();
  const recent = libraryItems.slice(0, 6);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Hero row: lavender block + peach co-pilot block */}
      <section className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        {/* Lavender hero */}
        <PastelBlock tone="lavender" className="overflow-hidden">
          <p className="eyebrow">Dashboard</p>

          <h1 className="ss-display mt-5 text-4xl md:text-6xl text-ss-ink-900 dark:text-white">
            Hi, let's build a class-ready plan.
          </h1>

          <p className="mt-5 max-w-xl text-base md:text-lg text-ss-ink-700 dark:text-ss-ink-200 leading-relaxed">
            Create playful lesson plans, assessments, and classroom content that feels premium, friendly, and instantly ready for teachers and students.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button variant="pill" icon={<Zap className="w-4 h-4 text-ss-orange-500" />} onClick={() => navigate("/generate")}>
              Start creating
            </Button>
            <Button variant="pill" icon={<Target className="w-4 h-4 text-ss-orange-500" />} onClick={() => navigate("/students")}>
              Manage students
            </Button>
          </div>

          {/* Stat strip inside hero */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <EyebrowCard
              eyebrow="Active Student"
              title={active ? active.name : "—"}
              subtitle={active ? `Grade ${active.grade}, ${active.country}` : "Pick one to begin"}
              tone="white"
              delay={0.05}
            />
            <EyebrowCard
              eyebrow="Experience"
              title="Instant planning"
              subtitle="Fast, classroom-ready AI"
              tone="white"
              delay={0.1}
            />
            <EyebrowCard
              eyebrow="Style"
              title="Playful premium"
              subtitle="Soft pastels, crisp spacing"
              tone="white"
              delay={0.15}
            />
          </div>
        </PastelBlock>

        {/* Peach co-pilot */}
        <PastelBlock tone="rose" delay={0.1} className="flex flex-col">
          <div className="flex-1 flex items-center justify-center min-h-[180px]">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <OwlMascot size={140} />
            </motion.div>
          </div>

          <div className="bg-white/70 dark:bg-deep-surface/70 backdrop-blur rounded-2xl p-5 mt-4 ss-edge">
            <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-ss-ink-500 dark:text-ss-ink-300">
              Hello, Teacher!
            </p>
            <h2 className="mt-2 font-display font-extrabold text-2xl text-ss-ink-900 dark:text-white leading-tight">
              I'm Sheldon — your AI class co-pilot.
            </h2>
            <p className="mt-2 text-sm text-ss-ink-500 dark:text-ss-ink-300 leading-snug">
              Wave hello and I'll help you build lessons, tests, presentations, and more.
            </p>
          </div>
        </PastelBlock>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <EyebrowCard
          eyebrow="Roster"
          title={`${students.length} ${students.length === 1 ? "student" : "students"}`}
          subtitle="In your class"
          tone="mint"
          icon={<Users className="w-5 h-5" />}
          delay={0.05}
          href="/students"
        />
        <EyebrowCard
          eyebrow="Library"
          title={`${libraryItems.length} ${libraryItems.length === 1 ? "item" : "items"}`}
          subtitle="Generated artifacts"
          tone="sky"
          icon={<BookOpen className="w-5 h-5" />}
          delay={0.1}
          href="/library"
        />
        <EyebrowCard
          eyebrow="AI Engine"
          title="Adaptive"
          subtitle="Pick a model at gen time"
          tone="cream"
          icon={<Brain className="w-5 h-5" />}
          delay={0.15}
        />
      </section>

      {/* Generator tools */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="eyebrow">Tools</p>
            <h2 className="ss-display mt-2 text-3xl md:text-4xl text-ss-ink-900 dark:text-white">
              Pick your craft.
            </h2>
          </div>
          <p className="text-sm text-ss-ink-500 dark:text-ss-ink-300 max-w-sm">
            Six AI generators for every classroom moment — diagnostic to presentation.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t, idx) => (
            <motion.div
              key={t.tool}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 * idx, ease: [0.2, 0.8, 0.2, 1] }}
            >
              <GeneratorCard {...t} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recently generated */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="eyebrow">Library</p>
            <h2 className="ss-display mt-2 text-3xl md:text-4xl text-ss-ink-900 dark:text-white">
              Recently generated.
            </h2>
          </div>
          <Link
            to="/library"
            className="group inline-flex items-center gap-1.5 text-sm font-bold text-ss-orange-500 hover:text-ss-orange-600 transition"
          >
            See all
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="bg-white dark:bg-deep-surface rounded-3xl border-2 border-dashed border-ss-ink-900 dark:border-white/40 p-12 text-center">
            <Sparkles className="w-8 h-8 text-ss-orange-400 mx-auto mb-3" strokeWidth={2} />
            <p className="font-display font-bold text-ss-ink-900 dark:text-white text-lg">
              Nothing here yet
            </p>
            <p className="text-sm text-ss-ink-500 dark:text-ss-ink-300 mt-1">
              Generate one to start your library.
            </p>
            <div className="mt-5 inline-block">
              <Button variant="primary" onClick={() => navigate("/generate")}>
                Start creating
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recent.map((item, idx) => {
              const studentName =
                students.find((s) => s.id === item.studentId)?.name ?? "—";
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * idx, ease: [0.2, 0.8, 0.2, 1] }}
                >
                  <Link
                    to={`/library?id=${item.id}`}
                    className="block bg-white dark:bg-deep-surface rounded-3xl ss-edge p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
                  >
                    <TypePill type={item.type} />
                    <p className="font-display font-extrabold text-ss-ink-900 dark:text-white mt-3 line-clamp-2 text-lg leading-snug">
                      {item.title}
                    </p>
                    <div className="mt-3 text-xs text-ss-ink-500 dark:text-ss-ink-400 flex items-center gap-2">
                      <span className="font-semibold">{studentName}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelative(item.createdAt)}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
