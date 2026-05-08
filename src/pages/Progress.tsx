import { useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, ChevronDown, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";
import PageHero from "@/components/shared/PageHero";
import StatCard from "@/components/shared/StatCard";
import EmptyState from "@/components/shared/EmptyState";
import { useStore, useActiveStudent } from "@/store/useStore";
import { exportElementToPdf } from "@/lib/pdf";
import { formatDate } from "@/lib/format";

export default function Progress() {
  const { students, attempts } = useStore();
  const active = useActiveStudent();
  const [studentId, setStudentId] = useState<string | null>(active?.id ?? null);
  const ref = useRef<HTMLDivElement | null>(null);

  const selected =
    students.find((s) => s.id === studentId) ?? active ?? students[0] ?? null;

  const studentAttempts = useMemo(
    () =>
      attempts
        .filter((a) => a.studentId === selected?.id)
        .sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt)),
    [attempts, selected?.id]
  );

  const trajectory = studentAttempts.map((a, i) => ({
    n: i + 1,
    score: a.score,
    date: formatDate(a.createdAt),
  }));

  const latest = studentAttempts[studentAttempts.length - 1];

  const handleExportPdf = async () => {
    if (!ref.current) return;
    const id = toast.loading("Building PTM report…");
    try {
      await exportElementToPdf(
        ref.current,
        `ptm-report-${selected?.name ?? "student"}-${Date.now()}.pdf`
      );
      toast.success("PDF ready!", { id });
    } catch {
      toast.error("Couldn't make PDF — try again.", { id });
    }
  };

  if (!students.length) {
    return (
      <EmptyState
        title="No students yet."
        message="Add a student in the Students page to track progress."
      />
    );
  }

  return (
    <div>
      <PageHero
        title="Progress & PTM Reports"
        subtitle="Track strengths, weaknesses and recommendations over time."
        right={
          <button
            onClick={handleExportPdf}
            disabled={!studentAttempts.length}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 active:scale-[0.98] disabled:opacity-40 transition text-sm"
          >
            <Download className="w-4 h-4" />
            Export PTM Report
          </button>
        }
      />

      {/* Student picker */}
      <div className="relative mb-6 max-w-sm">
        <select
          value={selected?.id ?? ""}
          onChange={(e) => setStudentId(e.target.value)}
          className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-navy/15 bg-white text-navy font-semibold text-sm focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none cursor-pointer"
          aria-label="Select student"
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} · Grade {s.grade}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-navy/50 pointer-events-none" />
      </div>

      <div ref={ref} className="space-y-6">
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Student"
            value={selected?.name ?? "—"}
            hint={`Grade ${selected?.grade ?? "—"} · ${selected?.subject ?? ""}`}
            accent="purple"
          />
          <StatCard
            label="Assessments taken"
            value={String(studentAttempts.length)}
            hint="Tracked attempts"
            accent="teal"
          />
          <StatCard
            label="Latest score"
            value={latest ? `${latest.score}%` : "—"}
            hint={latest ? formatDate(latest.createdAt) : "No attempts yet"}
            accent={
              !latest
                ? "purple"
                : latest.score >= 75
                ? "teal"
                : latest.score >= 50
                ? "gold"
                : "coral"
            }
            icon={TrendingUp}
          />
        </div>

        {/* Trajectory chart */}
        {trajectory.length === 0 ? (
          <div className="bg-white rounded-2xl border border-navy/5 p-10 text-center text-navy/60 shadow-soft">
            Nothing here yet — take an assessment to start a trajectory.
          </div>
        ) : (
          <section className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5">
            <h3 className="font-display font-bold text-navy mb-3">
              Score trajectory
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trajectory}>
                  <CartesianGrid stroke="#1B2A4E10" />
                  <XAxis
                    dataKey="n"
                    label={{ value: "Attempt", position: "insideBottom", offset: -5, fill: "#1B2A4E" }}
                    tick={{ fontSize: 12, fill: "#1B2A4E" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fontSize: 12, fill: "#1B2A4E" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #1B2A4E22",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6C5CE7"
                    strokeWidth={3}
                    dot={{ r: 5, fill: "#0FA3A3", stroke: "#0FA3A3" }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Attempts */}
        {studentAttempts
          .slice()
          .reverse()
          .map((a) => (
            <section
              key={a.id}
              className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5"
            >
              <header className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="pill bg-navy/5 text-navy/70">
                    {formatDate(a.createdAt)}
                  </p>
                  {a.analysisText && (
                    <p className="text-navy/80 text-sm mt-2 max-w-2xl">
                      {a.analysisText}
                    </p>
                  )}
                </div>
                <div
                  className={`text-right shrink-0 font-display font-extrabold text-3xl ${
                    a.score >= 75
                      ? "text-teal"
                      : a.score >= 50
                      ? "text-gold"
                      : "text-coral"
                  }`}
                >
                  {a.score}%
                </div>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <Bullets title="Strengths" color="teal" items={a.strengths} />
                <Bullets title="Weaknesses" color="coral" items={a.weaknesses} />
                <Bullets
                  title="Recommendations"
                  color="purple"
                  items={a.recommendations}
                />
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}

const Bullets = ({
  title,
  items,
  color,
}: {
  title: string;
  items: string[];
  color: "teal" | "coral" | "purple";
}) => {
  const map = {
    teal: { ring: "border-teal/30 bg-teal/5", text: "text-teal", bullet: "bg-teal" },
    coral: { ring: "border-coral/30 bg-coral/5", text: "text-coral", bullet: "bg-coral" },
    purple: { ring: "border-purple/30 bg-purple/5", text: "text-purple", bullet: "bg-purple" },
  } as const;
  const c = map[color];
  return (
    <div className={`rounded-xl border p-3 ${c.ring}`}>
      <p className={`pill bg-transparent !px-0 ${c.text} font-bold mb-1`}>
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((it, i) => (
          <li key={i} className="text-navy/80 flex gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${c.bullet} mt-2 shrink-0`}
            />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
};
