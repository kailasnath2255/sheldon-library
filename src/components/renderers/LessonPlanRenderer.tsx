import { Download, Target, Backpack, Lightbulb } from "lucide-react";
import { triggerHtmlDownload } from "@/lib/pdf";
import type { LessonPlanResponse } from "@/lib/types";

export default function LessonPlanRenderer({
  data,
  studentName,
  grade,
  duration,
}: {
  data: LessonPlanResponse;
  studentName?: string;
  grade?: number;
  duration?: number;
}) {
  const lp = data.json;

  const handleDownload = () => {
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${lp.topic}</title>
    <style>body{font-family:Calibri,Arial,sans-serif;color:#1B2A4E;padding:30px;max-width:900px;margin:auto}
    h1{color:#6C5CE7}h2{color:#1B2A4E;border-bottom:2px solid #6C5CE7;padding-bottom:4px}
    table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:8px;vertical-align:top}
    th{background:#F5F3FF;text-align:left}</style></head><body>
    <h1>${lp.topic}</h1>
    <p><b>Student:</b> ${studentName ?? "—"} · <b>Grade:</b> ${grade ?? "—"} · <b>Duration:</b> ${duration ?? "—"} min</p>
    <h2>Learning objectives</h2><ul>${lp.objectives.map((o) => `<li>${o}</li>`).join("")}</ul>
    <h2>Timeline</h2><table><tr><th>Time</th><th>Activity</th><th>Materials</th><th>Notes</th></tr>
    ${lp.timeline.map((s) => `<tr><td>${s.time}</td><td>${s.activity}</td><td>${s.materials}</td><td>${s.notes}</td></tr>`).join("")}
    </table>
    <h2>Differentiation</h2><table><tr><th>Below</th><th>At</th><th>Above</th></tr>
    <tr><td>${lp.differentiation.below}</td><td>${lp.differentiation.at}</td><td>${lp.differentiation.above}</td></tr></table>
    <h2>Assessment</h2><p>${lp.assessment}</p>
    <h2>Homework</h2><p>${lp.homework}</p>
    </body></html>`;
    triggerHtmlDownload(html, `lesson-plan-${Date.now()}.doc`);
  };

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex justify-end">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition text-sm"
        >
          <Download className="w-4 h-4" /> Download (Word)
        </button>
      </div>

      <header className="bg-white rounded-2xl shadow-soft border border-navy/5 p-6">
        <p className="pill bg-purple/10 text-purple">Lesson Plan</p>
        <h2 className="font-display text-3xl font-extrabold text-navy mt-2">
          {lp.topic}
        </h2>
        <div className="mt-2 flex flex-wrap gap-2 text-sm text-navy/70">
          {studentName && (
            <span className="bg-navy/5 px-2.5 py-1 rounded-full">
              👤 {studentName}
            </span>
          )}
          {grade && (
            <span className="bg-navy/5 px-2.5 py-1 rounded-full">
              🎓 Grade {grade}
            </span>
          )}
          {duration && (
            <span className="bg-navy/5 px-2.5 py-1 rounded-full">
              ⏱ {duration} min
            </span>
          )}
        </div>

        <div className="mt-5">
          <h3 className="font-display font-bold text-navy flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple" /> Learning objectives
          </h3>
          <ul className="space-y-1">
            {lp.objectives.map((o, i) => (
              <li key={i} className="text-navy/80 text-sm flex gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal mt-2 shrink-0" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Timeline */}
      <section className="bg-white rounded-2xl shadow-soft border border-navy/5 p-6">
        <h3 className="font-display text-xl font-bold text-navy mb-4">
          Timeline
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-navy/60">
                <th className="pb-2 pr-4 font-semibold">Time</th>
                <th className="pb-2 pr-4 font-semibold">Activity</th>
                <th className="pb-2 pr-4 font-semibold">Materials</th>
                <th className="pb-2 font-semibold">Teacher notes</th>
              </tr>
            </thead>
            <tbody>
              {lp.timeline.map((s, i) => (
                <tr
                  key={i}
                  className="border-t border-navy/5 align-top"
                >
                  <td className="py-3 pr-4 font-bold text-purple whitespace-nowrap">
                    {s.time}
                  </td>
                  <td className="py-3 pr-4 text-navy">{s.activity}</td>
                  <td className="py-3 pr-4 text-navy/70">{s.materials}</td>
                  <td className="py-3 text-navy/70 italic">{s.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Differentiation */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Diff title="Below level" body={lp.differentiation.below} color="coral" />
        <Diff title="At level" body={lp.differentiation.at} color="teal" />
        <Diff title="Above level" body={lp.differentiation.above} color="purple" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5">
          <h4 className="font-display font-bold text-navy flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-gold" /> Assessment
          </h4>
          <p className="text-navy/70 text-sm mt-2">{lp.assessment}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5">
          <h4 className="font-display font-bold text-navy flex items-center gap-2">
            <Backpack className="w-4 h-4 text-purple" /> Homework
          </h4>
          <p className="text-navy/70 text-sm mt-2">{lp.homework}</p>
        </div>
      </section>
    </div>
  );
}

const Diff = ({
  title,
  body,
  color,
}: {
  title: string;
  body: string;
  color: "coral" | "teal" | "purple";
}) => {
  const map = {
    coral: "bg-coral/5 border-coral/30 text-coral",
    teal: "bg-teal/5 border-teal/30 text-teal",
    purple: "bg-purple/5 border-purple/30 text-purple",
  };
  return (
    <div className={`rounded-2xl border p-4 ${map[color]}`}>
      <p className="pill bg-transparent !px-0 font-bold">{title}</p>
      <p className="text-navy/80 text-sm mt-2">{body}</p>
    </div>
  );
};
