import { useEffect, useRef } from "react";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AnalysisResponse } from "@/lib/types";
import OwlMascot from "@/components/shared/OwlMascot";

export type QuizResultsData = {
  score: number;
  totalQuestions: number;
  correctCount: number;
  perQuestion?: {
    correct: boolean;
    text: string;
    chosen: string;
    correct_answer: string;
    explanation?: string;
    marks?: number;
  }[];
  analysis?: AnalysisResponse;
};

const scoreColor = (score: number) =>
  score >= 75 ? "text-teal" : score >= 50 ? "text-gold" : "text-coral";
const scoreRing = (score: number) =>
  score >= 75
    ? "from-teal/30 to-teal"
    : score >= 50
    ? "from-gold/30 to-gold"
    : "from-coral/30 to-coral";

export default function QuizResults({
  data,
  showSkillsChart,
  onAutoSave,
}: {
  data: QuizResultsData;
  showSkillsChart?: boolean;
  onAutoSave?: () => void;
}) {
  const saved = useRef(false);

  useEffect(() => {
    if (!onAutoSave || saved.current) return;
    const t = setTimeout(() => {
      saved.current = true;
      onAutoSave();
    }, 1000);
    return () => clearTimeout(t);
  }, [onAutoSave]);

  const skills = data.analysis?.skills ?? {};
  const skillData = Object.entries(skills).map(([skill, val]) => ({
    skill,
    score: val,
  }));

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Score circle */}
      <div className="flex flex-col items-center text-center">
        <div className="relative w-44 h-44">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-br ${scoreRing(
              data.score
            )} blur-md opacity-40`}
          />
          <div
            className={`relative w-44 h-44 rounded-full border-8 ${
              data.score >= 75
                ? "border-teal"
                : data.score >= 50
                ? "border-gold"
                : "border-coral"
            } bg-white flex flex-col items-center justify-center shadow-soft`}
          >
            <div
              className={`font-display text-5xl font-extrabold ${scoreColor(
                data.score
              )}`}
            >
              {data.score}%
            </div>
            <div className="text-sm text-navy/60 mt-0.5">
              {data.correctCount} / {data.totalQuestions} correct
            </div>
          </div>
        </div>
        <p className="mt-4 text-navy/70 text-sm flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-purple" />
          {data.score >= 75
            ? "Brilliant — keep that momentum!"
            : data.score >= 50
            ? "Solid effort — focus on weak areas next."
            : "Plenty to learn — every great tutor sees this as opportunity."}
        </p>
      </div>

      {/* Per-skill chart */}
      {showSkillsChart && skillData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5">
          <h4 className="font-display text-lg font-bold text-navy mb-3">
            Per-skill score
          </h4>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skillData}>
                <CartesianGrid stroke="#1B2A4E10" />
                <XAxis dataKey="skill" tick={{ fontSize: 12, fill: "#1B2A4E" }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#1B2A4E" }} />
                <Tooltip cursor={{ fill: "#6C5CE715" }} />
                <Bar dataKey="score" fill="#6C5CE7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* 3-col analysis */}
      {data.analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Column
            title="Strengths"
            color="teal"
            items={data.analysis.strengths}
            bulletColor="bg-teal"
          />
          <Column
            title="Weaknesses"
            color="coral"
            items={data.analysis.weaknesses}
            bulletColor="bg-coral"
          />
          <Column
            title="Recommendations"
            color="purple"
            items={data.analysis.recommendations}
            bulletColor="bg-purple"
          />
        </div>
      )}

      {data.analysis?.analysisText && (
        <div className="bg-purple/5 border border-purple/20 rounded-2xl p-5 flex gap-3">
          <OwlMascot size={56} />
          <div>
            <p className="font-display font-bold text-purple text-sm uppercase tracking-wider">
              Sheldon's analysis
            </p>
            <p className="text-navy/80 mt-1 text-sm leading-relaxed">
              {data.analysis.analysisText}
            </p>
          </div>
        </div>
      )}

      {/* Per-question breakdown (used by Assessment) */}
      {data.perQuestion && data.perQuestion.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft border border-navy/5 p-5 space-y-3">
          <h4 className="font-display text-lg font-bold text-navy">
            Question by question
          </h4>
          {data.perQuestion.map((q, i) => (
            <div
              key={i}
              className={`p-3 rounded-xl border ${
                q.correct
                  ? "bg-teal/5 border-teal/30"
                  : "bg-coral/5 border-coral/30"
              }`}
            >
              <div className="flex items-start gap-2">
                {q.correct ? (
                  <CheckCircle2 className="w-5 h-5 text-teal shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-navy">
                    Q{i + 1}. {q.text}
                  </p>
                  <p className="text-xs text-navy/70 mt-1">
                    Your answer:{" "}
                    <span
                      className={
                        q.correct
                          ? "text-teal font-semibold"
                          : "text-coral font-semibold"
                      }
                    >
                      {q.chosen}
                    </span>
                    {!q.correct && (
                      <>
                        {" "}
                        · Correct:{" "}
                        <span className="text-teal font-semibold">
                          {q.correct_answer}
                        </span>
                      </>
                    )}
                    {typeof q.marks === "number" && (
                      <span className="text-navy/50 ml-2">[{q.marks}m]</span>
                    )}
                  </p>
                  {q.explanation && (
                    <p className="text-xs text-navy/60 italic mt-1">
                      {q.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const Column = ({
  title,
  color,
  items,
  bulletColor,
}: {
  title: string;
  color: "teal" | "coral" | "purple";
  items: string[];
  bulletColor: string;
}) => {
  const ringMap = {
    teal: "border-teal/30 bg-teal/5",
    coral: "border-coral/30 bg-coral/5",
    purple: "border-purple/30 bg-purple/5",
  };
  const titleMap = {
    teal: "text-teal",
    coral: "text-coral",
    purple: "text-purple",
  };
  return (
    <div className={`rounded-2xl p-4 border ${ringMap[color]}`}>
      <p
        className={`pill ${titleMap[color]} bg-transparent !px-0 mb-2 font-bold`}
      >
        {title}
      </p>
      <ul className="space-y-1.5">
        {items.map((it, i) => (
          <li key={i} className="text-sm text-navy/80 flex gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${bulletColor} mt-2 shrink-0`}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
