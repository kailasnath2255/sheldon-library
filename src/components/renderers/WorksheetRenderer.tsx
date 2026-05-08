import { useRef } from "react";
import { Download, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import type { WorksheetResponse } from "@/lib/types";
import { exportElementToPdf } from "@/lib/pdf";

const SECTION_BG: Record<string, string> = {
  MCQs: "bg-card-diagnostic",
  "Fill in the blanks": "bg-card-worksheet",
  "Match the following": "bg-card-presentation",
  "Short answers": "bg-card-lessonplan",
  "Choose the correct option": "bg-card-assessment",
  "Find the error": "bg-card-games",
  "Sentence making": "bg-card-presentation",
  "Sorting game": "bg-card-diagnostic",
  "Creative challenges": "bg-card-games",
  Passage: "bg-card-lessonplan",
  Comprehension: "bg-card-worksheet",
};
const SECTION_EMOJI: Record<string, string> = {
  MCQs: "🟢",
  "Fill in the blanks": "✏️",
  "Match the following": "🔗",
  "Short answers": "📝",
  "Choose the correct option": "✅",
  "Find the error": "🔍",
  "Sentence making": "🧱",
  "Sorting game": "📦",
  "Creative challenges": "🎨",
  Passage: "📖",
  Comprehension: "🤔",
};

export default function WorksheetRenderer({
  data,
  studentName,
}: {
  data: WorksheetResponse;
  studentName?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const w = data.json;

  const handleDownload = async () => {
    if (!ref.current) return;
    const id = toast.loading("Building PDF…");
    try {
      await exportElementToPdf(ref.current, `worksheet-${Date.now()}.pdf`);
      toast.success("PDF ready!", { id });
    } catch (e) {
      toast.error("Couldn't make PDF — try again.", { id });
    }
  };

  return (
    <div className="space-y-4 animate-fade-up">
      <div className="flex justify-end no-print">
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 transition text-sm"
        >
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div
        ref={ref}
        className="bg-white rounded-2xl shadow-soft border border-navy/5 p-6 md:p-8 space-y-6"
        style={{ pageBreakInside: "auto" }}
      >
        {/* Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-card-worksheet via-card-assessment to-card-games p-6 text-navy">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="pill bg-white/60 text-navy/80">Worksheet</p>
              <h2 className="font-display text-3xl md:text-4xl font-extrabold mt-2">
                {w.topic} 🎯
              </h2>
              <p className="text-sm text-navy/80 mt-2 max-w-xl">{w.intro}</p>
            </div>
            <div className="hidden md:flex flex-col items-center text-center text-navy/80 text-sm">
              <Sparkles className="w-6 h-6 text-purple" />
              <span className="font-bold mt-1">Have fun!</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        {w.sections.map((s, i) => (
          <section
            key={i}
            className={`${
              SECTION_BG[s.name] ?? "bg-card-presentation"
            } rounded-2xl p-5`}
            style={{ pageBreakInside: "avoid" }}
          >
            <h3 className="font-display text-xl font-extrabold text-navy mb-3 flex items-center gap-2">
              <span>{SECTION_EMOJI[s.name] ?? "📚"}</span>
              {s.name}
            </h3>
            <ol className="space-y-2 text-navy/90 text-sm list-decimal list-inside">
              {s.items.map((it, j) => (
                <li key={j} className="bg-white/70 rounded-lg p-2.5">
                  {it.question && <span>{it.question}</span>}
                  {it.sentence && (
                    <span>
                      {it.sentence
                        .replace(/___+/g, "____________")
                        .split("____________").map((part, k, arr) => (
                          <span key={k}>
                            {part}
                            {k < arr.length - 1 && (
                              <span className="inline-block min-w-[80px] border-b-2 border-navy/40 mx-1 align-baseline" />
                            )}
                          </span>
                        ))}
                    </span>
                  )}
                  {it.pair && (
                    <span>
                      <b>{it.pair.left}</b> ⟷ ____________
                    </span>
                  )}
                  {it.prompt && <span>{it.prompt}</span>}
                  {it.options && (
                    <ul className="grid grid-cols-2 gap-1 mt-1.5 text-xs text-navy/70">
                      {it.options.map((o, k) => (
                        <li key={k}>
                          {String.fromCharCode(97 + k)}) {o}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}

        {/* Footer */}
        <div
          className="grid grid-cols-3 gap-3 pt-6 border-t border-navy/10 text-xs"
          style={{ pageBreakInside: "avoid" }}
        >
          <div>
            <p className="pill bg-navy/5 text-navy/70">Name</p>
            <div className="border-b border-navy/30 mt-2 h-6 px-2 text-navy/70">
              {studentName ?? ""}
            </div>
          </div>
          <div>
            <p className="pill bg-navy/5 text-navy/70">Date</p>
            <div className="border-b border-navy/30 mt-2 h-6" />
          </div>
          <div>
            <p className="pill bg-navy/5 text-navy/70">Score</p>
            <div className="border-b border-navy/30 mt-2 h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
