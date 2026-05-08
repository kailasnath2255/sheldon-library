import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  Pause,
  Play,
  Timer,
  Loader2,
} from "lucide-react";
import { formatTime } from "@/lib/format";
import QuizResults, { type QuizResultsData } from "./QuizResults";
import type { AnalysisResponse } from "@/lib/types";

type QuizQuestion = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  marks?: number;
  explanation?: string;
  skill?: string;
};

type Mode = "diagnostic" | "assessment";

export default function QuizRenderer({
  questions,
  mode,
  onAnalyze,
  onAttemptSaved,
}: {
  questions: QuizQuestion[];
  mode: Mode;
  onAnalyze?: (
    answers: { questionId: string; chosenIndex: number }[],
    questions: QuizQuestion[]
  ) => Promise<AnalysisResponse>;
  onAttemptSaved?: (data: QuizResultsData) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [resultsData, setResultsData] = useState<QuizResultsData | null>(null);

  useEffect(() => {
    if (paused || submitted) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [paused, submitted]);

  const total = questions.length;
  const current = questions[idx];
  const isLast = idx === total - 1;
  const allAnswered = questions.every((q) => chosen[q.id] !== undefined);

  const handleSubmit = async () => {
    setSubmitted(true);

    let correctCount = 0;
    const perQuestion: QuizResultsData["perQuestion"] = questions.map((q) => {
      const chosenIdx = chosen[q.id];
      const correct = chosenIdx === q.correctIndex;
      if (correct) correctCount++;
      return {
        correct,
        text: q.text,
        chosen: chosenIdx !== undefined ? q.options[chosenIdx] : "(skipped)",
        correct_answer: q.options[q.correctIndex],
        explanation: q.explanation,
        marks: q.marks,
      };
    });

    let score = Math.round((correctCount / Math.max(1, total)) * 100);
    let analysis: AnalysisResponse | undefined;

    if (mode === "diagnostic" && onAnalyze) {
      setAnalyzing(true);
      try {
        analysis = await onAnalyze(
          questions.map((q) => ({
            questionId: q.id,
            chosenIndex: chosen[q.id] ?? -1,
          })),
          questions
        );
        score = analysis.score;
      } catch (e) {
        // fall through with computed score
      } finally {
        setAnalyzing(false);
      }
    }

    const data: QuizResultsData = {
      score,
      totalQuestions: total,
      correctCount,
      perQuestion: mode === "assessment" ? perQuestion : undefined,
      analysis,
    };
    setResultsData(data);
  };

  if (resultsData) {
    return (
      <QuizResults
        data={resultsData}
        showSkillsChart={mode === "diagnostic"}
        onAutoSave={() => onAttemptSaved?.(resultsData)}
      />
    );
  }

  if (analyzing) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="w-10 h-10 text-purple animate-spin mb-3" />
        <p className="font-display font-bold text-navy">
          Sheldon is analysing your answers…
        </p>
        <p className="text-sm text-navy/60 mt-1">Computing strengths & next steps</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-fade-up">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="text-sm font-bold text-navy">
          {idx + 1} <span className="text-navy/40">/ {total}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy/70 bg-navy/5 rounded-full px-3 py-1">
            <Timer className="w-4 h-4 text-purple" />
            {formatTime(seconds)}
          </span>
          <button
            onClick={() => setPaused((p) => !p)}
            className="px-3 py-1.5 rounded-full border border-navy/15 text-navy/70 hover:bg-navy/5 inline-flex items-center gap-1 text-sm font-semibold"
          >
            {paused ? (
              <>
                <Play className="w-3.5 h-3.5" /> Resume
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress */}
      <div className="h-1.5 rounded-full bg-navy/10 mb-6 overflow-hidden">
        <motion.div
          className="h-full bg-purple"
          initial={{ width: 0 }}
          animate={{ width: `${((idx + 1) / total) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {paused ? (
        <div className="flex-1 flex items-center justify-center text-navy/60 italic">
          Paused — take a breath.
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex flex-col"
          >
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-navy">
              {current.text}
            </h3>
            {current.skill && (
              <p className="pill bg-purple/10 text-purple mt-2 self-start">
                Skill: {current.skill}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {current.options.map((opt, i) => {
                const selected = chosen[current.id] === i;
                return (
                  <button
                    key={i}
                    onClick={() =>
                      setChosen((c) => ({ ...c, [current.id]: i }))
                    }
                    aria-label={`Option ${String.fromCharCode(65 + i)}: ${opt}`}
                    className={`text-left rounded-2xl border-2 p-4 hover:scale-[1.01] transition-all ${
                      selected
                        ? "bg-purple/5 border-purple shadow-md"
                        : "bg-white border-navy/10 hover:border-purple/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${
                          selected
                            ? "bg-purple text-white"
                            : "bg-navy/5 text-navy"
                        }`}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                      <p className="text-navy font-medium pt-1.5">{opt}</p>
                      {selected && (
                        <CheckCircle2 className="w-5 h-5 text-purple ml-auto shrink-0 mt-1.5" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex justify-between gap-2">
              <button
                onClick={() => setIdx((i) => Math.max(0, i - 1))}
                disabled={idx === 0}
                className="px-5 py-3 rounded-xl border border-navy/15 text-navy font-semibold hover:bg-navy/5 transition disabled:opacity-30"
              >
                Back
              </button>
              {!isLast ? (
                <button
                  onClick={() => setIdx((i) => Math.min(total - 1, i + 1))}
                  disabled={chosen[current.id] === undefined}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 active:scale-[0.98] disabled:opacity-30 transition"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || submitted}
                  className="px-6 py-3 rounded-xl bg-purple text-white font-semibold hover:bg-purple/90 disabled:opacity-30 transition shadow-sm"
                >
                  Submit
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
